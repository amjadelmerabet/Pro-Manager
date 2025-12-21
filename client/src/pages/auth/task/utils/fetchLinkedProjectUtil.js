import getProjectByIdAPI from "../../../../api/projects/getProjectByIdAPI";
import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load-project",
  });
}

async function fetchLinkedProjectAction(
  projectId,
  token,
  setProject,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken
) {
  const response = await getProjectByIdAPI(projectId, token);
  if (response.error === "Invalid access token") {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setProject(response.result[0]);
  }
}

export default async function fetchLinkedProjectUtil(
  projectId,
  token,
  user,
  userId,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProject
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await getNewAccessTokenAPI(
          userId,
          refreshToken
        );
        if (validAccessToken.error === "Valid access token") {
          fetchLinkedProjectAction(
            projectId,
            token,
            setProject,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken
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
      fetchLinkedProjectAction(
        projectId,
        token,
        setProject,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken
      );
    }
  } catch (error) {
    console.log(error);
  }
}
