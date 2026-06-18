import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";
import createTaskAPI from "../../../../../api/tasks/createTaskAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "create_task",
  });
}

async function createNewTaskAction(
  newTask,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  newTaskCreated,
  setNewTaskCreated,
  setCreateNewTask,
) {
  const create = await createTaskAPI(newTask, token);
  if (create.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setCreateNewTask(false);
    setNewTaskCreated(newTaskCreated + 1);
  }
}

export default async function createNewTaskUtil(
  newTask,
  user,
  session,
  token,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  newTaskCreated,
  setNewTaskCreated,
  setCreateNewTask,
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
        createNewTaskAction(
          newTask,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          newTaskCreated,
          setNewTaskCreated,
          setCreateNewTask,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    createNewTaskAction(
      newTask,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      newTaskCreated,
      setNewTaskCreated,
      setCreateNewTask,
    );
  }
}
