import apiConfig from "../config";

export default async function getWorkspaceByIdAPI(id, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/workspaces/id/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const workspace = await response.json();
  return workspace;
}
