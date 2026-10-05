import { LuExternalLink } from "react-icons/lu";
import { IconContext } from "react-icons/lib";
import { Link } from "react-router";
import {
  TbLock,
  TbShieldCheck,
  TbActivity,
  TbFilter,
  TbChartBar,
} from "react-icons/tb";

import "./DeepDiveSection.css";

const deepDiveItems = [
  {
    index: 1,
    mockType: "auth",
    description:
      "A secure system to manage user access, ensuring data privacy and personalized user experiences.",
    points: [
      "Ensures data security by restricting unauthorized access.",
      "Creates a personalized experience for users based on their accounts.",
    ],
  },
  {
    index: 2,
    mockType: "tracking",
    description:
      "A dynamic feature that provides live updates on the status of tasks, projects, and team activities.",
    points: [
      "Promotes transparency within teams.",
      "Reduces delays caused by miscommunication or outdated information.",
      "Enhances user experience by making updates instantaneous.",
    ],
  },
  {
    index: 3,
    mockType: "filters",
    description:
      "A flexible tool to help users organize and view relevant data quickly.",
    points: [
      "Saves time by reducing the need to sift through unnecessary data.",
      "Helps users focus on the most critical tasks or projects.",
      "Improves workflow organization, especially in complex projects.",
    ],
  },
  {
    index: 4,
    mockType: "reports",
    description:
      "Visual and analytical tools to help users measure and understand project and team performance.",
    points: [
      "Enhances decision-making with data-driven insights.",
      "Helps users identify bottlenecks and areas for improvement.",
      "Provides accountability by tracking and showcasing progress.",
    ],
  },
];

