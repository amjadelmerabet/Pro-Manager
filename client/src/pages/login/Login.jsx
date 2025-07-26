import { Link } from "react-router";

import "./Login.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <h1 className="title poppins-bold">Pro Manager</h1>
      <div className="login-section">
        <h2 className="signin-title poppins-bold">Sign in</h2>
        <form method="post" className="login-form poppins-regular">
          <div className="username-section">
            <label htmlFor="username" className="username-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username-input"
              className="username-input poppins-regular"
            />
          </div>
          <div className="password-section">
            <label htmlFor="password" className="password-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password-input"
              className="password-input poppins-regular"
            />
          </div>
          <div className="links-section">
            <a href="#" className="forgot-password">
              I forgot my password
            </a>
            <div className="sign-up">
              <p>Don't have an account yet. </p>
              <a href="#" className="signup-link">
                Sign up
              </a>
            </div>
          </div>
          <input type="submit" value="Sign in" className="signin-button poppins-bold" />
        </form>
      </div>
      <Link to="/" className="go-back-home poppins-regular">
        Go back home
      </Link>
    </div>
  );
}
