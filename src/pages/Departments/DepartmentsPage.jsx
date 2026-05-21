import { useEffect, useState } from "react";
import { fetchEmployees } from "../../services/employeeService";

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await fetchEmployees();

    const departmentList = data.map(
      (employee) => employee.company.name
    );

    setDepartments([...new Set(departmentList)]);
  };

  return (
    <div>
      <h1>Departments</h1>

      {departments.map((department, index) => (
        <div key={index} className="department-card">
          {department}
        </div>
      ))}
    </div>
  );
}

export default DepartmentsPage;