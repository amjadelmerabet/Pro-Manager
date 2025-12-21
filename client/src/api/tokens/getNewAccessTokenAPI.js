import apiConfig from "../config";

export default async function getNewAccessTokenAPI(userId, refreshToken) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tokens/access/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken.value}`,
      },
      body: JSON.stringify({ user_id: userId }),
    }
  );
  // console.log("Received a token or something");
  const accessTokenObject = await response.json();
  return accessTokenObject;
}