function AuthMock() {
  return (
    <div className="dive-mock auth-mock">
      <div className="dive-mock-chrome">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="chrome-label poppins-regular">Secure sign-in</span>
      </div>
      <div className="dive-mock-body">
        <div className="auth-card">
          <div className="auth-badge">
            <IconContext.Provider
              value={{ style: { color: "#0077b6", fontSize: "28px" } }}
            >
              <TbShieldCheck />
            </IconContext.Provider>
          </div>
          <h4 className="poppins-bold">Welcome back</h4>
          <p className="poppins-regular">Sign in to your workspace</p>
          <div className="auth-field">
            <TbLock />
            <span className="poppins-regular">jordan@email.com</span>
          </div>
          <div className="auth-field masked">
            <TbLock />
            <span>••••••••••</span>
          </div>
          <div className="auth-button poppins-semibold">Sign in</div>
          <div className="auth-secure-note poppins-regular">
            Protected session · Personal dashboard
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingMock() {
  const events = [
    {
      title: "Design homepage",
      change: "To do → Doing",
      time: "Just now",
      tone: "live",
    },
    {
      title: "Website redesign",
      change: "Deadline updated",
      time: "2 min ago",
      tone: "update",
    },
    {
      title: "Write project brief",
      change: "Marked Done",
      time: "8 min ago",
      tone: "done",
    },
  ];

  return (
    <div className="dive-mock tracking-mock">
      <div className="dive-mock-chrome">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="chrome-label poppins-regular">Live activity</span>
      </div>
      <div className="dive-mock-body">
        <div className="tracking-header">
          <div className="live-pill poppins-semibold">
            <span className="pulse" />
            Live
          </div>
          <IconContext.Provider
            value={{ style: { color: "#0077b6", fontSize: "20px" } }}
          >
            <TbActivity />
          </IconContext.Provider>
        </div>
        <div className="tracking-feed">
          {events.map((event) => (
            <div key={event.title} className={`tracking-item ${event.tone}`}>
              <div className="tracking-item-top">
                <strong className="poppins-semibold">{event.title}</strong>
                <span className="poppins-regular">{event.time}</span>
              </div>
              <div className="tracking-change poppins-regular">
                {event.change}
              </div>
            </div>
          ))}
        </div>
        <div className="tracking-status-row">
          <div>
            <em>4</em>
            <span>In progress</span>
          </div>
          <div>
            <em>7</em>
            <span>To do</span>
          </div>
          <div>
            <em>12</em>
            <span>Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FiltersMock() {
  return (
    <div className="dive-mock filters-mock">
      <div className="dive-mock-chrome">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="chrome-label poppins-regular">Smart filters</span>
      </div>
      <div className="dive-mock-body">
        <div className="filters-toolbar">
          <div className="filters-search poppins-regular">
            <TbFilter />
            Filter by status, priority…
          </div>
          <div className="filter-chips">
            <span className="active">In progress</span>
            <span className="active">High</span>
            <span>All projects</span>
            <span>This week</span>
          </div>
        </div>
        <div className="filtered-results">
          <div className="result-row highlight">
            <strong>Design homepage</strong>
            <em className="priority high">High</em>
            <em className="status doing">Doing</em>
          </div>
          <div className="result-row">
            <strong>Launch checklist</strong>
            <em className="priority high">High</em>
            <em className="status doing">Doing</em>
          </div>
          <div className="result-row dimmed">
            <strong>Team handbook</strong>
            <em className="priority medium">Medium</em>
            <em className="status todo">To do</em>
          </div>
          <div className="result-row dimmed">
            <strong>Q2 launch plan</strong>
            <em className="priority low">Low</em>
            <em className="status todo">To do</em>
          </div>
        </div>
        <div className="filter-footnote poppins-regular">
          Showing 2 of 18 items
        </div>
      </div>
    </div>
  );
}

function ReportsMock() {
  const bars = [
    { label: "Not started", value: 28, color: "#90e0ef" },
    { label: "In progress", value: 54, color: "#0077b6" },
    { label: "Completed", value: 78, color: "#023e8a" },
  ];

  return (
    <div className="dive-mock reports-mock">
      <div className="dive-mock-chrome">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="chrome-label poppins-regular">Progress reports</span>
      </div>
      <div className="dive-mock-body">
        <div className="reports-top">
          <div>
            <h4 className="poppins-bold">This month</h4>
            <p className="poppins-regular">Project & task overview</p>
          </div>
          <IconContext.Provider
            value={{ style: { color: "#0077b6", fontSize: "22px" } }}
          >
            <TbChartBar />
          </IconContext.Provider>
        </div>
        <div className="report-cards">
          <div className="mini-report">
            <span>Projects</span>
            <strong>14</strong>
          </div>
          <div className="mini-report">
            <span>Tasks</span>
            <strong>25</strong>
          </div>
          <div className="mini-report accent">
            <span>On track</span>
            <strong>82%</strong>
          </div>
        </div>
        <div className="report-bars">
          {bars.map((bar) => (
            <div key={bar.label} className="report-bar-row">
              <span className="poppins-regular">{bar.label}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${bar.value}%`, background: bar.color }}
                />
              </div>
              <em>{bar.value}%</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeepDiveMock({ type }) {
  switch (type) {
    case "auth":
      return <AuthMock />;
    case "tracking":
      return <TrackingMock />;
    case "filters":
      return <FiltersMock />;
    case "reports":
      return <ReportsMock />;
    default:
      return null;
  }
}

export default function DeepDiveSection() {
  return (
    <div className="deep-dive-section">
      <h2 className="section-title poppins-semibold">Dive Deeper</h2>
      <div className="deep-dive-features">
        {deepDiveItems.map((item) => (
          <div
            key={item.index}
            className="deep-dive-feature poppins-regular"
            data-feature-index={item.index}
          >
            <div>
              <div className="attachment">
                <DeepDiveMock type={item.mockType} />
              </div>
            </div>
            <div>
              <div className="feature-explained">
                <div className="short-description poppins-semibold">
                  {item.description}
                </div>
                <ul className="key-points poppins-regular">
                  {item.points.map((point) => (
                    <li key={point} className="key-point">
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="link">
                  <Link
                    to="/features"
                    className="read-more poppins-regular-italic"
                  >
                    Read more ...
                  </Link>
                  <IconContext.Provider
                    value={{ style: { color: "blue", fontSize: "120%" } }}
                  >
                    <LuExternalLink />
                  </IconContext.Provider>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="see-more-features">
        <Link to="/features" className="see-more poppins-regular-italic">
          See more features
        </Link>
      </div>
    </div>
  );
}
