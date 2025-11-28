import apiConfig from "../config";

export default async function getTasksByProjectAPI(project, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tasks/project/${project}`,
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
