import {
useEffect,
useState
} from "react";

import {
useNavigate,
useSearchParams
} from "react-router-dom";

import {
signupApi
}
from "../../services/authService";

import "./SignupPage.css";

function SignupPage(){

const navigate=
useNavigate();

const [
searchParams
] = useSearchParams();

const invitationEmail =
searchParams.get("email") || "";

const invitationCompany =
searchParams.get("company") || "";

const invitationRole =
searchParams.get("role") || "";

const isInvitationSignup =
invitationEmail !== "" ||
invitationCompany !== "" ||
invitationRole !== "";

const [formData,setFormData]=
useState({

name:"",

email:"",

password:"",

company:"",

role:""

});

const [message,setMessage]=
useState("");

useEffect(()=>{

if(isInvitationSignup){

setFormData((previousData)=>({

...previousData,

email:invitationEmail,

company:invitationCompany,

role:invitationRole

}));

}

},[
invitationEmail,
invitationCompany,
invitationRole,
isInvitationSignup
]);

const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:
e.target.value

});

};

const handleSubmit=
async(e)=>{

e.preventDefault();

const response=
await signupApi(
formData
);

setMessage(
response.message
);

if(

response.message===

"Signup Successful"

){

setTimeout(()=>{

navigate("/")

},1000)

}

};

return(

<div className="signup-page">

<form

className="signup-form"

onSubmit={handleSubmit}

>

<h2>

Create Account

</h2>

{

isInvitationSignup && (

<p className="invite-text">

You are signing up using an invitation link.

</p>

)

}

<input

name="name"

placeholder="Name"

required

value={formData.name}

onChange={handleChange}

/>

<input

name="email"

placeholder="Email"

required

value={formData.email}

onChange={handleChange}

disabled={isInvitationSignup}

/>

<input

type="password"

name="password"

placeholder="Password"

required

value={formData.password}

onChange={handleChange}

/>

<select

name="company"

required

value={formData.company}

onChange={handleChange}

disabled={isInvitationSignup}

>

<option value="">

Select Company

</option>

<option value="Stackly">

Stackly

</option>

<option value="TCS">

TCS

</option>

</select>

<select

name="role"

required

value={formData.role}

onChange={handleChange}

disabled={isInvitationSignup}

>

<option value="">

Select Role

</option>

<option value="user">

User

</option>

<option value="admin">

Admin

</option>

</select>

<button>

Create Account

</button>

<p>

{message}

</p>

</form>

</div>

)

}

export default SignupPage;