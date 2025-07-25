import { useParams } from "react-router"

export default function ProjectsPage() {
  const { userId } = useParams();
  return <div className="projects-page">Projects Page for the user with the ID: {userId}</div>
}