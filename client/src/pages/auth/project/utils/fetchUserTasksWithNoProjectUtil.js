import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import getTasksByAssignedToAPI from "../../../../api/tasks/getTasksByAssignedToAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load-tasks-with-no-project",
  });
}

async function fetchUserTasksWithNoProjectAction(
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTasksWithNoProject,
  setFetchUserTasksWithNoProject,
) {
  const fetchTasks = await getTasksByAssignedToAPI(userId, token);
  if (fetchTasks.error === "Invalid access token" && tries < 3) {
    setFetchUserTasksWithNoProject(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setTasksWithNoProject(
      fetchTasks.result.filter((task) => task.project === null),
    );
  }
}

export default async function fetchUserTasksWithNoProjectUtil(
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
  setTasksWithNoProject,
  setFetchUserTasksWithNoProject,
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
        fetchUserTasksWithNoProjectAction(
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setTasksWithNoProject,
          setFetchUserTasksWithNoProject,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    fetchUserTasksWithNoProjectAction(
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setTasksWithNoProject,
      setFetchUserTasksWithNoProject,
    );
  }
}
