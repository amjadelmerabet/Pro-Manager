import getProjectsByOwnerAPI from "../../../../api/projects/getProjectsByOwnerAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "projects",
  });
}

function updateProjectsStats(projects, projectsStats, setProjectsStats) {
  let projectsNotStarted = 0;
  let projectsInProgress = 0;
  let projecstCompleted = 0;
  projects.forEach((project) => {
    if (project.state === 1) {
      projectsNotStarted++;
    } else if (project.state === 2) {
      projectsInProgress++;
    } else if (project.state === 3) {
      projecstCompleted++;
    }
  });
  setProjectsStats({
    ...projectsStats,
    notStarted: projectsNotStarted,
    inProgress: projectsInProgress,
    completed: projecstCompleted,
  });
}

async function updateProjectAction(
  user,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  projectsStats,
  setProjectsStats,
  tempRecentPages,
  setTempRecentPages,
  setProjectsFetched
) {
  const projectsObject = await getProjectsByOwnerAPI(user, token);
  if (projectsObject.error === "Invalid access token") {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    updateProjectsStats(projectsObject.result, projectsStats, setProjectsStats);
    setTempRecentPages(tempRecentPages.concat(projectsObject.result));
    setProjectsFetched(true);
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
  projectsStats,
  setProjectsStats,
  tempRecentPages,
  setTempRecentPages,
  setProjectsFetched,
  setTokenValidated
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
      if (validAccessToken.message === "Valid access token") {
        updateProjectAction(
          user,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          projectsStats,
          setProjectsStats,
          tempRecentPages,
          setTempRecentPages,
          setProjectsFetched
        );
      } else {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      }
    } else {
      console.log("Invalid refresh token");
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    updateProjectAction(
      user,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      projectsStats,
      setProjectsStats,
      tempRecentPages,
      setTempRecentPages,
      setProjectsFetched
    );
  }
}
