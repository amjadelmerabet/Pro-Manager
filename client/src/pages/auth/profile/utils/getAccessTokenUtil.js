import getNewAccessTokenAPI from "../../../../api/tokens/getNewAccessTokenAPI";

function updateToken(accessTokenObject) {
  const authUser = JSON.parse(sessionStorage.getItem("authUser"));
  authUser.token = accessTokenObject.token;
  sessionStorage.removeItem("authUser");
  sessionStorage.setItem("authUser", JSON.stringify(authUser));
}

function nextAction(
  newAccessToken,
  setUpdateProfile,
  userUpdated,
  setUserUpdated
) {
  if (newAccessToken.type === "load") {
    setUserUpdated(userUpdated + 1);
  } else if (newAccessToken.type === "update") {
    setUpdateProfile(true);
    setTimeout(() => {
      setUpdateProfile(false);
    }, 250);
  }
}

export default async function getAccessTokenUtil(
  user,
  userId,
  setTokenValidated,
  setTries,
  newAccessToken,
  setUpdateProfile,
  userUpdated,
  setUserUpdated
) {
  try {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const accessTokenObject = await getNewAccessTokenAPI(userId, refreshToken);
      if (!accessTokenObject.error) {
        updateToken(accessTokenObject);
        setTokenValidated(true);
        setTries(0);
        nextAction(
          newAccessToken,
          setUpdateProfile,
          userUpdated,
          setUserUpdated
        );
        setTimeout(() => {
          setTokenValidated(false);
        }, 500);
      }
    } else {
      console.log("No refresh token");
    }
  } catch (error) {
    console.log(error);
  }
}
