import apiConfig from "../config";

export default async function deleteUserByUsernameAPI(username, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/users/delete/${username}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const deletedUser = await response.json();
  return deletedUser;
}
