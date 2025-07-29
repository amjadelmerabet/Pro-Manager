import "./ProfileMenu.css";

export default function ProfileMenu() {
  return (
    <div className="profile-menu">
      <div className="profile-menu-section">
        <div className="profile-menu-title poppins-semibold">Profile</div>
        <ul className="modules poppins-regular">
          <li className="module selected-module">Account</li>
          <li className="module">Themes</li>
          <li className="module">Settings</li>
        </ul>
      </div>
      <div className="profile-menu-section">
        <div className="profile-menu-title poppins-semibold">Dashboard</div>
        <ul className="modules poppins-regular">
          <li className="module">Widgets</li>
          <li className="module">Themes</li>
          <li className="module">Settings</li>
        </ul>
      </div>
      <div className="profile-menu-section">
        <div className="profile-menu-title poppins-semibold">Projects</div>
        <ul className="modules poppins-regular">
          <li className="module">Actions</li>
          <li className="module">Themes</li>
          <li className="module">Settings</li>
        </ul>
      </div>
      <div className="profile-menu-section">
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
