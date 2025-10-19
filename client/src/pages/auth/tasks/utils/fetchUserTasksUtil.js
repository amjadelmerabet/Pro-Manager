import getTasksByAssignedToAPI from "../../../../api/tasks/getTasksByAssignedToAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load",
  });
}

async function fetchTasksAction(
  user,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTasks,
) {
  const tasksObject = await getTasksByAssignedToAPI(user, token);
  if (tasksObject.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setTasks(tasksObject.result);
  }
}

export default async function fetchUserTasksUtil(
  tokenValidated,
  user,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTasks,
  setTokenValidated,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          fetchTasksAction(
            user,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setTasks,
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
      fetchTasksAction(
        user,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTasks,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
