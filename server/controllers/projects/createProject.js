import pool from "../../db/connection.js";

export default async function createProject(
  name,
  description,
  state,
  deadline,
  owner
) {
  let propertiesToInsert = [name];
  let query = "INSERT INTO projects (name, ";
  let values = "VALUES ($1, ";
  let count = 1;
  if (description) {
    propertiesToInsert.push(description);
    query += "description, ";
    count++;
    values += `$${count}, `;
  }
  if (state) {
    propertiesToInsert.push(state);
    query += "state, ";
    count++;
    values += `$${count}, `;
  }
  if (deadline) {
    propertiesToInsert.push(deadline);
    query += "deadline, ";
    count++;
    values += `$${count}, `;
  }
  propertiesToInsert.push(owner);
  query += "owner) ";
  count++;
  values += `$${count})`;
  query += values;
  const newProject = await pool.query(query, propertiesToInsert);
  return newProject;
}  
