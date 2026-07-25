import getNewAccessTokenAPI from "../../../../../api/tokens/getNewAccessTokenAPI";

function nextAction(
  newAccessToken,
  setFetchUserProjects,
  setCreateNewProject,
  deleteProject,
  setDeleteProject,
) {
  switch (newAccessToken.action) {
    case "fetch_user_projects":
      setFetchUserProjects(true);
      break;
    case "create_project":
      setCreateNewProject(true);
      break;
    case "delete_project":
      setDeleteProject({ ...deleteProject, delete: true });
      break;
    default:
      break;
  }
}

export default async function getNewAccessTokenUtil(
  user,
  userId,
  session,
  setTokenValidated,
  setTries,
  newAccessToken,
  setFetchUserProjects,
  setCreateNewProject,
  deleteProject,
  setDeleteProject,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const newAccessTokenObj = await getNewAccessTokenAPI(
        userId,
        session,
        refreshToken,
      );
      if (!newAccessTokenObj.error) {
        const authUserObj = JSON.parse(sessionStorage.getItem("authUser"));
        authUserObj.token = newAccessTokenObj.token;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(authUserObj));
        setTokenValidated(true);
        setTries(0);
        nextAction(
          newAccessToken,
          setFetchUserProjects,
          setCreateNewProject,
          deleteProject,
          setDeleteProject,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
