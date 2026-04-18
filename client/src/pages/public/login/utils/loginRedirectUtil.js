export default function loginRedirectUtil(
  redirectURL,
  userAuthenticated,
  navigate,
  logout,
  username,
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
      navigate("/auth/" + authUser + "/dashboard");
    } else if (username) {
      navigate("/auth/" + username + "/dashboard");
    } else {
      navigate("/auth/user/dashboard");
    }
  }
}
