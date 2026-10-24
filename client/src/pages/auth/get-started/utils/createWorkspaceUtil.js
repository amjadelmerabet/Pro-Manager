import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import createWorkspaceAPI from "../../../../api/workspaces/createWorkspaceAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "create-workspace",
  });
}

async function createWorkspaceAction(
  token,
  payload,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setCreateWorkspace,
  setWorkspaceCreated,
  setWorkspaceId
) {
  const newWorkspace = await createWorkspaceAPI(payload, token);
  if (newWorkspace.error === "Invalid access token" && tries < 3) {
    setCreateWorkspace(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setWorkspaceId(newWorkspace.workspace_id);
    let authUser = JSON.parse(sessionStorage.getItem("authUser"));
    authUser.workspaceId = newWorkspace.workspace_id;
    sessionStorage.setItem("authUser", JSON.stringify(authUser));
    setWorkspaceCreated(true);
  }
}

export default async function createWorkspaceUtil(
  user,
  session,
  token,
  payload,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  setCreateWorkspace,
  setWorkspaceCreated,
  setWorkspaceId
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
        setCreateWorkspace(false);
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        createWorkspaceAction(
          token,
          payload,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setCreateWorkspace,
          setWorkspaceCreated,
          setWorkspaceId
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    createWorkspaceAction(
      token,
      payload,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setCreateWorkspace,
      setWorkspaceCreated,
      setWorkspaceId
    );
  }
}
