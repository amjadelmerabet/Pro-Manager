import apiConfig from "../config";

export default async function getProjectsByOwnerAPI(owner, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/projects/owner/${owner}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const projects = await response.json();
  return projects;
}
