export default async function getProjectByIdAPI(id, token) {
  const response = await fetch("http://127.0.0.1:3000/projects/id/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const project = await response.json();
  return project;
}
