import getProjectByIdAPI from "../../../../api/projects/getProjectByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load",
  });
}

async function fetchProjectAction(
  projectId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjectObject,
  setProjectNotFound,
  setProjectFetched,
  setTokenValidated
) {
  const project = await getProjectByIdAPI(projectId, token);
  if (project.error === "Invalid access token") {
    setTokenValidated(false);
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    if (project.result.length > 0) {
      setProjectObject(project.result[0]);
      setProjectFetched(true);
    } else {
      setProjectNotFound(true);
    }
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
  }
}

export default async function fetchUserProjectUtil(
  tokenValidated,
  user,
  token,
  projectId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjectObject,
  setProjectNotFound,
  setTokenValidated,
  setProjectFetched
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          setTokenValidated(true);
          fetchProjectAction(
            projectId,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setProjectObject,
            setProjectNotFound,
            setProjectFetched,
            setTokenValidated
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
      fetchProjectAction(
        projectId,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setProjectObject,
        setProjectNotFound,
        setProjectFetched,
        setTokenValidated
      );
    }
  } catch (error) {
    console.log(error);
  }
}
