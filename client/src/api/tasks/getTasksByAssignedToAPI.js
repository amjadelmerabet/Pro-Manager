import apiConfig from "../config";

export default async function getTasksByAssignedToAPI(assignedTo, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tasks/assigned-to/${assignedTo}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const tasks = await response.json();
  return tasks;
}
