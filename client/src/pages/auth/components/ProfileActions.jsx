import { FaRegUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BsSliders } from "react-icons/bs";
import { TbTriangleFilled } from "react-icons/tb";
import { IconContext } from "react-icons/lib";

import "./ProfileActions.css";

export default function ProfileActions() {
  return <div className="profile-actions">
    <IconContext.Provider value={{ style: { color: "var(--primary-color)", fontSize: "24px" }}}>
      <TbTriangleFilled className="arrow" />
    </IconContext.Provider>
    <ul className="actions">
      <li className="action">
        <IconContext.Provider value={{ style: { color: "var(--primary-color)", fontSize: "20px" }}}>
          <FaRegUserCircle />
        </IconContext.Provider>
          <span className="poppins-semibold">My profile</span>
      </li>
      <li className="action notification poppins-semibold">
        <IconContext.Provider value={{ style: { color: "var(--primary-color)", fontSize: "20px" }}}>
          <IoMdNotificationsOutline />
        </IconContext.Provider>
        <span className="poppins-semibold">Notifications</span>
      </li>
      <li className="action">
        <IconContext.Provider value={{ style: { color: "var(--primary-color)", fontSize: "20px" }}}>
          <IoSettingsOutline />
        </IconContext.Provider>
        <span className="poppins-semibold">Settings</span>
      </li>
      <li className="action">
        <IconContext.Provider value={{ style: { color: "var(--primary-color)", fontSize: "20px" }}}>
          <BsSliders />
        </IconContext.Provider>
        <span className="poppins-semibold">Customizations</span>
      </li>
    </ul>
  </div>
}