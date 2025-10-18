import { Link } from "react-router";
import "./Header.css";

export default function Header() {
  const userLoggedIn = JSON.parse(sessionStorage.getItem("authUser"));

  return (
    <header>
      <h1 className="app-name poppins-bold">
        <Link to="/">Pro Manager</Link>
      </h1>
      <ul className="menu">
        <li className="poppins-semibold">
          <Link to="/">Home</Link>
        </li>
        <li className="poppins-semibold">
          <Link to="/features">Features</Link>
        </li>
        <li className="poppins-semibold">
          <Link to="/blog">Blog</Link>
        </li>
        <li className="poppins-semibold">
          <Link to="/pricing">Pricing</Link>
        </li>
        <li className="poppins-semibold">
          <Link to="/about">About us</Link>
        </li>
        <li className="poppins-semibold">
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <div className="auth-section">
        {userLoggedIn && userLoggedIn.authenticated ? (
          <Link
            to={`/auth/${userLoggedIn.user}/dashboard`}
            className="workspace poppins-semibold"
          >
            My Workspace
          </Link>
        ) : (
          <div className="auth-buttons">
            <Link to="/signin" className="signin-button poppins-semibold">
              Sign in
            </Link>
            <Link to="/signup" className="signup-button poppins-semibold">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
