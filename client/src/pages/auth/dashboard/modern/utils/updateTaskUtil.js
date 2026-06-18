import updateTaskByIdAPI from "../../../../../api/tasks/updateTaskByIdAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "update_task",
  });
}

async function updateTaskAction(
  taskId,
  taskUpdates,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  taskUpdated,
  setTaskUpdated,
  updateTask,
  setUpdateTask,
) {
  const update = await updateTaskByIdAPI(taskId, token, taskUpdates);
  if (update.error === "Invalid access token" && tries < 3) {
    setUpdateTask({ ...updateTask, update: false });
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setUpdateTask({ taskId: "", update: false });
    setTaskUpdated(taskUpdated + 1);
  }
}

export default async function updateTaskUtil(
  taskUpdates,
  user,
  session,
  token,
  taskId,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  taskUpdated,
  setTaskUpdated,
  updateTask,
  setUpdateTask,
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
        updateTaskAction(
          taskId,
          taskUpdates,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          taskUpdated,
          setTaskUpdated,
          updateTask,
          setUpdateTask,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    updateTaskAction(
      taskId,
      taskUpdates,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      taskUpdated,
      setTaskUpdated,
      updateTask,
      setUpdateTask,
    );
  }
}
