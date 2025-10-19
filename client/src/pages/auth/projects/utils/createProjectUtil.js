import createProjectAPI from "../../../../api/projects/createProjectAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(
  tries,
  setTries,
  setCreateProject,
  newAccessToken,
  setNewAccessToken
) {
  setTries(tries + 1);
  setCreateProject(0);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "new",
  });
}

async function createProjectAction(
  newProject,
  token,
  tries,
  setTries,
  setCreateProject,
  newAccessToken,
  setNewAccessToken,
  newProjectCreated,
  setNewProjectCreated,
  setNewProject,
  setLoadingNewProject,
  newProjectPopupDisplay,
  setNewProjectPopupDisplay
) {
  const createdProject = await createProjectAPI(newProject, token);
  if (createdProject.error === "Invalid access token") {
    tryAgain(
      tries,
      setTries,
      setCreateProject,
      newAccessToken,
      setNewAccessToken
    );
  } else {
    setTimeout(() => {
      setNewProjectCreated(newProjectCreated + 1);
      setNewProject({});
      setLoadingNewProject(false);
    }, 1000);
    setLoadingNewProject(true);
    setNewProjectPopupDisplay({
      ...newProjectPopupDisplay,
      active: false,
    });
  }
}

export default async function createProjectUtil(
  tokenValidated,
  user,
  token,
  newProject,
  tries,
  setTries,
  setCreateProject,
  newAccessToken,
  setNewAccessToken,
  newProjectCreated,
  setNewProjectCreated,
  setNewProject,
  setLoadingNewProject,
  newProjectPopupDisplay,
  setNewProjectPopupDisplay,
  setTokenValidated
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          createProjectAction(
            newProject,
            token,
            tries,
            setTries,
            setCreateProject,
            newAccessToken,
            setNewAccessToken,
            newProjectCreated,
            setNewProjectCreated,
            setNewProject,
            setLoadingNewProject,
            newProjectPopupDisplay,
            setNewProjectPopupDisplay
          );
        } else {
          tryAgain(
            tries,
            setTries,
            setCreateProject,
            newAccessToken,
            setNewAccessToken
          );
        }
      } else {
        console.log("No refresh token");
      }
    } else {
      setTimeout(() => {
        setTokenValidated(false);
      }, 500);
      createProjectAction(
        newProject,
        token,
        tries,
        setTries,
        setCreateProject,
        newAccessToken,
        setNewAccessToken,
        newProjectCreated,
        setNewProjectCreated,
        setNewProject,
        setLoadingNewProject,
        newProjectPopupDisplay,
        setNewProjectPopupDisplay
      );
    }
  } catch (error) {
    console.log(error);
  }
}
