import LoginForm from "../../components/forms/LoginForm";
import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back!</h1>
        <p>Login to your account</p>

        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
