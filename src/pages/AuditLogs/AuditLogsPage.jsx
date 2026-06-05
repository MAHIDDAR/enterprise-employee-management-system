import {
useEffect,
useState
} from "react";

import {
getAuditLogsApi
} from "../../services/auditService";

import "./AuditLogsPage.css";

function AuditLogsPage(){

const role =
localStorage.getItem("role");

const company =
localStorage.getItem("company") || "Stackly";

const [logs,setLogs] =
useState([]);

const [loading,setLoading] =
useState(true);

useEffect(()=>{

loadAuditLogs();

},[]);

const loadAuditLogs =
async()=>{

try{

setLoading(true);

const data =
await getAuditLogsApi();

setLogs(data);

}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

};

if(role !== "admin"){

return(

<div className="audit-logs-page">

<h1>Access Denied</h1>

<p>
Only admin users can view audit logs.
</p>

</div>

);

}

if(loading){

return(

<div className="audit-logs-page">

Loading audit logs...

</div>

);

}

return(

<div className="audit-logs-page">

<div className="audit-header">

<h1>

Audit Logs

</h1>

<p>

Activity history for {company} company — employee changes and role requests.

</p>

</div>

<div className="audit-table-card">

<table className="audit-table">

<thead>

<tr>

<th>User</th>

<th>Action</th>

<th>Related Entity</th>

<th>Details</th>

<th>Timestamp</th>

</tr>

</thead>

<tbody>

{

logs.length === 0

?

<tr>

<td colSpan="5" className="no-logs">

No audit logs found

</td>

</tr>

:

logs.map((log)=>(

<tr key={log.id}>

<td>{log.userName}</td>

<td>{log.action}</td>

<td>{log.relatedEntity}</td>

<td>{log.details || "—"}</td>

<td>{log.timestamp}</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>

);

}

export default AuditLogsPage;