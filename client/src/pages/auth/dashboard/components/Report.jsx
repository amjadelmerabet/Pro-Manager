import { Link } from "react-router";

import "./Report.css";

export default function Report({ name, type, user, value, state, theme }) {
  if (type === "project") {
    return (
      <div
        className={
          "report" + (theme === "light" || theme === "" ? " light" : " dark")
        }
      >
        <div className="report-title poppins-bold">{name}</div>
        <div className="report-value poppins-bold">{value}</div>
        <div className="report-link poppins-regular-italic">
          <Link to={`/auth/${user}/projects?filter=state=${state}`}>
            Show the list
          </Link>
        </div>
      </div>
    );
  } else if (type === "task") {
    return (
      <div
        className={
          "report" + (theme === "light" || theme === "" ? " light" : " dark")
        }
      >
        <div className="report-title poppins-bold">{name}</div>
        <div className="report-value poppins-bold">{value}</div>
        <div className="report-link poppins-regular-italic">
          <Link to={`/auth/${user}/tasks?filter=state=${state}`}>
            Show the list
          </Link>
        </div>
      </div>
    );
  }
}
