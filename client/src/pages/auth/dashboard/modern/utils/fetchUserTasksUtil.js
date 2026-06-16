import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";
import getTasksByAssignedToAPI from "../../../../../api/tasks/getTasksByAssignedToAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "refresh_user_tasks",
  });
}

function updateReportsStats(tasks, reportsStats, setReportsStats) {
  let toDoTasks = 0,
    doingTasks = 0,
    doneTasks = 0;
  tasks.forEach((task) => {
    switch (task.state) {
      case 1:
        toDoTasks++;
        break;
      case 2:
        doingTasks++;
        break;
      case 3:
        doneTasks++;
        break;
      default:
        break;
    }
  });
  setReportsStats({
    ...reportsStats,
    tasks: {
      ...reportsStats["tasks"],
      toDo: toDoTasks,
      doing: doingTasks,
      done: doneTasks,
    },
  });
}

async function fetchUserTasksAction(
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  reportsStats,
  setReportsStats,
  setUserTasksFetched,
  setUserTasks,
) {
  const userTasks = await getTasksByAssignedToAPI(userId, token);
  if (userTasks.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    updateReportsStats(userTasks.result, reportsStats, setReportsStats);
    setUserTasks(userTasks.result);
    setUserTasksFetched(true);
  }
}

export default async function fetchUserTasksUtil(
  user,
  userId,
  token,
  session,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  reportsStats,
  setReportsStats,
  setUserTasksFetched,
  setUserTasks,
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
          reportsStats,
          setReportsStats,
          setUserTasksFetched,
          setUserTasks,
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
      reportsStats,
      setReportsStats,
      setUserTasksFetched,
      setUserTasks,
    );
  }
}
