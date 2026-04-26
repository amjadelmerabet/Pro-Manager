import getTaskByIdAPI from "../../../../api/tasks/getTaskByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load",
  });
}

async function fetchTaskAction(
  taskId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTaskObject,
  setTaskFetched,
  setTokenValidated,
) {
  const task = await getTaskByIdAPI(taskId, token);
  if (task.error === "Invalid access token" && tries < 3) {
    setTokenValidated(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setTaskObject(task.result[0]);
    setTaskFetched(true);
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
  }
}

export default async function fetchUserTaskUtil(
  tokenValidated,
  user,
  token,
  taskId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTaskObject,
  setTokenValidated,
  setTaskFetched,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          setTokenValidated(true);
          fetchTaskAction(
            taskId,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setTaskObject,
            setTaskFetched,
            setTokenValidated,
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
      fetchTaskAction(
        taskId,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTaskObject,
        setTaskFetched,
        setTokenValidated,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
