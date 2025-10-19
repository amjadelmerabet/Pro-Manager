export default async function checkAccessTokenAPI(token, refreshToken) {
  const response = await fetch("http://127.0.0.1:3000/tokens/access/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken.value}`,
    },
    body: JSON.stringify({ token: token }),
  });
  const validAccessToken = await response.json();
  return validAccessToken;
}
