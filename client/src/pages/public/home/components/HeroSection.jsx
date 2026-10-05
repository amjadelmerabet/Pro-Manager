import { IconContext } from "react-icons/lib";
import { FaPlay } from "react-icons/fa";
import { TbFolder, TbSquareCheck } from "react-icons/tb";

import "./HeroSection.css";

const recentPages = [
  {
    type: "project",
    name: "Website redesign",
    status: "In progress",
    owner: "You",
    updated: "2 hours ago",
  },
  {
    type: "task",
    name: "Design homepage",
    status: "Doing",
    owner: "You",
    updated: "Yesterday",
  },
  {
    type: "project",
    name: "Q2 launch plan",
    status: "Not started",
    owner: "You",
    updated: "3 days ago",
  },
  {
    type: "task",
    name: "Write project brief",
    status: "To do",
    owner: "You",
    updated: "Last week",
  },
];

const projectReports = [
  { name: "Projects not started", value: 2 },
  { name: "Projects in progress", value: 4 },
  { name: "Projects completed", value: 8 },
];

const taskReports = [
  { name: "Tasks to do", value: 7 },
  { name: "Tasks in progress", value: 3 },
  { name: "Tasks done", value: 15 },
];

function DashboardVideoMock() {
  return (
    <div className="dashboard-video-mock" aria-hidden="true">
      <div className="mock-auth-header">
        <div className="mock-brand poppins-bold">Pro Manager</div>
        <ul className="mock-nav poppins-semibold">
          <li className="active">Dashboard</li>
          <li>Projects</li>
          <li>Tasks</li>
          <li>Insights</li>
        </ul>
        <div className="mock-search poppins-regular">Global search …</div>
        <div className="mock-profile-dot" />
      </div>

      <div className="mock-dashboard-body">
        <aside className="mock-side-menu">
          <p className="mock-welcome poppins-semibold">Welcome, Jordan</p>
          <div className="mock-menu-group">
            <div className="mock-menu-header poppins-medium">Favorites</div>
            <ul className="poppins-regular">
              <li>My projects</li>
              <li>My tasks</li>
            </ul>
          </div>
          <div className="mock-menu-group">
            <div className="mock-menu-header poppins-medium">Projects</div>
            <ul className="poppins-regular">
              <li>Create new</li>
              <li>All projects</li>
              <li>In progress</li>
            </ul>
          </div>
          <div className="mock-menu-group">
            <div className="mock-menu-header poppins-medium">Tasks</div>
            <ul className="poppins-regular">
              <li>Create new</li>
              <li>All tasks</li>
              <li>To do</li>
            </ul>
          </div>
        </aside>

        <div className="mock-main">
          <div className="mock-column-1">
            <section className="mock-recent-pages">
              <h4 className="mock-section-title poppins-bold">Recent pages</h4>
              <div className="mock-pages">
                {recentPages.map((page) => (
                  <div
                    key={page.name}
                    className={`mock-recent-page${page.name === "Website redesign" ? " selected" : ""}`}
                  >
                    <div className="mock-page-header">
                      <IconContext.Provider
                        value={{
                          style: { color: "#0077b6", fontSize: "12px" },
                        }}
                      >
                        {page.type === "project" ? (
                          <TbFolder />
                        ) : (
                          <TbSquareCheck />
                        )}
                      </IconContext.Provider>
                      <span className="poppins-medium">{page.name}</span>
                    </div>
                    <div className="mock-page-meta poppins-regular">
                      <span>Status</span>
                      <span>{page.status}</span>
                      <span>Owner</span>
                      <span>{page.owner}</span>
                      <span>Updated</span>
                      <span>{page.updated}</span>
                    </div>
                    <div className="mock-open-link poppins-regular-italic">
                      Click to open
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mock-reports">
              {[...projectReports, ...taskReports].map((report) => (
                <div key={report.name} className="mock-report">
                  <div className="mock-report-title poppins-bold">
                    {report.name}
                  </div>
                  <div className="mock-report-value poppins-bold">
                    {report.value}
                  </div>
                  <div className="mock-report-link poppins-regular-italic">
                    Show the list
                  </div>
                </div>
              ))}
            </section>

            <section className="mock-quick-actions">
              <h4 className="mock-section-title poppins-bold">Quick actions</h4>
              <ul className="mock-actions poppins-regular">
                <li>Create a new task</li>
                <li>Create a new project</li>
                <li className="disabled">Complete today&apos;s tasks</li>
              </ul>
            </section>
          </div>

          <aside className="mock-selected-panel">
            <div className="mock-selected-header">
              <IconContext.Provider
                value={{ style: { color: "white", fontSize: "14px" } }}
              >
                <TbFolder />
              </IconContext.Provider>
              <span className="poppins-bold">Website redesign</span>
            </div>
            <div className="mock-selected-details poppins-regular">
              <div>
                <span>Status</span>
                <span>In progress</span>
              </div>
              <div>
                <span>Assigned to</span>
                <span>You</span>
              </div>
              <div>
                <span>Updated</span>
                <span>2 hours ago</span>
              </div>
              <div>
                <span>Updated by</span>
                <span>You</span>
              </div>
              <div>
                <span>Created</span>
                <span>Last week</span>
              </div>
              <div>
                <span>Created by</span>
                <span>You</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="hero-section">
      <div className="overview">
        <p className="overview-text poppins-regular">
          Welcome to <span className="poppins-semibold">Pro Manager</span>, the
          ultimate tool for managing your projects and tasks effortlessly.
          Whether you&apos;re working solo or collaborating with a team, our app
          helps you stay organized, prioritize effectively, and achieve your
          goals faster
        </p>
        <button className="signup-button poppins-bold">Sign up for free</button>
      </div>
      <div className="video-container">
        <div
          className="video"
          role="img"
          aria-label="Preview of the Pro Manager classic dashboard"
        >
          <DashboardVideoMock />
          <button
            type="button"
            className="video-play-button"
            aria-label="Play product demo video"
          >
            <IconContext.Provider
              value={{ style: { color: "white", fontSize: "28px" } }}
            >
              <FaPlay />
            </IconContext.Provider>
          </button>
        </div>
      </div>
    </div>
  );
}
