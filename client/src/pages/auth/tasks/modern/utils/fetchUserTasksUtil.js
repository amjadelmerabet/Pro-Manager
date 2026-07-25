import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";
import getTasksByAssignedToAPI from "../../../../../api/tasks/getTasksByAssignedToAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "fetch_user_tasks",
  });
}

async function fetchUserTasksAction(
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUserTasks,
  setUserTasksFetched,
) {
  const fetch = await getTasksByAssignedToAPI(userId, token);
  if (fetch.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setUserTasks(fetch.result);
    setUserTasksFetched(true);
  }
}

export default async function fetchUserTasksUtil(
  user,
  userId,
  token,
  session,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  setUserTasks,
  setUserTasksFetched,
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
        fetchUserTasksAction(
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setUserTasks,
          setUserTasksFetched,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    fetchUserTasksAction(
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setUserTasks,
      setUserTasksFetched,
    );
  }
}