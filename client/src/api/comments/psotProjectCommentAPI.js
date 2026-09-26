import apiConfig from "../config";

export default async function postProjectCommentAPI(payload, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/comments/project/new`,
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
