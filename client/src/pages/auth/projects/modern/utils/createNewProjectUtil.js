import createProjectAPI from "../../../../../api/projects/createProjectAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "create_project",
  });
}

async function createNewProjectAction(
  newProject,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  newProjectCreated,
  setNewProjectCreated,
  setCreateNewProject,
) {
  const create = await createProjectAPI(newProject, token);
  if (create.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setCreateNewProject(false);
    setNewProjectCreated(newProjectCreated + 1);
  }
}

export default async function createNewProjectUtil(
  newProject,
  user,
  session,
  token,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  newProjectCreated,
  setNewProjectCreated,
  setCreateNewProject,
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
        createNewProjectAction(
          newProject,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          newProjectCreated,
          setNewProjectCreated,
          setCreateNewProject,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    createNewProjectAction(
      newProject,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      newProjectCreated,
      setNewProjectCreated,
      setCreateNewProject,
    );
  }
}
