import apiConfig from "../config";

export default async function createProjectAPI(payload, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/projects/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  const project = await response.json();
  return project;
}
