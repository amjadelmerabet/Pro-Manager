import getNewAccessTokenAPI from "../../../../../api/tokens/getNewAccessTokenAPI";

function nextAction(
  newAccessToken,
  fetchUserProjects,
  setFetchUserProjects,
  fetchUserTasks,
  setFetchUserTasks,
  updateProject,
  setUpdateProject,
  deleteProject,
  setDeleteProject,
  updateTask,
  setUpdateTask,
  deleteTask,
  setDeleteTask,
) {
  switch (newAccessToken.action) {
    case "fetch_user_projects":
      setFetchUserProjects(fetchUserProjects + 1);
      break;
    case "fetch_user_tasks":
      setFetchUserTasks(fetchUserTasks + 1);
      break;
    case "update_project":
      setUpdateProject({ ...updateProject, update: true });
      break;
    case "delete_project":
      setDeleteProject({ ...deleteProject, delete: true });
      break;
    case "update_task":
      setUpdateTask({ ...updateTask, update: true });
      break;
    case "delete_task":
      setDeleteTask({ ...deleteTask, delete: true });
      break;
    default:
      break;
  }
}

export default async function getNewAccessTokenUtil(
  user,
  userId,
  session,
  setTokenValidated,
  setTries,
  newAccessToken,
  fetchUserProjects,
  setFetchUserProjects,
  fetchUserTasks,
  setFetchUserTasks,
  updateProject,
  setUpdateProject,
  deleteProject,
  setDeleteProject,
  updateTask,
  setUpdateTask,
  deleteTask,
  setDeleteTask,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const newAccessTokenObj = await getNewAccessTokenAPI(
        userId,
        session,
        refreshToken,
      );
      if (!newAccessTokenObj.error) {
        const authUserObj = JSON.parse(sessionStorage.getItem("authUser"));
        authUserObj.token = newAccessTokenObj.token;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(authUserObj));
        setTokenValidated(true);
        setTries(0);
        nextAction(
          newAccessToken,
          fetchUserProjects,
          setFetchUserProjects,
          fetchUserTasks,
          setFetchUserTasks,
          updateProject,
          setUpdateProject,
          deleteProject,
          setDeleteProject,
          updateTask,
          setUpdateTask,
          deleteTask,
          setDeleteTask,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
