import apiConfig from "../config";

export default async function getActiveWorkspaceAPI(owner, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/workspaces/active/${owner}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const activeWorkspace = await response.json();
  return activeWorkspace;
}
