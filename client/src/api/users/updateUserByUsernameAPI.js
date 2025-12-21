import apiConfig from "../config";

export default async function updateUserDetailsAPI(username, updates, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/users/update/${username}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    }
  );
  const updatedUser = await response.json();
  return updatedUser;
}
