import AuthHeader from "../components/AuthHeader";
import SectionHeader from "../components/SectionHeader";

import "./Tasks.css";

export default function TasksPage() {
  return <div className="tasks-page">
    <div className="auth-header-container">
      <AuthHeader />
    </div>
    <div className="container">
      <SectionHeader title="Your tasks" selectedView="list" />
      <ul className="tasks">
        <li className="task">
          <div className="task-name poppins-regular">Finish the English grammar homework</div>
          <div className="properties">
            <div className="assignee">
              <div className="property-name poppins-semibold">Assigned to</div>
              <div className="property-value poppins-regular">You</div>
            </div>
            <div className="status">
              <div className="property-name poppins-semibold">State</div>
              <div className="property-value poppins-regular">Doing</div>
            </div>
          </div>
        </li>
        <li className="task">
          <div className="task-name poppins-regular">Design the landing page of the E-shop application</div>
          <div className="properties">
            <div className="assignee">
              <div className="property-name poppins-semibold">Assigned to</div>
              <div className="property-value poppins-regular">Kim</div>
            </div>
            <div className="status">
              <div className="property-name poppins-semibold">State</div>
              <div className="property-value poppins-regular">Doing</div>
            </div>
          </div>
        </li>
        <li className="task">
          <div className="task-name poppins-regular">Finish writing the first chapter of my book</div>
          <div className="properties">
            <div className="assignee">
              <div className="property-name poppins-semibold">Assigned to</div>
              <div className="property-value poppins-regular">You</div>
            </div>
            <div className="status">
              <div className="property-name poppins-semibold">State</div>
              <div className="property-value poppins-regular">Done</div>
            </div>
          </div>
        </li>
        <li className="task">
          <div className="task-name poppins-regular">Test the new API that retrieves the users from DB</div>
          <div className="properties">
            <div className="assignee">
              <div className="property-name poppins-semibold">Assigned to</div>
              <div className="property-value poppins-regular">Kim</div>
            </div>
            <div className="status">
              <div className="property-name poppins-semibold">State</div>
              <div className="property-value poppins-regular">To do</div>
            </div>
          </div>
        </li>
        <li className="task">
          <div className="task-name poppins-regular">Make the wireframes for all the necessary pages of the website</div>
          <div className="properties">
            <div className="assignee">
              <div className="property-name poppins-semibold">Assigned to</div>
              <div className="property-value poppins-regular">You</div>
            </div>
            <div className="status">
              <div className="property-name poppins-semibold">State</div>
              <div className="property-value poppins-regular">Done</div>
            </div>
          </div>
        </li>
        <li className="task">
          <div className="task-name poppins-regular">Finish the first chapter of JavaScript the crash course</div>
          <div className="properties">
            <div className="assignee">
              <div className="property-name poppins-semibold">Assigned to</div>
              <div className="property-value poppins-regular">You</div>
            </div>
            <div className="status">
              <div className="property-name poppins-semibold">State</div>
              <div className="property-value poppins-regular">Done</div>
            </div>
          </div>
        </li>
        <li className="task">
          <div className="task-name poppins-regular">Finish the Math homework</div>
          <div className="properties">
            <div className="assignee">
              <div className="property-name poppins-semibold">Assigned to</div>
              <div className="property-value poppins-regular">You</div>
            </div>
            <div className="status">
              <div className="property-name poppins-semibold">State</div>
              <div className="property-value poppins-regular">Done</div>
            </div>
          </div>
        </li>
        <li className="task">
          <div className="task-name poppins-regular">Finish the Spanish grammar homework</div>
          <div className="properties">
            <div className="assignee">
              <div className="property-name poppins-semibold">Assigned to</div>
              <div className="property-value poppins-regular">You</div>
            </div>
            <div className="status">
              <div className="property-name poppins-semibold">State</div>
              <div className="property-value poppins-regular">Doing</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
}