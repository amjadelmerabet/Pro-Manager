export default async function getProjectsByOwnerAPI(owner, token) {
  const response = await fetch(
    "http://127.0.0.1:3000/projects/owner/" + owner,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const projects = await response.json();
  return projects;
}
