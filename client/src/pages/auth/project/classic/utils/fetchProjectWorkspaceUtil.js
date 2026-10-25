import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";
import getWorkspaceByIdAPI from "../../../../../api/workspaces/getWorkspaceByIdAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "fetch-project-workspace",
  });
}

async function fetchProjectWorkspaceAction(
  workspaceId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjectWorkspace,
  setFetchProjectWorkspace
) {
  const workspace = await getWorkspaceByIdAPI(workspaceId, token);
  if (workspace.error === "Invalid access token" && tries < 3) {
    setFetchProjectWorkspace(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setProjectWorkspace(workspace.result[0]);
  }
}

export default async function fetchProjectWorkspaceUtil(
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
  setProjectWorkspace,
  setFetchProjectWorkspace
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
        fetchProjectWorkspaceAction(
          workspaceId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setProjectWorkspace,
          setFetchProjectWorkspace
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    fetchProjectWorkspaceAction(
      workspaceId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setProjectWorkspace,
      setFetchProjectWorkspace
    );
  }
}
