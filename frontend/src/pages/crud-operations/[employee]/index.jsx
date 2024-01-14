import { useEffect } from "react";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeProfileData } from "@/redux/features/employeeTableSlice";

const EmployeesProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const id = router.query.employee;

  const data = useSelector((state) => state.employees.employeeProfileData);
  const isLoading = useSelector(
    (state) => state.employees.employeeProfileIsLoading
  );
  const isError = useSelector(
    (state) => state.employees.employeeProfileIsError
  );
  const error = useSelector((state) => state.employees.employeeProfileError);
  const isSuccess = useSelector(
    (state) => state.employees.employeeProfileIsSuccess
  );

  useEffect(() => {
    dispatch(getEmployeeProfileData({ id }));
  }, [dispatch, id]);

  return (
    <div>
      {isLoading ? (
        <div style={{ width: "100%", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : isError ? (
        <div style={{ width: "100%", marginTop: "20px", textAlign: "center" }}>
          <h1>{error}</h1>
        </div>
      ) : isSuccess ? (
        <div>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <div style={{ maxWidth: "max-content", margin: "auto" }}>
              <Card variant="outlined" style={{ marginTop: "20px" }}>
                <CardContent>
                  <div>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={() => router.push("/crud-operations")}
                    >
                      Back
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3>{data?.data?.fname + " " + data?.data?.lname}</h3>
                    <h4>Email: {data?.data?.email}</h4>
                    <h5>Phone Number: {data?.data?.mobile}</h5>
                    <h4>Gender: {data?.data?.gender}</h4>
                    <h4>Location: {data?.data?.location}</h4>
                    <h4>Status: {data?.data?.status}</h4>
                    <h5>
                      Date Created:-
                      {moment(data?.data?.datecreated).format("DD-MM-YYYY")}
                    </h5>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default EmployeesProfile;
