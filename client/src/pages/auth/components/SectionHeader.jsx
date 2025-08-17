import { PiListBold } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import { IconContext } from "react-icons/lib";

import "./SectionHeader.css";

export default function SectionHeader(props) {

  const handleButtonClick = () => {
    props.setPopupDisplay({ ...props.popupDisplay, active: true });
  };

  const setListView = () => {
    props.setSelectedView("list");
  }

  const setGridView = () => {
    props.setSelectedView("grid");
  }

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
        <div className="filter-button poppins-regular">
          <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
            <FiFilter />
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}
