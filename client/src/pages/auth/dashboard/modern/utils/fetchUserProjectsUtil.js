import getProjectsByOwnerAPI from "../../../../../api/projects/getProjectsByOwnerAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    action: "fetch_user_projects",
  });
}

function updateReportsStats(projects, reportsStats, setReportsStats) {
  let projectsNotStarted = 0,
    projectsInProgress = 0,
    projectsCompleted = 0;
  projects.forEach((project) => {
    switch (project.state) {
      case 1:
        projectsNotStarted++;
        break;
      case 2:
        projectsInProgress++;
        break;
      case 3:
        projectsCompleted++;
        break;
      default:
        break;
    }
  });
  setReportsStats({
    ...reportsStats,
    projects: {
      ...reportsStats["projects"],
      notStarted: projectsNotStarted,
      inProgress: projectsInProgress,
      completed: projectsCompleted,
    },
  });
}

async function fetchUserProjectsAction(
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  reportsStats,
  setReportsStats,
  setUserProjectsFetched,
  setUserProjects,
) {
  const userProjects = await getProjectsByOwnerAPI(userId, token);
  if (userProjects.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    updateReportsStats(userProjects.result, reportsStats, setReportsStats);
    setUserProjects(userProjects.result);
    setUserProjectsFetched(true);
  }
}

export default async function fetchUserProjectsUtil(
  user,
  userId,
  token,
  session,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  reportsStats,
  setReportsStats,
  setUserProjectsFetched,
  setUserProjects,
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenCheck = await checkAccessTokenAPI(
        token,
        session,
        refreshToken,
      );
      if (accessTokenCheck.error === "Invalid access token" && tries < 3) {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        fetchUserProjectsAction(
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          reportsStats,
          setReportsStats,
          setUserProjectsFetched,
          setUserProjects,
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
      reportsStats,
      setReportsStats,
      setUserProjectsFetched,
      setUserProjects,
    );
  }
}
