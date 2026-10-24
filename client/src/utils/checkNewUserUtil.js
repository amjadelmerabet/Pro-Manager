import checkAccessTokenAPI from "../api/tokens/checkAccessTokenAPI";
import getWorkspacesByOwnerAPI from "../api/workspaces/getWorkspacesByOwnerAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "check-new-user",
  });
}

async function checkNewUserAction(
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUserAuthenticated,
  setCheckNewUser,
  setNewUser,
  setCheckingNewUserDone
) {
  const workspaces = await getWorkspacesByOwnerAPI(userId, token);
  if (workspaces.error === "Invalid access token" && tries < 3) {
    setUserAuthenticated(false);
    setCheckNewUser(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    if (workspaces.result.length === 0) {
      setNewUser(true);
    } else {
      setNewUser(false);
    }
    setCheckingNewUserDone(true);
  }
}

export default async function checkNewUserUtil(
  user,
  userId,
  session,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  tokenValidated,
  setTokenValidated,
  setNewUser,
  setCheckNewUser,
  setUserAuthenticated,
  setCheckingNewUserDone
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const checkAccessToken = await checkAccessTokenAPI(
        token,
        session,
        refreshToken,
      );
      if (checkAccessToken.error === "Invalid access token" && tries < 3) {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        checkNewUserAction(
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setUserAuthenticated,
          setCheckNewUser,
          setNewUser,
          setCheckingNewUserDone
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    checkNewUserAction(
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setUserAuthenticated,
      setCheckNewUser,
      setNewUser,
      setCheckingNewUserDone
    );
  }
}
