import apiConfig from "../config";

export default async function createNewUserAPI(userBody) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/users/new`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userBody),
    }
  );
  const newUser = await response.json();
  return newUser;
}
