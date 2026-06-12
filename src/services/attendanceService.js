import axios from "axios";

const BASE_URL =
"http://127.0.0.1:8000/attendance";

const getEmail = () => {
  return localStorage.getItem("email");
};

const getCompany = () => {
  return localStorage.getItem("company") || "Stackly";
};

const getName = () => {
  return localStorage.getItem("email");
};


// CHECK USER ATTENDANCE ACCESS

export const getUserAttendanceAccessApi =
async()=>{

const response =
await axios.get(
`${BASE_URL}/access-status?email=${getEmail()}&company=${getCompany()}`
);

return response.data;

};


// CREATE ATTENDANCE ACCESS REQUEST

export const createAttendanceAccessRequestApi =
async()=>{

const response =
await axios.post(
`${BASE_URL}/access-request`,
{
email:getEmail(),
name:getName(),
company:getCompany()
}
);

return response.data;

};


// CHECK IN

export const checkInApi =
async()=>{

const response =
await axios.post(
`${BASE_URL}/check-in`,
{
email:getEmail(),
company:getCompany()
}
);

return response.data;

};


// CHECK OUT

export const checkOutApi =
async()=>{

const response =
await axios.post(
`${BASE_URL}/check-out`,
{
email:getEmail(),
company:getCompany()
}
);

return response.data;

};


// GET MY ATTENDANCE

export const getMyAttendanceApi =
async()=>{

const response =
await axios.get(
`${BASE_URL}/my-attendance?email=${getEmail()}&company=${getCompany()}`
);

return response.data;

};


// SUBMIT LEAVE REQUEST

export const submitLeaveRequestApi =
async(leaveForm)=>{

const response =
await axios.post(
`${BASE_URL}/leave-request`,
{
...leaveForm,
email:getEmail(),
company:getCompany()
}
);

return response.data;

};


// GET MY LEAVE REQUESTS

export const getMyLeaveRequestsApi =
async()=>{

const response =
await axios.get(
`${BASE_URL}/my-leaves?email=${getEmail()}&company=${getCompany()}`
);

return response.data;

};


// ADMIN GET ATTENDANCE ACCESS REQUESTS

export const getAttendanceAccessRequestsApi =
async()=>{

const response =
await axios.get(
`${BASE_URL}/access-requests?company=${getCompany()}`
);

return response.data;

};


// ADMIN APPROVE ATTENDANCE ACCESS

export const approveAttendanceAccessApi =
async(id)=>{

const response =
await axios.put(
`${BASE_URL}/access-request/${id}/approve`,
{
company:getCompany(),
approvedBy:getEmail()
}
);

return response.data;

};


// ADMIN REJECT ATTENDANCE ACCESS

export const rejectAttendanceAccessApi =
async(id)=>{

const response =
await axios.put(
`${BASE_URL}/access-request/${id}/reject`,
{
company:getCompany(),
rejectedBy:getEmail()
}
);

return response.data;

};


// ADMIN GET LEAVE REQUESTS

export const getLeaveRequestsApi =
async()=>{

const response =
await axios.get(
`${BASE_URL}/leave-requests?company=${getCompany()}`
);

return response.data;

};


// ADMIN APPROVE LEAVE REQUEST

export const approveLeaveRequestApi =
async(id)=>{

const response =
await axios.put(
`${BASE_URL}/leave-request/${id}/approve`,
{
company:getCompany(),
approvedBy:getEmail()
}
);

return response.data;

};


// ADMIN REJECT LEAVE REQUEST

export const rejectLeaveRequestApi =
async(id)=>{

const response =
await axios.put(
`${BASE_URL}/leave-request/${id}/reject`,
{
company:getCompany(),
rejectedBy:getEmail()
}
);

return response.data;

};