import LoginPage from "../../pages/public/login/Login";

export default function LoginRoute({ isAuthenticated, setAuthentication, checkingNewUserDone, newUser }) {
  return (
    <LoginPage
      isAuthenticated={isAuthenticated}
      setAuthentication={setAuthentication}
      checkingNewUserDone={checkingNewUserDone}
      newUser={newUser}
    />
  );
}
