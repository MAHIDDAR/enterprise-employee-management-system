import {
useEffect,
useState
}
from "react";

import {
fetchEmployees
}
from "../../services/employeeService";

import "./AttendancePage.css";

function AttendancePage(){

const role=
localStorage.getItem(
"role"
);

const [
employees,
setEmployees
]=useState([]);

const [
loading,
setLoading
]=useState(true);

useEffect(()=>{

loadEmployees();

},[]);

const loadEmployees=
async()=>{

const data=
await fetchEmployees();

setEmployees(data);

setLoading(false);

};

const downloadCSV=()=>{

const rows=[

["Name","Email","Department"],

...employees.map(

e=>[

e.name,

e.email,

e.department

]

)

];

const csv=

rows.map(

row=>row.join(",")

).join("\n");

const blob=
new Blob(

[csv],

{

type:"text/csv"

}

);

const url=
URL.createObjectURL(
blob
);

const a=
document.createElement(
"a"
);

a.href=url;

a.download=
"attendance.csv";

a.click();

};

if(loading){

return <div>

Loading...

</div>

}

return(

<div className=
"attendance-page"
>

<div className=
"attendance-header"
>

<h1>

Attendance

</h1>

{

role==="admin"

&&

<button

className=
"download-btn"

onClick={
downloadCSV
}

>

Download Report

</button>

}

</div>

<div className=
"attendance-grid"
>

{

employees.map(

(emp)=>(

<div

key={emp.id}

className=
"attendance-card"

>

<h3>

{emp.name}

</h3>

<p>

{emp.email}

</p>

<p>

{emp.department}

</p>

</div>

)

)

}

</div>

</div>

);

}

export default AttendancePage;