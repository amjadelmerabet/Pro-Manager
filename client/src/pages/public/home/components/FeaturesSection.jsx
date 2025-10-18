import {
  LuChartPie,
  LuFilter,
  LuTextSearch,
  LuUserRoundCheck,
} from "react-icons/lu";
import { WiTime8 } from "react-icons/wi";
import { GrGroup } from "react-icons/gr";

import "./FeaturesSection.css";
import { IconContext } from "react-icons/lib";

export default function FeaturesSection() {
  return (
    <div className="features-section">
      <h2 className="section-title poppins-bold">Powerful Features</h2>
      <div className="features">
        <div className="feature">
          <div className="feature-details">
            <div className="feature-icon">
              <IconContext.Provider value={{ style: { color: "#0077B6", fontSize: "40px" }}}>
                <LuUserRoundCheck />
              </IconContext.Provider>
            </div>
            <h3 className="feature-title poppins-semibold">
              User authentication
            </h3>
            <div className="feature-description poppins-regular">
              Securely manage user access with features like sign-up, login, and
              password recovery. Ensure that only authorized users can access
              their personalized dashboards and project data.
            </div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-details">
            <div className="feature-icon">
              <IconContext.Provider value={{ style: { color: "#0077B6", fontSize: "40px" }}}>
                <WiTime8 />
              </IconContext.Provider>
            </div>
            <h3 className="feature-title poppins-semibold">
              Real time tracking
            </h3>
            <div className="feature-description poppins-regular">
              Keep up-to-date with live updates on task progress, project
              milestones, and team activities. See changes as they happen,
              ensuring transparency and efficient decision-making.
            </div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-details">
            <div className="feature-icon">
              <IconContext.Provider value={{ style: { color: "#0077B6", fontSize: "40px" }}}>
                <LuFilter />
              </IconContext.Provider>
            </div>
            <h3 className="feature-title poppins-semibold">Advanced filters</h3>
            <div className="feature-description poppins-regular">
              Quickly narrow down tasks and projects by applying filters such as
              status, priority, due date, or team member. Save time and find
              exactly what you need with minimal effort.
            </div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-details">
            <div className="feature-icon">
              <IconContext.Provider value={{ style: { color: "#0077B6", fontSize: "40px" }}}>
                <LuChartPie />
              </IconContext.Provider>
            </div>
            <h3 className="feature-title poppins-semibold">Charts & reports</h3>
            <div className="feature-description poppins-regular">
              Visualize your progress and performance through detailed charts
              and reports. Gain insights into task completion rates, team
              productivity, and project timelines for better planning.
            </div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-details">
            <div className="feature-icon">
              <IconContext.Provider value={{ style: { color: "#0077B6", fontSize: "40px" }}}>
                <GrGroup />
              </IconContext.Provider>
            </div>
            <h3 className="feature-title poppins-semibold">
              Team collaboration
            </h3>
            <div className="feature-description poppins-regular">
              Work seamlessly with your team by assigning tasks, sharing
              updates, and communicating in real-time. Enhance productivity and
              keep everyone aligned with a centralized workspace.
            </div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-details">
            <div className="feature-icon">
              <IconContext.Provider value={{ style: { color: "#0077B6", fontSize: "40px" } }}>
                <LuTextSearch />
              </IconContext.Provider>
            </div>
            <h3 className="feature-title poppins-semibold">Advanced search</h3>
            <div className="feature-description poppins-regular">
              Find tasks, projects, or team members instantly with a powerful
              search feature. Search using keywords, tags, or custom parameters
              to locate specific information with ease.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
