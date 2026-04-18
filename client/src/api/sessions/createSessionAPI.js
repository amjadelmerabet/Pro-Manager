import apiConfig from "../config";

export default async function createSessionAPI(session, user, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/sessions/new`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ session: session, user: user }),
    },
  );
  const newSession = await response.json();
  return newSession;
}
