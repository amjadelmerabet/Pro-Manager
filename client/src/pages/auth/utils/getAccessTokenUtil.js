import getNewAccessTokenAPI from "../../../api/tokens/getNewAccessTokenAPI";

function updateToken(accessTokenObject) {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  authUser.token = accessTokenObject.token;
  sessionStorage.removeItem("authUser");
  sessionStorage.setItem("authUser", JSON.stringify(authUser));
}

function nextAction(newAccessToken, logoutUser, setLogoutUser) {
  if (newAccessToken.action === "logout") {
    setLogoutUser(logoutUser + 1);
  }
}

export default async function getAccessTokenUtil(
  user,
  userId,
  session,
  setTokenValidated,
  setTries,
  newAccessToken,
  logoutUser,
  setLogoutUser,
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
        updateToken(accessTokenObject);
        setTokenValidated(true);
        setTries(0);
        nextAction(newAccessToken, logoutUser, setLogoutUser);
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
