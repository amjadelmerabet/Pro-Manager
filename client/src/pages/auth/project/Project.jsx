import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { IconContext } from "react-icons/lib";
import { BiReset } from "react-icons/bi";
import { GrFormClock } from "react-icons/gr";

import AuthHeader from "../components/AuthHeader";

import "./Project.css";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import updatedMessage from "../../../utils/updatedMessage";
import { MdOutlineModeEdit } from "react-icons/md";

export default function Project({ user, setAuthentication }) {
  const [projectObject, setProjectObject] = useState({});
  const [projectUpdates, setProjectUpdates] = useState({});
  const [projectUpdated, setProjectUpdated] = useState({
    counter: 0,
    update: false,
  });
  const [projectDeleted, setProjectDeleted] = useState(false);
  const [projectNotFound, setProjectNotFound] = useState(false);
  const [tries, setTries] = useState(0);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [loadProject, setLoadProject] = useState(0);
  const [updatedsuccessfully, setUpdatedsuccessfully] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [editDescriptionInput, setEditDescriptionInput] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editButtonVisible, setEditButtonVisible] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;
  const array = pathname
    .replace("/auth/", "")
    .replace("/project", "")
    .split("/");
  // const userId = array[0];
  const projectId = array[1];

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  const fetchProjectAPI = async () => {
    try {
      if (!tokenValidated) {
        const refreshToken = await cookieStore.get(user);
        const response = await fetch(
          "http://127.0.0.1:3000/tokens/access/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken.value}`,
            },
            body: JSON.stringify({ token: token }),
          }
        );
        const validAccessToken = await response.json();
        if (validAccessToken.message === "Valid access token") {
          const response = await fetch(
            "http://127.0.0.1:3000/projects/id/" + projectId,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const project = await response.json();
          if (project.error === "Invalid access token") {
            setTries(tries + 1);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "load",
            });
          } else {
            if (project.result.length > 0) {
              setProjectObject(project.result[0]);
            } else {
              setProjectNotFound(true);
            }
          }
        } else {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "load",
          });
        }
      } else {
        setTimeout(() => {
          setTokenValidated(false);
        }, 500);
        const response = await fetch(
          "http://127.0.0.1:3000/projects/id/" + projectId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const project = await response.json();
        if (project.error === "Invalid access token") {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "load",
          });
        } else {
          if (project.result.length > 0) {
            setProjectObject(project.result[0]);
          } else {
            setProjectNotFound(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      (!projectUpdated.update && projectUpdated.counter === 0) ||
      loadProject
    ) {
      fetchProjectAPI();
    }
  }, [updatedsuccessfully, loadProject]);

  const getAccessTokenAPI = async () => {
    // console.log("Getting new access token");
    try {
      const refreshToken = await cookieStore.get(user);
      if (refreshToken) {
        // console.log(refreshToken);
        const response = await fetch(
          "http://127.0.0.1:3000/tokens/access/new",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken.value}`,
            },
            body: JSON.stringify({ username: user }),
          }
        );
        // console.log("Received a token or something");
        const accessTokenObject = await response.json();
        if (!accessTokenObject.error) {
          const authUser = JSON.parse(sessionStorage.getItem("authUser"));
          authUser.token = accessTokenObject.token;
          sessionStorage.removeItem("authUser");
          sessionStorage.setItem("authUser", JSON.stringify(authUser));
          setTokenValidated(true);
          setTries(0);
          if (newAccessToken.type === "load") {
            setLoadProject(loadProject + 1);
          } else if (newAccessToken.type === "update") {
            setProjectUpdated({
              counter: projectUpdated.counter + 1,
              update: true,
            });
            // setTimeout(() => {
            //   setProjectUpdated(true);
            // }, 250);
          } else if (newAccessToken.type === "delete") {
            setProjectDeleted(false);
            setTimeout(() => {
              setProjectDeleted(true);
            }, 250);
          }
        }
      } else {
        console.log("No refresh token");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getAccessTokenAPI();
    }
  }, [newAccessToken]);

  const updateProjectAPI = async () => {
    try {
      if (!tokenValidated) {
        const refreshToken = await cookieStore.get(user);
        const response = await fetch(
          "http://127.0.0.1:3000/tokens/access/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken.value}`,
            },
            body: JSON.stringify({ token: token }),
          }
        );
        const validAccessToken = await response.json();
        if (validAccessToken.message === "Valid access token") {
          const response = await fetch(
            "http://127.0.0.1:3000/projects/update/" + projectId,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(projectUpdates),
            }
          );
          const updatedProject = await response.json();
          if (updatedProject.error === "Invalid access token" && tries < 3) {
            setTries(tries + 1);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "update",
            });
          } else {
            setUpdatedsuccessfully(true);
          }
        } else {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "update",
          });
        }
      } else {
        setTimeout(() => {
          setTokenValidated(false);
        }, 500);
        const response = await fetch(
          "http://127.0.0.1:3000/projects/update/" + projectId,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(projectUpdates),
          }
        );
        const updatedProject = await response.json();
        if (updatedProject.error === "Invalid access token" && tries < 3) {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "update",
          });
        } else {
          setUpdatedsuccessfully(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (projectUpdated.update) {
      updateProjectAPI();
    }
  }, [projectUpdated]);

  let navigate = useNavigate();

  const deleteProjectAPI = async () => {
    try {
      if (!tokenValidated) {
        const refreshToken = await cookieStore.get(user);
        const response = await fetch(
          "http://127.0.0.1:3000/tokens/access/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken.value}`,
            },
            body: JSON.stringify({ token: token }),
          }
        );
        const validAccessToken = await response.json();
        if (validAccessToken.message === "Valid access token") {
          const response = await fetch(
            "http://127.0.0.1:3000/projects/delete/" + projectId,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const deletedProject = await response.json();
          if (deletedProject.error === "Invalid access token" && tries < 3) {
            setTries(tries + 1);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "delete",
            });
          } else {
            setTimeout(() => {
              navigate("/auth/" + user + "/projects");
            }, 500);
          }
        } else {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "delete",
          });
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:3000/projects/delete/" + projectId,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const deletedProject = await response.json();
        if (deletedProject.error === "Invalid access token" && tries < 3) {
          setTries(tries + 1);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "delete",
          });
        } else {
          setTimeout(() => {
            navigate("/auth/" + user + "/projects");
          }, 500);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (projectDeleted) {
      deleteProjectAPI();
    }
  }, [projectDeleted]);

  useEffect(() => {
    if (updatedsuccessfully) {
      setTimeout(() => {
        console.log("success");
        setProjectUpdated({ counter: 0, update: false });
        setProjectUpdates({});
        setUpdatedsuccessfully(false);
      }, 250);
    }
  }, [updatedsuccessfully]);

  const startProject = () => {
    setProjectUpdates({ state: 2, updated_by: user });
    setProjectUpdated({ counter: projectUpdated.counter + 1, update: true });
  };

  const completeProject = () => {
    setProjectUpdates({ state: 3, updated_by: user });
    setProjectUpdated({ counter: projectUpdated.counter + 1, update: true });
    // setTimeout(() => {
    //   setProjectUpdated(false);
    //   setProjectUpdates({});
    // }, 250);
  };

  const resetProject = () => {
    setProjectUpdates({ state: 1, updated_by: user });
    setProjectUpdated({ counter: projectUpdated.counter + 1, update: true });
    // setTimeout(() => {
    //   setProjectUpdated(false);
    //   setProjectUpdates({});
    // });
  };

  const deleteProject = () => {
    setProjectDeleted(true);
  };

  let updated = new Date(projectObject.updated_on);
  let updatedStatus = updatedMessage(updated);

  let projectDeadline = new Date(projectObject.deadline);

  const showEditDescriptionButton = () => {
    setEditButtonVisible(true);
  };

  const hideEditDescriptionButton = () => {
    setEditButtonVisible(false);
  };

  const editDescription = (description) => {
    setEditedDescription(description);
    setEditingDescription(true);
    setEditDescriptionInput(true);
  };

  const updateDescription = () => {
    setProjectUpdates({ description: editedDescription, updated_by: user });
    setProjectUpdated({ counter: projectUpdated.counter + 1, update: true });
    setEditDescriptionInput(false);
    setEditingDescription(false);
  };

  const cancelDescriptionUpdate = () => {
    setEditingDescription(false);
    setEditDescriptionInput(false);
  };

  return (
    <div className="project-page">
      <div className="auth-header-container">
        <AuthHeader user={user} setAuthentication={setAuthentication} />
      </div>
      <div className="container">
        {Object.keys(projectObject).length === 0 && !projectNotFound ? (
          <div className="loading-project poppins-regular">
            Loading project content ...
          </div>
        ) : !projectNotFound ? (
          <div className="project">
            <div className="project-header">
              <div className="left">
                <h2 className="project-title poppins-bold">
                  {projectObject.name}
                </h2>
                <h5
                  className={
                    "project-state poppins-semibold" +
                    (projectObject.state === 1
                      ? " not-started"
                      : projectObject.state === 2
                      ? " in-progress"
                      : " completed")
                  }
                >
                  {projectObject.state === 1
                    ? "Not started"
                    : projectObject.state === 2
                    ? "In progress"
                    : "Completed"}
                </h5>
              </div>
              <div className="right">
                <div className="project-actions">
                  {projectObject.state !== 1 ? (
                    <button
                      className="reset-project poppins-regular"
                      onClick={() => resetProject()}
                    >
                      <IconContext.Provider
                        value={{
                          style: {
                            color: "rgb(45, 180, 245)",
                            fontSize: "24px",
                          },
                        }}
                      >
                        <BiReset />
                      </IconContext.Provider>
                      <span>Reset</span>
                    </button>
                  ) : (
                    ""
                  )}
                  {projectObject.state === 1 ? (
                    <button
                      className="start-project poppins-regular"
                      onClick={() => startProject()}
                    >
                      <IconContext.Provider
                        value={{
                          style: {
                            color: "rgb(245, 200, 45)",
                            fontSize: "24px",
                          },
                        }}
                      >
                        <GrFormClock />
                      </IconContext.Provider>
                      <span>Start</span>
                    </button>
                  ) : (
                    ""
                  )}
                  {projectObject.state !== 3 ? (
                    <button
                      className="complete-project poppins-regular"
                      onClick={() => completeProject()}
                    >
                      <IconContext.Provider
                        value={{
                          style: { color: "rgb(0, 200, 45)", fontSize: "24px" },
                        }}
                      >
                        <IoCheckmark />
                      </IconContext.Provider>
                      <span>Complete</span>
                    </button>
                  ) : (
                    ""
                  )}
                  <button
                    className="delete-project poppins-regular"
                    onClick={() => deleteProject()}
                  >
                    <IconContext.Provider
                      value={{
                        style: { color: "rgb(225, 0, 45)", fontSize: "24px" },
                      }}
                    >
                      <IoClose />
                    </IconContext.Provider>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="project-body">
              <div className="project-info">
                <div className="left">
                  <div className="project-owner poppins-regular">
                    Owned by
                    {projectObject.owner === user
                      ? " you"
                      : projectObject.owner}
                  </div>
                  <div className="project-deadline poppins-regular">
                    {projectObject.deadline
                      ? `Deadline on ${projectDeadline.getMonth()}/${projectDeadline.getDate()}/${projectDeadline.getFullYear()}`
                      : "No deadline"}
                  </div>
                </div>
                <div className="right">
                  <div className="updated poppins-regular">{updatedStatus}</div>
                </div>
              </div>
              <div
                onMouseEnter={() => showEditDescriptionButton()}
                onMouseLeave={() => hideEditDescriptionButton()}
              >
                <span className="description-label poppins-semibold">
                  Description
                </span>
                {!editDescriptionInput ? (
                  <p className="project-description poppins-regular">
                    {projectObject.description}
                  </p>
                ) : (
                  <div className="editing-description">
                    <input
                      type="text"
                      className="edit-description-input poppins-regular"
                      value={editedDescription}
                      onChange={(event) =>
                        setEditedDescription(event.target.value)
                      }
                    />
                    <div className="buttons">
                      <input
                        type="button"
                        value="Update"
                        className="update-description-button poppins-regular"
                        onClick={() => updateDescription()}
                      />
                      <input
                        type="button"
                        value="Cancel"
                        className="cancel-description-update-button poppins-regular"
                        onClick={() => cancelDescriptionUpdate()}
                      />
                    </div>
                  </div>
                )}
                {!editingDescription ? (
                  <div className="edit-description">
                    <button
                      className={
                        "edit-description-button poppins-regular" +
                        (editButtonVisible ? " visible" : "")
                      }
                      onClick={() => editDescription(projectObject.description)}
                    >
                      <IconContext.Provider
                        value={{ style: { fontSize: "16px" } }}
                      >
                        <MdOutlineModeEdit />
                      </IconContext.Provider>
                      Edit
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="links poppins-semibold">
              <Link
                to={
                  view === "dashboard"
                    ? `/auth/${user}/dashboard`
                    : `/auth/${user}/projects?view=${view}`
                }
              >
                <IconContext.Provider
                  value={{ style: { color: "var(--primary-color)" } }}
                >
                  <FaArrowLeft />
                </IconContext.Provider>
                <span>Go back</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="project-not-found poppins-regular">
            404 Project Not Found
          </div>
        )}
      </div>
    </div>
  );
}
