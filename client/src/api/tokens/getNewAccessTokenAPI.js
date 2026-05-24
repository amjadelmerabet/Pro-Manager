import apiConfig from "../config";

export default async function getNewAccessTokenAPI(
  userId,
  session,
  refreshToken,
) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/tokens/access/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken.value}`,
      },
      body: JSON.stringify({ user_id: userId, session: session }),
    },
  );
  // console.log("Received a token or something");
  const accessTokenObject = await response.json();
  return accessTokenObject;
}
