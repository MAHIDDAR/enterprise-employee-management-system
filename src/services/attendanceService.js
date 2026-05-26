import axios from "axios";

const BASE_URL =
  "http://127.0.0.1:8000/attendance";


// GET ATTENDANCE
export const fetchAttendance =
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


// ADD ATTENDANCE
export const addAttendanceApi =
  async (attendanceData) => {

    return await axios.post(
      BASE_URL,
      attendanceData
    );
};


// DELETE ATTENDANCE
export const deleteAttendanceApi =
  async (attendanceId) => {

    return await axios.delete(
      `${BASE_URL}/${attendanceId}`
    );
};