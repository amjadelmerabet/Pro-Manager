import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import getUserByUsernameAPI from "../../../../api/users/getUserByUsernameAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "load",
  });
}

async function getUserAction(
  user,
  token,
  setUserObject,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUserDetailsFetched
) {
  const userObject = await getUserByUsernameAPI(user, token);
  if (userObject.error === "Invalid access token") {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    setUserObject(userObject.result[0]);
    setUserDetailsFetched(true);
  }
}

export default async function getUserUtil(
  user,
  token,
  setUserObject,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUserDetailsFetched
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          getUserAction(
            user,
            token,
            setUserObject,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setUserDetailsFetched
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
      getUserAction(
        user,
        token,
        setUserObject,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setUserDetailsFetched
      );
    }
  } catch (error) {
    console.log(error);
  }
}
