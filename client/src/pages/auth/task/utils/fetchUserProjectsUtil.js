import getProjectsByOwnerAPI from "../../../../api/projects/getProjectsByOwnerAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load-projects",
  });
}

async function getProjectsAction(
  user,
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjects
) {
  const projects = await getProjectsByOwnerAPI(userId, token);
  if (projects.error === "Invalid access token") {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setProjects(projects.result);
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
  setProjects
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
      if (validAccessToken.message === "Valid access token") {
        getProjectsAction(
          user,
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setProjects
        );
      }
    }
  }
}
