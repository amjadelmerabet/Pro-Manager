import getNewAccessTokenAPI from "../api/tokens/getNewAccessTokenAPI";

function updateToken(accessTokenObject) {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  authUser.token = accessTokenObject.token;
  sessionStorage.removeItem("authUser");
  sessionStorage.setItem("authUser", JSON.stringify(authUser));
}

function nextAction(newAccessToken, setCheckNewUser) {
  if (newAccessToken.action === "check-new-user") {
    setCheckNewUser(true);
  }
}

export default async function getNewAccessTokenUtil(
  user,
  userId,
  session,
  setTries,
  setTokenValidated,
  newAccessToken,
  setCheckNewUser,
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
        nextAction(newAccessToken, setCheckNewUser);
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
