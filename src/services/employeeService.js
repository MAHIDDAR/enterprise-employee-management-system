import axios from "axios";

const BASE_URL =
  "http://127.0.0.1:8000/employees";

export const fetchEmployees =
  async () => {

    try {

      const response =
        await axios.get(BASE_URL);

      return response.data;

    } catch (error) {

      console.log(error);

      return [];
    }
};

export const addEmployeeApi =
  async (employeeData) => {

    return await axios.post(
      BASE_URL,
      employeeData
    );
};

export const updateEmployeeApi =
  async (
    employeeId,
    employeeData
  ) => {

    return await axios.put(
      `${BASE_URL}/${employeeId}`,
      employeeData
    );
};

export const deleteEmployeeApi =
  async (employeeId) => {

    return await axios.delete(
      `${BASE_URL}/${employeeId}`
    );
};