import getProjectByIdAPI from "../../../../../api/projects/getProjectByIdAPI";
import checkAccessTokenAPI from "../../../../../api/tokens/checkAccessTokenAPI";

export default async function fetchUserProjectUtil(
  tokenValidated,
  user,
  sessionId,
  token,
  projectId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setProject,
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
          type: "load",
        });
        return;
      }
      setTokenValidated(true);
    }
    const response = await getProjectByIdAPI(projectId, token);
    if (response.error === "Invalid access token" && tries < 3) {
      setTokenValidated(false);
      setTries(tries + 1);
      setNewAccessToken({ counter: newAccessToken.counter + 1, type: "load" });
    } else if (!response.error) {
      setProject(response.result[0] || {});
      setTokenValidated(false);
    }
  } catch (error) {
    console.log(error);
  }
}
