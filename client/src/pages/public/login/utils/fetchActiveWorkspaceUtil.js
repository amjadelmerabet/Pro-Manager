import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import getActiveWorkspaceAPI from "../../../../api/workspaces/getActiveWorkspaceAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "get-active-workspace",
  });
}

async function fetchActiveWorkspaceAction(
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setRetrieveActiveWorkspace,
  setActiveWorkspaceRetrieved,
) {
  const activeWorkspace = await getActiveWorkspaceAPI(userId, token);
  if (activeWorkspace.error === "Invalid access token" && tries < 3) {
    setRetrieveActiveWorkspace(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    let authUser = JSON.parse(sessionStorage.getItem("authUser"));
    authUser.workspaceId = activeWorkspace.result[0].workspace_id;
    sessionStorage.setItem("authUser", JSON.stringify(authUser));
    setActiveWorkspaceRetrieved(true);
  }
}

export default async function fetchActiveWorkspaceUtil(
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
  setRetrieveActiveWorkspace,
  setActiveWorkspaceRetrieved,
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
        fetchActiveWorkspaceAction(
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setRetrieveActiveWorkspace,
          setActiveWorkspaceRetrieved,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    fetchActiveWorkspaceAction(
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setRetrieveActiveWorkspace,
      setActiveWorkspaceRetrieved,
    );
  }
}
