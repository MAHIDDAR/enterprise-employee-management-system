import { useNavigate } from "react-router-dom";

import "./EmployeeTable.css";

function EmployeeTable({
  employees = [],
}) {
  const navigate =
    useNavigate();

  return (
    <div className="employee-table">
      <div className="table-header">
        <h3>
          Recent Employees
        </h3>

        <button
          onClick={() =>
            navigate(
              "/employees"
            )
          }
        >
          View All
        </button>
      </div>

      {employees
        .slice(0, 5)
        .map((employee, index) => (
          <div
            className="employee-row"
            key={
              employee?.id ||
              index
            }
          >
            <div>
              <h4>
                {employee?.name ||
                  "N/A"}
              </h4>

              <p>
                {employee?.email ||
                  "N/A"}
              </p>
            </div>

            <span>
              {employee?.company
                ?.name ||
                employee?.department ||
                "No Department"}
            </span>
          </div>
        ))}
    </div>
  );
}

export default EmployeeTable;   