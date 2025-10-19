import updateProjectByIdAPI from "../../../../api/projects/updateProjectByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "update",
  });
}

async function updateProjectAction(
  projectId,
  token,
  projectUpdates,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUpdatedSuccessfully,
) {
  const updatedProject = await updateProjectByIdAPI(
    projectId,
    token,
    projectUpdates,
  );
  if (updatedProject.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setUpdatedSuccessfully(true);
  }
}

export default async function updateProjectUtil(
  tokenValidated,
  user,
  token,
  projectId,
  projectUpdates,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUpdatedSuccessfully,
  setTokenValidated,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          updateProjectAction(
            projectId,
            token,
            projectUpdates,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setUpdatedSuccessfully,
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
      updateProjectAction(
        projectId,
        token,
        projectUpdates,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setUpdatedSuccessfully,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
