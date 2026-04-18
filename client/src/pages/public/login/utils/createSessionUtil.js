import createSessionAPI from "../../../../api/sessions/createSessionAPI";
import checkAccessTokenAPI from "../../../../api/tokens/checkAccessTokenAPI";

import bcrypt from "bcryptjs";

function tryAgain(tries, setTries, newAccessToken, setNewAccessToken) {
  setTries(tries + 1);
  setNewAccessToken({ counter: newAccessToken.counter + 1, type: "new" });
}

async function hashSession(plainSession) {
  const saltRounds = 10;
  const hashedSession = await bcrypt.hash(plainSession, saltRounds);
  return hashedSession;
}

async function createNewSessionAction(
  user,
  userId,
  token,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setRedirect
) {
  const hashedSession = await hashSession(user + "-" + userId);
  const newSession = await createSessionAPI(hashedSession, userId, token);
  if (newSession.error === "Invalid access token" && tries < 3) {
    tryAgain(tries, setTries, newAccessToken, setNewAccessToken);
  } else {
    let authUser = JSON.parse(sessionStorage.getItem("authUser"));
    authUser.sessionId = newSession.session_id;
    let sessionExpiresIn = new Date();
    sessionExpiresIn.setHours(new Date().getHours() + 2);
    await cookieStore.set({
      name: "session-" + userId,
      value: hashedSession,
      expires: sessionExpiresIn,
      path: "/",
      secure: true,
      sameSite: "strict",
    });
    sessionStorage.removeItem("authUser");
    sessionStorage.setItem("authUser", JSON.stringify(authUser));
    setRedirect(true);
  }
}

export default async function createSessionUtil(
  user,
  userId,
  token,
  tokenValidated,
  setTokenValidated,
  tries,
  setTries,
  newAccessToken,
  setNewAccessToken,
  setRedirect
) {
  if (!tokenValidated) {
    const refreshToken = await cookieStore.get(user);
    if (refreshToken) {
      const validAccessToken = await checkAccessTokenAPI(token, refreshToken);
      if (validAccessToken.message === "Valid access token") {
        createNewSessionAction(
          user,
          userId,
          token,
          tries,
          setTries,
          newAccessToken,
          setNewAccessToken,
          setRedirect
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
    createNewSessionAction(
      user,
      userId,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setRedirect
    );
  }
}
