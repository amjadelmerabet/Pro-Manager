import deleteTaskByIdAPI from "../../../../../api/tasks/deleteTaskByIdAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "delete_task",
  });
}

async function deleteTaskAction(
  taskId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  taskDeleted,
  setTaskDeleted,
  deleteTask,
  setDeleteTask,
) {
  const deleteAction = await deleteTaskByIdAPI(taskId, token);
  if (deleteAction.error === "Invalid access token" && tries < 3) {
    setDeleteTask({ ...deleteTask, delete: false });
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setDeleteTask({ taskId: "", delete: false });
    setTaskDeleted(taskDeleted + 1);
  }
}

export default async function deleteTaskUtil(
  taskId,
  token,
  user,
  session,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  taskDeleted,
  setTaskDeleted,
  deleteTask,
  setDeleteTask,
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
        deleteTaskAction(
          taskId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          taskDeleted,
          setTaskDeleted,
          deleteTask,
          setDeleteTask,
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
      taskId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      taskDeleted,
      setTaskDeleted,
      deleteTask,
      setDeleteTask,
    );
  }
}
