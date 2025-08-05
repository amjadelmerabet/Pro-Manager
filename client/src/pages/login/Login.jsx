import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import "./Login.css";

export default function LoginPage({ isAuthenticated, setAuthentication }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");

  const [searchParams] = useSearchParams();
  // if (searchParams.match(/^redirect=*./));
  const redirectURL = searchParams.get("redirect");
  
  let navigate = useNavigate();

  const userAuthenticated = sessionStorage.getItem("authUser");
  
  useEffect(() => {
    if (isAuthenticated || userAuthenticated) {
      if (redirectURL) {
        console.log("Redirect URL");
        if (userAuthenticated) {
          console.log("User Authenticated");
          const authUser = JSON.parse(userAuthenticated).user;
          const userRedirectURL = redirectURL.replace("user", authUser);
          navigate(userRedirectURL);
        } else {
          navigate("/signin");
        }
      } else {
        console.log("No Redirect URL");
        if (userAuthenticated && !username) {
          const authUser = JSON.parse(userAuthenticated).user;
          navigate("/auth/" + authUser + "/dashboard");
        } else {
          console.log("Other");
          navigate("/auth/user/dashboard");
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (login === "login") {
      // console.log("User trying to login");
      const authUser = async () => {
        const response = await fetch("http://127.0.0.1:3000/users/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const auth = await response.json();
        setLogin("LoginEnded");
        if (auth.authenticated) {
          sessionStorage.setItem("authUser", JSON.stringify({ user: username, authenticated: true }));
        }
        setAuthentication(auth.authenticated);
      }
      authUser();
    }
  }, [login]);

  const handleSignIn = async () => {
    setLogin("login");
  };

  return (
    <div className="login-page">
      <h1 className="title poppins-bold">Pro Manager</h1>
      <div className="login-section">
        <h2 className="signin-title poppins-bold">Sign in</h2>
        <form className="login-form poppins-regular">
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
              <a href="#" className="signup-link">
                Sign up
              </a>
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
      <Link to="/" className="go-back-home poppins-regular">
        Go back home
      </Link>
    </div>
  );
}
