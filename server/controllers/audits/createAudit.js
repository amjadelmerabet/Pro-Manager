import pool from "../../db/connection.js";

export default async function createAudit(
  type,
  activityId,
  commentId,
  user,
  record,
  recordId,
  field,
  value,
) {
  const now = new Date();
  if (record === "task") {
    if (activityId !== "") {
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
        let updates = 0;
        let old_value = "[No audit]";
        if (lastAuditUpdate?.rows.length > 0) {
          updates = lastAuditUpdate?.rows[0].updates;
          old_value = lastAuditUpdate?.rows[0].new_value;
        }
        const newAudit = await pool.query(
          "INSERT INTO audits (type, activity, field, updates, old_value, new_value, record, task, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
          [
            type,
            activityId,
            field,
            updates + 1,
            old_value,
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
    } else if (commentId !== "") {
      if (type === "insert") {
        const newAudit = await pool.query(
          "INSERT INTO audits (type, comment, new_value, record, task, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [type, commentId, value, record, recordId, now, user, now, user],
        );
      }
    }
  } else if (record === "project") {
    if (activityId !== "") {
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
        let updates = 0;
        let old_value = "[No audit]";
        if (lastAuditUpdate?.rows.length > 0) {
          updates = lastAuditUpdate?.rows[0].updates;
          old_value = lastAuditUpdate?.rows[0].new_value;
        }
        const newAudit = await pool.query(
          "INSERT INTO audits (type, activity, field, updates, old_value, new_value, record, project, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
          [
            type,
            activityId,
            field,
            updates + 1,
            old_value,
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
    } else if (commentId !== "") {
      if (type === "insert") {
        const newAudit = await pool.query(
          "INSERT INTO audits (type, comment, new_value, record, project, updated_on, updated_by, created_on, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [type, commentId, value, record, recordId, now, user, now, user],
        );
      }
    }
  }
  return { message: "Audit created" };
}
