import apiConfig from "../config";

export default async function updateProjectByIdAPI(id, token, updates) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/projects/update/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    }
  );
  const project = await response.json();
  return project;
}
