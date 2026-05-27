import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  loginApi
} from "../../services/authService";

import "./LoginPage.css";

function LoginPage() {

  const navigate =
    useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      const response =
        await loginApi(formData);

      if (
        response.message ===
        "Login Successful"
      ) {

        // STORE ROLE
        localStorage.setItem(
          "role",
          response.role
        );

        // STORE LOGIN
        localStorage.setItem(
          "isLoggedIn",
          true
        );

        navigate("/dashboard");

      } else {

        setError(
          "Invalid Credentials"
        );
      }

    } catch (error) {

      console.log(error);

      setError(
        "Login Failed"
      );
    }
  };

  return (

    <div className="login-page">

      <form
        className="login-form"
        onSubmit={handleSubmit}
      >

        <h2>
          Employee Management Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

      </form>

    </div>
  );
}

export default LoginPage;