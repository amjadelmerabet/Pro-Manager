import apiConfig from "../config";

export default async function getWorkspacesByOwnerAPI(owner, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/workspaces/owner/${owner}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const workspaces = await response.json();
  return workspaces;
}
