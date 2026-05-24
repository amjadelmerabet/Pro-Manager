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
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjects,
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
  setTokenValidated,
  user,
  session,
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjects,
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const validAccessToken = await checkAccessTokenAPI(
        token,
        session,
        refreshToken,
      );
      if (validAccessToken.message === "Valid access token") {
        getProjectsAction(
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setProjects,
        );
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
    );
  }
}
