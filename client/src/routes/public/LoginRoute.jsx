import LoginPage from "../../pages/public/login/Login";

export default function LoginRoute({ isAuthenticated, setAuthentication }) {
  return <LoginPage isAuthenticated={isAuthenticated} setAuthentication={setAuthentication} />
}