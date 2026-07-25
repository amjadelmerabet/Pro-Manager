import getNewAccessTokenAPI from "../../../../../api/tokens/getNewAccessTokenAPI";

function nextAction(
  newAccessToken,
  setFetchTasks,
  setCreateNewTask,
  deleteTask,
  setDeleteTask,
) {
  switch (newAccessToken.action) {
    case "fetch_user_tasks":
      setFetchTasks(true);
      break;
    case "create_task":
      setCreateNewTask(true);
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
  setFetchTasks,
  setCreateNewTask,
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
          setFetchTasks,
          setCreateNewTask,
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