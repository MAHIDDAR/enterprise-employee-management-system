import {
useState
} from "react";

import {
submitReactivationRequestApi
} from "../../services/invitationService";

import "./AccountDeactivatedPage.css";

function AccountDeactivatedPage(){

const email =
localStorage.getItem("email");

const company =
localStorage.getItem("company");

const status =
localStorage.getItem("accountStatus") || "Deactivated";

const deactivatedBy =
localStorage.getItem("deactivatedBy") || "Not Available";

const currentRequestStatus =
localStorage.getItem("reactivationStatus") || "Not Requested";

const [
message,
setMessage
] = useState("");

const [
requestStatus,
setRequestStatus
] = useState(currentRequestStatus);

const [
reactivationMessage,
setReactivationMessage
] = useState("");

const submitRequest =
async()=>{

try{

const response =
await submitReactivationRequestApi(
reactivationMessage
);

setMessage(response.message);

if(
response.message === "Reactivation Request Submitted"
||
response.message === "Request Already Pending"
){

localStorage.setItem(
"reactivationStatus",
"pending"
);

setRequestStatus("pending");

}

}

catch(error){

console.log(error);

setMessage("Request Failed");

}

};

const logout =
()=>{

localStorage.clear();

window.location.href = "/";

};

return(

<div className="deactivated-page">

<div className="deactivated-card">

<h1>Account Deactivated</h1>

<p>
Your account is currently deactivated. You can submit a reactivation request to your company admin.
</p>

<div className="status-box">

<p>
<strong>Email:</strong> {email}
</p>

<p>
<strong>Company:</strong> {company}
</p>

<p>
<strong>Status:</strong> {status}
</p>

<p>
<strong>Deactivated By:</strong> {deactivatedBy}
</p>

<p>
<strong>Request Status:</strong>{" "}
{requestStatus}
</p>

</div>

<textarea
className="reactivation-textarea"
placeholder="Write your reason for reactivation request..."
value={reactivationMessage}
onChange={(event)=>
setReactivationMessage(event.target.value)
}
disabled={requestStatus === "pending"}
/>

<button
onClick={submitRequest}
disabled={requestStatus === "pending"}
>
{
requestStatus === "pending"
?
"Request Already Sent"
:
"Submit Reactivation Request"
}
</button>

<button
className="logout-btn"
onClick={logout}
>
Logout
</button>

{
message &&
<p className="message">
{message}
</p>
}

</div>

</div>

);

}

export default AccountDeactivatedPage;