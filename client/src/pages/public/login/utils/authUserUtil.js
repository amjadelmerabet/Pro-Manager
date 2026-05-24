import loginUserAPI from "../../../../api/users/loginUserAPI";

async function saveRefreshTokenAsCookie(username, auth) {
  let refreshTokenExpiresIn = new Date();
  refreshTokenExpiresIn.setHours(refreshTokenExpiresIn.getHours() + 24 * 7);
  await cookieStore.set({
    name: username,
    value: auth.refresh,
    expires: refreshTokenExpiresIn,
    path: "/",
    secure: true,
    sameSite: "strict",
  });
}

export default async function authUserUtil(
  username,
  password,
  setLogin,
  setAuthentication,
  setIncorrectCredentials,
) {
  const refreshToken = await cookieStore.get(username);
  const auth = await loginUserAPI(username, password);
  setLogin("LoginEnded");
  if (auth.authenticated && auth.token) {
    sessionStorage.removeItem("userLoggedOut");
    sessionStorage.setItem(
      "authUser",
      JSON.stringify({
        user: username,
        authenticated: true,
        token: auth.token,
        sessionId: auth.sessionId,
        name: auth.name,
        userId: auth.userId,
      }),
    );
    let sessionExpiresIn = new Date();
    sessionExpiresIn.setHours(new Date().getHours() + 2);
    await cookieStore.set({
      name: "session-" + auth.userId,
      value: auth.session,
      expires: sessionExpiresIn,
      path: "/",
      secure: true,
      sameSite: "strict",
    });
    if (!refreshToken) {
      saveRefreshTokenAsCookie(username, auth);
    } else {
      if (refreshToken.value !== auth.refresh) {
        await cookieStore.delete(username);
        saveRefreshTokenAsCookie(username, auth);
      }
    }
    setAuthentication(auth.authenticated);
    setIncorrectCredentials(false);
  } else {
    setIncorrectCredentials(true);
  }
}
