import pool from "../../db/connection.js";

export default async function createTask(fields) {
  try {
    const acceptedFields = [
      "name",
      "state",
      "priority",
      "short_description",
      "description",
      "assigned_to",
      "project",
      "updated_on",
      "updated_by",
      "created_on",
      "created_by",
    ];
    let query = "INSERT INTO tasks (";
    let values = "VALUES (";
    let propertiesToInsert = [];
    let count = 1;
    let insertError = false;
    let errorObject = {};
    Object.entries(fields).forEach((field, index) => {
      if (acceptedFields.indexOf(field[0]) === -1) {
        insertError = true;
        errorObject.errorMessage = "Bad Request";
        errorObject.error = "Invalid field " + field[0];
      }
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
    });
    if (!insertError) {
      query += " RETURNING task_id";
      const newTask = await pool.query(query, propertiesToInsert);
      return newTask;
    } else {
      return errorObject;
    }
  } catch (error) {
    return { errorMessage: "Internal Server Error", error };
  }
}
