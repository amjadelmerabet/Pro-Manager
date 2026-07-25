import updateProjectByIdAPI from "../../../../../api/projects/updateProjectByIdAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

export default async function updateProjectUtil(
  tokenValidated,
  user,
  sessionId,
  token,
  projectId,
  updates,
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
      if (!refreshToken) return;
      const validation = await checkAccessTokenAPI(
        token,
        sessionId,
        refreshToken,
      );
      if (validation.message !== "Valid access token") {
        setTries(tries + 1);
        setNewAccessToken({
          counter: newAccessToken.counter + 1,
          type: "update",
        });
        return;
      }
      setTokenValidated(true);
    }
    const response = await updateProjectByIdAPI(projectId, token, updates);
    if (response.error === "Invalid access token" && tries < 3) {
      setTokenValidated(false);
      setTries(tries + 1);
      setNewAccessToken({
        counter: newAccessToken.counter + 1,
        type: "update",
      });
    } else if (!response.error) {
      setUpdatedSuccessfully(true);
      setTokenValidated(false);
    }
  } catch (error) {
    console.log(error);
  }
}
