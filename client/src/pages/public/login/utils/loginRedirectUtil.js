import checkNewUserUtil from "../../../../utils/checkNewUserUtil";

export default async function loginRedirectUtil(
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
    const { user, userId, token, workspaceId } = JSON.parse(userAuthenticated);
    // const newUser = await checkNewUserUtil(userId, token);
    if (userAuthenticated && !logout) {
      // if (newUser) {
      //   navigate(
      //     `/auth/${user}/${modernUI && modernUI === "true" ? "modern" : "classic"}/get-started`,
      //   );
      // } else {
      // }
      navigate(
        `/auth/${user}/${modernUI && modernUI === "true" ? "modern" : "classic"}/workspace/${workspaceId}/dashboard`,
      );
    } else if (username) {
      // if (newUser) {
      //   navigate(
      //     `/auth/${username}/${modernUI && modernUI === "true" ? "modern" : "classic"}/get-started`,
      //   );
      // } else {
      // }
      navigate(
        `/auth/${username}/${modernUI && modernUI === "true" ? "modern" : "classic"}/workspace/${workspaceId}/dashboard`,
      );
    } else {
      // if (newUser) {
      //   navigate(
      //     `/auth/user/${modernUI && modernUI === "true" ? "modern" : "classic"}/get-started`,
      //   );
      // } else {
      // }
      navigate(
        `/auth/user/${modernUI && modernUI === "true" ? "modern" : "classic"}/workspace/${workspaceId}/dashboard`,
      );
    }
  }
}
