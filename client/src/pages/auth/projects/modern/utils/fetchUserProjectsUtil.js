import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";
import getProjectsByOwnerAPI from "../../../../../api/projects/getProjectsByOwnerAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "fetch_user_projects",
  });
}

async function fetchUserProjectsAction(
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUserProjects,
  setUserProjectsFetched,
) {
  const fetch = await getProjectsByOwnerAPI(userId, token);
  if (fetch.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setUserProjects(fetch.result);
    setUserProjectsFetched(true);
  }
}

export default async function fetchUserProjectsUtil(
  user,
  userId,
  token,
  session,
  tries,
  setTries,
  tokenValidated,
  setTokenValidated,
  newAccessToken,
  setNewAccessToken,
  setUserProjects,
  setUserProjectsFetched,
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const checkAccessToken = await checkAccessTokenAPI(
        token,
        session,
        refreshToken,
      );
      if (checkAccessToken.error === "Invalid access token" && tries < 3) {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        fetchUserProjectsAction(
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setUserProjects,
          setUserProjectsFetched,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    fetchUserProjectsAction(
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setUserProjects,
      setUserProjectsFetched,
    );
  }
}
