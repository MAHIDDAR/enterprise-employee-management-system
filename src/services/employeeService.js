import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};