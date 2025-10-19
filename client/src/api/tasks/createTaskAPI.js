export default async function createTaskAPI(payload, token) {
  const response = await fetch("http://127.0.0.1:3000/tasks/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const task = await response.json();
  return task;
}
