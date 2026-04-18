import deleteSessionAPI from "../../../api/sessions/deleteSessionAPI";
import checkAccessTokenAPI from "../../../api/tokens/checkAccessTokenAPI";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken, setSessionDeleted) {
  setSessionDeleted(false);
  setTries(tries + 1);
  setNewAccessToken({ counter: newAccessToken.counter + 1, type: "delete" });
}

async function deleteSessionAction(
  id,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setSessionDeleted,
) {
  const deleteSession = await deleteSessionAPI(id, token);
  if (deleteSession.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken, setSessionDeleted);
  } else {
    setSessionDeleted(true);
  }
}

export default async function deleteSessionUtil(
  id,
  user,
  token,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setSessionDeleted,
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
      if (validAccessToken.message === "Valid access token") {
        deleteSessionAction(
          id,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setSessionDeleted,
        );
      } else {
        tryAgain(tries, setTries, newAccessToken, setNewAccessToken, setSessionDeleted);
      }
    } else {
      setTimeout(() => {
        setTokenValidated(false);
      }, 500);
      deleteSessionAction(
        id,
        token,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        setSessionDeleted,
      );
    }
  } else {
    setTimeout(() => {
      setTokenValidated(false);
    }, 500);
    deleteSessionAction(
      id,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setSessionDeleted,
    );
  }
}
