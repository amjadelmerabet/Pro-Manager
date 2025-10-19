import deleteTaskByIdAPI from "../../../../api/tasks/deleteTaskByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(
  tries,
  setTries,
  deletedTaskId,
  setdeletedTaskId,
  newAccessToken,
  setNewAccessToken
) {
  setTries(tries + 1);
  setdeletedTaskId({ ...deletedTaskId, delete: false });
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "delete",
  });
}

async function deleteTaskAction(
  deletedTaskId,
  token,
  tries,
  setTries,
  setdeletedTaskId,
  newAccessToken,
  setNewAccessToken,
  taskDeleted,
  setTaskDeleted
) {
  const deletedTask = await deleteTaskByIdAPI(deletedTaskId.taskId, token);
  if (deletedTask.error === "Invalid access token" && tries < 3) {
    tryAgain(
      tries,
      setTries,
      deletedTaskId,
      setdeletedTaskId,
      newAccessToken,
      setNewAccessToken
    );
  } else {
    setTimeout(() => {
      setTaskDeleted(taskDeleted + 1);
    }, 1000);
  }
}

export default async function deleteTaskUtil(
  tokenValidated,
  user,
  token,
  deletedTaskId,
  tries,
  setTries,
  setdeletedTaskId,
  newAccessToken,
  setNewAccessToken,
  taskDeleted,
  setTaskDeleted,
  setTokenValidated
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          deleteTaskAction(
            deletedTaskId,
            token,
            tries,
            setTries,
            setdeletedTaskId,
            newAccessToken,
            setNewAccessToken,
            taskDeleted,
            setTaskDeleted
          );
        } else {
          tryAgain(
            tries,
            setTries,
            deletedTaskId,
            setdeletedTaskId,
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
      deleteTaskAction(
        deletedTaskId,
        token,
        tries,
        setTries,
        setdeletedTaskId,
        newAccessToken,
        setNewAccessToken,
        taskDeleted,
        setTaskDeleted
      );
    }
  } catch (error) {
    console.log(error);
  }
}
