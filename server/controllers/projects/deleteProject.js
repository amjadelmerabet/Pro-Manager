import pool from "../../db/connection.js";
import getProjectById from "./getProjectById.js";

export default async function deleteProject(id) {
  const project = await getProjectById(id);
  if (project) {
    try {
      const deletedProject = await pool.query(
        "DELETE FROM projects WHERE project_id = $1",
        [id],
      );
      return { status: "success", message: "Project deleted successfully" };
    } catch (error) {
      console.log("Query error: " + error);
    }
  } else {
    return { status: "fail", message: "404 Project not found" };
  }
}
