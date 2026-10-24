import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";
import getWorkspaceByIdAPI from "../../../../../api/workspaces/getWorkspaceByIdAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "fetch-task-workspace",
  });
}

async function fetchTaskWorkspaceAction(
  workspaceId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTaskWorkspace,
) {
  const workspace = await getWorkspaceByIdAPI(workspaceId, token);
  if (workspace.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setTaskWorkspace(workspace.result[0]);
  }
}

export default async function fetchTaskWorkspaceUtil(
  user,
  session,
  token,
  workspaceId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  tokenValidated,
  setTokenValidated,
  setTaskWorkspace,
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
        fetchTaskWorkspaceAction(
          workspaceId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setTaskWorkspace,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    fetchTaskWorkspaceAction(
      workspaceId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setTaskWorkspace,
    );
  }
}
