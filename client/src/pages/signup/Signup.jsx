import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import "./Signup.css";

export default function SignUpPage() {
  const [userBody, setUserBody] = useState({});
  const [newUserCreated, setNewUserCreated] = useState(false);
  const [createNewUser, setCreateNewUser] = useState(false);
  const [signUpStart, setSignUpStart] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    const createNewUserAPI = async () => {
      const response = await fetch("http://127.0.0.1:3000/users/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userBody),
      });
      const newUser = await response.json();
    };
    if (createNewUser) {
      createNewUserAPI();
      setTimeout(() => {
       setCreateNewUser(false);
       setNewUserCreated(false); 
      }, 500);
      setTimeout(() => {
        setUserBody({});
        navigate("/signin");
      }, 1000);
    }
  }, [createNewUser]);

  const openConfirmPopup = () => {
    let name = userBody.first_name + " " + userBody.last_name;
    setUserBody({
      ...userBody,
      name: name,
      created_by: "system",
      updated_by: "system",
    });
    setNewUserCreated(true);
  };

  const createUser = () => {
    setCreateNewUser(true);
  }

  const cancelCreation = () => {
    setNewUserCreated(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setSignUpStart(true);
    }, 250);
  }, []);

  return (
    <div className={"signup-page" + (signUpStart ? " visible" : "")}>
      <h1 className="title poppins-bold">Pro Manager</h1>
      <div className="signup-section">
        <h2 className="signup-title poppins-bold">Sign up</h2>
        <form className="signup-form poppins-regular">
          <div>
            <div className="first-name-section">
              <label htmlFor="first-name" className="first-name-label">
                First name
              </label>
              <input
                type="text"
                name="first-name"
                id="first-name-input"
                className="first-name-input"
                required
                onChange={(event) =>
                  setUserBody({ ...userBody, first_name: event.target.value })
                }
              />
            </div>
            <div className="last-name-section">
              <label htmlFor="last-name" className="last-name-label">
                Last name
              </label>
              <input
                type="text"
                name=""
                id="last-name-input"
                className="last-name-input"
                required
                onChange={(event) =>
                  setUserBody({ ...userBody, last_name: event.target.value })
                }
              />
            </div>
          </div>
          <div>
            <div className="username-section">
              <label htmlFor="username" className="username-label">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username-input"
                className="username-input"
                required
                onChange={(event) =>
                  setUserBody({ ...userBody, username: event.target.value })
                }
              />
            </div>
            <div className="email-section">
              <label htmlFor="email" className="email-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email-input"
                className="email-input"
                required
                onChange={(event) =>
                  setUserBody({ ...userBody, email: event.target.value })
                }
              />
            </div>
          </div>
          <div>
            <div className="password-section">
              <label htmlFor="password" className="password-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="password-input"
                required
                onChange={(event) =>
                  setUserBody({ ...userBody, password: event.target.value })
                }
              />
            </div>
            <div className="confirm-password-section">
              <label
                htmlFor="confirm-password"
                className="confirm-password-label"
              >
                Confirm your password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password-input"
                className="confirm-password-input"
                required
              />
            </div>
          </div>
          <div className="links">
            <p>Already have an account?</p>
            <Link to="/signin">Sign in</Link>
          </div>
          <input
            type="button"
            value="Sign up"
            className="signup-button poppins-bold"
            onClick={() => openConfirmPopup()}
          />
        </form>
      </div>
      {newUserCreated ? 
      <div className="confirm-popup poppins-regular">
        <span>Can you confirm that all the details are correct?</span>
        <div className="buttons">
          <button
            className="confirm poppins-semibold"
            onClick={() => createUser()}
          >
            Confirm
          </button>
          <button
            className="cancel poppins-semibold"
            onClick={() => cancelCreation()}
          >
            Cancel
          </button>
        </div>
      </div> : ""}
    </div>
  );
}
