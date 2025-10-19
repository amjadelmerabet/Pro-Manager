import getTasksByAssignedToAPI from "../../../../api/tasks/getTasksByAssignedToAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({ counter: newAccessToken.counter + 1, type: "tasks" });
}

function updateTasksStats(tasks, tasksStats, setTasksStats) {
  let tasksToDo = 0;
  let tasksDoing = 0;
  let tasksDone = 0;
  tasks.forEach((task) => {
    if (task.state === 1) {
      tasksToDo++;
    } else if (task.state === 2) {
      tasksDoing++;
    } else if (task.state === 3) {
      tasksDone++;
    }
  });
  setTasksStats({
    ...tasksStats,
    toDo: tasksToDo,
    doing: tasksDoing,
    done: tasksDone,
  });
}

async function getUserTasksAction(
  user,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  tasksStats,
  setTasksStats,
  tempRecentPages,
  setTempRecentPages,
  setTasksFetched,
) {
  const tasksObject = await getTasksByAssignedToAPI(user, token);
  if (tasksObject.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    updateTasksStats(tasksObject.result, tasksStats, setTasksStats);
    setTempRecentPages(tempRecentPages.concat(tasksObject.result));
    setTasksFetched(true);
  }
}

export default async function fetchAllTasksUtil(
  tokenValidated,
  user,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  tasksStats,
  setTasksStats,
  tempRecentPages,
  setTempRecentPages,
  setTasksFetched,
  setTokenValidated,
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
      if (validAccessToken.message === "Valid access token") {
        getUserTasksAction(
          user,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          tasksStats,
          setTasksStats,
          tempRecentPages,
          setTempRecentPages,
          setTasksFetched,
        );
      } else {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      }
    } else {
      console.log("Invalid refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    getUserTasksAction(
      user,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      tasksStats,
      setTasksStats,
      tempRecentPages,
      setTempRecentPages,
      setTasksFetched,
    );
  }
}
