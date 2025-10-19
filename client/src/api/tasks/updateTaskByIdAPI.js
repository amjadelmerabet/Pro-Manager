export default async function updateTaskByIdAPI(id, token, updates) {
  const response = await fetch("http://127.0.0.1:3000/tasks/update/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const task = await response.json();
  return task;
}
