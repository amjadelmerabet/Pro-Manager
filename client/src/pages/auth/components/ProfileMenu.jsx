import { IconContext } from "react-icons/lib";
import "./ProfileMenu.css";
import { TbLock, TbLockOpen } from "react-icons/tb";

export default function ProfileMenu({
  selectedModule,
  setSelectedModule,
  securitySectionVisible,
}) {
  return (
    <div className="profile-menu">
      <div className="profile-menu-section">
        <div className="profile-menu-title poppins-semibold">Profile</div>
        <ul className="modules poppins-regular">
          <li
            className={
              "module" +
              (selectedModule === "account" ? " selected-module" : "")
            }
          >
            <span onClick={() => setSelectedModule("account")}>Account</span>
          </li>
          <div
            className={
              "module" +
              (selectedModule === "security" ? " selected-module" : "")
            }
          >
            <span onClick={() => setSelectedModule("security")}>
              Sign in & Security
              <IconContext.Provider
                value={{
                  style: {
                    color:
                      selectedModule === "security"
                        ? "rgb(45, 245, 120)"
                        : "rgb(25, 180, 65)",
                  },
                }}
              >
                {securitySectionVisible ? <TbLockOpen /> : <TbLock />}
              </IconContext.Provider>
            </span>
          </div>
          <li
            className={
              "module" +
              (selectedModule === "themes" ? " selected-module" : "")
            }
          >
            <span onClick={() => setSelectedModule("themes")}>Themes</span>
          </li>
          <li
            className={
              "module feature-disabled" +
              (selectedModule === "settings" ? " selected-module" : "")
            }
          >
            <span onClick={() => setSelectedModule("settings")}>Settings</span>
          </li>
        </ul>
      </div>
      <div className="profile-menu-section feature-disabled">
        <div className="profile-menu-title poppins-semibold">Dashboard</div>
        <ul className="modules poppins-regular">
          <li className="module">Widgets</li>
          <li className="module">Themes</li>
          <li className="module">Settings</li>
        </ul>
      </div>
      <div className="profile-menu-section feature-disabled">
        <div className="profile-menu-title poppins-semibold">Projects</div>
        <ul className="modules poppins-regular">
          <li className="module">Actions</li>
          <li className="module">Themes</li>
          <li className="module">Settings</li>
        </ul>
      </div>
      <div className="profile-menu-section feature-disabled">
        <div className="profile-menu-title poppins-semibold">Tasks</div>
        <ul className="modules poppins-regular">
          <li className="module">Actions</li>
          <li className="module">Themes</li>
          <li className="module">Settings</li>
        </ul>
      </div>
    </div>
  );
}
