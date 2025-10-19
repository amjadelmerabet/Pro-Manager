import updateProjectByIdAPI from "../../../../api/projects/updateProjectByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(
  tries,
  setTries,
  updatedProjectId,
  setUpdatedProjectId,
  newAccessToken,
  setNewAccessToken,
) {
  setTries(tries + 1);
  setUpdatedProjectId({ ...updatedProjectId, update: false });
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "update",
  });
}

async function updateProjectAction(
  updatedProjectId,
  token,
  projectUpdates,
  tries,
  setTries,
  setUpdatedProjectId,
  newAccessToken,
  setNewAccessToken,
  projectUpdated,
  setProjectUpdated,
  setProjectUpdates,
) {
  const updatedProject = await updateProjectByIdAPI(
    updatedProjectId.projectId,
    token,
    projectUpdates,
  );
  if (updatedProject.error === "Invalid access token" && tries < 3) {
    tryAgain(
      tries,
      setTries,
      updatedProjectId,
      setUpdatedProjectId,
      newAccessToken,
      setNewAccessToken,
    );
  } else {
    setTimeout(() => {
      setProjectUpdated(projectUpdated + 1);
      setProjectUpdates({});
      setUpdatedProjectId({});
    }, 250);
  }
}

export default async function updateProjectUtil(
  tokenValidated,
  user,
  token,
  projectUpdates,
  tries,
  setTries,
  updatedProjectId,
  setUpdatedProjectId,
  newAccessToken,
  setNewAccessToken,
  projectUpdated,
  setProjectUpdated,
  setProjectUpdates,
  setTokenValidated,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          updateProjectAction(
            updatedProjectId,
            token,
            projectUpdates,
            tries,
            setTries,
            setUpdatedProjectId,
            newAccessToken,
            setNewAccessToken,
            projectUpdated,
            setProjectUpdated,
            setProjectUpdates,
          );
        } else {
          tryAgain(
            tries,
            setTries,
            updatedProjectId,
            setUpdatedProjectId,
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
      updateProjectAction(
        updatedProjectId,
        token,
        projectUpdates,
        tries,
        setTries,
        setUpdatedProjectId,
        newAccessToken,
        setNewAccessToken,
        projectUpdated,
        setProjectUpdated,
        setProjectUpdates,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
