import apiConfig from "../config";

export default async function deleteProjectByIdAPI(id, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/projects/delete/${id}`,
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
