// Hooks
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

// Icons
import { IoArrowBack } from "react-icons/io5";

// Components
import { Link } from "react-router";

// Utils
import authUserUtil from "./utils/authUserUtil";

// Styles
import "./Login.css";
import loginRedirectUtil from "./utils/loginRedirectUtil";

export default function LoginPage({ isAuthenticated, setAuthentication }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [loginStart, setLoginStart] = useState(false);
  const [goBackLink, setGoBackLink] = useState(false);

  const [searchParams] = useSearchParams();
  const redirectURL = searchParams.get("redirect");

  let navigate = useNavigate();

  const userAuthenticated = sessionStorage.getItem("authUser");
  const logout = sessionStorage.getItem("userLoggedOut");

  useEffect(() => {
    if (isAuthenticated || userAuthenticated) {
      loginRedirectUtil(
        redirectURL,
        userAuthenticated,
        navigate,
        logout,
        username,
      );
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (login === "login") {
      authUserUtil(
        username,
        password,
        setLogin,
        setAuthentication,
        setIncorrectCredentials,
      );
    }
  }, [login]);

  useEffect(() => {
    setTimeout(() => {
      setLoginStart(true);
    }, 250);
  }, []);

  const handleSignIn = async () => {
    setLogin("login");
  };

  const mouseOnGoBackLink = () => {
    setGoBackLink(true);
    setTimeout(() => {
      setGoBackLink(false);
    }, 250);
  };

  return (
    <div className={"login-page" + (loginStart ? " visible " : "")}>
      <h1 className="title poppins-bold">Pro Manager</h1>
      <div className="login-section">
        <h2 className="signin-title poppins-bold">Sign in</h2>
        <form className="login-form poppins-regular">
          {incorrectCredentials ? (
            <div className="incorrect-credentials">Incorrect Credentials</div>
          ) : (
            ""
          )}
          <div className="username-section">
            <label htmlFor="username" className="username-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username-input"
              className="username-input poppins-regular"
              onChange={(event) => setUsername(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="links-section">
            <a href="#" className="forgot-password">
              I forgot my password
            </a>
            <div className="sign-up">
              <p>Don't have an account yet. </p>
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </div>
          </div>
          <input
            type="button"
            value="Sign in"
            className="signin-button poppins-bold"
            onClick={() => handleSignIn()}
          />
        </form>
      </div>
      <Link
        to="/"
        className={
          "go-back-home poppins-regular" + (goBackLink ? " mouse-on" : "")
        }
        onMouseEnter={() => mouseOnGoBackLink()}
      >
        <IoArrowBack />
        <span>Go back home</span>
      </Link>
    </div>
  );
}
