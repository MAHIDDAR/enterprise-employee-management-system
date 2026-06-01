import axios from "axios";

const BASE_URL =
"http://127.0.0.1:8000/auth";

export const loginApi =
async(data)=>{

const response=
await axios.post(

`${BASE_URL}/login`,

data

);

return response.data;

};


export const signupApi =
async(data)=>{

const response=
await axios.post(

`${BASE_URL}/signup`,

data

);

return response.data;

};


export const forgotPasswordApi =
async(data)=>{

const response=
await axios.post(

`${BASE_URL}/forgot-password`,

data

);

return response.data;

};