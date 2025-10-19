import createProjectAPI from "../../../../api/projects/createProjectAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "create",
    page: "project",
  });
}

async function updateProjectAction(
  newProject,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjectCreatedSuccessfully,
) {
  const newProjectObject = await createProjectAPI(newProject, token);
  if (newProjectObject.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setProjectCreatedSuccessfully(true);
  }
}

export default async function createProjectUtil(
  tokenValidated,
  user,
  token,
  newProject,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjectCreatedSuccessfully,
  setTokenValidated,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          updateProjectAction(
            newProject,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setProjectCreatedSuccessfully,
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
        newProject,
        token,
        tries,
        newAccessToken,
        setNewAccessToken,
        setProjectCreatedSuccessfully,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
