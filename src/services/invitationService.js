import axios from "axios";

const BASE_URL =
"http://127.0.0.1:8000/invitations";

const getCompany = () => {

return localStorage.getItem("company") || "Stackly";

};

const getEmail = () => {

return localStorage.getItem("email") || "Admin User";

};


// CREATE INVITATION

export const createInvitationApi =
async(data)=>{

const response =
await axios.post(
BASE_URL,
{
...data,
company:getCompany(),
invitedBy:getEmail()
}
);

return response.data;

};


// GET INVITATIONS

export const getInvitationsApi =
async()=>{

const response =
await axios.get(
`${BASE_URL}?company=${getCompany()}`
);

return response.data;

};


// REVOKE INVITATION

export const revokeInvitationApi =
async(id)=>{

const response =
await axios.put(
`${BASE_URL}/${id}/revoke`,
{
company:getCompany(),
revokedBy:getEmail()
}
);

return response.data;

};


// GET MEMBERS

export const getMembersApi =
async()=>{

const response =
await axios.get(
`${BASE_URL}/members?company=${getCompany()}`
);

return response.data;

};


// DEACTIVATE USER

export const deactivateUserApi =
async(email)=>{

const response =
await axios.put(
`${BASE_URL}/members/deactivate`,
{
email:email,
company:getCompany(),
deactivatedBy:getEmail()
}
);

return response.data;

};


// SUBMIT REACTIVATION REQUEST

export const submitReactivationRequestApi =
async(reactivationMessage)=>{

const response =
await axios.post(
`${BASE_URL}/reactivation-request`,
{
email:localStorage.getItem("email"),
company:getCompany(),
requestedBy:localStorage.getItem("email"),
deactivatedBy:localStorage.getItem("deactivatedBy") || "",
message:reactivationMessage
}
);

return response.data;

};

// GET REACTIVATION REQUESTS

export const getReactivationRequestsApi =
async()=>{

const response =
await axios.get(
`${BASE_URL}/reactivation-requests?company=${getCompany()}`
);

return response.data;

};


// APPROVE REACTIVATION

export const approveReactivationApi =
async(id)=>{

const response =
await axios.put(
`${BASE_URL}/reactivation/${id}/approve`,
{
company:getCompany(),
approvedBy:getEmail()
}
);

return response.data;

};


// REJECT REACTIVATION

export const rejectReactivationApi =
async(id)=>{

const response =
await axios.put(
`${BASE_URL}/reactivation/${id}/reject`,
{
company:getCompany(),
rejectedBy:getEmail()
}
);

return response.data;

};