import getTasksByProjectAPI from "../../../../api/tasks/getTasksByProjectAPI";
import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load-tasks",
  });
}

async function fetchProjectTasksAction(
  projectId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTasks
) {
  const tasks = await getTasksByProjectAPI(projectId, token);
  if (tasks.error === "Invalid access token") {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setTasks(tasks.result);
  }
}

export default async function fetchProjectTasksUtil(
  projectId,
  token,
  setTasks,
  tokenValidated,
  setTokenValidated,
  user,
  userId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await getNewAccessTokenAPI(
          userId,
          refreshToken
        );
        if (validAccessToken.message === "Valid access token") {
          fetchProjectTasksAction(
            projectId,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setTasks
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
      fetchProjectTasksAction(
        projectId,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTasks
      );
    }
  } catch (error) {
    console.log(error);
  }
}
