import { useNavigate } from "react-router-dom";
import "./EmployeeTable.css";

function EmployeeTable({ employees }) {
  const navigate = useNavigate();

  return (
    <div className="employee-table">
      <div className="table-header">
        <h3>Recent Employees</h3>

        <button onClick={() => navigate("/employees")}>
          View All
        </button>
      </div>

      {employees.slice(0, 5).map((employee) => (
        <div className="employee-row" key={employee.id}>
          <div>
            <h4>{employee.name}</h4>
            <p>{employee.email}</p>
          </div>

          <span>{employee.company.name}</span>
        </div>
      ))}
    </div>
  );
}

export default EmployeeTable;