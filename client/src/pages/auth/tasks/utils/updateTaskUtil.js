import updateTaskByIdAPI from "../../../../api/tasks/updateTaskByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(
  tries,
  setTries,
  updatedTaskId,
  setUpdatedTaskId,
  newAccessToken,
  setNewAccessToken,
) {
  setTries(tries + 1);
  setUpdatedTaskId({ ...updatedTaskId, update: false });
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "update",
  });
}

async function updateTaskAction(
  updatedTaskId,
  token,
  taskUpdates,
  tries,
  setTries,
  setUpdatedTaskId,
  newAccessToken,
  setNewAccessToken,
  taskUpdated,
  setTaskUpdated,
  setTaskUpdates,
) {
  const updatedTask = await updateTaskByIdAPI(
    updatedTaskId.taskId,
    token,
    taskUpdates,
  );
  if (updatedTask.error === "Invalid access token" && tries < 3) {
    tryAgain(
      tries,
      setTries,
      updatedTaskId,
      setUpdatedTaskId,
      newAccessToken,
      setNewAccessToken,
    );
  } else {
    setTimeout(() => {
      setTaskUpdated(taskUpdated + 1);
      setTaskUpdates({});
      setUpdatedTaskId({});
    }, 250);
  }
}

export default async function updateTaskUtil(
  tokenValidated,
  user,
  token,
  updatedTaskId,
  taskUpdates,
  tries,
  setTries,
  setUpdatedTaskId,
  newAccessToken,
  setNewAccessToken,
  taskUpdated,
  setTaskUpdated,
  setTaskUpdates,
  setTokenValidated,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          updateTaskAction(
            updatedTaskId,
            token,
            taskUpdates,
            tries,
            setTries,
            setUpdatedTaskId,
            newAccessToken,
            setNewAccessToken,
            taskUpdated,
            setTaskUpdated,
            setTaskUpdates,
          );
        } else {
          tryAgain(
            tries,
            setTries,
            updatedTaskId,
            setUpdatedTaskId,
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
      updateTaskAction(
        updatedTaskId,
        token,
        taskUpdates,
        tries,
        setTries,
        setUpdatedTaskId,
        newAccessToken,
        setNewAccessToken,
        taskUpdated,
        setTaskUpdated,
        setTaskUpdates,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
