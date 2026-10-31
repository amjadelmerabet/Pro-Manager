import apiConfig from "../config";

export default async function createWorkspaceAPI(payload, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/workspaces/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );
  const workspace = await response.json();
  return workspace;
}
