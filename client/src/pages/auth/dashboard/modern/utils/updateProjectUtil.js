import updateProjectByIdAPI from "../../../../../api/projects/updateProjectByIdAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "update_project",
  });
}

async function updateProjectAction(
  projectId,
  updates,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  projectUpdated,
  setProjectUpdated,
  updateProject,
  setUpdateProject,
) {
  const updatedProject = await updateProjectByIdAPI(projectId, token, updates);
  if (updatedProject.error === "Invalid access token") {
    setUpdateProject({ ...updateProject, update: false })
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setProjectUpdated(projectUpdated + 1);
    setUpdateProject({ projectId: "", update: false });
  }
}

export default async function updateProjectUtil(
  projectId,
  updates,
  user,
  token,
  session,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  projectUpdated,
  setProjectUpdated,
  updateProject,
  setUpdateProject,
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
        setUpdateProject({ ...updateProject, update: false });
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        updateProjectAction(
          projectId,
          updates,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          projectUpdated,
          setProjectUpdated,
          updateProject,
          setUpdateProject,
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
      projectId,
      updates,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      projectUpdated,
      setProjectUpdated,
      updateProject,
      setUpdateProject,
    );
  }
}
