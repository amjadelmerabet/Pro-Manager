import { PiListBold } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import { IconContext } from "react-icons/lib";

import "./SectionHeader.css";

export default function SectionHeader(props) {

  return (
    <div className="section-header">
        <h2 className="title poppins-bold">{props.title}</h2>
        <div className="page-buttons">
          <div className="select-view">
            <div className={"list-view " + (props.selectedView == "list" ? "selected" : "")}>
              <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
                <PiListBold />
              </IconContext.Provider>
            </div>
            <div className={"grid-view " + (props.selectedView == "grid" ? "selected" : "")}>
              <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
                <HiViewGrid />
              </IconContext.Provider>
            </div>
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
