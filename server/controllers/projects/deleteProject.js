import pool from "../../db/connection.js";
import getProjectById from "./getProjectById.js";

export default async function deleteProject(id) {
  try {
    const deletedProject = await pool.query(
      "DELETE FROM projects WHERE project_id = $1",
      [id],
    );
    return deletedProject;
  } catch (error) {
    return { error };
  }
}
