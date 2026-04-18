// Hooks
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

// Icons
import { IoArrowBack } from "react-icons/io5";

// Components
import { Link } from "react-router";

// Utils
import authUserUtil from "./utils/authUserUtil";
import loginRedirectUtil from "./utils/loginRedirectUtil";
import createSessionUtil from "./utils/createSessionUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";

// Styles
import "./Login.css";

export default function LoginPage({ isAuthenticated, setAuthentication }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [loginStart, setLoginStart] = useState(false);
  const [goBackLink, setGoBackLink] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [tries, setTries] = useState(0);
  const [newSession, setNewSession] = useState(0);
  const [redirect, setRedirect] = useState(false);

  const [searchParams] = useSearchParams();
  const redirectURL = searchParams.get("redirect");

  let navigate = useNavigate();

  const userAuthenticated = sessionStorage.getItem("authUser");
  const logout = sessionStorage.getItem("userLoggedOut");

  useEffect(() => {
    setTimeout(() => {
      setTokenValidated(false);
    }, 2500);
    if (isAuthenticated) {
      setTokenValidated(true);
      setNewSession(newSession + 1);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (redirect) {
      loginRedirectUtil(
        redirectURL,
        userAuthenticated,
        navigate,
        logout,
        username,
      );
    }
  }, [redirect]);

  useEffect(() => {
    if (newSession > 0) {
      const { user, userId, token } = JSON.parse(userAuthenticated);
      createSessionUtil(
        user,
        userId,
        token,
        tokenValidated,
        setTokenValidated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setRedirect
      );
    }
  }, [newSession]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getAccessTokenUtil(
        userAuthenticated.user,
        userAuthenticated.userId,
        setTokenValidated,
        setTries,
        newAccessToken,
        newSession,
        setNewSession,
      );
    }
  }, [newAccessToken]);

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
