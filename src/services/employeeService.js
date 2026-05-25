import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/employees";

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(BASE_URL);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching employees:",
      error
    );

    throw error;
  }
};