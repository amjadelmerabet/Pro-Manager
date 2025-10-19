import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function updateToken(accessTokenObject) {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  authUser.token = accessTokenObject.token;
  sessionStorage.removeItem("authUser");
  sessionStorage.setItem("authUser", JSON.stringify(authUser));
}

function nextAction(
  newAccessToken,
  loadTasks,
  setLoadTasks,
  create,
  setCreate,
  updatedTaskId,
  setUpdatedTaskId,
  deletedTaskId,
  setDeletedTaskId,
) {
  if (newAccessToken.type === "load") {
    setLoadTasks(loadTasks + 1);
  } else if (newAccessToken.type === "new") {
    setCreate(create + 1);
  } else if (newAccessToken.type === "update") {
    setUpdatedTaskId({ ...updatedTaskId, update: true });
  } else if (newAccessToken.type === "delete") {
    setDeletedTaskId({ ...deletedTaskId, delete: true });
  }
}

export default async function getAccessTokenUtil(
  user,
  setTokenValidated,
  setTries,
  newAccessToken,
  loadTasks,
  setLoadTasks,
  create,
  setCreate,
  updatedTaskId,
  setUpdatedTaskId,
  deletedTaskId,
  setDeletedTaskId,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenObject = await getNewAccessTokenAPI(user, refreshToken);
      if (!accessTokenObject.error) {
        updateToken(accessTokenObject);
        setTokenValidated(true);
        setTries(0);
        nextAction(
          newAccessToken,
          loadTasks,
          setLoadTasks,
          create,
          setCreate,
          updatedTaskId,
          setUpdatedTaskId,
          deletedTaskId,
          setDeletedTaskId,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
