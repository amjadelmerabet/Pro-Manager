import getNewAccessTokenAPI from "../../../../../api/tokens/getNewAccessTokenAPI";

export default async function getAccessTokenUtil(
  user,
  userId,
  sessionId,
  setTokenValidated,
  setTries,
  newAccessToken,
  setLoadProject,
  setProjectUpdated,
  setProjectDeleted,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (!refreshToken) return;
    const response = await getNewAccessTokenAPI(
      userId,
      sessionId,
      refreshToken,
    );
    if (response.error) return;
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
    authUser.token = response.token;
    sessionStorage.setItem("authUser", JSON.stringify(authUser));
    setTokenValidated(true);
    setTries(0);
    if (newAccessToken.type === "load")
      setLoadProject((current) => current + 1);
    else if (newAccessToken.type === "update")
      setProjectUpdated((current) => ({
        ...current,
        counter: current.counter + 1,
        update: true,
      }));
    else if (newAccessToken.type === "delete") setProjectDeleted(true);
  } catch (error) {
    console.log(error);
  }
}
