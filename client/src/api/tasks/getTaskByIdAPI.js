import apiConfig from "../config";

export default async function getTaskByIdAPI(id, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tasks/id/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const task = await response.json();
  return task;
}
