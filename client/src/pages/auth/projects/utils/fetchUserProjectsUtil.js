import getProjectsByOwnerAPI from "../../../../api/projects/getProjectsByOwnerAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load",
  });
}

async function getProjectsAction(
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjects,
  globalSearchList,
  setGlobalSearchList,
  setProjectsFetched
) {
  const projectsObject = await getProjectsByOwnerAPI(userId, token);
  if (projectsObject.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setProjects(projectsObject.result);
    setGlobalSearchList([...globalSearchList, ...projectsObject.result]);
    setProjectsFetched(true);
  }
}

export default async function fetchUserProjectsUtil(
  tokenValidated,
  user,
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjects,
  setTokenValidated,
  globalSearchList,
  setGlobalSearchList,
  setProjectsFetched
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          getProjectsAction(
            userId,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setProjects,
            globalSearchList,
            setGlobalSearchList,
            setProjectsFetched
          );
        } else {
          tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
        }
      } else {
        console.log("No refresh token");
      }
    } else {
      setTimeout(() => {
        setTokenValidated(false);
      }, 500);
      getProjectsAction(
        userId,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProjects,
        globalSearchList,
        setGlobalSearchList,
        setProjectsFetched
      );
    }
  } catch (error) {
    console.log(error);
  }
}
