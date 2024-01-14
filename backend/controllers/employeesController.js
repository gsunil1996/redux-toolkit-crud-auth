const employees = require("../models/employeesSchema");

const ITEM_PER_PAGE = 2;

const handleSuccess = (res, data) => {
  res.status(200).json({ success: true, data });
};

const handleValidationError = (res, errors) => {
  res.status(400).json({ success: false, error: errors });
};

const handleNotFound = (res, message) => {
  res.status(404).json({ success: false, error: message });
};

const handleServerError = (res, error = "Internal server error") => {
  res.status(500).json({ success: false, error });
};

const getEmployeesTable = async (req, res) => {
  try {
    const {
      search = "",
      gender = "",
      status = "",
      sort = "",
      page = 1,
    } = req.query;

    const query = {
      $or: [
        { fname: { $regex: search, $options: "i" } },
        { lname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    };

    if (gender !== "all") {
      query.gender = gender;
    }

    if (status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * ITEM_PER_PAGE;
    const count = await employees.countDocuments(query);
    const employeesTableData = await employees
      .find(query)
      .sort({ datecreated: sort === "new" ? -1 : 1 })
      .limit(ITEM_PER_PAGE)
      .skip(skip);

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    handleSuccess(res, {
      pagination: {
        count,
        pageCount,
      },
      employeesTableData,
    });
  } catch (error) {
    // console.error(error);
    handleServerError(res, error);
  }
};

const addNewEmployee = async (req, res) => {
  try {
    const { fname, lname, email, mobile, gender, location, status } = req.body;

    // Add validation for required fields
    const requiredFields = [
      "fname",
      "lname",
      "email",
      "mobile",
      "gender",
      "location",
      "status",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      handleValidationError(res, `Missing fields: ${missingFields.join(", ")}`);
      return;
    }

    const preuser = await employees.findOne({ email });

    if (preuser) {
      handleValidationError(res, "This user already exists in our database");
    } else {
      const datecreated = new Date();
      const employeeData = new employees({
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        status,
        datecreated,
      });

      await employeeData.validate();

      await employeeData.save();
      handleSuccess(res, employeeData);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      let validationErrors = "";
      for (const field in error.errors) {
        validationErrors = error.errors[field].message;
      }
      handleValidationError(res, validationErrors);
    } else {
      // console.error(error);
      handleServerError(res, error);
    }
  }
};

const getSingleEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeData = await employees.findOne({ _id: id });

    if (employeeData) {
      handleSuccess(res, employeeData);
    } else {
      handleNotFound(res, "User not found");
    }
  } catch (error) {
    // console.error(error);
    handleServerError(res, error);
  }
};

const updateEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { fname, lname, email, mobile, gender, location, status } = req.body;

    const dateUpdated = new Date();

    const updateEmployee = await employees.findByIdAndUpdate(
      { _id: id },
      {
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        status,
        dateUpdated,
      },
      {
        new: true,
      }
    );

    if (updateEmployee) {
      handleSuccess(res, updateEmployee);
    } else {
      handleNotFound(res, "User not found");
    }
  } catch (error) {
    // console.error(error);
    handleServerError(res, error);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEmployee = await employees.findByIdAndDelete({ _id: id });

    if (deleteEmployee) {
      handleSuccess(res, deleteEmployee);
    } else {
      handleNotFound(res, "User not found");
    }
  } catch (error) {
    // console.error(error);
    handleServerError(res, error);
  }
};

module.exports = {
  getEmployeesTable,
  addNewEmployee,
  getSingleEmployeeDetails,
  updateEmployeeDetails,
  deleteEmployee,
};
