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

  const [loading, setLoading] =
    useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // HANDLE LOGIN
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      const response =
        await loginApi(formData);

      // SUCCESS LOGIN
      if (
        response.message ===
        "Login Successful"
      ) {

        // STORE ROLE
        localStorage.setItem(
          "role",
          response.role
        );

        // STORE JWT TOKEN
        localStorage.setItem(
          "token",
          response.token
        );

        
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

    } finally {

      setLoading(false);
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

        <p className="login-subtitle">
          Welcome Back 👋
        </p>

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Logging In..."
            : "Login"}

        </button>

        {/* ERROR */}
        {error && (

          <p className="error-text">
            {error}
          </p>
        )}

        {/* DEMO CREDENTIALS */}
        <div className="demo-credentials">

          <h4>
            Demo Credentials
          </h4>

          <p>
            <strong>Admin:</strong>
            admin@gmail.com /
            admin123
          </p>

          <p>
            <strong>User:</strong>
            user@gmail.com /
            user123
          </p>

        </div>

      </form>

    </div>
  );
}

export default LoginPage;