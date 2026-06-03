import axios from "axios";

const BASE_URL =
"http://127.0.0.1:8000/auth";


// LOGIN

export const loginApi =
async(data)=>{

const response=
await axios.post(

`${BASE_URL}/login`,

data

)

return response.data

}


// SIGNUP

export const signupApi =
async(data)=>{

const response=
await axios.post(

`${BASE_URL}/signup`,

data

)

return response.data

}


// FORGOT PASSWORD

export const forgotPasswordApi =
async(data)=>{

const response=
await axios.post(

`${BASE_URL}/forgot-password`,

data

)

return response.data

}


// SEND ROLE REQUEST

export const sendRoleRequestApi =
async(data)=>{

const response=
await axios.post(

"http://127.0.0.1:8000/requests",

data

)

return response.data

}


// GET REQUESTS

export const getPendingRequestsApi =
async()=>{

const response=
await axios.get(

"http://127.0.0.1:8000/requests"

)

return response.data

}


// APPROVE

export const approveRequestApi =
async(id)=>{

const response=
await axios.put(

`http://127.0.0.1:8000/requests/${id}/approve`

)

return response.data

}


// REJECT

export const rejectRequestApi =
async(id)=>{

const response=
await axios.put(

`http://127.0.0.1:8000/requests/${id}/reject`

)

return response.data

}
