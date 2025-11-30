import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import createTaskAPI from "../../../../api/tasks/createTaskAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "create-task",
  });
}

async function createNewProjectTaskAction(
  newTask,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setLoadTasks,
  setTokenValidated,
  newProjectTaskPopupDisplay,
  setNewProjectTaskPopupDisplay
) {
  const newTaskCreated = await createTaskAPI(newTask, token);
  if (newTaskCreated.error === "Invalid access token" && tries < 3) {
    setTokenValidated(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setLoadTasks(true);
    setNewProjectTaskPopupDisplay({
      ...newProjectTaskPopupDisplay,
      active: false,
    });
    setTimeout(() => {
      setLoadTasks(false);
      setTokenValidated(false);
    }, 500);
  }
}

export default async function createNewProjectTaskUtil(
  tokenValidated,
  setTokenValidated,
  user,
  token,
  newTask,
  setLoadTasks,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  newProjectTaskPopupDisplay,
  setNewProjectTaskPopupDisplay
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          setTokenValidated(true);
          createNewProjectTaskAction(
            newTask,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setLoadTasks,
            setTokenValidated,
            newProjectTaskPopupDisplay,
            setNewProjectTaskPopupDisplay
          );
        }
      }
    } else {
      setTimeout(() => {
        setTokenValidated(false);
      }, 500);
      createNewProjectTaskAction(
        newTask,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setLoadTasks,
        setTokenValidated,
        newProjectTaskPopupDisplay,
        setNewProjectTaskPopupDisplay
      );
    }
  } catch (error) {
    console.log(error);
  }
}
