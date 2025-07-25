import { useParams } from "react-router"

export default function TasksPage() {
  const { userId } = useParams();
  return <div className="tasks page">Tasks Page for the user with ID: {userId}</div>
}