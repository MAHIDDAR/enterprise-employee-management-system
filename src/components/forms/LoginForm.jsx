import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label>Email</label>

        <input type="email" placeholder="Enter your email" />
      </div>

      <div className="form-group">
        <label>Password</label>

        <input type="password" placeholder="Enter your password" />
      </div>

      <button type="submit" className="login-btn">
        Login
      </button>
    </form>
  );
}

export default LoginForm;
