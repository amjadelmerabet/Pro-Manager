import { IconContext } from "react-icons/lib";
import { FaRegFolder } from "react-icons/fa";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router";
import { GrFormClock } from "react-icons/gr";
import { BiReset } from "react-icons/bi";
import { IoCheckmark } from "react-icons/io5";

import AuthHeader from "../components/AuthHeader";
import SectionHeader from "../components/SectionHeader";
import NewProjectPopup from "./components/NewProjectPopup";
import GridProjectItem from "./components/GridProjectItem";

import updatedMessage from "../../../utils/updatedMessage";

import "./Projects.css";
import ListProjectItem from "./components/ListProjectItem";

export default function ProjectsPage({ user }) {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({});
  const [create, setCreate] = useState(0);
  const [newProjectPopupDisplay, setNewProjectPopupDisplay] = useState({
    active: false,
    type: "project",
  });
  const [newProjectCreated, setNewProjectCreated] = useState(0);
  const [loadingNewProject, setLoadingNewProject] = useState(false);
  const [deletedProjectId, setDeletedProjectId] = useState("");
  const [projectDeleted, setProjectDeleted] = useState(0);
  const [openProjectClass, setOpenProjectClass] = useState("");
  const [projectUpdates, setProjectUpdates] = useState({});
  const [updatedProjectId, setUpdatedProjectId] = useState("");
  const [projectUpdated, setProjectUpdated] = useState(0);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [selectedView, setSelectedView] = useState("grid");

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  useEffect(() => {
    if (view) {
      setSelectedView(view);
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("http://127.0.0.1:3000/projects");
      const projectsObject = await response.json();
      setProjects(projectsObject.result);
    };
    fetchProjects();
  }, [newProjectCreated, projectDeleted, projectUpdated]);

  useEffect(() => {
    const newList = projects.filter((project) => {
      if (project.name.toLowerCase().includes(search.toLowerCase()))
        return project;
    });
    setFilteredList(newList);
  }, [search]);

  useEffect(() => {
    const createNewProjectAPI = async () => {
      const response = await fetch("http://127.0.0.1:3000/projects/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const createdTask = await response.json();
    };
    if (Object.keys(newProject).length > 0) {
      createNewProjectAPI();
    }
  }, [create]);

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
    setCreate(create + 1);
    setTimeout(() => {
      setNewProjectCreated(newProjectCreated + 1);
      setNewProject({});
      setLoadingNewProject(false);
    }, 1000);
    setLoadingNewProject(true);
    setNewProjectPopupDisplay({ ...newProjectPopupDisplay, active: false });
  };

  useEffect(() => {
    const updateProjectAPI = async (id) => {
      const response = await fetch(
        "http://127.0.0.1:3000/projects/update/" + id,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectUpdates),
        }
      );
      const updatedProject = await response.json();
    };
    if (updatedProjectId !== "") {
      updateProjectAPI(updatedProjectId);
    }
  }, [updatedProjectId]);

  const startProject = (id) => {
    setProjectUpdates({ state: 2, updated_by: user });
    setUpdatedProjectId(id);
    setTimeout(() => {
      setProjectUpdated(projectUpdated + 1);
      setProjectUpdates({});
      setUpdatedProjectId("");
    }, 250);
  };

  const resetProject = (id) => {
    setProjectUpdates({ state: 1, updated_by: user });
    setUpdatedProjectId(id);
    setTimeout(() => {
      setProjectUpdated(projectUpdated + 1);
      setProjectUpdates({});
      setUpdatedProjectId("");
    }, 250);
  };

  const completeProject = (id) => {
    setProjectUpdates({ state: 3, updated_by: user });
    setUpdatedProjectId(id);
    setTimeout(() => {
      setProjectUpdated(projectUpdated + 1);
      setProjectUpdates({});
      setUpdatedProjectId("");
    }, 250);
  };

  useEffect(() => {
    const deleteProjectAPI = async (id) => {
      const response = await fetch(
        "http://127.0.0.1:3000/projects/delete/" + id,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      const deletedProject = await response.json();
    };
    if (deletedProjectId !== "") {
      deleteProjectAPI(deletedProjectId);
    }
  }, [deletedProjectId]);

  const deleteProject = (id) => {
    setDeletedProjectId(id);
    setTimeout(() => {
      setProjectDeleted(projectDeleted + 1);
    }, 1000);
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
        <AuthHeader user={user} />
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
        />
        <div className={"projects " + selectedView}>
          {search === ""
            ? projects.map((project) => {
                if (project.owner === user) {
                  myProjects++;
                  const updated = new Date(project.updated_on);
                  let updatedStatus = updatedMessage(updated);
                  if (deletedProjectId !== project.project_id) {
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
              })
            : filteredList.map((project) => {
                if (project.owner === user) {
                  myProjects++;
                  const updated = new Date(project.updated_on);
                  let updatedStatus = updatedMessage(updated);
                  if (deletedProjectId !== project.project_id) {
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
