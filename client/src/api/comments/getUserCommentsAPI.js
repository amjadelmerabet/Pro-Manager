import apiConfig from "../config";

export default async function getUserCommentsAPI(record, id, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/comments/${record}/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const comments = await response.json();
  return comments;
}
