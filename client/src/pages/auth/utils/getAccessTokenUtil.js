import getNewAccessTokenAPI from "../../../api/tokens/getNewAccessTokenAPI";

function updateToken(accessTokenObject) {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  authUser.token = accessTokenObject.token;
  sessionStorage.removeItem("authUser");
  sessionStorage.setItem("authUser", JSON.stringify(authUser));
}

function nextAction(newAccessToken, deleteSession, setDeleteSession) {
  if (newAccessToken.type === "delete") {
    setDeleteSession(deleteSession + 1);
  }
}

export default async function getAccessTokenUtil(
  user,
  userId,
  setTokenValidated,
  setTries,
  newAccessToken,
  deleteSession,
  setDeleteSession,
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenObject = await getNewAccessTokenAPI(
        userId,
        refreshToken,
      );
      if (!accessTokenObject.error) {
        updateToken(accessTokenObject);
        setTokenValidated(true);
        setTries(0);
        nextAction(newAccessToken, deleteSession, setDeleteSession);
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
