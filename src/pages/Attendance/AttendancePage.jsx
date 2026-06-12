import {
useEffect,
useState
}
from "react";

import {
fetchEmployees
}
from "../../services/employeeService";

import {
getUserAttendanceAccessApi,
createAttendanceAccessRequestApi,
checkInApi,
checkOutApi,
getMyAttendanceApi,
submitLeaveRequestApi,
getMyLeaveRequestsApi
}
from "../../services/attendanceService";

import "./AttendancePage.css";

function AttendancePage(){

const role=
localStorage.getItem(
"role"
);

const email=
localStorage.getItem(
"email"
);

const company=
localStorage.getItem(
"company"
) || "Stackly";

const [
employees,
setEmployees
]=useState([]);

const [
loading,
setLoading
]=useState(true);

const [
accessStatus,
setAccessStatus
]=useState("");

const [
submittedAt,
setSubmittedAt
]=useState("");

const [
todayAttendance,
setTodayAttendance
]=useState(null);

const [
attendanceHistory,
setAttendanceHistory
]=useState([]);

const [
leaveForm,
setLeaveForm
]=useState({
leaveType:"Vacation",
startDate:"",
endDate:"",
reason:""
});

const [
leaveRequests,
setLeaveRequests
]=useState([]);

const [
message,
setMessage
]=useState("");

useEffect(()=>{

if(role==="admin"){

loadEmployees();

}
else{

loadUserAttendance();

}

},[]);

const loadEmployees=
async()=>{

const data=
await fetchEmployees();

setEmployees(data);

setLoading(false);

};

const loadUserAttendance=
async()=>{

try{

setLoading(true);

const accessData =
await getUserAttendanceAccessApi();

if(accessData.status === "not_requested"){

const requestResponse =
await createAttendanceAccessRequestApi();

setAccessStatus(
requestResponse.status
);

setSubmittedAt(
requestResponse.submittedAt
);

setLoading(false);

return;

}

setAccessStatus(
accessData.status
);

setSubmittedAt(
accessData.submittedAt
);

if(accessData.status === "approved"){

const attendanceData =
await getMyAttendanceApi();

setTodayAttendance(
attendanceData.todayAttendance
);

setAttendanceHistory(
attendanceData.history || []
);

const leaveData =
await getMyLeaveRequestsApi();

setLeaveRequests(
leaveData
);

}

setLoading(false);

}
catch(error){

console.log(error);

setMessage("Attendance loading failed");

setLoading(false);

}

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

const handleCheckIn =
async()=>{

const response =
await checkInApi();

setMessage(
response.message
);

loadUserAttendance();

};

const handleCheckOut =
async()=>{

const response =
await checkOutApi();

setMessage(
response.message
);

loadUserAttendance();

};

const handleLeaveChange =
(event)=>{

setLeaveForm({
...leaveForm,
[event.target.name]:
event.target.value
});

};

const submitLeave =
async()=>{

const response =
await submitLeaveRequestApi(
leaveForm
);

setMessage(
response.message
);

setLeaveForm({
leaveType:"Vacation",
startDate:"",
endDate:"",
reason:""
});

loadUserAttendance();

};

if(loading){

return <div>

Loading...

</div>

}

/* ADMIN ATTENDANCE PAGE - SAME AS BEFORE */

if(role==="admin"){

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

<button

className=
"download-btn"

onClick={
downloadCSV
}

>

Download Report

</button>

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

/* USER PENDING ACCESS SCREEN */

if(accessStatus !== "approved"){

return(

<div className="attendance-page">

<div className="attendance-header">

<h1>

Attendance

</h1>

<p>

Check in/out for today and submit leave requests for admin approval.

</p>

</div>

<div className="attendance-pending-card">

<h2>

Attendance Access Pending

</h2>

<p>

Your account is not linked to an employee profile yet. A request has been sent to your company admin for approval.

</p>

<p>

<strong>Submitted on:</strong>{" "}
{submittedAt || "Request submitted"}

</p>

</div>

</div>

);

}

/* USER APPROVED ATTENDANCE PAGE */

return(

<div className="attendance-page">

<div className="attendance-header">

<h1>

Attendance

</h1>

<p>

Check in/out for today and submit leave requests for admin approval.

</p>

</div>

{
message &&
<div className="attendance-message">

{message}

</div>
}

<div className="user-attendance-grid">

<div className="attendance-user-card">

<h2>

Today's Attendance

</h2>

<p>

<strong>User:</strong> {email}

</p>

<p>

<strong>Company:</strong> {company}

</p>

<p className="attendance-status">

{
todayAttendance
?
`In: ${todayAttendance.checkIn || "-"} - Out: ${todayAttendance.checkOut || "-"}`
:
"No attendance marked today"
}

</p>

<div className="attendance-actions">

{
(!todayAttendance || !todayAttendance.checkIn) &&

<button
onClick={handleCheckIn}
>
Check In
</button>

}

{
todayAttendance &&
todayAttendance.checkIn &&
!todayAttendance.checkOut &&

<button
onClick={handleCheckOut}
>
Check Out
</button>

}

{
todayAttendance &&
todayAttendance.checkIn &&
todayAttendance.checkOut &&

<p className="attendance-completed-text">

Attendance completed for today

</p>

}

</div>

</div>

<div className="attendance-user-card">

<h2>

Request Leave

</h2>

<label>

Leave type

</label>

<select
name="leaveType"
value={leaveForm.leaveType}
onChange={handleLeaveChange}
>

<option value="Vacation">

Vacation

</option>

<option value="Sick Leave">

Sick Leave

</option>

<option value="Casual Leave">

Casual Leave

</option>

</select>

<label>

Start date

</label>

<input
type="date"
name="startDate"
value={leaveForm.startDate}
onChange={handleLeaveChange}
/>

<label>

End date

</label>

<input
type="date"
name="endDate"
value={leaveForm.endDate}
onChange={handleLeaveChange}
/>

<label>

Reason

</label>

<textarea
name="reason"
placeholder="Brief reason for your leave request"
value={leaveForm.reason}
onChange={handleLeaveChange}
>
</textarea>

<button
onClick={submitLeave}
>
Submit Leave Request

</button>

</div>

</div>

<div className="attendance-table-card">

<h2>

Recent Attendance

</h2>

<table>

<thead>

<tr>

<th>Date</th>

<th>Status</th>

<th>Check In</th>

<th>Check Out</th>

<th>Working Hours</th>

</tr>

</thead>

<tbody>

{
attendanceHistory.length === 0
?
<tr>
<td colSpan="5">
No attendance history
</td>
</tr>
:
attendanceHistory.map((item,index)=>(

<tr key={index}>

<td>{item.date}</td>

<td>{item.status}</td>

<td>{item.checkIn || "-"}</td>

<td>{item.checkOut || "-"}</td>

<td>{item.workingHours || "-"}</td>

</tr>

))
}

</tbody>

</table>

</div>

<div className="attendance-table-card">

<h2>

My Leave Requests

</h2>

<table>

<thead>

<tr>

<th>Type</th>

<th>Dates</th>

<th>Status</th>

<th>Reason</th>

</tr>

</thead>

<tbody>

{
leaveRequests.length === 0
?
<tr>
<td colSpan="4">
No leave requests
</td>
</tr>
:
leaveRequests.map((request,index)=>(

<tr key={index}>

<td>{request.leaveType}</td>

<td>{request.startDate} → {request.endDate}</td>

<td>{request.status}</td>

<td>{request.reason}</td>

</tr>

))
}

</tbody>

</table>

</div>

</div>

);

}

export default AttendancePage;