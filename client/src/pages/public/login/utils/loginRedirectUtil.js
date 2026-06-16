export default function loginRedirectUtil(
  redirectURL,
  userAuthenticated,
  navigate,
  logout,
  username,
  modernUI,
) {
  if (redirectURL) {
    if (userAuthenticated) {
      const authUser = JSON.parse(userAuthenticated).user;
      const userRedirectURL = redirectURL.replace("user", authUser);
      navigate(userRedirectURL);
    } else {
      navigate("/signin");
    }
  } else {
    if (userAuthenticated && !logout) {
      const authUser = JSON.parse(userAuthenticated).user;
      navigate(
        `/auth/${authUser}/${modernUI && modernUI === "true" ? "modern" : "classic"}/dashboard`,
      );
    } else if (username) {
      navigate(
        `/auth/${username}/${modernUI && modernUI === "true" ? "modern" : "classic"}/dashboard`,
      );
    } else {
      navigate(
        `/auth/user/${modernUI && modernUI === "true" ? "modern" : "classic"}/dashboard`,
      );
    }
  }
}
