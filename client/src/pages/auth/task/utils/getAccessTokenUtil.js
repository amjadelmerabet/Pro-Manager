import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

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
) {
  if (newAccessToken.type === "load") {
    setLoadTask(loadTask + 1);
  }
  if (newAccessToken.type === "update") {
    setTaskUpdated({ counter: taskUpdated.counter + 1, update: true });
  } else if (newAccessToken.type === "delete") {
    setTaskDeleted(true);
  }
}

export default async function getAccessTokenUtil(
  user,
  setTokenValidated,
  setTries,
  newAccessToken,
  loadTask,
  setLoadTask,
  taskUpdated,
  setTaskUpdated,
  setTaskDeleted,
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
          loadTask,
          setLoadTask,
          taskUpdated,
          setTaskUpdated,
          setTaskDeleted,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
