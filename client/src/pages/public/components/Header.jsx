import { Link, NavLink } from "react-router";
import "./Header.css";

export default function Header() {
  const userLoggedIn = JSON.parse(sessionStorage.getItem("authUser"));
  const previewModernUI = sessionStorage.getItem("modern-ui");

  return (
    <header>
      <h1 className="app-name poppins-bold">
        <Link to="/">Pro Manager</Link>
      </h1>
      <ul className="menu">
        <li className="poppins-semibold">
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li className="poppins-semibold">
          <NavLink to="/features">Features</NavLink>
        </li>
        <li className="poppins-semibold">
          <NavLink to="/blog">Blog</NavLink>
        </li>
        <li className="poppins-semibold">
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li className="poppins-semibold">
          <NavLink to="/about">About us</NavLink>
        </li>
        <li className="poppins-semibold">
          <NavLink to="/contact">Contact</NavLink>
        </li>
      </ul>
      <div className="auth-section">
        {userLoggedIn && userLoggedIn.authenticated ? (
          previewModernUI && previewModernUI === "true" ? (
            <Link
              to={`/auth/${userLoggedIn.user}/modern/workspace/${userLoggedIn.workspaceId}/dashboard`}
              className="workspace poppins-semibold"
            >
              My Workspace
            </Link>
          ) : (
            <Link
              to={`/auth/${userLoggedIn.user}/classic/workspace/${userLoggedIn.workspaceId}/dashboard`}
              className="workspace poppins-semibold"
            >
              My Workspace
            </Link>
          )
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
