import { TbFolderOpen, TbSquareCheck } from "react-icons/tb";
import { IconContext } from "react-icons/lib";

import "./SelectedPage.css";

export default function SelectedPage({
  selectedPage,
  user,
  updatedMessageUtil,
}) {
  return (
    <div className="selected">
      <div className="selected-page-header poppins-bold">
        <IconContext.Provider
          value={{ style: { color: "white", fontSize: "24px" } }}
        >
          {selectedPage.type === "project" ? (
            <TbFolderOpen />
          ) : (
            <TbSquareCheck />
          )}
        </IconContext.Provider>
        <div className="selected-page-title">{selectedPage.name}</div>
      </div>
      <table className="selected-page-details">
        <tbody>
          <tr>
            <td className="property poppins-semibold">Status</td>
            <td className="value poppins-regular">
              {selectedPage.state === 1
                ? selectedPage.type === "project"
                  ? "Not started"
                  : "To do"
                : selectedPage.state === 2
                  ? selectedPage.type === "project"
                    ? "In progress"
                    : "Doing"
                  : selectedPage.type === "project"
                    ? "Completed"
                    : "Done"}
            </td>
          </tr>
          <tr>
            <td className="property poppins-semibold">Assigned to</td>
            <td className="value poppins-regular">
              {selectedPage.type === "project"
                ? selectedPage.owner === user
                  ? "You"
                  : selectedPage.owner
                : selectedPage.assigned_to === user
                  ? "You"
                  : selectedPage.assigned_to}
            </td>
          </tr>
          <tr>
            <td className="property poppins-semibold">Updated</td>
            <td className="value poppins-regular">
              {updatedMessageUtil(new Date(selectedPage.updated_on))}
            </td>
          </tr>
          <tr>
            <td className="property poppins-semibold">Updated by</td>
            <td className="value poppins-regular">
              {selectedPage.updated_by === user
                ? "You"
                : selectedPage.updated_by}
            </td>
          </tr>
          <tr>
            <td className="property poppins-semibold">Created</td>
            <td className="value poppins-regular">
              {updatedMessageUtil(new Date(selectedPage.created_on))}
            </td>
          </tr>
          <tr>
            <td className="property poppins-semibold">Created by</td>
            <td className="value poppins-regular">
              {selectedPage.created_by === user
                ? "You"
                : selectedPage.created_by}
            </td>
          </tr>
          {selectedPage.type === "project" ? (
            <tr>
              <td className="property poppins-semibold">Deadline</td>
              <td className="value poppins-regular">
                {`${
                  new Date(selectedPage.deadline).getDate().toString()
                    .length === 1
                    ? "0"
                    : ""
                }${new Date(selectedPage.deadline).getDate()}/${
                  new Date(selectedPage.deadline).getMonth().toString()
                    .length === 1
                    ? "0"
                    : ""
                }${new Date(selectedPage.deadline).getMonth()}/${new Date(
                  selectedPage.deadline
                ).getFullYear()}`}
              </td>
            </tr>
          ) : (
            <tr>
              <td className="property poppins-semibold">Priority</td>
              <td className="value poppins-regular">
                {selectedPage.priority === 1
                  ? "High"
                  : selectedPage.priority === 2
                    ? "Medium"
                    : "Low"}
              </td>
            </tr>
          )}
          {selectedPage.type === "task" ? (
            <tr>
              <td className="property poppins-semibold" colSpan={2}>
                Short description
              </td>
            </tr>
          ) : (
            ""
          )}
          {selectedPage.type === "task" ? (
            <tr>
              <td
                className="value short-description poppins-regular"
                colSpan={2}
              >
                {selectedPage.short_description}
              </td>
            </tr>
          ) : (
            ""
          )}
          <tr>
            <td className="property poppins-semibold" colSpan={2}>
              Description
            </td>
          </tr>
          <tr>
            <td className="value description poppins-regular" colSpan={2}>
              {selectedPage.description}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
