import apiConfig from "../config";

export default async function deleteTaskByIdAPI(id, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tasks/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const deleted = await response.json();
  return deleted;
}
