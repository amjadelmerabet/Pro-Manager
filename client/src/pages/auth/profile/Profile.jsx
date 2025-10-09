import AuthHeader from "../components/AuthHeader";
import ProfileMenu from "../components/ProfileMenu";
import { FaPencilAlt } from "react-icons/fa";
import NetherlandsFlag from "../../../assets/netherlands-flag.webp";

import "./Profile.css";
import ProfileActions from "../components/ProfileActions";

export default function ProfilePage({ user, setAuthentication }) {
  return (
    <div className="profile-page">
      <div className="auth-header-container">
        <AuthHeader user={user} setAuthentication={setAuthentication} />
      </div>
      <ProfileActions />
      <div className="profile-page-container">
        <ProfileMenu />
        <main>
          <div className="profile-section">
            <h2 className="section-title poppins-bold">Profile</h2>
            <div className="profile-settings">
              <table>
                <tbody>
                  <tr>
                    <td className="property poppins-bold">First name</td>
                    <td className="value poppins-regular readonly">Jack</td>
                  </tr>
                  <tr>
                    <td className="property poppins-bold">Last name</td>
                    <td className="value poppins-regular readonly">Herztog</td>
                  </tr>
                  <tr>
                    <td className="property poppins-bold">Phone</td>
                    <td className="value poppins-regular readonly">
                      +31 98 06 93 88
                    </td>
                  </tr>
                  <tr>
                    <td className="property poppins-bold">Country</td>
                    <td className="value poppins-regular readonly">
                      <div className="text-value">Netherlands</div>
                      <img
                        src={NetherlandsFlag}
                        alt="Country Flag"
                        className="country-flag"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="property poppins-bold">City</td>
                    <td className="value poppins-regular readonly">
                      Amsterdam
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="edit">
                <button className="edit-button poppins-semibold">
                  <FaPencilAlt />
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div className="themes-section">
            <h2 className="section-title poppins-bold">Themes</h2>
            <div className="theme-settings">
              <div className="theme-picker">
                <div className="title poppins-bold">Theme picker</div>
                <ul className="themes">
                  <li className="theme poppins-bold selected-theme">Default</li>
                  <li className="theme"></li>
                  <li className="theme"></li>
                  <li className="theme"></li>
                  <li className="theme"></li>
                  <li className="theme"></li>
                </ul>
              </div>
              <div className="customized-theme">
                <div className="enable-custom-theme">
                  <input
                    type="checkbox"
                    name="customize-theme"
                    id="customize-theme"
                  />
                  <label
                    htmlFor="customize-theme"
                    className="customize-theme-label poppins-semibold"
                  >
                    Customize
                  </label>
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td className="property poppins-regular">Font color</td>
                      <td className="value">
                        <div className="font-color"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="property poppins-regular">
                        Background color
                      </td>
                      <td className="value">
                        <div className="background-color"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="property poppins-regular">Header color</td>
                      <td className="value">
                        <div className="header-color"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="edit">
                  <button className="edit-button poppins-semibold">
                    <FaPencilAlt />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
