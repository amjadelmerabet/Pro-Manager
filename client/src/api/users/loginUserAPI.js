import apiConfig from "../config";

export default async function loginUserAPI(username, password) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/users/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    },
  );
  const auth = await response.json();
  return auth;
}
