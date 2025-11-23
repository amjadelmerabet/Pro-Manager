import apiConfig from "../config";

export default async function getProjectByIdAPI(id, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/projects/id/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const project = await response.json();
  return project;
}
