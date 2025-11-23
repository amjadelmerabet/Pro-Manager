import apiConfig from "../config";

export default async function updateTaskByIdAPI(id, token, updates) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tasks/update/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    }
  );
  const task = await response.json();
  return task;
}
