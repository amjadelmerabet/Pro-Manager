import pool from "../../db/connection.js";

export default async function createTask(name, short_description, description, state, priority, assigned_to) {
  try {
    let query = "INSERT INTO tasks (name, short_description, ";
    let values = "VALUES ($1, $2, ";
    let propertiesToInsert = [name, short_description];
    let count = 2;
    if (description) {
      query += "description, ";
      values += `$${count + 1}, `;
      count++;
      propertiesToInsert.push(description);
    }
    if (state) {
      query += "state, ";
      values += `$${count + 1}, `;
      count++;
      propertiesToInsert.push(state);
    }
    if (priority) {
      query += "priority, ";
      values += `$${count + 1}, `;
      count++;
      propertiesToInsert.push(priority);
    }
    query += "assigned_to) ";
    values += `$${count + 1})`;
    query += values;
    propertiesToInsert.push(assigned_to);
    const newTask = await pool.query(query, propertiesToInsert);
    return newTask;
  } catch (error) {
    console.log("Query error: " + error);
  }
}