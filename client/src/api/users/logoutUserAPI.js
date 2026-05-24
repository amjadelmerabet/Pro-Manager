import apiConfig from "../config";

export default async function logoutUserAPI(session, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/users/auth/logout/${session}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const userLoggedOut = await response.json();
  return userLoggedOut;
}
