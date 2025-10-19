export default async function createProjectAPI(payload, token) {
  const response = await fetch("http://127.0.0.1:3000/projects/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const project = await response.json();
  return project;
}
