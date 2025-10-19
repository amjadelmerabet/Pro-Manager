import deleteProjectByIdAPI from "../../../../api/projects/deleteProjectByIdAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "delete",
  });
}

async function deleteProjectAction(
  projectId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  user,
  navigate,
) {
  const deletedProject = await deleteProjectByIdAPI(projectId, token);
  if (deletedProject.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setTimeout(() => {
      navigate("/auth/" + user + "/projects");
    }, 500);
  }
}

export default async function deleteProjectUtil(
  tokenValidated,
  user,
  token,
  projectId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setTokenValidated,
  navigate,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          deleteProjectAction(
            projectId,
            token,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            user,
            navigate,
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
      deleteProjectAction(
        projectId,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        user,
        navigate,
      );
    }
  } catch (error) {
    console.log(error);
  }
}
