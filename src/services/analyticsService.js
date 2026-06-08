import axios from "axios";

const BASE_URL =
"http://127.0.0.1:8000/analytics";

const getCompany = () => {

return localStorage.getItem("company") || "Stackly";

};


// DASHBOARD KPI CARDS

export const getDashboardAnalyticsApi =
async()=>{

const response =
await axios.get(

`${BASE_URL}/dashboard?company=${getCompany()}`

);

return response.data;

};


// EMPLOYEES BY DEPARTMENT CHART

export const getEmployeesByDepartmentApi =
async()=>{

const response =
await axios.get(

`${BASE_URL}/employees-by-department?company=${getCompany()}`

);

return response.data;

};


// EMPLOYEE STATUS CHART

export const getEmployeeStatusApi =
async()=>{

const response =
await axios.get(

`${BASE_URL}/employee-status?company=${getCompany()}`

);

return response.data;

};


// ROLE COUNT CHART

export const getRoleCountApi =
async()=>{

const response =
await axios.get(

`${BASE_URL}/roles?company=${getCompany()}`

);

return response.data;

};