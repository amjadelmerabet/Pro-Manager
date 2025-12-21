// Hooks
import { useEffect, useState } from "react";

// Components
import AuthHeader from "../components/AuthHeader";
import ProfileMenu from "../components/ProfileMenu";

// Assets
import NetherlandsFlag from "../../../assets/netherlands-flag.webp";

// Icons
import { FaPencilAlt } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router";
import { BiSave } from "react-icons/bi";

// Utils
import getUserUtil from "./utils/getUserUtil";
import updateUserUtil from "./utils/updateUserUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import saveUserCredentialsUtil from "./utils/saveUserCredentialsUtil";
import authUserAPI from "../../../api/users/authUserAPI";

// Styles
import "./Profile.css";

export default function ProfilePage({ user, userId, setAuthentication }) {
  const [userObject, setUserObject] = useState({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileUpdates, setProfileUpdates] = useState({});
  const [updateProfile, setUpdateProfile] = useState(false);
  const [userUpdated, setUserUpdated] = useState(0);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [tries, setTries] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [selectedModule, setSelectedModule] = useState("account");
  const [userDetailsFetched, setUserDetailsFetched] = useState(false);
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [securitySectionVisible, setSecuritySectionVisible] = useState(false);
  const [signInFormVisible, setSignInFormVisible] = useState(false);
  const [signInUsername, setSignInUesrname] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [credentialsUpdated, setCredentialsUpdated] = useState(false);
  const [usernameUpdated, setUsernameUpdated] = useState(false);
  const [showCredentialsSavedPopup, setShowCredentialsSavedPopup] =
    useState(false);

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  let navigate = useNavigate();

  useEffect(() => {
    getUserUtil(
      usernameUpdated ? username : user,
      token,
      setUserObject,
      tokenValidated,
      setTokenValidated,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setUserDetailsFetched
    );
  }, [userUpdated]);

  useEffect(() => {
    if (updateProfile) {
      updateUserUtil(
        user,
        profileUpdates,
        token,
        userUpdated,
        setUserUpdated,
        setEditingProfile,
        tokenValidated,
        setTokenValidated,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken
      );
    }
  }, [updateProfile]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getAccessTokenUtil(
        user,
        userId,
        setTokenValidated,
        setTries,
        newAccessToken,
        setUpdateProfile,
        userUpdated,
        setUserUpdated
      );
    }
  }, [newAccessToken]);

  useEffect(() => {
    if (selectedModule === "security") {
      setTimeout(() => {
        setSignInFormVisible(true);
      }, 250);
    } else {
      setSignInFormVisible(false);
    }
  }, [selectedModule]);

  useEffect(() => {
    if (userDetailsFetched) {
      setUsername(userObject.username);
    }
  }, [userDetailsFetched]);

  const editProfile = () => {
    const { first_name, last_name, email } = userObject;
    setProfileUpdates({
      first_name,
      last_name,
      email,
    });
    setEditingProfile(true);
  };

  const confirmProfileEdit = () => {
    setProfileUpdates({
      ...profileUpdates,
      updated_by: userId,
      name: profileUpdates.first_name + " " + profileUpdates.last_name,
    });
    setUpdateProfile(updateProfile + 1);
  };

  const cancelProfileEdit = () => {
    setEditingProfile(false);
  };

  const handleSignIn = async (username, password) => {
    if (userObject.username === username) {
      const authUser = await authUserAPI(username, password);
      if (authUser.authenticated) {
        setSecuritySectionVisible(true);
        setSignInFormVisible(false);
        setSignInUesrname("");
        setSignInPassword("");
        setTimeout(() => {
          setSecuritySectionVisible(false);
          setTimeout(() => {
            setSignInFormVisible(true);
          }, 250);
        }, [900000]);
      } else {
        setInvalidCredentials(true);
      }
    } else {
      setInvalidCredentials(true);
    }
  };

  useEffect(() => {
    if (credentialsUpdated) {
      saveUserCredentialsUtil(
        updatePassword,
        userObject,
        currentPassword,
        username,
        newPassword,
        token,
        tokenValidated,
        setTokenValidated,
        user,
        userId,
        tries,
        setTries,
        newAccessToken,
        setNewAccessToken,
        userUpdated,
        setUserUpdated,
        setUsernameUpdated
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  }, [credentialsUpdated]);

  const saveCredentials = () => {
    setCredentialsUpdated(true);
    setTimeout(() => {
      setShowCredentialsSavedPopup(true);
      setTimeout(() => {
        setShowCredentialsSavedPopup(false);
      }, 3000);
      setTimeout(() => {
        setCredentialsUpdated(false);
      }, 3500);
    }, 250);
    setTimeout(async () => {
      await updateAuthCredntials();
    }, 250);
  };

  const updateAuthCredntials = async () => {
    const authUser = JSON.parse(sessionStorage.getItem("authUser"));
    authUser.user = username;
    sessionStorage.setItem("authUser", JSON.stringify(authUser));
    const refreshToken = await cookieStore.get(user);
    cookieStore.delete(user);
    let refreshTokenExpiresIn = new Date();
    refreshTokenExpiresIn.setHours(refreshTokenExpiresIn.getHours() + 24 * 7);
    await cookieStore.set({
      name: username,
      value: refreshToken.value,
      expires: refreshTokenExpiresIn,
      path: "/",
      secure: true,
      sameSite: "strict",
    });
    navigate(`/auth/${username}/profile`);
  };

  return (
    <div className="profile-page">
      <div className="auth-header-container">
        <AuthHeader user={user} setAuthentication={setAuthentication} />
      </div>
      <div className="profile-page-container">
        <ProfileMenu
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          securitySectionVisible={securitySectionVisible}
        />
        <main>
          <div className="profile-section">
            <h2 className="section-title poppins-bold">Profile</h2>
            {selectedModule === "account" ? (
              <div className="module">
                <h3 className="module-title poppins-semibold">Account</h3>
                <div className="settings profile-settings">
                  <table>
                    <tbody>
                      <tr>
                        <td className="property poppins-semibold">Username</td>
                        <td className="value poppins-regular readonly">
                          {userObject.username}
                        </td>
                      </tr>
                      <tr>
                        <td className="property poppins-semibold">
                          First name
                        </td>
                        <td
                          className={
                            "value poppins-regular" +
                            (!editingProfile ? " readonly" : "")
                          }
                        >
                          {!editingProfile ? (
                            userObject.first_name
                          ) : (
                            <input
                              type="text"
                              name="first-name-edit"
                              value={profileUpdates.first_name}
                              onChange={(event) =>
                                setProfileUpdates({
                                  ...profileUpdates,
                                  first_name: event.target.value,
                                })
                              }
                              className="first-name-edit poppins-regular"
                            />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="property poppins-semibold">Last name</td>
                        <td
                          className={
                            "value poppins-regular" +
                            (!editingProfile ? " readonly" : "")
                          }
                        >
                          {!editingProfile ? (
                            userObject.last_name
                          ) : (
                            <input
                              type="text"
                              name="last-name-edit"
                              value={profileUpdates.last_name}
                              onChange={(event) =>
                                setProfileUpdates({
                                  ...profileUpdates,
                                  last_name: event.target.value,
                                })
                              }
                              className="last-name-edit poppins-regular"
                            />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="property poppins-semibold">Email</td>
                        <td
                          className={
                            "value poppins-regular" +
                            (!editingProfile ? " readonly" : "")
                          }
                        >
                          {!editingProfile ? (
                            userObject.email
                          ) : (
                            <input
                              type="text"
                              name="email-edit"
                              value={profileUpdates.email}
                              onChange={(event) =>
                                setProfileUpdates({
                                  ...profileUpdates,
                                  email: event.target.value,
                                })
                              }
                              className="email-edit poppins-regular"
                            />
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="property poppins-semibold">Phone</td>
                        <td className="value poppins-regular readonly">
                          +31 98 06 93 88
                        </td>
                      </tr>
                      <tr>
                        <td className="property poppins-semibold">Country</td>
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
                        <td className="property poppins-semibold">City</td>
                        <td className="value poppins-regular readonly">
                          Amsterdam
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="edit">
                    {!editingProfile ? (
                      <button
                        className="edit-button poppins-semibold"
                        onClick={() => editProfile()}
                      >
                        <FaPencilAlt />
                        Edit
                      </button>
                    ) : (
                      <div className="controls">
                        <button
                          className="confirm-edit poppins-regular"
                          onClick={() => confirmProfileEdit()}
                        >
                          Confirm
                        </button>
                        <button
                          className="cancel-edit poppins-regular"
                          onClick={() => cancelProfileEdit()}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : selectedModule === "themes" ? (
              <div className="module">
                <h3 className="module-title poppins-semibold">Themes</h3>
                <div className="settings theme-settings">
                  <div className="theme-picker">
                    <div className="title poppins-bold">Theme picker</div>
                    <ul className="themes">
                      <li className="theme poppins-bold selected-theme">
                        Default
                      </li>
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
                          <td className="property poppins-regular">
                            Font color
                          </td>
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
                          <td className="property poppins-regular">
                            Header color
                          </td>
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
            ) : selectedModule === "security" ? (
              securitySectionVisible ? (
                <div className="module">
                  <h3 className="module-title poppins-semibold">
                    Sign in & Security
                  </h3>
                  <div className="settings security-settings">
                    <form className="poppins-regular">
                      <div>
                        <label htmlFor="username" className="poppins-semibold">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className="poppins-regular"
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="update-password"
                          className="poppins-semibold"
                        >
                          Update password
                        </label>
                        <div className="update-password-checkbox-div">
                          <input
                            type="checkbox"
                            name="update-password"
                            id="update-password"
                            className="update-password-checkbox"
                            onChange={(event) =>
                              setUpdatePassword(event.target.checked)
                            }
                          />
                        </div>
                      </div>
                      {updatePassword ? (
                        <div className="update-password-section">
                          <div>
                            <label
                              htmlFor="current-password"
                              className="poppins-semibold"
                            >
                              Current password
                            </label>
                            <input
                              type="password"
                              name="current-password"
                              id="current-password"
                              className="poppins-regular"
                              value={currentPassword}
                              onChange={(event) =>
                                setCurrentPassword(event.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="new-password"
                              className="poppins-semibold"
                            >
                              New password
                            </label>
                            <input
                              type="password"
                              name="new-password"
                              id="new-password"
                              className="poppins-regular"
                              value={newPassword}
                              onChange={(event) =>
                                setNewPassword(event.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="confirm-new-password"
                              className="poppins-semibold"
                            >
                              Confirm new password
                            </label>
                            <input
                              type="password"
                              name="confirm-new-password"
                              id="confirm-new-password"
                              className="poppins-regular"
                              value={confirmNewPassword}
                              onChange={() => setConfirmNewPassword()}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <input
                        type="button"
                        value="Save"
                        className="save-credentials-button poppins-bold"
                        onClick={() => saveCredentials()}
                      />
                    </form>
                    <div
                      className={
                        "credentials-saved poppins-regular" +
                        (credentialsUpdated ? " visible" : "") +
                        (showCredentialsSavedPopup ? " popup" : "")
                      }
                    >
                      <IconContext.Provider
                        value={{
                          style: {
                            color: "rgb(0, 245, 165)",
                            fontSize: "20px",
                          },
                        }}
                      >
                        <BiSave />
                      </IconContext.Provider>
                      <span>Credentials saved</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="signin-required">
                  <form
                    className={
                      "poppins-regular" + (signInFormVisible ? " visible" : "")
                    }
                  >
                    <IconContext.Provider
                      value={{
                        style: {
                          color: "var(--primary-color)",
                          fontSize: "32px",
                        },
                      }}
                    >
                      <TbLockPassword className="lock-icon" />
                    </IconContext.Provider>
                    {invalidCredentials ? (
                      <span className="invalid-credentials">
                        Invalid credentials
                      </span>
                    ) : (
                      ""
                    )}
                    <div>
                      <label htmlFor="username">
                        Username
                        {invalidCredentials ? (
                          <span className="invalid-credentials-field-indicator">
                            *
                          </span>
                        ) : (
                          ""
                        )}
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="poppins-regular"
                        value={signInUsername}
                        onChange={(event) =>
                          setSignInUesrname(event.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="password">
                        Password
                        {invalidCredentials ? (
                          <span className="invalid-credentials-field-indicator">
                            *
                          </span>
                        ) : (
                          ""
                        )}
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        className="poppins-regular"
                        value={signInPassword}
                        onChange={(event) =>
                          setSignInPassword(event.target.value)
                        }
                      />
                    </div>
                    <input
                      type="button"
                      value="Sign in"
                      className="sign-in-button poppins-semibold"
                      onClick={() =>
                        handleSignIn(signInUsername, signInPassword)
                      }
                    />
                  </form>
                </div>
              )
            ) : (
              <div className="feature-coming-soon poppins-regular">
                Coming Soon ...
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
