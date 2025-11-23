import apiConfig from "../config";

export default async function checkAccessTokenAPI(token, refreshToken) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tokens/access/check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken.value}`,
      },
      body: JSON.stringify({ token: token }),
    }
  );
  const validAccessToken = await response.json();
  return validAccessToken;
}
