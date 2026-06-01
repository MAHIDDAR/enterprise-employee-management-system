import {
useState
} from "react";

import {
useNavigate
} from "react-router-dom";

import {
FaEye,
FaEyeSlash
} from "react-icons/fa";

import {
loginApi
} from "../../services/authService";

import "./LoginPage.css";

function LoginPage(){

const navigate=
useNavigate();

const[
showPassword,
setShowPassword
]=useState(true);

const[
formData,
setFormData
]=useState({

email:"",

password:"",

role:""

});

const[
error,
setError
]=useState("");

const[
loading,
setLoading
]=useState(false);

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

setError("");

try{

setLoading(true);

const response=
await loginApi(
formData
);

if(

response.message===
"Login Successful"

){

localStorage.setItem(

"role",

response.role

);

localStorage.setItem(

"token",

response.token

);

localStorage.setItem(

"isLoggedIn",

true

);

navigate(
"/dashboard"
);

}

else{

setError(
"Invalid Credentials"
);

}

}

catch{

setError(
"Login Failed"
);

}

finally{

setLoading(false);

}

};

return(

<div className="login-page">

<form

className="login-form"

onSubmit={
handleSubmit
}

>

<h2>

Employee Management Login

</h2>

<select

name="role"

value={
formData.role
}

onChange={
handleChange
}

required

>

<option value="">

Select Role

</option>

<option value="admin">

Admin

</option>

<option value="user">

User

</option>

</select>

<input

type="email"

name="email"

placeholder="Enter Email"

value={
formData.email
}

onChange={
handleChange
}

required

/>

<div className="password-wrapper">

<input

type={

showPassword

?

"password"

:

"text"

}

name="password"

placeholder="Enter Password"

value={formData.password}

onChange={handleChange}

required

/>

<span

className="eye-icon"

onClick={()=>{

setShowPassword(

!showPassword

)

}}

>

{

showPassword

?

<FaEyeSlash/>

:

<FaEye/>

}

</span>

</div>

<button

type="submit"

disabled={loading}

>

{

loading

?

"Logging In..."

:

"Login"

}

</button>

<div className="auth-links">

<button

type="button"

className="secondary-btn"

onClick={()=>{

navigate(
"/forgot-password"
)

}}

>

Forgot Password?

</button>

<button

type="button"

className="secondary-btn"

onClick={()=>{

navigate(
"/signup"
)

}}

>

Sign Up

</button>

</div>

{

error && (

<p className="error-text">

{error}

</p>

)

}

</form>

</div>

);

}

export default LoginPage;