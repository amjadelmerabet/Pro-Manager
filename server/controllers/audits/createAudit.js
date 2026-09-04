import pool from "../../db/connection.js";

export default async function createAudit(
  type,
  activityId,
  user,
  record,
  recordId,
  field,
  value,
) {
  const now = new Date();
  if (record === "task") {
    if (type === "insert") {
      const newAudit = await pool.query(
        "INSERT INTO audits (type, activity, field, new_value, record, task, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          type,
          activityId,
          field,
          value,
          record,
          recordId,
          now,
          user,
          now,
          user,
        ],
      );
    } else if (type === "update") {
      const lastAuditUpdate = await pool.query(
        "SELECT updates, new_value FROM audits WHERE record = 'task' AND task = $1 AND field = $2 ORDER BY updates DESC LIMIT 1",
        [recordId, field],
      );
      const { updates, new_value } = lastAuditUpdate?.rows[0];
      const newAudit = await pool.query(
        "INSERT INTO audits (type, activity, field, updates, old_value, new_value, record, task, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
        [
          type,
          activityId,
          field,
          updates + 1,
          new_value,
          value,
          record,
          recordId,
          now,
          user,
          now,
          user,
        ],
      );
    }
  } else if (record === "project") {
    if (type === "insert") {
      const newAudit = await pool.query(
        "INSERT INTO audits (type, activity, field, new_value, record, project, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [
          type,
          activityId,
          field,
          value,
          record,
          recordId,
          now,
          user,
          now,
          user,
        ],
      );
    } else if (type === "update") {
      const lastAuditUpdate = await pool.query(
        "SELECT updates, new_value FROM audits WHERE record = 'project' AND project = $1 AND field = $2 ORDER BY updates DESC LIMIT 1",
        [recordId, field],
      );
      const { updates, new_value } = lastAuditUpdate?.rows[0];
      const newAudit = await pool.query(
        "INSERT INTO audits (type, activity, field, updates, old_value, new_value, record, project, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
        [
          type,
          activityId,
          field,
          updates + 1,
          new_value,
          value,
          record,
          recordId,
          now,
          user,
          now,
          user,
        ],
      );
    }
  }
  return { message: "Audit created" };
}
