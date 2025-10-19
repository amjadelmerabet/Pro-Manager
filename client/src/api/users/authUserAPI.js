export default async function authUserAPI(username, password) {
  const response = await fetch("http://127.0.0.1:3000/users/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const auth = await response.json();
  return auth;
}
