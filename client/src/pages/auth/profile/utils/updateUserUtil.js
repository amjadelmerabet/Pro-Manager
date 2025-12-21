import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import updateUserByUsernameAPI from "../../../../api/users/updateUserByUsernameAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "update",
  });
}

async function updateUserAction(
  user,
  updates,
  token,
  userUpdated,
  setUserUpdated,
  setEditingProfile,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken
) {
  const updatedUser = await updateUserByUsernameAPI(user, updates, token);
  if (updatedUser.error === "Invalid access token") {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
    authUser.name = updates.first_name + " " + updates.last_name;
    sessionStorage.setItem("authUser", JSON.stringify(authUser));
    setUserUpdated(userUpdated + 1);
    setEditingProfile(false);
  }
}

export default async function updateUserDetailsUtil(
  user,
  updates,
  token,
  userUpdated,
  setUserUpdated,
  setEditingProfile,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          updateUserAction(
            user,
            updates,
            token,
            userUpdated,
            setUserUpdated,
            setEditingProfile,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken
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
      updateUserAction(
        user,
        updates,
        token,
        userUpdated,
        setUserUpdated,
        setEditingProfile,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken
      );
    }
  } catch (error) {
    console.log(error);
  }
}
