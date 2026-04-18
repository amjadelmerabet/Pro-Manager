import apiConfig from "../config";

export default async function deleteSessionAPI(id, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/sessions/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id }),
    },
  );
  const deletedSession = await response.json();
  return deletedSession;
}
