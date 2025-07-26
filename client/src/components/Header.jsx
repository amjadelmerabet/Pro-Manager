import { Link } from "react-router";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <h1 className="app-name poppins-bold">Pro Manager</h1>
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
        <Link to="/signin" className="signin-button poppins-semibold">Sign in</Link>
        <Link to="/signup" className="signup-button poppins-semibold">Sign up</Link>
      </div>
    </header>
  );
}
