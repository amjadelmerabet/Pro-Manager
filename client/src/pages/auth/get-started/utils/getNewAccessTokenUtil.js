import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function nextAction(newAccessToken, setCreateWorkspace) {
  if (newAccessToken.action === "create-workspace") {
    setCreateWorkspace(true);
  }
}

export default async function getNewAccessTokenUtil(
  user,
  userId,
  session,
  setTries,
  setTokenValidated,
  newAccessToken,
  setCreateWorkspace,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenObject = await getNewAccessTokenAPI(
        userId,
        session,
        refreshToken,
      );
      if (!accessTokenObject.error) {
        const authUser = JSON.parse(sessionStorage.getItem("authUser"));
        authUser.token = accessTokenObject.token;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(authUser));
        setTokenValidated(true);
        setTries(0);
        nextAction(newAccessToken, setCreateWorkspace);
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
