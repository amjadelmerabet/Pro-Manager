export default async function deleteTaskByIdAPI(id, token) {
  const response = await fetch("http://127.0.0.1:3000/tasks/delete/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const deleted = await response.json();
  return deleted;
}
