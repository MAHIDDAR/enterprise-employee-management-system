import {
useEffect,
useState
} from "react";

import {
fetchEmployees
} from "../../services/employeeService";

import {
getCompanyUsersApi
} from "../../services/authService";

import "./CompanyPage.css";

function CompanyPage(){

const company =
localStorage.getItem("company") || "Stackly";

const [employees,setEmployees]=
useState([]);

const [users,setUsers]=
useState([]);

const [loading,setLoading]=
useState(true);

useEffect(()=>{

loadCompanyData();

},[]);

const loadCompanyData =
async()=>{

try{

setLoading(true);

const employeeData =
await fetchEmployees();

const userData =
await getCompanyUsersApi();

setEmployees(employeeData);

setUsers(userData);

}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};

if(loading){

return(

<div className="company-page">

Loading company data...

</div>

);

}

return(

<div className="company-page">

<div className="company-header">

<h1>

Company Management

</h1>

<p>

Company based employee and user details

</p>

</div>

<div className="company-summary">

<div className="company-card">

<h2>

{company}

</h2>

<p>

Current Logged-in Company

</p>

</div>

<div className="company-card">

<h2>

{employees.length}

</h2>

<p>

Total Employees

</p>

</div>

<div className="company-card">

<h2>

{users.length}

</h2>

<p>

Total Users

</p>

</div>

</div>

<div className="company-section">

<h2>

Employees in {company}

</h2>

<div className="company-list">

{

employees.length===0

?

<p>No employees found</p>

:

employees.map((employee)=>(

<div
key={employee.id}
className="company-row"
>

<div>

<h3>

{employee.name}

</h3>

<p>

{employee.email}

</p>

</div>

<span>

{employee.department}

</span>

</div>

))

}

</div>

</div>

<div className="company-section">

<h2>

Users in {company}

</h2>

<div className="company-list">

{

users.length===0

?

<p>No users found</p>

:

users.map((user,index)=>(

<div
key={index}
className="company-row"
>

<div>

<h3>

{user.name || user.email}

</h3>

<p>

{user.email}

</p>

</div>

<span>

{user.role}

</span>

</div>

))

}

</div>

</div>

</div>

);

}

export default CompanyPage;