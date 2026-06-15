import axios from "axios";

const BASE_URL =
"http://127.0.0.1:8000/employees";

const getCompany = () => {

return (
localStorage.getItem("company")
||
"Stackly"
);

};

const getUserName = () => {

return (
localStorage.getItem("email")
||
"Admin User"
);

};


// FETCH EMPLOYEES
export const fetchEmployees =
async()=>{

try{

const response =
await axios.get(

`${BASE_URL}?company=${getCompany()}`

);

return response.data;

}

catch(error){

console.log(error);

return [];

}

};


// FETCH SINGLE EMPLOYEE DETAILS
export const fetchEmployeeById =
async(id)=>{

try{

const response =
await axios.get(

`${BASE_URL}/${id}?company=${getCompany()}`

);

return response.data;

}

catch(error){

console.log(error);

return null;

}

};


// FETCH REPORTING MANAGERS
export const fetchReportingManagersApi =
async()=>{

try{

const response =
await axios.get(

`${BASE_URL}/managers/list?company=${getCompany()}`

);

return response.data;

}

catch(error){

console.log(error);

return [];

}

};


// ADD EMPLOYEE
export const addEmployeeApi =
async(employeeData)=>{

return await axios.post(

BASE_URL,

{
...employeeData,

company:getCompany(),

userName:getUserName()
}

);

};


// UPDATE EMPLOYEE
export const updateEmployeeApi =
async(id,data)=>{

return await axios.put(

`${BASE_URL}/${id}`,

{
...data,

company:getCompany(),

userName:getUserName()
}

);

};


// DELETE EMPLOYEE
export const deleteEmployeeApi =
async(id)=>{

return await axios.delete(

`${BASE_URL}/${id}?company=${getCompany()}&userName=${getUserName()}`

);

};