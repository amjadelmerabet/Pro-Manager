export default async function getTasksByAssignedToAPI(assignedTo, token) {
  const response = await fetch(
    "http://127.0.0.1:3000/tasks/assigned-to/" + assignedTo,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const tasks = await response.json();
  return tasks;
}
