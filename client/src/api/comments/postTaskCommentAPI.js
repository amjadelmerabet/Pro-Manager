import apiConfig from "../config";

export default async function postTaskCommentAPI(payload, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/comments/task/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );
  const comment = await response.json();
  return comment;
}
