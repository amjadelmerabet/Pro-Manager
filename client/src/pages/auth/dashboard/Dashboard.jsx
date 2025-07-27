import { FaRegCheckSquare, FaRegFolder } from "react-icons/fa";
import AllMenu from "../components/AllMenu";
import AuthHeader from "../components/AuthHeader";

import "./Dashboard.css";
import { IconContext } from "react-icons/lib";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="auth-header-container">
        <AuthHeader />
      </div>
      <div className="dashboard-container">
        <AllMenu />
        <main>
          <div className="column-1">
            <div className="recent-pages">
              <h4 className="section-title poppins-bold">Recent pages</h4>
              <div className="pages poppins-regular">
                <div className="page selected-recent-page">
                  <div className="page-header">
                    <IconContext.Provider
                      value={{ style: { color: "var(--primary-color)" } }}
                    >
                      <FaRegCheckSquare />
                    </IconContext.Provider>
                    <div className="title">Finish the first chapter ...</div>
                  </div>
                  <table className="details">
                    <tr>
                      <td className="property poppins-bold">Status</td>
                      <td className="value">Doing</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Assigned to</td>
                      <td className="value">You</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Updated at</td>
                      <td className="value">Yesterday</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Updated by</td>
                      <td className="value">You</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Created at</td>
                      <td className="value">12/20/2024</td>
                    </tr>
                  </table>
                  <div className="links">
                    <a href="#" className="open-link poppins-regular-italic">
                      Click to open
                    </a>
                  </div>
                </div>
                <div className="page">
                  <div className="page-header">
                    <IconContext.Provider
                      value={{ style: { color: "var(--primary-color)" } }}
                    >
                      <FaRegFolder />
                    </IconContext.Provider>
                    <div className="title">English class</div>
                  </div>
                  <table className="details">
                    <tr>
                      <td className="property poppins-bold">Status</td>
                      <td className="value">In progress</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Category</td>
                      <td className="value">Homework</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Updated at</td>
                      <td className="value">Yesterday</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Updated by</td>
                      <td className="value">You</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Created at</td>
                      <td className="value">12/20/2024</td>
                    </tr>
                  </table>
                  <div className="links">
                    <a href="#" className="open-link poppins-regular-italic">
                      Click to open
                    </a>
                  </div>
                </div>
                <div className="page">
                  <div className="page-header">
                    <IconContext.Provider
                      value={{ style: { color: "var(--primary-color)" } }}
                    >
                      <FaRegCheckSquare />
                    </IconContext.Provider>
                    <div className="title">Setup Node JS on my ...</div>
                  </div>
                  <table className="details">
                    <tr>
                      <td className="property poppins-bold">Status</td>
                      <td className="value">Done</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Assigned to</td>
                      <td className="value">Aiden Kim</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Updated at</td>
                      <td className="value">Last Friday</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Updated by</td>
                      <td className="value">You</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Created at</td>
                      <td className="value">01/05/2025</td>
                    </tr>
                  </table>
                  <div className="links">
                    <a href="#" className="open-link poppins-regular-italic">
                      Click to open
                    </a>
                  </div>
                </div>
                <div className="page">
                  <div className="page-header">
                    <IconContext.Provider
                      value={{ style: { color: "var(--primary-color)" } }}
                    >
                      <FaRegCheckSquare />
                    </IconContext.Provider>
                    <div className="title">Database modeling</div>
                  </div>
                  <table className="details">
                    <tr>
                      <td className="property poppins-bold">Status</td>
                      <td className="value">Doing</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Assigned to</td>
                      <td className="value">Aiden Kim</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Updated at</td>
                      <td className="value">02/25/2025</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Updated by</td>
                      <td className="value">Aiden Kim</td>
                    </tr>
                    <tr>
                      <td className="property poppins-bold">Created at</td>
                      <td className="value">02/20/2025</td>
                    </tr>
                  </table>
                  <div className="links">
                    <a href="#" className="open-link poppins-regular-italic">
                      Click to open
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="reports">
              <div className="report">
                <div className="report-title poppins-bold">
                  Projects in progress
                </div>
                <div className="report-value poppins-bold">8</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">
                  Tasks assigned to you
                </div>
                <div className="report-value poppins-bold">23</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">Today's tasks</div>
                <div className="report-value poppins-bold">5</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">
                  Tasks for this week
                </div>
                <div className="report-value poppins-bold">13</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">Inbox</div>
                <div className="report-value poppins-bold">7</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
              <div className="report">
                <div className="report-title poppins-bold">Completed tasks</div>
                <div className="report-value poppins-bold">45</div>
                <div className="report-link poppins-regular-italic">
                  <a href="#">Show the list</a>
                </div>
              </div>
            </div>
            <div className="quick-actions">
              <h4 className="title poppins-bold">Quick actions</h4>
              <ul className="actions poppins-regular">
                <li className="action">
                  <a href="#">Create a new task</a>
                </li>
                <li className="action">
                  <a href="#">Create a new project</a>
                </li>
                <li className="action">
                  <a href="#">Complete today's tasks</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="column-2">
            <div className="selected">
              <div className="selected-page-header poppins-bold">
                <IconContext.Provider value={{ style: { color: "white", fontSize: "20px" } }}>
                  <FaRegCheckSquare />
                </IconContext.Provider>
                <div className="selected-page-title">
                  Finish the first chapter of grammar
                </div>
              </div>
              <table className="selected-page-details">
                <tr>
                  <td className="property poppins-bold">Status</td>
                  <td className="value poppins-regular">Doing</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Assigned to</td>
                  <td className="value poppins-regular">You</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Updated at</td>
                  <td className="value poppins-regular">Yesterday</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Updated by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created at</td>
                  <td className="value poppins-regular">12/20/2024</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">Aiden Kim</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Priority</td>
                  <td className="value poppins-regular">High</td>
                </tr>
                <tr>
                  <td className="property poppins-bold" colSpan={2}>Description</td>
                </tr>
                <tr>
                  <td className="value poppins-regular" colSpan={2}>
                    "Finish the first chapter of grammar" involves reading,
                    understanding, and completing all exercises or examples in
                    the first chapter of a grammar book or study material. Focus
                    on key concepts, definitions, and rules presented in the
                    chapter. Ensure you practice any included questions or
                    assignments to solidify your understanding. Mark the chapter
                    as complete once you're confident with the material.
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
