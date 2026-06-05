import axios from "axios";

const BASE_URL =
"http://127.0.0.1:8000/audit-logs";

const getCompany = () => {

return localStorage.getItem("company") || "Stackly";

};

export const getAuditLogsApi =
async()=>{

const response =
await axios.get(

`${BASE_URL}?company=${getCompany()}`

);

return response.data;

};