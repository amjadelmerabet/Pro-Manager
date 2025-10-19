import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function updateToken(accessTokenObject) {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  authUser.token = accessTokenObject.token;
  sessionStorage.removeItem("authUser");
  sessionStorage.setItem("authUser", JSON.stringify(authUser));
}

function nextAction(
  newAccessToken,
  loadProject,
  setLoadProject,
  projectUpdated,
  setProjectUpdated,
  setProjectDeleted,
) {
  if (newAccessToken.type === "load") {
    setLoadProject(loadProject + 1);
  } else if (newAccessToken.type === "update") {
    setProjectUpdated({
      counter: projectUpdated.counter + 1,
      update: true,
    });
  } else if (newAccessToken.type === "delete") {
    setProjectDeleted(false);
    setTimeout(() => {
      setProjectDeleted(true);
    }, 250);
  }
}

export default async function getAccessTokenUtil(
  user,
  setTokenValidated,
  setTries,
  loadProject,
  setLoadProject,
  newAccessToken,
  projectUpdated,
  setProjectUpdated,
  setProjectDeleted,
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
          loadProject,
          setLoadProject,
          projectUpdated,
          setProjectUpdated,
          setProjectDeleted,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
