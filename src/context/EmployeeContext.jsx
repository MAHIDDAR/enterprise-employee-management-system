import {
  createContext,
  useEffect,
  useState,
} from "react";

import { fetchEmployees } from "../services/employeeService";

export const EmployeeContext =
  createContext();

function EmployeeProvider({
  children,
}) {
  const [employees, setEmployees] =
    useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await fetchEmployees();

    setEmployees(data);
  };

  // ADD EMPLOYEE
  const addEmployee = (
    employeeData
  ) => {
    const newEmployee = {
      id: Date.now(),

      ...employeeData,

      company: {
        name:
          employeeData.department,
      },

      address: {
        city: employeeData.city,
      },
    };

    setEmployees((prev) => [
      ...prev,
      newEmployee,
    ]);
  };

  // UPDATE EMPLOYEE
  const updateEmployee = (
    updatedEmployee
  ) => {
    const updatedList =
      employees.map((employee) =>
        employee.id ===
        updatedEmployee.id
          ? updatedEmployee
          : employee
      );

    setEmployees(updatedList);
  };

  // DELETE EMPLOYEE
  const deleteEmployee = (
    employeeId
  ) => {
    const filteredEmployees =
      employees.filter(
        (employee) =>
          employee.id !==
          employeeId
      );

    setEmployees(
      filteredEmployees
    );
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export default EmployeeProvider;