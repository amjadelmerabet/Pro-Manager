import { FaRegCheckSquare, FaRegFolder } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { Link } from "react-router";

import "./RecentPage.css";

export default function RecentPage({
  type,
  recentPage,
  selectedPage,
  setSelectedPage,
  createPageName,
  user,
  updatedStatus,
  createdStatus,
}) {
  if (type === "project") {
    return (
      <div
        key={recentPage.project_id}
        className={
          "recent-page" +
          (selectedPage.project_id === recentPage.project_id
            ? " selected-recent-page"
            : "")
        }
        onClick={() => setSelectedPage({ ...recentPage, type: "project" })}
      >
        <div className="page-header">
          <IconContext.Provider
            value={{
              style: { color: "var(--primary-color)" },
            }}
          >
            <FaRegFolder />
          </IconContext.Provider>
          <div className="title">{createPageName(recentPage.name)}</div>
        </div>
        <table className="details">
          <tbody>
            <tr>
              <td className="property poppins-semibold">Status</td>
              <td className="value">
                {recentPage.state === 1
                  ? "Not started"
                  : recentPage.state === 2
                    ? "In progress"
                    : "Completed"}
              </td>
            </tr>
            <tr>
              <td className="property poppins-semibold">Owner</td>
              <td className="value">
                {recentPage.owner === user ? "You" : recentPage.owner}
              </td>
            </tr>
            <tr>
              <td className="property poppins-semibold">Updated</td>
              <td className="value">{updatedStatus}</td>
            </tr>
            <tr>
              <td className="property poppins-semibold">Updated by</td>
              <td className="value">
                {recentPage.updated_by === user ? "You" : recentPage.updated_by}
              </td>
            </tr>
            <tr>
              <td className="property poppins-semibold">Created</td>
              <td className="value">{createdStatus}</td>
            </tr>
          </tbody>
        </table>
        <div className="links">
          <Link
            to={`/auth/${user}/project/${recentPage.project_id}?view=dashboard`}
            className="open-link poppins-regular-italic"
          >
            Click to open
          </Link>
        </div>
      </div>
    );
  } else if (type === "task") {
    return (
      <div
        key={recentPage.task_id}
        className={
          "recent-page" +
          (selectedPage.task_id === recentPage.task_id
            ? " selected-recent-page"
            : "")
        }
        onClick={() => {
          setSelectedPage({ ...recentPage, type: "task" });
        }}
      >
        <div className="page-header">
          <IconContext.Provider
            value={{
              style: { color: "var(--primary-color)" },
            }}
          >
            <FaRegCheckSquare />
          </IconContext.Provider>
          <div className="title">{createPageName(recentPage.name)}</div>
        </div>
        <table className="details">
          <tbody>
            <tr>
              <td className="property poppins-semibold">Status</td>
              <td className="value">
                {recentPage.state === 1
                  ? "To do"
                  : recentPage.state === 2
                    ? "Doing"
                    : "Done"}
              </td>
            </tr>
            <tr>
              <td className="property poppins-semibold">Assigned to</td>
              <td className="value">
                {recentPage.assigned_to === user
                  ? "You"
                  : recentPage.assigned_to}
              </td>
            </tr>
            <tr>
              <td className="property poppins-semibold">Updated</td>
              <td className="value">{updatedStatus}</td>
            </tr>
            <tr>
              <td className="property poppins-semibold">Updated by</td>
              <td className="value">
                {recentPage.updated_by === user ? "You" : recentPage.updated_by}
              </td>
            </tr>
            <tr>
              <td className="property poppins-semibold">Created</td>
              <td className="value">{createdStatus}</td>
            </tr>
          </tbody>
        </table>
        <div className="links">
          <Link
            to={`/auth/${user}/task/${recentPage.task_id}?view=dashboard`}
            className="open-link poppins-regular-italic"
          >
            Click to open
          </Link>
        </div>
      </div>
    );
  }
}
