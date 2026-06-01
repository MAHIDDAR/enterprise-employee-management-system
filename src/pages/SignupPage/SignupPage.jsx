import {useState} from "react";

import {useNavigate}
from "react-router-dom";

import {
signupApi
}
from "../../services/authService";

import "./SignupPage.css";

function SignupPage(){

const navigate=
useNavigate();

const [formData,setFormData]=
useState({

name:"",

email:"",

password:"",

role:""

});

const [message,setMessage]=
useState("");

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

<input

name="name"

placeholder="Name"

required

onChange={handleChange}

/>

<input

name="email"

placeholder="Email"

required

onChange={handleChange}

/>

<input

type="password"

name="password"

placeholder="Password"

required

onChange={handleChange}

/>

<select

name="role"

required

onChange={handleChange}

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