import LoginPage from "../pages/login/Login";

export default function LoginRoute({ isAuthenticated, setAuthentication }) {
  return <LoginPage isAuthenticated={isAuthenticated} setAuthentication={setAuthentication} />
}