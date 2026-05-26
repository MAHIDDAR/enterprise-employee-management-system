import { useEffect, useState } from "react";

import { fetchEmployees } from "../../services/employeeService";

import "./AttendancePage.css";

function AttendancePage() {

  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {

    try {

      const data =
        await fetchEmployees();

      setEmployees(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {

    return (
      <div className="attendance-page">
        Loading Attendance...
      </div>
    );
  }

  return (

    <div className="attendance-page">

      <div className="attendance-header">

        <div>

          <h1>
            Attendance
          </h1>

          <p>
            Employee Attendance Status
          </p>

        </div>

        <div className="attendance-count">

          Total Employees :
          {" "}
          {employees.length}

        </div>

      </div>

      <div className="attendance-grid">

        {employees.map(
          (employee, index) => (

            <div
              key={employee.id || index}
              className="attendance-card"
            >

              <div className="attendance-top">

                <div>

                  <h3>
                    {employee.name}
                  </h3>

                  <p>
                    {employee.email}
                  </p>

                </div>

                <span
                  className={
                    employee.id % 2 === 0
                      ? "active-status"
                      : "inactive-status"
                  }
                >

                  {employee.id % 2 === 0
                    ? "Active"
                    : "Inactive"}

                </span>

              </div>

              <div className="attendance-info">

                <p>

                  <strong>
                    Department :
                  </strong>

                  {" "}

                  {employee.department ||
                    employee.company?.name ||
                    "N/A"}

                </p>

                <p>

                  <strong>
                    City :
                  </strong>

                  {" "}

                  {employee.city ||
                    employee.address?.city ||
                    "N/A"}

                </p>

                <p>

                  <strong>
                    Phone :
                  </strong>

                  {" "}

                  {employee.phone}

                </p>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default AttendancePage;