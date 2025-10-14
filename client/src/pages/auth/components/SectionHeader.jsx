import { PiListBold } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import { IconContext } from "react-icons/lib";
import { useState } from "react";

import "./SectionHeader.css";
import { IoClose } from "react-icons/io5";

export default function SectionHeader(props) {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleButtonClick = () => {
    props.setPopupDisplay({ ...props.popupDisplay, active: true });
  };

  const setListView = () => {
    props.setSelectedView("list");
  };

  const setGridView = () => {
    props.setSelectedView("grid");
  };

  const openFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const changeFilter = (type, value) => {
    if (type === "state") {
      props.setFilter({ state: value });
    }
  };

  const cancelFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const closeFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilter = () => {
    props.setFilter({ state: "0" });
    props.setApplyFilters(0);
    props.setFilterCleared(true);
  };

  const applyFilter = () => {
    props.setFilterCleared(false);
    setTimeout(() => {
      props.setApplyFilters(props.applyFilters + 1);
      setFilterOpen(!filterOpen);
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
        </div>
        <button
          className={
            "filter-button poppins-regular" +
            (Object.keys(props.filter).length === 1 &&
            Number(props.filter.state) === 0
              ? " filter-popup"
              : "") +
            (filterOpen ? " open" : "") +
            (props.applyFilters === 0 ? " draft-filters" : "")
          }
          data-filter-number-popup={Object.keys(props.filter).length}
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
                <option value="1">To do</option>
                <option value="2">Doing</option>
                <option value="3">Done</option>
              </select>
            </div>
          ) : (
            ""
          )}
          <div className="filter-section-buttons">
            {Object.keys(props.filter).length === 1 &&
            Number(props.filter.state) === 0 &&
            props.applyFilters === 0 ? (
              <button
                className="cancel-filters-button"
                onClick={() => cancelFilter()}
              >
                Cancel
              </button>
            ) : (
              <button
                className="clear-filters-button"
                onClick={() => clearFilter()}
              >
                Clear
              </button>
            )}
            <button
              className="apply-filters-button"
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
