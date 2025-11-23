import apiConfig from "../config";

export default async function createTaskAPI(payload, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tasks/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  const task = await response.json();
  return task;
}
