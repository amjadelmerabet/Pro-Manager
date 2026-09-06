import { parse } from "url";
import canRead from "../authorization/canRead.js";
import getProjectById from "../controllers/projects/getProjectById.js";
import getTaskById from "../controllers/tasks/getTaskById.js";
import getUserActivities from "../controllers/activities/getUserActivities.js";
import getRecordAudits from "../controllers/audits/getRecordAudits.js";

export async function activitiesRoute(req, res) {
  const { method, url } = req;

  const parsedUrl = parse(url, true);
  const pathname = parsedUrl.pathname;
  if (req.user) {
    if (method === "GET") {
      if (url.match(/^\/api\/activities\/project\/.+/)) {
        const { readAllowed, readAllRecords } = await canRead(
          req.user.user_id,
          "activities",
        );
        const projectId = pathname.replace("/api/activities/project/", "");
        if (readAllowed) {
          if (readAllRecords) {
            const userActivities = await getUserActivities(
              "project",
              projectId,
            );
            const activities = await Promise.all(
              userActivities.map(async (activity) => {
                const audits = await getRecordAudits(activity.activity_id);
                activity.audits = audits;
                return activity;
              }),
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: activities }));
          } else {
            const project = await getProjectById(projectId);
            if (project[0].owner === req.user.user_id) {
              const userActivities = await getUserActivities(
                "project",
                projectId,
              );
              const activities = await Promise.all(
                userActivities.map(async (activity) => {
                  const audits = await getRecordAudits(activity.activity_id);
                  activity.audits = audits;
                  return activity;
                }),
              );
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: activities }));
            } else {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "User not authorized to access the requested data",
                }),
              );
            }
          }
        } else {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User not authorized to access the requested data",
            }),
          );
        }
      } else if (url.match(/^\/api\/activities\/task\/.+/)) {
        const { readAllowed, readAllRecords } = await canRead(
          req.user.user_id,
          "activities",
        );
        const taskId = pathname.replace("/api/activities/task/", "");
        if (readAllowed) {
          if (readAllRecords) {
            const userActivities = await getUserActivities("task", taskId);
            const activities = await Promise.all(
              userActivities.map(async (activity) => {
                const audits = await getRecordAudits(activity.activity_id);
                activity.audits = audits;
                return activity;
              }),
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: activities }));
          } else {
            const task = await getTaskById(taskId);
            if (task[0].assigned_to === req.user.user_id) {
              const userActivities = await getUserActivities("task", taskId);
              const activities = await Promise.all(
                userActivities.map(async (activity) => {
                  const audits = await getRecordAudits(activity.activity_id);
                  activity.audits = audits;
                  return activity;
                }),
              );
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ result: activities }));
            } else {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "User not allowed to access the requested data",
                }),
              );
            }
          }
        } else {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "User is not allowed to access the requested data",
            }),
          );
        }
      }
    }
  } else if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  } else {
    res.writeHead(401);
    res.end(JSON.stringify({ messsage: "User not authenticated" }));
  }
}
