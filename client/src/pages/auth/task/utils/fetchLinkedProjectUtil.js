import getProjectByIdAPI from "../../../../api/projects/getProjectByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

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
  setNewAccessToken,
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
  session,
  token,
  user,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProject,
) {
  try {
    if (projectId) {
      if (!tokenValidated) {
        const refreshToken = await cookieStore.get(user);
        if (refreshToken) {
          const validAccessToken = await checkAccessTokenAPI(
            token,
            session,
            refreshToken,
          );
          if (validAccessToken.message === "Valid access token") {
            fetchLinkedProjectAction(
              projectId,
              token,
              setProject,
              tries,
              setTries,
              newAccessToken,
              setNewAccessToken,
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
          setNewAccessToken,
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}
