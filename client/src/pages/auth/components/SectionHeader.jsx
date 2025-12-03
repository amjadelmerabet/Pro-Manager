import { useState } from "react";
import { IconContext } from "react-icons/lib";
import { PiListBold } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";
import { LuKanban } from "react-icons/lu";

import "./SectionHeader.css";

export default function SectionHeader(props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [kanbanSelectOpen, setKanbanSelectOpen] = useState(false);
  const [kanbanSelectVisible, setKanbanSelectVisible] = useState(false);
  const [toolTipShown, setToolTipShown] = useState(false);
  const [toolTipVisible, setToolTipVisible] = useState(false);

  const handleButtonClick = () => {
    props.setPopupDisplay({ ...props.popupDisplay, active: true });
  };

  const setListView = () => {
    handleKanbanSelect();
    props.setSelectedView("list");
    handleKanbanSelect("list");
  };

  const setGridView = () => {
    handleKanbanSelect();
    props.setSelectedView("grid");
    handleKanbanSelect("grid");
  };

  const handleKanbanSelect = (selectedView) => {
    if (!kanbanSelectOpen && selectedView === "kanban") {
      setTimeout(() => {
        setKanbanSelectOpen(true);
      }, 250);
      setTimeout(() => {
        setKanbanSelectVisible(true);
      }, 500);
    } else {
      setTimeout(() => {
        setKanbanSelectVisible(false);
      }, 250);
      setTimeout(() => {
        setKanbanSelectOpen(false);
      }, 500);
    }
  };

  const openKanbanSelect = () => {
    handleKanbanSelect(props.selectedView);
  };

  const setKanbanView = () => {
    if (props.page === "tasks") {
      if (props.groupBy !== "priority") {
        props.setGroupBy("state");
      }
    }
    props.setSelectedView("kanban");
  };

  const openSortPopup = () => {
    if (filterOpen) {
      setFilterOpen(!filterOpen);
    }
    setSortOpen(!sortOpen);
  };

  const openFilter = () => {
    if (sortOpen) {
      setSortOpen(!sortOpen);
    }
    setFilterOpen(!filterOpen);
  };

  const changeSort = (value) => {
    if (value === "0") {
      props.setSort({ sort_by: value, type: 1 });
    } else {
      props.setSort({ ...props.sort, sort_by: value });
    }
  };

  const changeFilter = (type, value) => {
    if (type === "state") {
      props.setFilter((current) => {
        return { ...current, state: value };
      });
    } else if (type === "priority") {
      props.setFilter((current) => {
        return { ...current, priority: value };
      });
    }
  };

  const cancelSort = () => {
    props.setSort({ sort_by: "0", type: 1 });
    setSortOpen(!sortOpen);
  };

  const cancelFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const closeSortPopup = () => {
    setSortOpen(!sortOpen);
  };

  const closeFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearSort = () => {
    props.setSort({ sort_by: "0", type: 1 });
    props.setApplySort(0);
  };

  const clearFilter = () => {
    props.setFilter({ state: "0", priority: "0" });
    props.setApplyFilters(0);
  };

  const applySort = () => {
    setTimeout(() => {
      props.setApplySort(props.applySort + 1);
      setSortOpen(!sortOpen);
    });
  };

  const applyFilter = () => {
    setTimeout(() => {
      props.setApplyFilters(props.applyFilters + 1);
      setFilterOpen(!filterOpen);
    }, 250);
  };

  const setAscendingSort = () => {
    props.setSort({ ...props.sort, type: 1 });
  };

  const setDescendingSort = () => {
    props.setSort({ ...props.sort, type: 2 });
  };

  const groupByState = () => {
    props.setGroupBy("state");
    props.setSelectedView("kanban");
    handleKanbanSelect(props.selectedView);
  };

  const groupByPriority = () => {
    props.setGroupBy("priority");
    props.setSelectedView("kanban");
    handleKanbanSelect(props.selectedView);
  };

  const showToolTip = () => {
    setToolTipShown(true);
    setTimeout(() => {
      setToolTipVisible(true);
    }, 250);
  };

  const hideToolTip = () => {
    setToolTipVisible(false);
    setTimeout(() => {
      setToolTipShown(false);
    }, 250);
  };

  return (
    <div className="section-header">
      <h2 className="title poppins-bold">{props.title}</h2>
      <div className="search">
        <input
          type="text"
          name="search"
          id="search-input"
          className="search-input poppins-regular"
          placeholder={
            "Search for a " +
            (props.page === "tasks" ? "task" : "project") +
            " ..."
          }
          onChange={(event) => props.setSearch(event.target.value)}
        />
      </div>
      <div className="page-buttons">
        <div className="actions">
          <button
            className="create-new poppins-regular"
            onClick={() => handleButtonClick()}
          >
            Create a new {props.page === "projects" ? "project" : "task"}
          </button>
        </div>
        <div className="select-view">
          <button
            className={
              "list-view" + (props.selectedView == "list" ? " selected" : "")
            }
            onClick={() => setListView()}
          >
            <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
              <PiListBold />
            </IconContext.Provider>
          </button>
          <button
            className={
              "grid-view" + (props.selectedView == "grid" ? " selected" : "")
            }
            onClick={() => setGridView()}
          >
            <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
              <HiViewGrid />
            </IconContext.Provider>
          </button>
          <button
            className={
              "kanban-view" +
              (props.selectedView === "kanban" ? " selected" : "")
            }
            onClick={() => setKanbanView()}
            onDoubleClick={() => openKanbanSelect()}
            onMouseEnter={() => showToolTip()}
            onMouseLeave={() => hideToolTip()}
          >
            {toolTipShown ? (
              <div
                className={
                  "tooltip poppins-regular" + (toolTipVisible ? " visible" : "")
                }
              >
                Double click
              </div>
            ) : (
              ""
            )}
            <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
              <LuKanban />
            </IconContext.Provider>
          </button>
          {kanbanSelectOpen ? (
            <div
              className={
                "kanban-select poppins-regular" +
                (kanbanSelectVisible ? " visible" : "")
              }
            >
              <button
                className="group-by-state poppins-regular"
                onClick={() => groupByState()}
              >
                State
              </button>
              <button
                className="group-by-priority poppins-regular"
                onClick={() => groupByPriority()}
              >
                Priority
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <button
          className={
            "sort-button poppins-regular" +
            (Number(props.sort.sort_by) === 0 ? " no-sort" : "") +
            (props.applySort === 0 && Number(props.sort.sort_by) !== 0
              ? " draft-sort"
              : "")
          }
          onClick={() => openSortPopup()}
        >
          <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
            <TbArrowsSort />
          </IconContext.Provider>
        </button>
        <div
          className={
            "sort-popup poppins-regular" + (sortOpen ? " visible" : "")
          }
        >
          <div className="close-sort-popup" onClick={() => closeSortPopup()}>
            <IconContext.Provider
              value={{ style: { color: "rgb(200, 0, 0)" } }}
            >
              <IoClose />
            </IconContext.Provider>
          </div>
          {props.page === "projects" ? (
            <div className="sort-by-section">
              <label htmlFor="sort-by" className="sort-label">
                Sort by
              </label>
              <select
                name="sort-by"
                className="poppins-regular"
                id="sort-by"
                value={props.sort.sort_by}
                onChange={(event) => changeSort(event.target.value)}
              >
                <option value="0">-- None --</option>
                <option value="1">State</option>
                <option value="2">Deadline</option>
              </select>
            </div>
          ) : props.page === "tasks" ? (
            <div className="sort-by-section">
              <label htmlFor="sort-by" className="sort-label">
                Sort by
              </label>
              <select
                name="sort-by"
                className="poppins-regular"
                id="sort-by"
                value={props.sort.sort_by}
                onChange={(event) => changeSort(event.target.value)}
              >
                <option value="0">-- None --</option>
                {props.groupBy === "priority" ||
                props.selectedView !== "kanban" ? (
                  <option value="1">State</option>
                ) : (
                  ""
                )}
                {props.groupBy === "state" ||
                props.selectedView !== "kanban" ? (
                  <option value="2">Priority</option>
                ) : (
                  ""
                )}
              </select>
            </div>
          ) : (
            ""
          )}
          {Number(props.sort.sort_by) !== 0 ? (
            <div className="sort-type">
              <div className="ascending-sort-section poppins-regular">
                <label
                  htmlFor="ascending-sort"
                  className="ascending-sort-label"
                >
                  Ascending
                </label>
                <input
                  type="radio"
                  name="sort-type"
                  id="ascending-sort"
                  className="ascending-sort"
                  checked={props.sort.type === 1}
                  onChange={(event) =>
                    event.target.value === "on" ? setAscendingSort() : ""
                  }
                />
              </div>
              <div className="descending-sort-section poppins-regular">
                <label
                  htmlFor="descending-sort"
                  className="descending-sort-label"
                >
                  Descending
                </label>
                <input
                  type="radio"
                  name="sort-type"
                  id="descending-sort"
                  className="descending-sort"
                  checked={props.sort.type === 2}
                  onChange={(event) =>
                    event.target.value === "on" ? setDescendingSort() : ""
                  }
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="sort-actions">
            {(Object.keys(props.sort).length === 2 &&
              Number(props.sort.sort_by) === 0) ||
            props.applySort === 0 ? (
              <button
                className="cancel-sort-button poppins-regular"
                onClick={() => cancelSort()}
              >
                Cancel
              </button>
            ) : (
              <button
                className="clear-sort-button poppins-regular"
                onClick={() => clearSort()}
              >
                Clear
              </button>
            )}
            <button
              className={
                "apply-sort-button poppins-regular" +
                (Number(props.sort.sort_by) === 0 ? " feature-disabled" : "")
              }
              onClick={() => applySort()}
            >
              Apply
            </button>
          </div>
        </div>
        <button
          className={
            "filter-button poppins-regular" +
            (Number(props.filter.state) === 0 &&
            Number(props.filter.priority) === 0
              ? " no-filters"
              : "") +
            (filterOpen ? " open" : "") +
            (props.applyFilters === 0 ? " draft-filters" : "")
          }
          data-filter-number-popup={
            Object.values(props.filter).filter((property) =>
              property !== "0" ? property : ""
            ).length
          }
          onClick={() => openFilter()}
        >
          <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
            <FiFilter />
          </IconContext.Provider>
        </button>
        <div
          className={"filter poppins-regular" + (filterOpen ? " visible" : "")}
        >
          <div className="close-filter-popup" onClick={() => closeFilter()}>
            <IconContext.Provider
              value={{ style: { color: "rgb(200, 0, 0)" } }}
            >
              <IoClose />
            </IconContext.Provider>
          </div>
          {props.page === "projects" ? (
            <div className="state-section">
              <label htmlFor="select-state" className="select-state-label">
                State
              </label>
              <select
                name="select-state"
                id="select-state"
                className="poppins-regular"
                value={props.filter.state}
                onChange={(event) => changeFilter("state", event.target.value)}
              >
                <option value="0">-- None --</option>
                <option value="1">Not started</option>
                <option value="2">In progress</option>
                <option value="3">Completed</option>
              </select>
            </div>
          ) : props.page === "tasks" ? (
            <div className="filters">
              <div className="state-section">
                <label htmlFor="select-state" className="select-state-label">
                  State
                </label>
                <select
                  name="select-state"
                  id="select-state"
                  className="poppins-regular"
                  value={props.filter.state}
                  onChange={(event) =>
                    changeFilter("state", event.target.value)
                  }
                >
                  <option value="0">-- None --</option>
                  <option value="1">To do</option>
                  <option value="2">Doing</option>
                  <option value="3">Done</option>
                </select>
              </div>
              <div className="priority-section">
                <label
                  htmlFor="select-priority"
                  className="select-priority-label"
                >
                  Priority
                </label>
                <select
                  name="priority-select"
                  id="priority-select"
                  className="poppins-regular"
                  value={props.filter.priority}
                  onChange={(event) =>
                    changeFilter("priority", event.target.value)
                  }
                >
                  <option value="0">-- None --</option>
                  <option value="1">High</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </select>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="filter-section-buttons">
            {Number(props.filter.state) === 0 &&
            Number(props.filter.priority) === 0 &&
            props.applyFilters === 0 ? (
              <button
                className="cancel-filters-button poppins-regular"
                onClick={() => cancelFilter()}
              >
                Cancel
              </button>
            ) : (
              <button
                className="clear-filters-button poppins-regular"
                onClick={() => clearFilter()}
              >
                Clear
              </button>
            )}
            <button
              className="apply-filters-button poppins-regular"
              onClick={() => applyFilter()}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
