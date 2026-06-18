import {
useState,
useEffect,
useContext
} from "react";

import axios from "axios";

import {

sendRoleRequestApi,
getPendingRequestsApi,
approveRequestApi,
rejectRequestApi,
updatePlanApi

}

from "../../services/authService";

import {
getReactivationRequestsApi,
approveReactivationApi,
rejectReactivationApi
} from "../../services/invitationService";

import {
getLeaveRequestsApi,
approveLeaveRequestApi,
rejectLeaveRequestApi
} from "../../services/attendanceService";

import {
fetchEmployees
} from "../../services/employeeService";

import {
ThemeContext
} from "../../context/ThemeContext";

import "./SettingsPage.css";

function SettingsPage(){

const {
darkMode,
toggleTheme
} = useContext(ThemeContext);

const role=
localStorage.getItem("role");

const email=
localStorage.getItem("email");

const company=
localStorage.getItem("company") || "Stackly";

const [currentPlan,setCurrentPlan] =
useState(
localStorage.getItem("plan") || "Free"
);

const [employeeCount,setEmployeeCount] =
useState(0);

const [adminCount,setAdminCount] =
useState(0);

const [formData,setFormData]=
useState({

password:"",

adminEmail:""

});

const [message,setMessage]=
useState("");

const [requests,setRequests]=
useState([]);

const [
reactivationRequests,
setReactivationRequests
] = useState([]);

const [
leaveRequests,
setLeaveRequests
] = useState([]);

const plans = {

Free:{
name:"Free",
maxEmployees:5,
maxAdmins:1,
analytics:"No",
auditLogs:"No",
exportAccess:"No"
},

Professional:{
name:"Professional",
maxEmployees:25,
maxAdmins:3,
analytics:"Yes",
auditLogs:"Yes",
exportAccess:"Yes"
},

Enterprise:{
name:"Enterprise",
maxEmployees:200,
maxAdmins:20,
analytics:"Yes",
auditLogs:"Yes",
exportAccess:"Yes"
}

};

const planRank = {
Free:1,
Professional:2,
Enterprise:3
};

const canSelectPlan = (planName)=>{

return planRank[planName] > planRank[currentPlan];

};

useEffect(()=>{

loadUsageData();

if(role==="admin"){

loadRequests();

loadReactivationRequests();

loadLeaveRequests();

}

},[role]);

const loadUsageData =
async()=>{

try{

const employeesData =
await fetchEmployees();

setEmployeeCount(
employeesData.length
);

const usersResponse =
await axios.get(
`http://127.0.0.1:8000/auth/users?company=${company}`
);

const admins =
usersResponse.data.filter(
(user)=> user.role === "admin"
);

setAdminCount(
admins.length
);

}
catch(error){

console.log(error);

}

};

const selectPlan =
async(planName)=>{

if(!canSelectPlan(planName)){

setMessage(
"You cannot downgrade your plan"
);

setTimeout(()=>{

setMessage("");

},3000);

return;

}

try{

const response =
await updatePlanApi(planName);

if(
response.message === "Plan Updated Successfully"
){

localStorage.setItem(
"plan",
response.plan || planName
);

setCurrentPlan(
response.plan || planName
);

setMessage(
`${planName} plan selected successfully`
);

}
else{

setMessage(
response.message || "Plan update failed"
);

}

setTimeout(()=>{

setMessage("");

},3000);

}
catch(error){

console.log(error);

setMessage(
"Plan update failed"
);

setTimeout(()=>{

setMessage("");

},3000);

}

};

const loadRequests=
async()=>{

try{

const data=

await getPendingRequestsApi();

setRequests(data);

}

catch(error){

console.log(error);

}

};

const loadReactivationRequests =
async()=>{

try{

const data =
await getReactivationRequestsApi();

const pendingData =
data.filter(
(request)=>
request.status === "pending"
);

setReactivationRequests(
pendingData
);

}

catch(error){

console.log(error);

}

};

const loadLeaveRequests =
async()=>{

try{

const data =
await getLeaveRequestsApi();

const pendingData =
data.filter(
(request)=>
request.status === "pending"
);

setLeaveRequests(
pendingData
);

}

catch(error){

console.log(error);

}

};

const handleChange=
(event)=>{

setFormData({

...formData,

[event.target.name]:

event.target.value

});

};

const submitRequest=
async()=>{

try{

const response=

await sendRoleRequestApi({

name:

localStorage.getItem(

"email"

),

email:

localStorage.getItem(

"email"

),

password:

formData.password,

adminEmail:

formData.adminEmail,

company:

company

});

setMessage(

response.message

);

setFormData({

password:"",

adminEmail:""

});

}
catch(error){

console.log(error);

setMessage(

"Request Failed"

);

}

};

const approve=
async(id)=>{

try{

await approveRequestApi(id);

loadRequests();

loadUsageData();

}
catch(error){

console.log(error);

}

};

const reject=
async(id)=>{

try{

await rejectRequestApi(id);

loadRequests();

}
catch(error){

console.log(error);

}

};

const approveReactivation =
async(id)=>{

try{

await approveReactivationApi(id);

loadReactivationRequests();

loadRequests();

}
catch(error){

console.log(error);

}

};

const rejectReactivation =
async(id)=>{

try{

await rejectReactivationApi(id);

loadReactivationRequests();

loadRequests();

}
catch(error){

console.log(error);

}

};

const approveLeave =
async(id)=>{

try{

await approveLeaveRequestApi(id);

loadLeaveRequests();

}
catch(error){

console.log(error);

}

};

const rejectLeave =
async(id)=>{

try{

await rejectLeaveRequestApi(id);

loadLeaveRequests();

}
catch(error){

console.log(error);

}

};

const employeeLimit =
plans[currentPlan].maxEmployees;

const adminLimit =
plans[currentPlan].maxAdmins;

const employeeUsagePercent =
Math.min(
(employeeCount / employeeLimit) * 100,
100
);

const adminUsagePercent =
Math.min(
(adminCount / adminLimit) * 100,
100
);

return(

<div className="settings-page">

<div className="settings-header">

<h1>

Settings

</h1>

<p>

Manage appearance, notifications, subscription and preferences

</p>

</div>

{
message &&

<div className="success-message">

{message}

</div>
}

<div className="settings-grid">

{/* SUBSCRIPTION PLAN */}

{
role==="admin" &&

<div className="settings-card subscription-card">

<h2>

💳 Subscription & Plan

</h2>

<div className="current-plan-box">

<div>

<p>

Current Plan

</p>

<h3>

{currentPlan}

</h3>

</div>

<span>

{currentPlan.toUpperCase()}

</span>

</div>

<div className="usage-section">

<h3>

Usage

</h3>

<div className="usage-row">

<div className="usage-label">

<span>Employees</span>

<strong>
{employeeCount} / {employeeLimit}
</strong>

</div>

<div className="usage-bar">

<div
className={
employeeCount >= employeeLimit
?
"usage-progress danger"
:
"usage-progress"
}
style={{
width:`${employeeUsagePercent}%`
}}
>
</div>

</div>

</div>

<div className="usage-row">

<div className="usage-label">

<span>Admins</span>

<strong>
{adminCount} / {adminLimit}
</strong>

</div>

<div className="usage-bar">

<div
className={
adminCount >= adminLimit
?
"usage-progress danger"
:
"usage-progress"
}
style={{
width:`${adminUsagePercent}%`
}}
>
</div>

</div>

</div>

</div>

<div className="plans-section">

<h3>

Change Plan

</h3>

<p>

Select a plan for your admin account. Other admins in your company keep their own plans.

</p>

<div className="plan-grid">

{
Object.values(plans).map(
(plan)=>(

<div
key={plan.name}
className={
currentPlan === plan.name
?
"plan-card active-plan"
:
"plan-card"
}
>

<div className="plan-title-row">

<h3>

{plan.name}

</h3>

{
currentPlan === plan.name &&

<span>

CURRENT

</span>
}

</div>

<p>✓ Max Employees: <strong>{plan.maxEmployees}</strong></p>

<p>✓ Max Admins: <strong>{plan.maxAdmins}</strong></p>

<p>✓ Analytics Access: <strong>{plan.analytics}</strong></p>

<p>✓ Audit Log Access: <strong>{plan.auditLogs}</strong></p>

<p>✓ Export Access: <strong>{plan.exportAccess}</strong></p>

{
currentPlan === plan.name
?
null
:
canSelectPlan(plan.name)
?
<button
className="select-plan-btn"
onClick={()=>selectPlan(plan.name)}
>

Select {plan.name}

</button>
:
<button
className="select-plan-btn locked-plan-btn"
disabled
>

Locked

</button>
}

</div>

)
)
}

</div>

</div>

</div>

}

{/* APPEARANCE */}

<div className="settings-card">

<h2>

🌙 Appearance

</h2>

<p>

Switch between themes

</p>

<label>

<input

type="checkbox"

checked={darkMode}

onChange={toggleTheme}

/>

Dark Theme

</label>

</div>

{/* NOTIFICATIONS */}

<div className="settings-card">

<h2>

🔔 Notifications

</h2>

<label>

<input

type="checkbox"

defaultChecked

/>

Employee Alerts

</label>

<label>

<input

type="checkbox"

defaultChecked

/>

Attendance Alerts

</label>

<label>

<input

type="checkbox"

/>

Email Notifications

</label>

</div>

{/* ACCOUNT */}

<div className="settings-card">

<h2>

👤 Account

</h2>

<p>

<strong>

Email:

</strong>

{" "}

{email}

</p>

<p>

<strong>

Role:

</strong>

{" "}

{role}

</p>

<p>

<strong>

Company:

</strong>

{" "}

{company}

</p>

<p>

<strong>

Plan:

</strong>

{" "}

{currentPlan}

</p>

</div>

{/* USER */}

{

role==="user"

&&

<div className="settings-card">

<h2>

Request Admin Role

</h2>

<input

type="password"

name="password"

placeholder="Current Password"

value={formData.password}

onChange={handleChange}

/>

<input

name="adminEmail"

placeholder="Admin Email"

value={formData.adminEmail}

onChange={handleChange}

/>

<button

className="request-btn"

onClick={submitRequest}

>

Send Request

</button>

</div>

}

{/* ADMIN ROLE REQUESTS */}

{

role==="admin"

&&

<div className="settings-card">

<h2>

Pending Role Requests

</h2>

{

requests.length===0

?

<p>

No Role Requests

</p>

:

requests.map(

(request)=>(

<div

key={request.id}

className="request-card"

>

<div>

<p>

<strong>

User:

</strong>

{" "}

{request.name}

</p>

<p>

<strong>

Email:

</strong>

{" "}

{request.email}

</p>

<p>

<strong>

Company:

</strong>

{" "}

{request.company || "Stackly"}

</p>

</div>

<div className="request-buttons">

<button

className="approve-btn"

onClick={()=>{

approve(

request.id

)

}}

>

Approve

</button>

<button

className="reject-btn"

onClick={()=>{

reject(

request.id

)

}}

>

Reject

</button>

</div>

</div>

)

)

}

</div>

}

{/* ADMIN REACTIVATION REQUESTS */}

{

role==="admin"

&&

<div className="settings-card">

<h2>

Reactivation Requests

</h2>

{

reactivationRequests.length===0

?

<p>

No Reactivation Requests

</p>

:

reactivationRequests.map(

(request)=>(

<div

key={request.id}

className="request-card"

>

<div>

<p>

<strong>

User Email:

</strong>

{" "}

{request.email}

</p>

<p>

<strong>

Company:

</strong>

{" "}

{request.company}

</p>

<p>

<strong>

Requested By:

</strong>

{" "}

{request.requestedBy}

</p>

<p>

<strong>

Deactivated By:

</strong>

{" "}

{request.deactivatedBy || "Not Available"}

</p>

<p>

<strong>

Status:

</strong>

{" "}

{request.status}

</p>

</div>

<div className="request-buttons">

<button

className="approve-btn"

onClick={()=>{

approveReactivation(

request.id

)

}}

>

Approve

</button>

<button

className="reject-btn"

onClick={()=>{

rejectReactivation(

request.id

)

}}

>

Reject

</button>

</div>

</div>

)

)

}

</div>

}

{/* ADMIN LEAVE REQUESTS */}

{

role==="admin"

&&

<div className="settings-card">

<h2>

Leave Requests

</h2>

{

leaveRequests.length===0

?

<p>

No Leave Requests

</p>

:

leaveRequests.map(

(request)=>(

<div

key={request.id}

className="request-card"

>

<div>

<p>

<strong>

User Email:

</strong>

{" "}

{request.email}

</p>

<p>

<strong>

Leave Type:

</strong>

{" "}

{request.leaveType}

</p>

<p>

<strong>

Dates:

</strong>

{" "}

{request.startDate} to {request.endDate}

</p>

<p>

<strong>

Reason:

</strong>

{" "}

{request.reason}

</p>

<p>

<strong>

Company:

</strong>

{" "}

{request.company}

</p>

<p>

<strong>

Status:

</strong>

{" "}

{request.status}

</p>

</div>

<div className="request-buttons">

<button

className="approve-btn"

onClick={()=>{

approveLeave(

request.id

)

}}

>

Approve

</button>

<button

className="reject-btn"

onClick={()=>{

rejectLeave(

request.id

)

}}

>

Reject

</button>

</div>

</div>

)

)

}

</div>

}

</div>

</div>

)

}

export default SettingsPage;