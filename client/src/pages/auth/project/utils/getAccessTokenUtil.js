import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function updateToken(accessTokenObject) {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  authUser.token = accessTokenObject.token;
  sessionStorage.removeItem("authUser");
  sessionStorage.setItem("authUser", JSON.stringify(authUser));
}

function nextAction(
  newAccessToken,
  loadProject,
  setLoadProject,
  projectUpdated,
  setProjectUpdated,
  setProjectDeleted,
  setLoadTasks,
  newTaskToCreate,
  setNewTaskToCreate
) {
  if (newAccessToken.type === "load") {
    setLoadProject(loadProject + 1);
  } else if (newAccessToken.type === "update") {
    setProjectUpdated({
      counter: projectUpdated.counter + 1,
      update: true,
    });
  } else if (newAccessToken.type === "delete") {
    setProjectDeleted(false);
    setTimeout(() => {
      setProjectDeleted(true);
    }, 250);
  } else if (newAccessToken.type === "load-tasks") {
    setLoadTasks(true);
    setTimeout(() => {
      setLoadTasks(false);
    }, 250);
  } else if (newAccessToken.type === "create-task") {
    setNewTaskToCreate(newTaskToCreate + 1);
  }
}

export default async function getAccessTokenUtil(
  user,
  userId,
  setTokenValidated,
  setTries,
  loadProject,
  setLoadProject,
  newAccessToken,
  projectUpdated,
  setProjectUpdated,
  setProjectDeleted,
  setLoadTasks,
  newTaskToCreate,
  setNewTaskToCreate
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenObject = await getNewAccessTokenAPI(userId, refreshToken);
      if (!accessTokenObject.error) {
        updateToken(accessTokenObject);
        setTokenValidated(true);
        setTries(0);
        nextAction(
          newAccessToken,
          loadProject,
          setLoadProject,
          projectUpdated,
          setProjectUpdated,
          setProjectDeleted,
          setLoadTasks,
          newTaskToCreate,
          setNewTaskToCreate
        );
        setTimeout(() => {
          setTokenValidated(false);
        }, 500);
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
