import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SideMenu from "../../dashboard/modern/components/SideMenu";
import NewProjectForm from "./components/NewProjectForm";
import fetchUserProjectsUtil from "./utils/fetchUserProjectsUtil";
import getNewAccessTokenUtil from "./utils/getNewAccessTokenUtil";
import createNewProjectUtil from "./utils/createNewProjectUtil";
import deleteProjectUtil from "./utils/deleteProjectUtil";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import "./Projects.css";

const projectStates = {
  labels: {
    1: "Not started",
    2: "In progress",
    3: "Completed",
  },
  classes: {
    1: "not-started",
    2: "in-progress",
    3: "completed",
  },
};
const truncateProjectName = (name, maxLength = 40) =>
  name?.length > maxLength ? `${name.slice(0, maxLength)}...` : name;

const truncateDescription = (description, maxWords = 16) => {
  let descWords = description.split(" ").length;
  if (descWords <= maxWords) {
    return description;
  } else {
    let descArr = description.split(" ");
    let newDesc = "";
    for (let i = 0; i < maxWords; i++) {
      newDesc += descArr[i];
      if (i < maxWords - 1) {
        newDesc += " ";
      } else {
        newDesc += " ...";
      }
    }
    return newDesc;
  }
};

export default function ProjectsPageModern({
  user,
  userId,
  setAuthentication,
  setPreviewModernUI,
}) {
  const navigate = useNavigate();
  const [tries, setTries] = useState(0);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [newAccessToken, setNewAccessToken] = useState({
    counter: 0,
    action: "",
  });
  const [userProjects, setUserProjects] = useState([]);
  const [fetchProjects, setFetchProjects] = useState(false);
  const [userProjectsFetched, setUserProjectsFetched] = useState(0);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [filtersPopupVisible, setFiltersPopupVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filteredProjectsList, setFilteredProjectsList] = useState([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectFormVisible, setNewProjectFormVisible] = useState(false);
  const [createNewProject, setCreateNewProject] = useState(false);
  const [newProjectCreated, setNewProjectCreated] = useState(0);
  const [newProject, setNewProject] = useState({});
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [deleteQueue, setDeleteQueue] = useState([]);
  const [deleteProject, setDeleteProject] = useState({
    projectId: "",
    delete: false,
  });
  const [projectDeleted, setProjectDeleted] = useState(0);
  const [sortBy, setSortBy] = useState({ type: 1 });
  const [showSortingPopup, setShowSortingPopup] = useState(false);
  const [sortingPopupVisible, setSortingPopupVisible] = useState(false);
  const [sortingApplied, setSortingApplied] = useState(0);
  const [sortedList, setSortedList] = useState([]);

  const { token, sessionId } = JSON.parse(sessionStorage.getItem("authUser"));
  const displayedProjects =
    filtersApplied > 0
      ? sortingApplied > 0
        ? sortedList
        : filteredProjectsList
      : userProjects;
  const hasSelectedProjects = selectedProjectIds.length > 0;
  const allDisplayedProjectsSelected =
    displayedProjects.length > 0 &&
    displayedProjects.every((project) =>
      selectedProjectIds.includes(project.project_id),
    );

  useEffect(() => {
    fetchUserProjectsUtil(
      user,
      userId,
      token,
      sessionId,
      tries,
      setTries,
      tokenValidated,
      setTokenValidated,
      newAccessToken,
      setNewAccessToken,
      setUserProjects,
      setUserProjectsFetched,
    );
  }, [fetchProjects, newProjectCreated]);

  useEffect(() => {
    if (newAccessToken.counter > 0) {
      getNewAccessTokenUtil(
        user,
        userId,
        sessionId,
        setTokenValidated,
        setTries,
        newAccessToken,
        setFetchProjects,
        setCreateNewProject,
        deleteProject,
        setDeleteProject,
      );
    }
  }, [newAccessToken]);

  useEffect(() => {
    if (deleteProject.delete) {
      deleteProjectUtil(
        deleteProject.projectId,
        user,
        sessionId,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        projectDeleted,
        setProjectDeleted,
        deleteProject,
        setDeleteProject,
        newAccessToken,
        setNewAccessToken,
      );
    }
  }, [deleteProject]);

  useEffect(() => {
    if (projectDeleted > 0) {
      setDeleteQueue((queue) => {
        const remaining = queue.slice(1);
        if (remaining.length > 0) {
          setDeleteProject({ projectId: remaining[0], delete: true });
        } else {
          setSelectedProjectIds([]);
          setFetchProjects((prev) => !prev);
        }
        return remaining;
      });
    }
  }, [projectDeleted]);

  useEffect(() => {
    if (newProjectCreated > 0) {
      setNewProjectFormVisible(false);
      setTimeout(() => {
        setShowNewProjectForm(false);
      }, 250);
    }
  }, [newProjectCreated]);

  useEffect(() => {
    if (createNewProject) {
      createNewProjectUtil(
        newProject,
        user,
        sessionId,
        token,
        tries,
        setTries,
        tokenValidated,
        setTokenValidated,
        newAccessToken,
        setNewAccessToken,
        newProjectCreated,
        setNewProjectCreated,
        setCreateNewProject,
      );
    }
  }, [createNewProject]);

  useEffect(() => {
    if (filtersApplied > 0) {
      const { state } = filters;
      const filteredList = userProjects.filter(
        (project) => project.state === state,
      );
      setFilteredProjectsList(filteredList);
    }
  }, [filtersApplied]);

  useEffect(() => {
    if (sortingApplied > 0) {
      const { by, type } = sortBy;
      const sortedTempList =
        filtersApplied > 0 ? filteredProjectsList : userProjects;
      switch (by) {
        case "state":
          if (type === 1) {
            sortedTempList.sort((a, b) => a.state - b.state);
          } else {
            sortedTempList.sort((a, b) => b.state - a.state);
          }
          break;
        case "deadline":
          if (type === 1) {
            sortedTempList.sort(
              (a, b) =>
                new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
            );
          } else {
            sortedTempList.sort(
              (a, b) =>
                new Date(b.deadline).getTime() - new Date(a.deadline).getTime(),
            );
          }
          break;
        case "created":
          if (type === 1) {
            sortedTempList.sort(
              (a, b) =>
                new Date(a.created_on).getTime() -
                new Date(b.created_on).getTime(),
            );
          } else {
            sortedTempList.sort(
              (a, b) =>
                new Date(b.created_on).getTime() -
                new Date(a.created_on).getTime(),
            );
          }
          break;
        default:
          if (type === 1) {
            sortedTempList.sort(
              (a, b) =>
                new Date(a.updated_on).getTime() -
                new Date(b.updated_on).getTime(),
            );
          } else {
            sortedTempList.sort(
              (a, b) =>
                new Date(b.updated_on).getTime() -
                new Date(a.updated_on).getTime(),
            );
          }
          break;
      }
      setSortedList(sortedTempList);
    }
  }, [sortingApplied]);

  const openFiltersPopup = () => {
    setShowFiltersPopup(true);
    setTimeout(() => {
      setFiltersPopupVisible(true);
    }, 250);
  };

  const closeFiltersPopup = () => {
    setFiltersPopupVisible(false);
    setTimeout(() => {
      setShowFiltersPopup(false);
    }, 250);
  };

  const updateFilters = (type, value) => {
    if (type === "state") {
      setFilters({ ...filters, state: Number(value) });
    }
  };

  const applyFilters = () => {
    setFiltersApplied(filtersApplied + 1);
    closeFiltersPopup();
  };

  const clearFilters = () => {
    setFiltersApplied(0);
    setFilters({});
    setFilteredProjectsList([]);
  };

  const openNewProjectForm = () => {
    setShowNewProjectForm(true);
    setTimeout(() => {
      setNewProjectFormVisible(true);
    }, 250);
  };

  const closeNewProjectForm = () => {
    setNewProjectFormVisible(false);
    setNewProject({});
    setTimeout(() => {
      setShowNewProjectForm(false);
    }, 250);
  };

  const createNewProjectFn = () => {
    setNewProject({
      ...newProject,
      owner: userId,
      updated_by: userId,
      created_by: userId,
    });
    setCreateNewProject(true);
  };

  const toggleProjectSelection = (projectId) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  };

  const toggleSelectAllProjects = () => {
    const displayedProjectIds = displayedProjects.map(
      (project) => project.project_id,
    );

    if (allDisplayedProjectsSelected) {
      setSelectedProjectIds((prev) =>
        prev.filter((id) => !displayedProjectIds.includes(id)),
      );
    } else {
      setSelectedProjectIds((prev) => [
        ...new Set([...prev, ...displayedProjectIds]),
      ]);
    }
  };

  const deleteSelectedProjects = () => {
    if (!hasSelectedProjects) {
      return;
    }

    setDeleteQueue(selectedProjectIds);
    setDeleteProject({
      projectId: selectedProjectIds[0],
      delete: true,
    });
  };

  const openSortingPopup = () => {
    setShowSortingPopup(true);
    setTimeout(() => {
      setSortingPopupVisible(true);
    }, 250);
  };

  const closeSortingPopup = () => {
    setSortingPopupVisible(false);
    setTimeout(() => {
      setShowSortingPopup(false);
    }, 250);
  };

  const applySorting = () => {
    setSortingApplied(sortingApplied + 1);
    closeSortingPopup();
  };

  const clearSorting = () => {
    setSortingApplied(0);
    setSortBy({ type: 1 });
    setSortedList([]);
  };

  return (
    <div className="projects-page-modern">
      <div className="page-container">
        <SideMenu
          user={user}
          setPreviewModernUI={setPreviewModernUI}
          useLocalRecentWork={true}
          setAuthentication={setAuthentication}
        />
        <main
          className={
            filtersPopupVisible || showNewProjectForm || sortingPopupVisible
              ? "popup-open"
              : ""
          }
        >
          <h2 className="page-title poppins-bold">My Projects</h2>
          <div className="projects-actions">
            <div className="project-actions-left">
              <button
                className="filter-projects poppins-medium"
                onClick={() => openFiltersPopup()}
              >
                Filter
              </button>
              <button
                className="sort-projects poppins-medium"
                onClick={() => openSortingPopup()}
              >
                Sort
              </button>
            </div>
            <div className="projects-actions-right">
              <button
                className={
                  "delete-projects poppins-medium" +
                  (!hasSelectedProjects ? " feature-disabled" : "")
                }
                onClick={() => deleteSelectedProjects()}
                disabled={!hasSelectedProjects}
              >
                Delete
              </button>
              <button
                className="create-new-project poppins-medium"
                onClick={() => openNewProjectForm()}
              >
                Create new
              </button>
            </div>
          </div>
          {showFiltersPopup ? (
            <div
              className={
                "filters-popup" + (filtersPopupVisible ? " visible" : "")
              }
            >
              <button
                className="close-popup poppins-semibold"
                onClick={() => closeFiltersPopup()}
              >
                Close
              </button>
              <div className="state-section poppins-regular">
                <label
                  htmlFor="project-states"
                  className="project-states-label"
                >
                  State
                </label>
                <div className="project-states">
                  <div className="not-started-section">
                    <input
                      type="radio"
                      name="project-state"
                      value="1"
                      id="not-started"
                      checked={
                        Object.keys(filters).indexOf("state") !== -1
                          ? filters.state === 1
                            ? true
                            : false
                          : false
                      }
                      onChange={(e) => updateFilters("state", e.target.value)}
                    />
                    <label htmlFor="not-started" className="not-started-label">
                      Not started
                    </label>
                  </div>
                  <div className="in-progress-section">
                    <input
                      type="radio"
                      name="project-state"
                      value="2"
                      id="in-progress"
                      checked={
                        Object.keys(filters).indexOf("state") !== -1
                          ? filters.state === 2
                            ? true
                            : false
                          : false
                      }
                      onChange={(e) => updateFilters("state", e.target.value)}
                    />
                    <label htmlFor="in-progress" className="in-progress-label">
                      In progress
                    </label>
                  </div>
                  <div className="completed-section">
                    <input
                      type="radio"
                      name="project-state"
                      value="3"
                      id="completed"
                      checked={
                        Object.keys(filters).indexOf("state") !== -1
                          ? filters.state === 3
                            ? true
                            : false
                          : false
                      }
                      onChange={(e) => updateFilters("state", e.target.value)}
                    />
                    <label htmlFor="completed" className="completed-label">
                      Completed
                    </label>
                  </div>
                </div>
              </div>
              <div className="actions">
                <button
                  className="clear-filters poppins-semibold"
                  onClick={() => clearFilters()}
                >
                  Clear
                </button>
                <button
                  className="apply-filters poppins-semibold"
                  onClick={() => applyFilters()}
                >
                  Apply
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
          {showSortingPopup ? (
            <div
              className={
                "sorting-popup" + (sortingPopupVisible ? " visible" : "")
              }
            >
              <button
                className="close-popup poppins-semibold"
                onClick={() => closeSortingPopup()}
              >
                Close
              </button>
              <div className="sort-form">
                <div>
                  <label
                    htmlFor="sort-by"
                    className="sort-by-label poppins-medium"
                  >
                    Sort by
                  </label>
                  <select
                    name="sort-by"
                    className="sort-by poppins-regular"
                    value={
                      Object.keys(sortBy).indexOf("by") !== -1
                        ? sortBy.by
                        : "default"
                    }
                    onChange={(e) =>
                      setSortBy({ ...sortBy, by: e.target.value })
                    }
                  >
                    <option value="default" defaultChecked>
                      Default
                    </option>
                    <option value="state">State</option>
                    <option value="deadline">Deadline</option>
                    <option value="updated">Updated</option>
                    <option value="created">Created</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="sort-type" className="poppins-medium">
                    Sort type
                  </label>
                  <div>
                    <div className="a-to-z-sort poppins-regular">
                      <input
                        type="radio"
                        name="sort-type"
                        id="a-to-z"
                        checked={
                          Object.keys(sortBy).indexOf("type") !== -1
                            ? sortBy.type === 1
                              ? true
                              : false
                            : false
                        }
                        onChange={() => setSortBy({ ...sortBy, type: 1 })}
                      />
                      <label htmlFor="a-to-z" className="a-to-z-sort-label">
                        A to Z
                      </label>
                    </div>
                    <div className="z-to-a sort poppins-regular">
                      <input
                        type="radio"
                        name="sort-type"
                        id="z-to-a"
                        checked={
                          Object.keys(sortBy).indexOf("type") !== -1
                            ? sortBy.type === 2
                              ? true
                              : false
                            : false
                        }
                        onChange={() => setSortBy({ ...sortBy, type: 2 })}
                      />
                      <label htmlFor="z-to-a" className="z-to-a-sort-label">
                        Z to A
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="actions">
                <button
                  className="clear-sort poppins-semibold"
                  onClick={() => clearSorting()}
                >
                  Clear
                </button>
                <button
                  className="apply-sort poppins-semibold"
                  onClick={() => applySorting()}
                >
                  Apply
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
          {showNewProjectForm ? (
            <NewProjectForm
              newProjectFormVisible={newProjectFormVisible}
              closeNewProjectForm={closeNewProjectForm}
              newProject={newProject}
              setNewProject={setNewProject}
              createNewProjectFn={createNewProjectFn}
            />
          ) : (
            ""
          )}
          <section className="projects-section">
            {userProjectsFetched ? (
              <table className="projects poppins-regular">
                <thead>
                  <tr>
                    <th className="poppins-semibold select-column">
                      <input
                        type="checkbox"
                        checked={allDisplayedProjectsSelected}
                        onChange={() => toggleSelectAllProjects()}
                        disabled={displayedProjects.length === 0}
                      />
                    </th>
                    <th className="poppins-semibold">Name</th>
                    <th
                      className={
                        "poppins-semibold" +
                        (sortingApplied > 0
                          ? sortBy.by === "state"
                            ? " sorted-by"
                            : ""
                          : "")
                      }
                    >
                      <div>
                        State
                        {sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1 ? (
                          sortBy.by === "state" ? (
                            <span>
                              {sortBy.type === 1 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}
                            </span>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </th>
                    <th className="poppins-semibold">Owner</th>
                    <th
                      className={
                        "poppins-semibold" +
                        (sortingApplied > 0
                          ? sortBy.by === "deadline"
                            ? " sorted-by"
                            : ""
                          : "")
                      }
                    >
                      <div>
                        Deadline
                        {sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1 ? (
                          sortBy.by === "deadline" ? (
                            <span>
                              {sortBy.type === 1 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}
                            </span>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </th>
                    <th className="poppins-semibold">Description</th>
                    <th
                      className={
                        "poppins-semibold" +
                        (sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1
                          ? sortBy.by === "updated"
                            ? " sorted-by"
                            : ""
                          : " sorted-by")
                      }
                    >
                      <div>
                        Updated
                        {sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1 ? (
                          sortBy.by === "updated" ? (
                            <span>
                              {sortBy.type === 1 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}
                            </span>
                          ) : (
                            ""
                          )
                        ) : (
                          <span>
                            {sortBy.type === 1 ? (
                              <FaArrowUp />
                            ) : (
                              <FaArrowDown />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="poppins-semibold">Updated by</th>
                    <th
                      className={
                        "poppins-semibold" +
                        (sortingApplied > 0
                          ? sortBy.by === "created"
                            ? " sorted-by"
                            : ""
                          : "")
                      }
                    >
                      <div>
                        Created
                        {sortingApplied > 0 &&
                        Object.keys(sortBy).indexOf("by") !== -1 ? (
                          sortBy.by === "created" ? (
                            <span>
                              {sortBy.type === 1 ? (
                                <FaArrowUp />
                              ) : (
                                <FaArrowDown />
                              )}
                            </span>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </th>
                    <th className="poppins-semibold">Created by</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProjects.map((project) => {
                    return (
                      <tr
                        key={project.project_id}
                        onClick={() =>
                          navigate(
                            `/auth/${user}/modern/project/${project.project_id}`,
                          )
                        }
                      >
                        <td className="select-column">
                          <div>
                            <input
                              type="checkbox"
                              checked={selectedProjectIds.includes(
                                project.project_id,
                              )}
                              onChange={() =>
                                toggleProjectSelection(project.project_id)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <span
                              className={projectStates.classes[project.state]}
                            >
                              <MdOutlineRadioButtonChecked />
                            </span>
                            <span title={project.name}>
                              {truncateProjectName(project.name)}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={
                              "poppins-semibold " +
                              projectStates.classes[project.state]
                            }
                          >
                            {projectStates.labels[project.state]}
                          </span>
                        </td>
                        <td>{project.owner === userId ? "Me" : ""}</td>
                        <td>
                          {new Date(project.deadline).toLocaleString("fr")}
                        </td>
                        <td className="description">
                          {truncateDescription(project.description)}
                        </td>
                        <td>
                          {new Date(project.updated_on).toLocaleString("fr")}
                        </td>
                        <td>{project.updated_by === userId ? "Me" : ""}</td>
                        <td>
                          {new Date(project.created_on).toLocaleString("fr")}
                        </td>
                        <td>{project.created_by === userId ? "Me" : ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
