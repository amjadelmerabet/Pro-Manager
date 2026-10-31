import { Link } from "react-router";

import "./Report.css";

export default function Report({
  name,
  type,
  user,
  value,
  state,
  theme,
  workspace,
}) {
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
          <Link
            to={`/auth/${user}/classic/workspace/${workspace}/projects?filter=state=${state}`}
          >
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
          <Link
            to={`/auth/${user}/classic/workspace/${workspace}/tasks?filter=state=${state}`}
          >
            Show the list
          </Link>
        </div>
      </div>
    );
  }
}
