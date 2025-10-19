export default async function getNewAccessTokenAPI(user, refreshToken) {
  const response = await fetch("http://127.0.0.1:3000/tokens/access/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken.value}`,
    },
    body: JSON.stringify({ username: user }),
  });
  // console.log("Received a token or something");
  const accessTokenObject = await response.json();
  return accessTokenObject;
}
