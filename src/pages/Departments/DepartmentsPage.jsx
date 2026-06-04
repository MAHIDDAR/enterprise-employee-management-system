import {
  useEffect,
  useState,
} from "react";

import {
  fetchEmployees
} from "../../services/employeeService";

import "./DepartmentsPage.css";


function DepartmentsPage() {

  const [
    departments,
    setDepartments
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {

    loadDepartments();

  }, []);

  const loadDepartments =
    async () => {

      try {

        setLoading(true);

        const data =
          await fetchEmployees();

        const departmentList =
          data.map(
            (employee) =>

              employee.department ||
              employee.company?.name
          );

        const uniqueDepartments =
          [
            ...new Set(
              departmentList
            ),
          ].filter(Boolean);

        setDepartments(
          uniqueDepartments
        );

        setError("");

      } catch (error) {

        console.log(error);

        setError(
          "Failed to load departments"
        );

      } finally {

        setLoading(false);
      }
    };

  if (loading) {

    return (
      <div className="dashboard-message">
        Loading Departments...
      </div>
    );
  }

  if (error) {

    return (
      <div className="dashboard-message error">
        {error}
      </div>
    );
  }

  return (

    <div className="departments-page">

      <div className="departments-header">

        <h1>
          Departments
        </h1>

        <p>
          Total Departments :
          {" "}
          {departments.length}
        </p>

      </div>

      <div className="department-grid">

        {departments.map(
          (
            department,
            index
          ) => (

            <div
              key={index}
              className="department-card"
            >

              <h3>
                {department}
              </h3>

              <p>
                Active Department
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default DepartmentsPage;