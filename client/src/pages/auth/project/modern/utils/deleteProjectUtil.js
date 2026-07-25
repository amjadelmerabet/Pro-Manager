import deleteProjectByIdAPI from "../../../../../api/projects/deleteProjectByIdAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

export default async function deleteProjectUtil(
  tokenValidated,
  user,
  sessionId,
  token,
  projectId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProjectDeleted,
  setTokenValidated,
  navigate,
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (!refreshToken) return;
      const validation = await checkAccessTokenAPI(
        token,
        sessionId,
        refreshToken,
      );
      if (validation.message !== "Valid access token") {
        setProjectDeleted(false);
        setTries(tries + 1);
        setNewAccessToken({
          counter: newAccessToken.counter + 1,
          type: "delete",
        });
        return;
      }
      setTokenValidated(true);
    }
    const response = await deleteProjectByIdAPI(projectId, token);
    if (response.error === "Invalid access token" && tries < 3) {
      setProjectDeleted(false);
      setTokenValidated(false);
      setTries(tries + 1);
      setNewAccessToken({
        counter: newAccessToken.counter + 1,
        type: "delete",
      });
    } else if (!response.error) {
      navigate(`/auth/${user}/modern/projects`);
    }
  } catch (error) {
    console.log(error);
  }
}
