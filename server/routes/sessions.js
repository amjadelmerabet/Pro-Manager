import createSession from "../controllers/sessions/createSession.js";
import deleteSession from "../controllers/sessions/deleteSession.js";

export async function sessionsRoute(req, res) {
  const { method, url } = req;
  if (req.user) {
    if (method === "POST") {
      if (url === "/api/sessions/new") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          const { session, user } = JSON.parse(body);
          const newSession = await createSession(session, user);
          if (newSession.error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Something went wrong while creating a new session" }));
          } else {
            const sessionId = newSession?.rows[0].session_id;
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "New session created", session_id: sessionId }));
          }
        });
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Wrong endpoint" }));
      }
    } else if (method === "DELETE") {
      if (url === "/api/sessions/delete") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          const { id } = JSON.parse(body);
          const deletedSession = await deleteSession(id);
          if (deletedSession.error) {
            res.writeHead(500, { "Content-Tpye": "application/json" });
            res.end(
              JSON.stringify({
                message: "Something went wrong while deleting the session.",
              }),
            );
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Session deleted successfully" }),
            );
          }
        });
      }
    } else {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Bad request" }));
    }
  } else if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  } else {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User not authorized" }));
  }
}
