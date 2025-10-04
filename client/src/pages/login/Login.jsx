import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import "./Login.css";

export default function LoginPage({ isAuthenticated, setAuthentication }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);
  const [loginStart, setLoginStart] = useState(false);

  const [searchParams] = useSearchParams();
  const redirectURL = searchParams.get("redirect");

  let navigate = useNavigate();

  const userAuthenticated = sessionStorage.getItem("authUser");
  const logout = sessionStorage.getItem("userLoggedOut");

  useEffect(() => {
    if (isAuthenticated || userAuthenticated) {
      if (redirectURL) {
        if (userAuthenticated) {
          const authUser = JSON.parse(userAuthenticated).user;
          const userRedirectURL = redirectURL.replace("user", authUser);
          navigate(userRedirectURL);
        } else {
          navigate("/signin");
        }
      } else {
        if (userAuthenticated && !logout) {
          const authUser = JSON.parse(userAuthenticated).user;
          navigate("/auth/" + authUser + "/dashboard");
        } else if (username) {
          navigate("/auth/" + username + "/dashboard");
        } else {
          navigate("/auth/user/dashboard");
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (login === "login") {
      // console.log("User trying to login");
      const authUser = async () => {
        const refreshToken = await cookieStore.get(username);
        const response = await fetch("http://127.0.0.1:3000/users/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const auth = await response.json();
        setLogin("LoginEnded");
        if (auth.authenticated && auth.token) {
          sessionStorage.clear();
          sessionStorage.setItem(
            "authUser",
            JSON.stringify({
              user: username,
              authenticated: true,
              token: auth.token,
            })
          );
          if (!refreshToken) {
            let refreshTokenExpiresIn = new Date();
            refreshTokenExpiresIn.setHours(
              refreshTokenExpiresIn.getHours() + 24 * 7
            );
            await cookieStore.set({
              name: username,
              value: auth.refresh,
              expires: refreshTokenExpiresIn,
              path: "/",
              secure: true,
              sameSite: "strict",
            });
          } else {
            if (refreshToken.value !== auth.refresh) {
              await cookieStore.delete(username);
              let refreshTokenExpiresIn = new Date();
              refreshTokenExpiresIn.setHours(
                refreshTokenExpiresIn.getHours() + 24 * 7
              );
              await cookieStore.set({
                name: username,
                value: auth.refresh,
                expires: refreshTokenExpiresIn,
                path: "/",
                secure: true,
                sameSite: "strict",
              });
            }
          }
          setAuthentication(auth.authenticated);
          setIncorrectCredentials(false);
        } else {
          setIncorrectCredentials(true);
        }
      };
      authUser();
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
      <Link to="/" className="go-back-home poppins-regular">
        Go back home
      </Link>
    </div>
  );
}
