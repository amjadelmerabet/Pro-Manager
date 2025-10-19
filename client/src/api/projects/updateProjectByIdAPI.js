export default async function updateProjectByIdAPI(id, token, updates) {
  const response = await fetch("http://127.0.0.1:3000/projects/update/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const project = await response.json();
  return project;
}
