const express = require("express");
const router = express.Router();
const employeesController = require("../controllers/employeesController");
const { Auth } = require("../Auth");

router.get("/employeesTable", Auth, employeesController.getEmployeesTable);
router.get(
  "/employeesTable/:id",
  Auth,
  employeesController.getSingleEmployeeDetails
);
router.post("/addEmployee", Auth, employeesController.addNewEmployee);
router.patch(
  "/updateEmployeeDetails/:id",
  Auth,
  employeesController.updateEmployeeDetails
);
router.delete("/deleteEmployee/:id", Auth, employeesController.deleteEmployee);

module.exports = router;
