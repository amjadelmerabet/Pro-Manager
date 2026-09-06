import getNewAccessTokenAPI from "../../../../../api/tokens/getNewAccessTokenAPI";

function nextAction(
  newAccessToken,
  loadTask,
  setLoadTask,
  taskUpdated,
  setTaskUpdated,
  setTaskDeleted,
  setLoadProject,
  setLoadProjects,
  setFetchUserActivities,
  setFetchProjectsHistory,
) {
  if (newAccessToken.type === "load") setLoadTask(loadTask + 1);
  if (newAccessToken.type === "update")
    setTaskUpdated({
      counter: taskUpdated.counter + 1,
      update: true,
      updates: taskUpdated.updates,
    });
  else if (newAccessToken.type === "delete") setTaskDeleted(true);
  else if (newAccessToken.type === "load-project") setLoadProject(true);
  else if (newAccessToken.type === "load-projects") setLoadProjects(true);
  else if (newAccessToken.type === "fetch-task-activities") {
    setFetchUserActivities(true);
    setTimeout(() => {
      setFetchUserActivities(false);
    }, 500);
  } else if (newAccessToken.type === "fetch-task-projects-history") {
    setFetchProjectsHistory(true);
    setTimeout(() => {
      setFetchProjectsHistory(false);
    }, 250);
  }
}

export default async function getAccessTokenUtil(
  user,
  userId,
  session,
  setTokenValidated,
  setTries,
  newAccessToken,
  loadTask,
  setLoadTask,
  taskUpdated,
  setTaskUpdated,
  setTaskDeleted,
  setLoadProject,
  setLoadProjects,
  setFetchUserActivities,
  setFetchProjectsHistory,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (!refreshToken) return;
    const accessTokenObject = await getNewAccessTokenAPI(
      userId,
      session,
      refreshToken,
    );
    if (!accessTokenObject.error) {
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      authUser.token = accessTokenObject.token;
      sessionStorage.setItem("authUser", JSON.stringify(authUser));
      setTokenValidated(true);
      setTries(0);
      nextAction(
        newAccessToken,
        loadTask,
        setLoadTask,
        taskUpdated,
        setTaskUpdated,
        setTaskDeleted,
        setLoadProject,
        setLoadProjects,
        setFetchUserActivities,
        setFetchProjectsHistory,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
