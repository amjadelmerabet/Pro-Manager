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
  user,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjects,
) {
  const projectsObject = await getProjectsByOwnerAPI(user, token);
  if (projectsObject.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setProjects(projectsObject.result);
  }
}

export default async function fetchUserProjectsUtil(
  tokenValidated,
  user,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjects,
  setTokenValidated,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          getProjectsAction(
            user,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setProjects,
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
        user,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProjects,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
