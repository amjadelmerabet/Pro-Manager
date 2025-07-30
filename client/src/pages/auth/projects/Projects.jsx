import AuthHeader from "../components/AuthHeader";

import { PiListBold } from "react-icons/pi";
import { FiFilter } from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import { IconContext } from "react-icons/lib";
import { FaRegFolder } from "react-icons/fa";

import "./Projects.css";

export default function ProjectsPage() {
  return (
    <div className="projects-page">
      <div className="auth-header-container">
        <AuthHeader />
      </div>
      <div className="container">
        <div className="header">
          <h2 className="title poppins-bold">Your Projects</h2>
          <div className="page-buttons">
            <div className="select-view">
              <div className="list-view">
                <IconContext.Provider value={{ style: { fontSize: "28px" } }}>
                  <PiListBold />
                </IconContext.Provider>
              </div>
              <div className="grid-view selected">
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
        <div className="projects">
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
          <div className="project">
            <div className="project-header">
              <div className="project-icon">
                <IconContext.Provider
                  value={{
                    style: { color: "var(--primary-color)", fontSize: "125%" },
                  }}
                >
                  <FaRegFolder />
                </IconContext.Provider>
              </div>
              <div className="project-name poppins-bold">English class</div>
            </div>
            <table className="project-body">
              <tbody>
                <tr>
                  <td className="property poppins-bold">State</td>
                  <td className="value poppins-regular">In progress</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Category</td>
                  <td className="value poppins-regular">School</td>
                </tr>
                <tr>
                  <td className="property poppins-bold">Created by</td>
                  <td className="value poppins-regular">You</td>
                </tr>
              </tbody>
            </table>
            <div className="updated poppins-regular">Updated 2h ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
