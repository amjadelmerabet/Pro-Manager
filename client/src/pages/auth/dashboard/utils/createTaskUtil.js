import createTaskAPI from "../../../../api/tasks/createTaskAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "create",
    page: "task",
  });
}

async function createTaskAction(
  newTask,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTaskCreatedSuccessfully
) {
  const newTaskBody = await createTaskAPI(newTask, token);
  if (newTaskBody.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setTaskCreatedSuccessfully(true);
  }
}

export default async function createTaskUtil(
  tokenValidated,
  user,
  token,
  newTask,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTaskCreatedSuccessfully,
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
            newAccessToken,
            setNewAccessToken,
            setTaskCreatedSuccessfully
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
      createTaskAction(
        newTask,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setTaskCreatedSuccessfully
      );
    }
  } catch (error) {
    console.log(error);
  }
}
