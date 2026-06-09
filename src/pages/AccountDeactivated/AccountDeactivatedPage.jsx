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

const [
message,
setMessage
] = useState("");

const submitRequest =
async()=>{

try{

const response =
await submitReactivationRequestApi();

setMessage(response.message);

localStorage.setItem(
"reactivationStatus",
"pending"
);

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
<strong>Request Status:</strong>{" "}
{localStorage.getItem("reactivationStatus") || "Not Requested"}
</p>

</div>

<button
onClick={submitRequest}
>
Submit Reactivation Request
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