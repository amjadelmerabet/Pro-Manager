import updateTaskByIdAPI from "../../../../api/tasks/updateTaskByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "update",
  });
}

async function updateTaskAction(
  taskId,
  token,
  taskUpdates,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUpdatedSuccessfully,
) {
  const updatedTask = await updateTaskByIdAPI(taskId, token, taskUpdates);
  if (updatedTask.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setUpdatedSuccessfully(true);
  }
}

export default async function updateTaskUtil(
  tokenValidated,
  user,
  token,
  taskId,
  taskUpdates,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUpdatedSuccessfully,
  setTokenValidated,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          updateTaskAction(
            taskId,
            token,
            taskUpdates,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setUpdatedSuccessfully,
          );
        } else {
          tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
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
        token,
        taskUpdates,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setUpdatedSuccessfully,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
