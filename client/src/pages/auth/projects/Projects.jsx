import AuthHeader from "../components/AuthHeader";

import SectionHeader from "../components/SectionHeader";
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
        <SectionHeader title="Your projects" selectedView="grid" />
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
