import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import logoutUserAPI from "../../../../api/users/logoutUserAPI";

async function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({ counter: newAccessToken.counter + 1, action: "logout" });
}

async function logoutUserAction(
  token,
  session,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setSuccessfulLogout,
) {
  const logout = await logoutUserAPI(session, token);
  if (logout.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setSuccessfulLogout(true);
  }
}

export default async function logoutUserUtil(
  session,
  user,
  token,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  setSuccessfulLogout,
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const validAccessToken = await checkAccessTokenAPI(token, session, refreshToken);
      if (validAccessToken.error === "Invalid access token" && tries < 3) {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        logoutUserAction(
          token,
          session,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setSuccessfulLogout,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    logoutUserAction(
      token,
      session,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setSuccessfulLogout,
    );
  }
}
