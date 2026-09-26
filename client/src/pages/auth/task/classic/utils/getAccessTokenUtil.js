import getNewAccessTokenAPI from "../../../../../api/tokens/getNewAccessTokenAPI";

function updateToken(accessTokenObject) {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  authUser.token = accessTokenObject.token;
  sessionStorage.removeItem("authUser");
  sessionStorage.setItem("authUser", JSON.stringify(authUser));
}

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
  setPostComment,
  setFetchUserComments
) {
  if (newAccessToken.type === "load") {
    setLoadTask(loadTask + 1);
  }
  if (newAccessToken.type === "update") {
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  } else if (newAccessToken.type === "delete") {
    setTaskDeleted(true);
  } else if (newAccessToken.type === "load-project") {
    setLoadProject(true);
  } else if (newAccessToken.type === "load-projects") {
    setLoadProjects(true);
  } else if (newAccessToken.type === "fetch-task-activities") {
    setFetchUserActivities(true);
    setTimeout(() => {
      setFetchUserActivities(false);
    }, 250);
  } else if (newAccessToken.type === "fetch-task-projects-history") {
    setFetchProjectsHistory(true);
    setTimeout(() => {
      setFetchProjectsHistory(false);
    }, 250);
  } else if (newAccessToken.type === "post-user-comment") {
    setPostComment(true);
  } else if (newAccessToken.type === "fetch-user-comments") {
    setFetchUserComments(true);
    setTimeout(() => {
      setFetchUserComments(false);
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
  setPostComment,
  setFetchUserComments
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenObject = await getNewAccessTokenAPI(
        userId,
        session,
        refreshToken,
      );
      if (!accessTokenObject.error) {
        updateToken(accessTokenObject);
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
          setPostComment,
          setFetchUserComments
        );
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
