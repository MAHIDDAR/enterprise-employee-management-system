import {
useState
} from "react";

import {
useNavigate
} from "react-router-dom";

import {
FaEye,
FaEyeSlash,
FaEnvelope,
FaLock,
FaUserFriends
} from "react-icons/fa";

import {
loginApi
} from "../../services/authService";

import {
createAttendanceAccessRequestApi
} from "../../services/attendanceService";

import "./LoginPage.css";

function LoginPage(){

const navigate =
useNavigate();

const [
showPassword,
setShowPassword
] = useState(false);

const [
rememberMe,
setRememberMe
] = useState(false);

const [
formData,
setFormData
] = useState({

email:"",

password:""

});

const [
error,
setError
] = useState("");

const [
loading,
setLoading
] = useState(false);

const handleChange = (event)=>{

setFormData({

...formData,

[event.target.name]:
event.target.value

});

};

const handleSubmit =
async(event)=>{

event.preventDefault();

setError("");

try{

setLoading(true);

const response =
await loginApi({

email:formData.email,

password:formData.password

});

if(
response.message === "Login Successful"
){

localStorage.setItem(
"role",
response.role
);

localStorage.setItem(
"company",
response.company
);

localStorage.setItem(
"token",
response.token
);

localStorage.setItem(
"isLoggedIn",
true
);

localStorage.setItem(
"email",
response.email || formData.email
);

localStorage.setItem(
"accountStatus",
response.accountStatus || "Active"
);

localStorage.setItem(
"reactivationStatus",
response.reactivationStatus || "Not Requested"
);

localStorage.setItem(
"deactivatedBy",
response.deactivatedBy || ""
);

if(response.role === "user"){

try{

await createAttendanceAccessRequestApi();

}
catch(error){

console.log(error);

}

}

if(
response.accountStatus === "Deactivated"
){

navigate(
"/account-deactivated"
);

}
else{

navigate(
"/dashboard"
);

}

}
else{

setError(
"Invalid Credentials"
);

}

}
catch(error){

console.log(error);

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
onSubmit={handleSubmit}
>

<div className="login-icon">

<FaUserFriends/>

</div>

<h2>

Welcome Back!

</h2>

<p className="login-subtitle">

Login to your account

</p>

<div className="form-group">

<label>

Email

</label>

<div className="input-wrapper">

<FaEnvelope className="input-icon"/>

<input
type="email"
name="email"
placeholder="Enter your email"
value={formData.email}
onChange={handleChange}
required
/>

</div>

</div>

<div className="form-group">

<label>

Password

</label>

<div className="input-wrapper">

<FaLock className="input-icon"/>

<input
type={
showPassword
?
"text"
:
"password"
}
name="password"
placeholder="Enter your password"
value={formData.password}
onChange={handleChange}
required
/>

<span
className="eye-icon"
onClick={()=>{

setShowPassword(
!showPassword
);

}}
>

{
showPassword
?
<FaEye/>
:
<FaEyeSlash/>
}

</span>

</div>

</div>

<div className="login-options">

<label className="remember-box">

<input
type="checkbox"
checked={rememberMe}
onChange={()=>setRememberMe(!rememberMe)}
/>

Remember me

</label>

<button
type="button"
className="forgot-btn"
onClick={()=>{

navigate(
"/forgot-password"
);

}}
>

Forgot password?

</button>

</div>

<button
type="submit"
className="login-btn"
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

<div className="signup-text">

Don't have an account?

<button
type="button"
onClick={()=>{

navigate(
"/signup"
);

}}
>

Sign up

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