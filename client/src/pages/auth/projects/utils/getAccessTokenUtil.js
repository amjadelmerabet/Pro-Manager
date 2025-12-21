import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function nextAction(
  newAccessToken,
  loadProjects,
  setLoadProjects,
  createProject,
  setCreateProject,
  updatedProjectId,
  setUpdatedProjectId,
  deletedProjectId,
  setDeletedProjectId,
) {
  if (newAccessToken.type === "load") {
    setLoadProjects(loadProjects + 1);
  } else if (newAccessToken.type === "new") {
    setCreateProject(createProject + 1);
  } else if (newAccessToken.type === "update") {
    setUpdatedProjectId({ ...updatedProjectId, update: true });
  } else if (newAccessToken.type === "delete") {
    setDeletedProjectId({ ...deletedProjectId, delete: true });
  }
}

export default async function getAccessTokenUtil(
  user,
  userId,
  setTokenValidated,
  setTries,
  newAccessToken,
  loadProjects,
  setLoadProjects,
  createProject,
  setCreateProject,
  updatedProjectId,
  setUpdatedProjectId,
  deletedProjectId,
  setDeletedProjectId,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenObject = await getNewAccessTokenAPI(userId, refreshToken);
      if (!accessTokenObject.error) {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"));
        authUser.token = accessTokenObject.token;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(authUser));
        setTokenValidated(true);
        setTries(0);
        nextAction(
          newAccessToken,
          loadProjects,
          setLoadProjects,
          createProject,
          setCreateProject,
          updatedProjectId,
          setUpdatedProjectId,
          deletedProjectId,
          setDeletedProjectId,
        );
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
