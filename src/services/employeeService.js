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

// ADD EMPLOYEE
export const addEmployeeApi =
async(employeeData)=>{

return await axios.post(

BASE_URL,

{
...employeeData,

company:getCompany()
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

company:getCompany()
}

);

};

// DELETE EMPLOYEE
export const deleteEmployeeApi =
async(id)=>{

return await axios.delete(

`${BASE_URL}/${id}?company=${getCompany()}`

);

};