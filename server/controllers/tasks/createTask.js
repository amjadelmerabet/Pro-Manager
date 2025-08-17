import pool from "../../db/connection.js";

export default async function createTask(fields) {
  try {
    let query = "INSERT INTO tasks (";
    let values = "VALUES (";
    let propertiesToInsert = [];
    let count = 1;
    Object.entries(fields).forEach((field, index) => {
      query += field[0];
      values += `$${count++}`;
      if (index < Object.keys(fields).length - 1) {
        query += ", ";
        values += ", ";
      } else {
        query += ") ";
        values += ")";
        query += values;
      }
      propertiesToInsert.push(field[1]);
    })
    const newTask = await pool.query(query, propertiesToInsert);
    return newTask;
  } catch (error) {
    console.log("Query error: " + error);
  }
}