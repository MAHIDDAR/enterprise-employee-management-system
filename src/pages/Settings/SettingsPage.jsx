import {
useState,
useEffect,
useContext
} from "react";

import {

sendRoleRequestApi,
getPendingRequestsApi,
approveRequestApi,
rejectRequestApi

}

from "../../services/authService";

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

const [formData,setFormData]=
useState({

password:"",

adminEmail:""

});

const [message,setMessage]=
useState("");

const [requests,setRequests]=
useState([]);

useEffect(()=>{

if(role==="admin"){

loadRequests();

}

},[role]);

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

return(

<div className="settings-page">

<div className="settings-header">

<h1>

Settings

</h1>

<p>

Manage appearance, notifications and preferences

</p>

</div>

<div className="settings-grid">

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

{

message &&

<p>

{message}

</p>

}

</div>

}

{/* ADMIN */}

{

role==="admin"

&&

<div className="settings-card">

<h2>

Pending Requests

</h2>

{

requests.length===0

?

<p>

No Requests

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

</div>

</div>

)

}

export default SettingsPage;