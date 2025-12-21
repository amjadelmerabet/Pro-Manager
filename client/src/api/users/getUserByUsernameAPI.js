import apiConfig from "../config";

export default async function getUserDetailsAPI(username, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/users/username/${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const user = await response.json();
  return user;
}
