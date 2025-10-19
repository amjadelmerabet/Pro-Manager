import deleteTaskByIdAPI from "../../../../api/tasks/deleteTaskByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(
  tries,
  setTries,
  setTaskDeleted,
  newAccessToken,
  setNewAccessToken
) {
  setTries(tries + 1);
  setTaskDeleted(false);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "delete",
  });
}

async function deleteTaskAction(
  taskId,
  token,
  tries,
  setTries,
  setTaskDeleted,
  newAccessToken,
  setNewAccessToken,
  navigate,
  user
) {
  const deletedTask = await deleteTaskByIdAPI(taskId, token);
  if (deletedTask.error === "Invalid access token") {
    tryAgain(
      tries,
      setTries,
      setTaskDeleted,
      newAccessToken,
      setNewAccessToken
    );
  } else {
    setTimeout(() => {
      navigate("/auth/" + user + "/tasks");
    }, 500);
  }
}

export default async function deleteTaskUtil(
  tokenValidated,
  user,
  token,
  taskId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTaskDeleted,
  setTokenValidated,
  navigate
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          deleteTaskAction(
            taskId,
            token,
            tries,
            setTries,
            setTaskDeleted,
            newAccessToken,
            setNewAccessToken,
            navigate,
            user
          );
        } else {
          tryAgain(
            tries,
            setTries,
            setTaskDeleted,
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
        taskId,
        token,
        tries,
        setTries,
        setTaskDeleted,
        newAccessToken,
        setNewAccessToken,
        navigate,
        user
      );
    }
  } catch (error) {
    console.log(error);
  }
}
