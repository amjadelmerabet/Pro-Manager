import deleteProjectByIdAPI from "../../../../../api/projects/deleteProjectByIdAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "delete_project",
  });
}

async function deleteProjectAction(
  projectId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  projectDeleted,
  setProjectDeleted,
  deleteProject,
  setDeleteProject,
) {
  const deleteAction = await deleteProjectByIdAPI(projectId, token);
  if (deleteAction.error === "Invalid access token" && tries < 3) {
    setDeleteProject({ ...deleteProject, delete: false })
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setDeleteProject({ projectId: "", delete: false });
    setProjectDeleted(projectDeleted + 1);
  }
}

export default async function deleteProjectUtil(
  projectId,
  user,
  session,
  token,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  projectDeleted,
  setProjectDeleted,
  deleteProject,
  setDeleteProject,
  newAccessToken,
  setNewAccessToken,
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
        deleteProjectAction(
          projectId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          projectDeleted,
          setProjectDeleted,
          deleteProject,
          setDeleteProject,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    deleteProjectAction(
      projectId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      projectDeleted,
      setProjectDeleted,
      deleteProject,
      setDeleteProject,
    );
  }
}
