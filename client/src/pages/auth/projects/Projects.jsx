// Hooks
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

// Components
import AuthHeader from "../components/AuthHeader";
import SectionHeader from "../components/SectionHeader";
import NewProjectPopup from "./components/NewProjectPopup";
import GridProjectItem from "./components/GridProjectItem";
import ListProjectItem from "./components/ListProjectItem";

// Utils
import updatedMessageUtil from "../../../utils/updatedMessageUtil";
import fetchUserProjectsUtil from "./utils/fetchUserProjectsUtil";
import getAccessTokenUtil from "./utils/getAccessTokenUtil";
import createProjectUtil from "./utils/createProjectUtil";
import updateProjectUtil from "./utils/updateProjectUtil";
import deleteProjectUtil from "./utils/deleteProjectUtil";
import updateProjectsListUtil from "./utils/updateProjectsListUtil";

// Styles
import "./Projects.css";

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
  const [sort, setSort] = useState({ sort_by: "0", type: 1 });
  const [sortCleared, setSortCleared] = useState(false);
  const [applySort, setApplySort] = useState(0);

  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const filterInURL = searchParams.get("filter");

  const { token } = JSON.parse(sessionStorage.getItem("authUser"));

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
    }
  }, []);

  useEffect(() => {
    fetchUserProjectsUtil(
      tokenValidated,
      user,
      token,
      tries,
      setTries,
      newAccessToken,
      setNewAccessToken,
      setProjects,
      setTokenValidated
    );
  }, [
    newProjectCreated,
    projectDeleted,
    projectUpdated,
    filterCleared,
    loadProjects,
    sortCleared,
  ]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getAccessTokenUtil(
        user,
        setTokenValidated,
        setTries,
        newAccessToken,
        loadProjects,
        setLoadProjects,
        createProject,
        setCreateProject,
        updatedProjectId,
        setUpdatedProjectId,
        deletedProjectId,
        setDeletedProjectId
      );
    }
  }, [newAccessToken]);

  useEffect(() => {
    updateProjectsListUtil(filter, search, projects, setFilteredList);
  }, [search, applyFilters]);

  useEffect(() => {
    const sortProjects = (unsoredProjectsList) => {
      if (Number(sort.sort_by) !== 0) {
        if (sort.sort_by === "1") {
          unsoredProjectsList.sort((a, b) => {
            if (sort.type === 1) {
              return a.state - b.state;
            } else {
              return b.state - a.state;
            }
          });
        } else if (sort.sort_by === "2") {
          unsoredProjectsList.sort((a, b) => {
            if (sort.type === 1) {
              return (
                new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
              );
            } else {
              return (
                new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
              );
            }
          });
        }
      }
      return unsoredProjectsList;
    };
    if (applySort > 0) {
      setProjects((currentList) => {
        return sortProjects(currentList);
      });
    }
  }, [applySort]);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  useEffect(() => {
    if (Object.keys(newProject).length > 0 && createProject > 0) {
      createProjectUtil(
        tokenValidated,
        user,
        token,
        newProject,
        tries,
        setTries,
        setCreateProject,
        newAccessToken,
        setNewAccessToken,
        newProjectCreated,
        setNewProjectCreated,
        setNewProject,
        setLoadingNewProject,
        newProjectPopupDisplay,
        setNewProjectPopupDisplay,
        setTokenValidated
      );
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

  useEffect(() => {
    if (updatedProjectId.update) {
      updateProjectUtil(
        tokenValidated,
        user,
        token,
        projectUpdates,
        tries,
        setTries,
        updatedProjectId,
        setUpdatedProjectId,
        newAccessToken,
        setNewAccessToken,
        projectUpdated,
        setProjectUpdated,
        setProjectUpdates,
        setTokenValidated
      );
    }
  }, [updatedProjectId]);

  const startProject = (id) => {
    setProjectUpdates({ state: 2, updated_by: user });
    setUpdatedProjectId({ projectId: id, update: true });
  };

  const resetProject = (id) => {
    setProjectUpdates({ state: 1, updated_by: user });
    setUpdatedProjectId({ projectId: id, update: true });
  };

  const completeProject = (id) => {
    setProjectUpdates({ state: 3, updated_by: user });
    setUpdatedProjectId({ projectId: id, update: true });
  };

  useEffect(() => {
    if (deletedProjectId.delete) {
      deleteProjectUtil(
        tokenValidated,
        user,
        token,
        tries,
        setTries,
        deletedProjectId,
        setDeletedProjectId,
        newAccessToken,
        setNewAccessToken,
        projectDeleted,
        setProjectDeleted,
        setTokenValidated
      );
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
          sort={sort}
          setSort={setSort}
          applySort={applySort}
          setApplySort={setApplySort}
          setSortCleared={setSortCleared}
        />
        <div className={"projects " + selectedView}>
          {search === "" && applyFilters === 0
            ? projects.map((project) => {
                if (project.owner === user) {
                  myProjects++;
                  const updated = new Date(project.updated_on);
                  let updatedStatus = updatedMessageUtil(updated);
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
                  let updatedStatus = updatedMessageUtil(updated);
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
