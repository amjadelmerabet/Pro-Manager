import createTaskAPI from "../../../../api/tasks/createTaskAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(
  tries,
  setTries,
  setCreate,
  newAccessToken,
  setNewAccessToken
) {
  setTries(tries + 1);
  setCreate(0);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "new",
  });
}

async function createTaskAction(
  newTask,
  token,
  tries,
  setTries,
  setCreate,
  newAccessToken,
  setNewAccessToken,
  newTaskCreated,
  setNewTaskCreated,
  setNewTask,
  setLoadingNewTask,
  newTaskPopupDisplay,
  setNewTaskPopupDisplay
) {
  const createdTask = await createTaskAPI(newTask, token);
  if (createdTask.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, setCreate, newAccessToken, setNewAccessToken);
  } else {
    setTimeout(() => {
      setNewTaskCreated(newTaskCreated + 1);
      setNewTask({});
      setLoadingNewTask(false);
    }, 1000);
    setLoadingNewTask(true);
    setNewTaskPopupDisplay({ ...newTaskPopupDisplay, active: false });
  }
}

export default async function createTaskUtil(
  tokenValidated,
  user,
  token,
  newTask,
  tries,
  setTries,
  setCreate,
  newAccessToken,
  setNewAccessToken,
  newTaskCreated,
  setNewTaskCreated,
  setNewTask,
  setLoadingNewTask,
  newTaskPopupDisplay,
  setNewTaskPopupDisplay,
  setTokenValidated
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          createTaskAction(
            newTask,
            token,
            tries,
            setTries,
            setCreate,
            newAccessToken,
            setNewAccessToken,
            newTaskCreated,
            setNewTaskCreated,
            setNewTask,
            setLoadingNewTask,
            newTaskPopupDisplay,
            setNewTaskPopupDisplay
          );
        } else {
          tryAgain(
            tries,
            setTries,
            setCreate,
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
      createTaskAction(
        newTask,
        token,
        tries,
        setTries,
        setCreate,
        newAccessToken,
        setNewAccessToken,
        newTaskCreated,
        setNewTaskCreated,
        setNewTask,
        setLoadingNewTask,
        newTaskPopupDisplay,
        setNewTaskPopupDisplay
      );
    }
  } catch (error) {
    console.log(error);
  }
}
