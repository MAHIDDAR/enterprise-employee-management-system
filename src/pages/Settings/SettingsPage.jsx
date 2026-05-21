import {
  useContext,
  useState,
} from "react";

import { EmployeeContext } from "../../context/EmployeeContext";

import "./SettingsPage.css";

function SettingsPage() {
  const {
    employees,
    updateEmployee,
    deleteEmployee,
  } = useContext(EmployeeContext);

  const [formData, setFormData] =
    useState({
      id: "",
      name: "",
      email: "",
      department: "",
      city: "",
      phone: "",
    });

  const [editingId, setEditingId] =
    useState(null);

  // HANDLE INPUT CHANGE
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  // EDIT EMPLOYEE
  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setFormData({
      id: employee.id,

      name: employee.name || "",

      email: employee.email || "",

      department:
        employee.company?.name || "",

      city:
        employee.address?.city || "",

      phone: employee.phone || "",
    });
  };

  // UPDATE EMPLOYEE
  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedEmployee = {
      id: formData.id,

      name: formData.name,

      email: formData.email,

      phone: formData.phone,

      company: {
        name:
          formData.department,
      },

      address: {
        city: formData.city,
      },
    };

    updateEmployee(
      updatedEmployee
    );

    setEditingId(null);

    setFormData({
      id: "",
      name: "",
      email: "",
      department: "",
      city: "",
      phone: "",
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>
          Employee Settings
        </h1>
      </div>

      {/* EDIT FORM */}
      {editingId && (
        <form
          onSubmit={handleSubmit}
          className="settings-form"
        >
          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <select
            name="department"
            value={
              formData.department
            }
            onChange={handleChange}
            required
          >
            <option value="">
              Select Department
            </option>

            <option>
              HR
            </option>

            <option>
              Development
            </option>

            <option>
              Marketing
            </option>

            <option>
              Finance
            </option>
          </select>

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="settings-buttons">
            <button type="submit">
              Update Employee
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingId(
                  null
                );

                setFormData({
                  id: "",
                  name: "",
                  email: "",
                  department: "",
                  city: "",
                  phone: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* EMPLOYEE LIST */}
      <div className="users-list">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="user-card"
          >
            <div>
              <h3>
                {employee.name}
              </h3>

              <p>
                {employee.email}
              </p>

              <span>
                {
                  employee.company
                    ?.name
                }
              </span>
            </div>

            <div className="action-buttons">
              <button
                onClick={() =>
                  handleEdit(
                    employee
                  )
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteEmployee(
                    employee.id
                  )
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsPage;