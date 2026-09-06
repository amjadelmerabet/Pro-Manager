import apiConfig from "../config";

export default async function getUserActivitiesAPI(record, id, token) {
  const response = await fetch(
    `${apiConfig.url}:${apiConfig.port}/api/activities/${record === "task" ? "task" : "project"}/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const userActivities = await response.json();
  return userActivities;
}
