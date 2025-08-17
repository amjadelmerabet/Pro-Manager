import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { IconContext } from "react-icons/lib";
import { BiReset } from "react-icons/bi";
import { GrFormClock } from "react-icons/gr";

import AuthHeader from "../components/AuthHeader";

import "./Project.css";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

export default function Project({ user }) {
  const [projectObject, setProjectObject] = useState({});
  const [projectUpdates, setProjectUpdates] = useState({});
  const [projectUpdated, setProjectUpdated] = useState(false);
  const [projectDeleted, setProjectDeleted] = useState(false);
  const [projectNotFound, setProjectNotFound] = useState(false);

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

  useEffect(() => {
    const fetchProjectAPI = async () => {
      const response = await fetch(
        "http://127.0.0.1:3000/projects/id/" + projectId
      );
      const project = await response.json();
      if (project.result.length > 0) {
        setProjectObject(project.result[0]);
      } else {
        setProjectNotFound(true);
      }
    };
    if (!projectUpdated) {
      fetchProjectAPI();
    }
  }, [projectUpdated]);

  useEffect(() => {
    const updateProjectAPI = async () => {
      const response = await fetch(
        "http://127.0.0.1:3000/projects/update/" + projectId,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectUpdates),
        }
      );
      const updatedProject = await response.json();
    };
    if (projectUpdated) {
      updateProjectAPI();
    }
  }, [projectUpdated]);

  let navigate = useNavigate();

  useEffect(() => {
    const deleteProjectAPI = async () => {
      const response = await fetch(
        "http://127.0.0.1:3000/projects/delete/" + projectId,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      const deletedProject = await response.json();
      setTimeout(() => {
        navigate("/auth/" + user + "/projects");
      }, 500);
    };
    if (projectDeleted) {
      deleteProjectAPI();
    }
  }, [projectDeleted]);

  const startProject = () => {
    setProjectUpdates({ state: 2, updated_by: user });
    setProjectUpdated(true);
    setTimeout(() => {
      setProjectUpdated(false);
      setProjectUpdates({});
    }, 250);
  };

  const completeProject = () => {
    setProjectUpdates({ state: 3, updated_by: user });
    setProjectUpdated(true);
    setTimeout(() => {
      setProjectUpdated(false);
      setProjectUpdates({});
    }, 250);
  };

  const resetProject = () => {
    setProjectUpdates({ state: 1, updated_by: user });
    setProjectUpdated(true);
    setTimeout(() => {
      setProjectUpdated(false);
      setProjectUpdates({});
    });
  };

  const deleteProject = () => {
    setProjectDeleted(true);
  };

  return (
    <div className="project-page">
      <div className="auth-header-container">
        <AuthHeader user={user} />
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
              <div className="project-owner poppins-regular">
                Owned by {projectObject.owner === user ? "you" : projectObject.owner}
              </div>
              <p className="project-description poppins-regular">
                {projectObject.description}
              </p>
              <div className="links poppins-semibold">
                <Link to={`/auth/${user}/projects?view=${view}`}>
                  <IconContext.Provider value={{ style: { color: "var(--primary-color)" }}}>
                    <FaArrowLeft />
                  </IconContext.Provider>
                  <span>Go back</span>
                </Link>
              </div>
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
