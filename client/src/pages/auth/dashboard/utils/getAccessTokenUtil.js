import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function nextAction(
  newAccessToken,
  loadProjects,
  setLoadProjects,
  loadTasks,
  setLoadTasks,
  createProject,
  setCreateProject,
  createTask,
  setCreateTask,
) {
  if (newAccessToken.type === "projects") {
    setLoadProjects(loadProjects + 1);
  } else if (newAccessToken.type === "tasks") {
    setLoadTasks(loadTasks + 1);
  } else if (newAccessToken.type === "create") {
    if (newAccessToken.page === "project") {
      setCreateProject(createProject + 1);
    } else if (newAccessToken.page === "task") {
      setCreateTask(createTask + 1);
    }
  }
}

export default async function getAccessTokenUtil(
  user,
  setTokenValidated,
  setTries,
  newAccessToken,
  loadProjects,
  setLoadProjects,
  loadTasks,
  setLoadTasks,
  createProject,
  setCreateProject,
  createTask,
  setCreateTask,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenObject = await getNewAccessTokenAPI(user, refreshToken);
      if (!accessTokenObject.error) {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"));
        authUser.token = accessTokenObject.token;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(authUser));
        setTokenValidated(true);
        setTries(0);
        nextAction(
          newAccessToken,
          loadProjects,
          setLoadProjects,
          loadTasks,
          setLoadTasks,
          createProject,
          setCreateProject,
          createTask,
          setCreateTask,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
