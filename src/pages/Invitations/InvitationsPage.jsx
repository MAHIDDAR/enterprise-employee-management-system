import {
useEffect,
useState
} from "react";

import {
createInvitationApi,
getInvitationsApi,
revokeInvitationApi,
getMembersApi,
deactivateUserApi,
getReactivationRequestsApi,
approveReactivationApi,
rejectReactivationApi
} from "../../services/invitationService";

import "./InvitationsPage.css";

function InvitationsPage(){

const role =
localStorage.getItem("role");

const company =
localStorage.getItem("company") || "Stackly";

const [formData,setFormData] =
useState({
email:"",
role:"user"
});

const [message,setMessage] =
useState("");

const [invitations,setInvitations] =
useState([]);

const [members,setMembers] =
useState([]);

const [
reactivationRequests,
setReactivationRequests
] = useState([]);

useEffect(()=>{

loadData();

},[]);

const loadData =
async()=>{

try{

const invitationData =
await getInvitationsApi();

const memberData =
await getMembersApi();

const requestData =
await getReactivationRequestsApi();

setInvitations(invitationData);

setMembers(memberData);

setReactivationRequests(requestData);

}

catch(error){

console.log(error);

}

};

const handleChange =
(event)=>{

setFormData({
...formData,
[event.target.name]:
event.target.value
});

};

const createInvitation =
async()=>{

try{

const response =
await createInvitationApi(formData);

setMessage(response.message);

setFormData({
email:"",
role:"user"
});

loadData();

}

catch(error){

console.log(error);

setMessage("Invitation Failed");

}

};

const copyLink =
(link)=>{

navigator.clipboard.writeText(link);

setMessage("Invitation Link Copied");

};

const revokeInvitation =
async(id)=>{

await revokeInvitationApi(id);

loadData();

};

const deactivateMember =
async(email)=>{

const confirmAction =
window.confirm(
"Are you sure you want to deactivate this user?"
);

if(!confirmAction) return;

await deactivateUserApi(email);

loadData();

};

const approveRequest =
async(id)=>{

await approveReactivationApi(id);

loadData();

};

const rejectRequest =
async(id)=>{

await rejectReactivationApi(id);

loadData();

};

if(role !== "admin"){

return(

<div className="invitations-page">

<h1>Access Denied</h1>

<p>Only admin can access invitations.</p>

</div>

);

}

return(

<div className="invitations-page">

<div className="invitations-header">

<h1>User Invitations & Members</h1>

<p>
Manage invitations, members, deactivation and reactivation for {company}
</p>

</div>

{
message &&
<div className="invitation-message">
{message}
</div>
}

<div className="invitation-grid">

<div className="invitation-card">

<h2>Create Invitation</h2>

<input
name="email"
placeholder="User Email"
value={formData.email}
onChange={handleChange}
/>

<select
name="role"
value={formData.role}
onChange={handleChange}
>

<option value="user">
User
</option>

<option value="admin">
Admin
</option>

</select>

<button
onClick={createInvitation}
>
Generate Invitation
</button>

</div>

<div className="invitation-card">

<h2>Pending Invitations</h2>

{
invitations.filter(
item => item.status === "pending"
).length === 0
?
<p>No pending invitations</p>
:
invitations
.filter(item => item.status === "pending")
.map(invitation=>(

<div
key={invitation.id}
className="invitation-row"
>

<div>

<h3>{invitation.email}</h3>

<p>{invitation.role} - {invitation.status}</p>

</div>

<div className="invitation-actions">

<button
onClick={()=>
copyLink(invitation.invitationLink)
}
>
Copy Link
</button>

<button
className="danger-btn"
onClick={()=>
revokeInvitation(invitation.id)
}
>
Revoke
</button>

</div>

</div>

))
}

</div>

</div>

<div className="invitation-card full-card">

<h2>Active Members</h2>

<div className="member-table">

<table>

<thead>

<tr>

<th>Name</th>

<th>Email</th>

<th>Role</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{
members.map((member,index)=>(

<tr key={index}>

<td>{member.name}</td>

<td>{member.email}</td>

<td>{member.role}</td>

<td>{member.status}</td>

<td>

{
member.status === "Deactivated"
?
<span className="disabled-text">
Deactivated
</span>
:
<button
className="danger-btn"
onClick={()=>
deactivateMember(member.email)
}
>
Deactivate
</button>
}

</td>

</tr>

))
}

</tbody>

</table>

</div>

</div>

<div className="invitation-card full-card">

<h2>Reactivation Requests</h2>

{
reactivationRequests.filter(
request => request.status === "pending"
).length === 0
?
<p>No reactivation requests</p>
:
reactivationRequests
.filter(request => request.status === "pending")
.map(request=>(

<div
key={request.id}
className="invitation-row"
>

<div>

<h3>{request.email}</h3>

<p>Status: {request.status}</p>

</div>

<div className="invitation-actions">

<button
onClick={()=>
approveRequest(request.id)
}
>
Approve
</button>

<button
className="danger-btn"
onClick={()=>
rejectRequest(request.id)
}
>
Reject
</button>

</div>

</div>

))
}

</div>

</div>

);

}

export default InvitationsPage;