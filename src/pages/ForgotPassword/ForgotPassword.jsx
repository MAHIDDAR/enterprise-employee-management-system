import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  forgotPasswordApi
} from "../../services/authService";

import "./ForgotPassword.css";

function ForgotPasswordPage() {

  const navigate =
    useNavigate();

  const [formData,setFormData]=
    useState({

      email:"",

      newPassword:"",

      confirmPassword:""

    });

  const [error,setError]=
    useState("");

  const [success,setSuccess]=
    useState("");

  const [loading,setLoading]=
    useState(false);

  const handleChange=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  const handleSubmit=async(
    e
  )=>{

    e.preventDefault();

    setError("");

    setSuccess("");

    // VALIDATIONS

    if(

      !formData.email ||

      !formData.newPassword ||

      !formData.confirmPassword

    ){

      setError(
        "All fields are required"
      );

      return;

    }

    if(

      formData.newPassword.length < 6

    ){

      setError(
        "Password must contain minimum 6 characters"
      );

      return;

    }

    if(

      formData.newPassword !==
      formData.confirmPassword

    ){

      setError(
        "Passwords do not match"
      );

      return;

    }

    try{

      setLoading(true);

      const response=
      await forgotPasswordApi({

        email:
        formData.email,

        password:
        formData.newPassword

      });

      if(

        response.message

      ){

        setSuccess(
          "Password Updated Successfully"
        );

        setTimeout(()=>{

          navigate("/");

        },2000);

      }

    }

    catch(error){

      setError(
        "Failed To Reset Password"
      );

    }

    finally{

      setLoading(false);

    }

  };

  return(

    <div className="forgot-page">

      <div className="forgot-card">

        <h2>

          Forgot Password

        </h2>

        <p>

          Reset your account password

        </p>

        <form
          onSubmit={handleSubmit}
        >

          <input

            type="email"

            name="email"

            placeholder="Enter Email"

            value={formData.email}

            onChange={handleChange}

            required

          />

          <input

            type="password"

            name="newPassword"

            placeholder="New Password"

            value={
              formData.newPassword
            }

            onChange={
              handleChange
            }

            required

          />

          <input

            type="password"

            name="confirmPassword"

            placeholder="Confirm Password"

            value={
              formData.confirmPassword
            }

            onChange={
              handleChange
            }

            required

          />

          <button

            type="submit"

            disabled={loading}

          >

            {

              loading ?

              "Updating..."

              :

              "Reset Password"

            }

          </button>

        </form>

        {

          error &&

          <p className="error-text">

            {error}

          </p>

        }

        {

          success &&

          <p className="success-text">

            {success}

          </p>

        }

        <button

          className="back-btn"

          onClick={()=>navigate("/")}

        >

          Back To Login

        </button>

      </div>

    </div>

  );

}

export default ForgotPasswordPage;