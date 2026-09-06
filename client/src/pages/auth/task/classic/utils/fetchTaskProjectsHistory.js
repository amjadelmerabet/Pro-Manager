import getProjectsByOwnerAPI from "../../../../../api/projects/getProjectsByOwnerAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "fetch-task-projects-history",
  });
}

async function fetchTaskProjectsHistoryAction(
  projects,
  userId,
  session,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjectsHistory,
) {
  const userProjects = await getProjectsByOwnerAPI(userId, token);
  if (userProjects.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    let projectsHistory = {};
    projects.forEach((project) => {
      projectsHistory[project] = userProjects.result.filter(
        (userProject) => userProject.project_id === project,
      )[0].name;
    });
    setProjectsHistory(projectsHistory);
  }
}

export default async function fetchTaskProjectsHistoryUtil(
  projects,
  user,
  userId,
  session,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  tokenValidated,
  setTokenValidated,
  setProjectsHistory,
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
        fetchTaskProjectsHistoryAction(
          projects,
          userId,
          session,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setProjectsHistory,
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
    fetchTaskProjectsHistoryAction(
      projects,
      userId,
      session,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setProjectsHistory,
    );
  }
}
