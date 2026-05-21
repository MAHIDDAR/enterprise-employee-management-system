import { useEffect, useState } from "react";
import { fetchEmployees } from "../../services/employeeService";

function AttendancePage() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    const data = await fetchEmployees();

    const formattedData = data.map((employee) => ({
      ...employee,
      status: Math.random() > 0.5 ? "Present" : "Absent",
    }));

    setAttendance(formattedData);
  };

  return (
    <div>
      <h1>Attendance</h1>

      {attendance.map((employee) => (
        <div key={employee.id} className="attendance-card">
          <h4>{employee.name}</h4>

          <span>{employee.status}</span>
        </div>
      ))}
    </div>
  );
}

export default AttendancePage;