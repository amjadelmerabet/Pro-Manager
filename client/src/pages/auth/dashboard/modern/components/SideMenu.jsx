import { useNavigate } from "react-router";
import "./SideMenu.css";

export default function SideMenu({
  user,
  previewModernUI,
  setPreviewModernUI,
  recentWork,
}) {
  let navigate = useNavigate();

  const switchUI = () => {
    setPreviewModernUI(false);
    navigate(`/auth/${user}/classic/dashboard`);
    sessionStorage.setItem("modern-ui", false);
  };

  return (
    <div className="side-menu poppins-regular">
      <div className="app-title poppins-bold">Pro Manager</div>
      <input
        type="text"
        className="search-box poppins-thin"
        placeholder="Search for something ..."
      />
      <div className="sections">
        <div className="section">
          <ul className="section-menu">
            <li className="section-menu-item">Organization</li>
            <li className="section-menu-item">Workspaces</li>
            <li className="section-menu-item">Settings</li>
          </ul>
        </div>
        <div className="section">
          <div className="section-title poppins-medium">Workspace</div>
          <ul className="section-menu">
            <li className="section-menu-item">Team</li>
            <li className="section-menu-item">Projects</li>
            <li className="section-menu-item">Tasks</li>
          </ul>
        </div>
        <div className="section">
          <div className="section-title poppins-medium">Favorites</div>
          <ul className="section-menu">
            <li className="section-menu-item">My projects</li>
            <li className="section-menu-item">My tasks</li>
            <li className="section-menu-item">Open tasks</li>
          </ul>
        </div>
        <div className="section recent-work">
          <div className="section-title poppins-medium">Recents</div>
          <ul className="section-menu">
            {recentWork.map((item, index) => {
              let recentPage = item.slice(0, 23) + " ...";
              return (
                <li className="section-menu-item" key={index}>
                  {recentPage}
                </li>
              );
            })}
          </ul>
        </div>
        <button
          className="switch-to-classic-ui poppins-medium"
          onClick={() => switchUI()}
        >
          Go back to Classic
        </button>
        {/* <div className="switch-ui poppins-regular">
          <h3 className="switch-ui-title poppins-bold">Switch UI</h3>
          <div className="classic-ui">
            <input
              type="radio"
              name="dashboard-ui-picker"
              id="classic-ui"
              value="classic"
              checked={!previewModernUI}
              onChange={(e) => switchUI(e.target.value)}
            />
            <label htmlFor="classic" className="classic-ui-label">
              Classic
            </label>
          </div>
          <div className="modern-ui">
            <input
              type="radio"
              name="dashboard-ui-picker"
              id="modern-ui"
              value="modern"
              checked={previewModernUI}
              onChange={(e) => switchUI(e.target.value)}
            />
            <label htmlFor="modern" className="modern-ui-label">
              Modern
            </label>
          </div>
        </div> */}
        <button className="logout poppins-medium">Log out</button>
      </div>
    </div>
  );
}
