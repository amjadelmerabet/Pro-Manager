import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";
import authUserAPI from "../../../../api/users/authUserAPI";
import updateUserDetailsAPI from "../../../../api/users/updateUserByUsernameAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({
    counter: newAccessToken.counter + 1,
    type: "update",
  });
}

async function updateUserAction(
  updatePassword,
  userObject,
  token,
  currentPassword,
  username,
  newPassword,
  userId,
  userUpdated,
  setUserUpdated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setUsernameUpdated
) {
  if (updatePassword) {
    const authUser = await authUserAPI(userObject.username, currentPassword);
    if (authUser.authenticated) {
      const updates = {
        username: username,
        password: newPassword,
        updated_by: userId,
      };
      if (
        username !== userObject.username ||
        (currentPassword !== newPassword && newPassword !== "")
      ) {
        const updateUserCredentials = await updateUserDetailsAPI(
          userObject.username,
          updates,
          token
        );
        if (updateUserCredentials.error === "Invalid access token") {
          tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
        } else {
          setTimeout(() => {
            setUsernameUpdated(true);
            setUserUpdated(userUpdated + 1);
            setTimeout(() => {
              setUsernameUpdated(false);
            }, 250);
          }, 500);
        }
      } else {
        console.log("No updates");
      }
    } else {
      console.log("Wrong current password");
    }
  } else {
    if (username !== userObject.username) {
      const updates = { username: username };
      const updateUserCredentials = await updateUserDetailsAPI(
        userObject.username,
        updates,
        token
      );
      if (updateUserCredentials.error === "Invalid access token") {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
      } else {
        setTimeout(() => {
          setUsernameUpdated(true);
          setUserUpdated(userUpdated + 1);
          setTimeout(() => {
            setUsernameUpdated(false);
          }, 500);
        }, 250);
      }
    } else {
      console.log("No updates");
    }
  }
}

export default async function saveUserCredentialsUtil(
  updatePassword,
  userObject,
  currentPassword,
  username,
  newPassword,
  token,
  tokenValidated,
  setTokenValidated,
  user,
  userId,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  userUpdated,
  setUserUpdated,
  setUsernameUpdated
) {
  try {
    if (!tokenValidated) {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
        if (validAccessToken.message === "Valid access token") {
          updateUserAction(
            updatePassword,
            userObject,
            token,
            currentPassword,
            username,
            newPassword,
            userId,
            userUpdated,
            setUserUpdated,
            tries,
            setTries,
            newAccessToken,
            setNewAccessToken,
            setUsernameUpdated
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
        updatePassword,
        userObject,
        token,
        currentPassword,
        username,
        newPassword,
        userId,
        userUpdated,
        setUserUpdated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setUsernameUpdated
      );
    }
  } catch (error) {
    console.log(error);
  }
}
