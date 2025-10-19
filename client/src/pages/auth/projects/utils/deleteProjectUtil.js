import deleteProjectByIdAPI from "../../../../api/projects/deleteProjectByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(
  tries,
  setTries,
  deletedProjectId,
  setDeletedProjectId,
  newAccessToken,
  setNewAccessToken,
) {
  setTries(tries + 1);
  setDeletedProjectId({ ...deletedProjectId, delete: false });
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "delete",
  });
}

async function deleteProjectAction(
  deletedProjectId,
  token,
  tries,
  setTries,
  setDeletedProjectId,
  newAccessToken,
  setNewAccessToken,
  projectDeleted,
  setProjectDeleted,
) {
  const deletedProject = await deleteProjectByIdAPI(
    deletedProjectId.projectId,
    token,
  );
  if (deletedProject.error === "Invalid access token" && tries < 3) {
    tryAgain(
      tries,
      setTries,
      deletedProjectId,
      setDeletedProjectId,
      newAccessToken,
      setNewAccessToken,
    );
  } else {
    setTimeout(() => {
      setProjectDeleted(projectDeleted + 1);
    }, 1000);
  }
}

export default async function deleteProjectUtil(
  tokenValidated,
  user,
  token,
  tries,
  setTries,
  deletedProjectId,
  setDeletedProjectId,
  newAccessToken,
  setNewAccessToken,
  projectDeleted,
  setProjectDeleted,
  setTokenValidated,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          deleteProjectAction(
            deletedProjectId,
            token,
            tries,
            setTries,
            setDeletedProjectId,
            newAccessToken,
            setNewAccessToken,
            projectDeleted,
            setProjectDeleted,
          );
        } else {
          tryAgain(
            tries,
            setTries,
            deletedProjectId,
            setDeletedProjectId,
            newAccessToken,
            setNewAccessToken,
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
        deletedProjectId,
        token,
        tries,
        setTries,
        setDeletedProjectId,
        newAccessToken,
        setNewAccessToken,
        projectDeleted,
        setProjectDeleted,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
