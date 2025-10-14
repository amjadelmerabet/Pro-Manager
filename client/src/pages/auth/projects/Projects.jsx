// import { IconContext } from "react-icons/lib";
// import { FaRegFolder } from "react-icons/fa";
import { useState, useEffect } from "react";
// import { IoClose, IoNavigateOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router";
// import { GrFormClock } from "react-icons/gr";
// import { BiReset } from "react-icons/bi";
// import { IoCheckmark } from "react-icons/io5";

import AuthHeader from "../components/AuthHeader";
import SectionHeader from "../components/SectionHeader";
import NewProjectPopup from "./components/NewProjectPopup";
import GridProjectItem from "./components/GridProjectItem";

import updatedMessage from "../../../utils/updatedMessage";

import "./Projects.css";
import ListProjectItem from "./components/ListProjectItem";

export default function ProjectsPage({ user, setAuthentication }) {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({});
  const [createProject, setCreateProject] = useState(0);
  const [newProjectPopupDisplay, setNewProjectPopupDisplay] = useState({
    active: false,
    type: "project",
  });
  const [newProjectCreated, setNewProjectCreated] = useState(0);
  const [loadingNewProject, setLoadingNewProject] = useState(false);
  const [deletedProjectId, setDeletedProjectId] = useState({});
  const [projectDeleted, setProjectDeleted] = useState(0);
  const [openProjectClass, setOpenProjectClass] = useState("");
  const [projectUpdates, setProjectUpdates] = useState({});
  const [updatedProjectId, setUpdatedProjectId] = useState({});
  const [projectUpdated, setProjectUpdated] = useState(0);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [selectedView, setSelectedView] = useState("grid");
  const [filter, setFilter] = useState({ state: "0" });
  const [applyFilters, setApplyFilters] = useState(0);
  const [filterCleared, setFilterCleared] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    type: "",
  });
  const [tries, setTries] = useState(0);
  const [loadProjects, setLoadProjects] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  // const [projectCreatedSuccessfully, setProjectCreatedSuccessfully] =
  //   useState(false);
  // const [accessToken, setAccessToken] = useState("");

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const filterInURL = searchParams.get("filter");

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

  // const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;

  //   // Auto-abort after a timeout
  //   const timer = setTimeout(() => controller.abort(), timeout);

  //   return fetch(url, { ...options, signal }).finally(() =>
  //     clearTimeout(timer)
  //   );
  // };

  useEffect(() => {
    if (view) {
      setSelectedView(view);
    }
    if (filterInURL) {
      filterInURL.split("&").forEach((filterProp) => {
        const keyValue = filterProp.split("=");
        let tempFilter = filter;
        tempFilter[keyValue[0]] = keyValue[1];
        setFilter(tempFilter);
      });
      setTimeout(() => {
        setApplyFilters(applyFilters + 1);
      }, 250);
    } else {
      console.log("No filters");
    }
  }, []);

  const getAllProjectsAPI = async () => {
    // console.log("Getting projects");
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
            "http://127.0.0.1:3000/projects/owner/" + user,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log("Received something from server");
          const projectsObject = await response.json();
          if (projectsObject.error === "Invalid access token" && tries < 3) {
            setTries(tries + 1);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "load",
            });
          } else {
            setProjects(projectsObject.result);
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
          "http://127.0.0.1:3000/projects/owner/" + user,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("Received something from server");
        const projectsObject = await response.json();
        if (projectsObject.error === "Invalid access token" && tries < 3) {
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "load",
          });
        } else {
          setProjects(projectsObject.result);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProjectsAPI();
  }, [
    newProjectCreated,
    projectDeleted,
    projectUpdated,
    filterCleared,
    loadProjects,
  ]);

  const getAccessTokenAPI = async () => {
    // console.log("Getting new access token");
    try {
      // await fetchWithTimeout("http://127.0.0.1:3000/tokens/access/new", {
      //     method: "POST",
      //     headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${refreshToken.value}`,
      //       },
      //   body: JSON.stringify({ username: user }),
      // })
      //   .then((res) => res.json())
      //   .then((data) => console.log(data))
      //   .catch((error) => {
      //     if (error.name === "AbortError") {
      //       console.log("Request timed out");
      //     } else {
      //       console.log("Fetch error", error);
      //     }
      //   });
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
            setLoadProjects(loadProjects + 1);
          } else if (newAccessToken.type === "new") {
            setCreateProject(createProject + 1);
          } else if (newAccessToken.type === "update") {
            setUpdatedProjectId({ ...updatedProjectId, update: true });
          } else if (newAccessToken.type === "delete") {
            setDeletedProjectId({ ...deletedProjectId, delete: true });
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

  useEffect(() => {
    if (Object.keys(filter).length !== 0) {
      if (filter.state && Number(filter.state) !== 0) {
        if (search !== "") {
          let newList = projects.filter((project) => {
            if (
              project.state === Number(filter.state) &&
              project.name.toLowerCase().includes(search.toLowerCase())
            ) {
              return project;
            }
          });
          setFilteredList(newList);
        } else {
          let newList = projects.filter((project) => {
            if (project.state === Number(filter.state)) {
              return project;
            }
          });
          setFilteredList(newList);
        }
      } else {
        let newList = projects.filter((project) => {
          if (project.name.toLowerCase().includes(search.toLowerCase()))
            return project;
        });
        setFilteredList(newList);
      }
    }
  }, [search, applyFilters]);

  // useEffect(() => {

  // }, [applyFilters]);

  const createNewProjectAPI = async () => {
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
          const response = await fetch("http://127.0.0.1:3000/projects/new", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newProject),
          });
          const createdProject = await response.json();
          if (createdProject.error === "Invalid access token") {
            setTries(tries + 1);
            setCreateProject(0);
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "new",
            });
          } else {
            setTimeout(() => {
              setNewProjectCreated(newProjectCreated + 1);
              setNewProject({});
              setLoadingNewProject(false);
            }, 1000);
            setLoadingNewProject(true);
            setNewProjectPopupDisplay({
              ...newProjectPopupDisplay,
              active: false,
            });
            // setProjectCreatedSuccessfully(false);
          }
        } else {
          setTries(tries + 1);
          setCreateProject(0);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "new",
          });
        }
      } else {
        const response = await fetch("http://127.0.0.1:3000/projects/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProject),
        });
        const createdProject = await response.json();
        if (createdProject.error === "Invalid access token") {
          setTries(tries + 1);
          setCreateProject(0);
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "new",
          });
        } else {
          setTimeout(() => {
            setNewProjectCreated(newProjectCreated + 1);
            setNewProject({});
            setLoadingNewProject(false);
          }, 1000);
          setLoadingNewProject(true);
          setNewProjectPopupDisplay({
            ...newProjectPopupDisplay,
            active: false,
          });
          // setProjectCreatedSuccessfully(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Object.keys(newProject).length > 0 && createProject > 0) {
      createNewProjectAPI();
    }
  }, [createProject]);

  useEffect(() => {
    if (!newProjectPopupDisplay.active) {
      setNewProject({});
    }
  }, [newProjectPopupDisplay]);

  const createNewProject = () => {
    setNewProject({
      ...newProject,
      owner: user,
      created_by: user,
      updated_by: user,
    });
    setCreateProject(createProject + 1);
  };

  const updateProjectAPI = async (id) => {
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
            "http://127.0.0.1:3000/projects/update/" + id,
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
            setUpdatedProjectId({ ...updatedProjectId, update: false });
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "update",
            });
          } else {
            setTimeout(() => {
              setProjectUpdated(projectUpdated + 1);
              setProjectUpdates({});
              setUpdatedProjectId({});
            }, 250);
          }
        } else {
          setTries(tries + 1);
          setUpdatedProjectId({ ...updatedProjectId, update: false });
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "update",
          });
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:3000/projects/update/" + id,
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
          setUpdatedProjectId({ ...updatedProjectId, update: false });
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "update",
          });
        } else {
          setTimeout(() => {
            setProjectUpdated(projectUpdated + 1);
            setProjectUpdates({});
            setUpdatedProjectId({});
          }, 250);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (updatedProjectId.update) {
      updateProjectAPI(updatedProjectId.projectId);
    }
  }, [updatedProjectId]);

  const startProject = (id) => {
    setProjectUpdates({ state: 2, updated_by: user });
    setUpdatedProjectId({ projectId: id, update: true });
  };

  const resetProject = (id) => {
    setProjectUpdates({ state: 1, updated_by: user });
    setUpdatedProjectId({ projectId: id, update: true });
    // setTimeout(() => {
    //   setProjectUpdated(projectUpdated + 1);
    //   setProjectUpdates({});
    //   setUpdatedProjectId("");
    // }, 250);
  };

  const completeProject = (id) => {
    setProjectUpdates({ state: 3, updated_by: user });
    setUpdatedProjectId({ projectId: id, update: true });
    // setTimeout(() => {
    //   setProjectUpdated(projectUpdated + 1);
    //   setProjectUpdates({});
    //   setUpdatedProjectId("");
    // }, 250);
  };

  const deleteProjectAPI = async (id) => {
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
            "http://127.0.0.1:3000/projects/delete/" + id,
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
            setDeletedProjectId({ ...deletedProjectId, delete: false });
            setNewAccessToken({
              counter: newAccessToken.counter + 1,
              type: "delete",
            });
          } else {
            setTimeout(() => {
              setProjectDeleted(projectDeleted + 1);
            }, 1000);
          }
        } else {
          setTries(tries + 1);
          setDeletedProjectId({ ...deletedProjectId, delete: false });
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "delete",
          });
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:3000/projects/delete/" + id,
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
          setDeletedProjectId({ ...deletedProjectId, delete: false });
          setNewAccessToken({
            counter: newAccessToken.counter + 1,
            type: "delete",
          });
        } else {
          setTimeout(() => {
            setProjectDeleted(projectDeleted + 1);
          }, 1000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (deletedProjectId.delete) {
      deleteProjectAPI(deletedProjectId.projectId);
    }
  }, [deletedProjectId]);

  const deleteProject = (id) => {
    setDeletedProjectId({ projectId: id, delete: true });
  };

  let navigate = useNavigate();

  const openProject = (id) => {
    navigate("/auth/" + user + "/project/" + id + "?view=" + selectedView);
  };

  const hoverOverProject = (id) => {
    setTimeout(() => {
      setOpenProjectClass(id);
    }, 50);
  };

  const hoverOverProjectEnd = () => {
    setTimeout(() => {
      setOpenProjectClass("");
    }, 50);
  };

  let myProjects = 0;

  return (
    <div className="projects-page">
      <div className="auth-header-container">
        <AuthHeader user={user} setAuthentication={setAuthentication} />
      </div>
      <div className="container">
        <SectionHeader
          title="Your projects"
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          page="projects"
          popupDisplay={newProjectPopupDisplay}
          setPopupDisplay={setNewProjectPopupDisplay}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          applyFilters={applyFilters}
          setApplyFilters={setApplyFilters}
          setFilterCleared={setFilterCleared}
        />
        <div className={"projects " + selectedView}>
          {search === "" && applyFilters === 0
            ? projects.map((project) => {
                if (project.owner === user) {
                  myProjects++;
                  const updated = new Date(project.updated_on);
                  let updatedStatus = updatedMessage(updated);
                  if (deletedProjectId.projectId !== project.project_id) {
                    if (selectedView === "grid") {
                      return (
                        <GridProjectItem
                          key={project.project_id}
                          project={project}
                          openProjectClass={openProjectClass}
                          hoverOverProject={hoverOverProject}
                          hoverOverProjectEnd={hoverOverProjectEnd}
                          openProject={openProject}
                          startProject={startProject}
                          resetProject={resetProject}
                          completeProject={completeProject}
                          deleteProject={deleteProject}
                          user={user}
                          updatedStatus={updatedStatus}
                        />
                      );
                    } else {
                      return (
                        <ListProjectItem
                          key={project.project_id}
                          project={project}
                          user={user}
                          openProjectClass={openProjectClass}
                          openProject={openProject}
                          startProject={startProject}
                          completeProject={completeProject}
                          resetProject={resetProject}
                          deleteProject={deleteProject}
                          hoverOverProject={hoverOverProject}
                          hoverOverProjectEnd={hoverOverProjectEnd}
                          updatedStatus={updatedStatus}
                        />
                      );
                    }
                  } else {
                    return (
                      <div className={"deleting-project poppins-semibold"}>
                        Project being deleted ...
                      </div>
                    );
                  }
                }
              })
            : filteredList.map((project) => {
                if (project.owner === user) {
                  myProjects++;
                  const updated = new Date(project.updated_on);
                  let updatedStatus = updatedMessage(updated);
                  if (deletedProjectId.projectId !== project.project_id) {
                    if (selectedView === "grid") {
                      return (
                        <GridProjectItem
                          key={project.project_id}
                          project={project}
                          openProjectClass={openProjectClass}
                          hoverOverProject={hoverOverProject}
                          hoverOverProjectEnd={hoverOverProjectEnd}
                          openProject={openProject}
                          startProject={startProject}
                          resetProject={resetProject}
                          completeProject={completeProject}
                          deleteProject={deleteProject}
                          user={user}
                          updatedStatus={updatedStatus}
                        />
                      );
                    } else {
                      return (
                        <ListProjectItem
                          key={project.project_id}
                          project={project}
                          user={user}
                          openProjectClass={openProjectClass}
                          openProject={openProject}
                          startProject={startProject}
                          completeProject={completeProject}
                          resetProject={resetProject}
                          deleteProject={deleteProject}
                          hoverOverProject={hoverOverProject}
                          hoverOverProjectEnd={hoverOverProjectEnd}
                        />
                      );
                    }
                  } else {
                    return (
                      <div className={"deleting-project poppins-semibold"}>
                        Project being deleted ...
                      </div>
                    );
                  }
                }
              })}
          {loadingNewProject ? (
            <div className="loading-new-project poppins-regular">
              Creating a new project ...
            </div>
          ) : (
            ""
          )}
        </div>
        {myProjects === 0 ? (
          <div className="no-projects">
            <h3 className="no-projects-message poppins-semibold">
              You have no projects
            </h3>
          </div>
        ) : (
          ""
        )}
        {newProjectPopupDisplay.active ? (
          <NewProjectPopup
            newProject={newProject}
            setNewProject={setNewProject}
            createNewProject={createNewProject}
            popupDisplay={newProjectPopupDisplay}
            setPopupDisplay={setNewProjectPopupDisplay}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
