export default async function getTaskByIdAPI(id, token) {
  const response = await fetch("http://127.0.0.1:3000/tasks/id/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const task = await response.json();
  return task;
}
