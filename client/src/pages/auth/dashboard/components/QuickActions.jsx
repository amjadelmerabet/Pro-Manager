import "./QuickActions.css";

export default function QuickActions({
  openNewTaskPopup,
  openNewProjectPopup,
  theme,
}) {
  return (
    <div
      className={
        "quick-actions" +
        (theme === "light" || theme === "" ? " light" : " dark")
      }
    >
      <h4 className="title poppins-bold">Quick actions</h4>
      <ul className="actions poppins-regular">
        <li className="action">
          <button
            className="poppins-regular"
            onClick={() => openNewTaskPopup()}
          >
            Create a new task
          </button>
        </li>
        <li className="action">
          <button
            className="poppins-regular"
            onClick={() => openNewProjectPopup()}
          >
            Create a new project
          </button>
        </li>
        <li className="action feature-disabled">
          <button className="poppins-regular">Complete today's tasks</button>
        </li>
      </ul>
    </div>
  );
}
