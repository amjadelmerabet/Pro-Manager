// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router";

// Styles
import "./Features.css";

/*
  To use real screenshots later, add files under client/src/assets/features/
  and pass them via the `image` field, for example:

  import dashboardShot from "../../../assets/features/dashboard.png";
  { id: "dashboard", image: dashboardShot, imageAlt: "Dashboard overview", ... }
*/

const features = [
  {
    id: "dashboard",
    title: "Your work, all in one place",
    description:
      "Start every day on a clear dashboard. See how your projects and tasks are doing, jump back into what you worked on last, and create something new in just a few clicks.",
    points: [
      "Quick summaries of what’s not started, in progress, or done",
      "Recent items so you can pick up where you left off",
      "Create a new project or task without leaving the page",
    ],
    visualLabel: "Dashboard",
    mockType: "dashboard",
  },
  {
    id: "projects",
    title: "Organize projects from start to finish",
    description:
      "Create projects, set deadlines, and track progress as you go. Switch between list, grid, or board views so you can see your work the way that feels most natural.",
    points: [
      "Add a name, description, and deadline for every project",
      "Move work through Not started, In progress, and Completed",
      "Filter and sort to focus on what matters right now",
    ],
    visualLabel: "Projects",
    mockType: "projects",
  },
  {
    id: "tasks",
    title: "Keep every task under control",
    description:
      "Break work into clear tasks with priorities and statuses. Whether something is high priority or a quick to-do, you always know what needs attention next.",
    points: [
      "Set priority to High, Medium, or Low",
      "Track status: To do, Doing, or Done",
      "View tasks as a list, grid, or kanban board",
    ],
    visualLabel: "Tasks",
    mockType: "tasks",
  },
  {
    id: "linking",
    title: "Connect tasks to the right projects",
    description:
      "Link tasks to a project when they belong together, or keep them standalone when they don’t. Everything stays tidy without forcing you into a rigid structure.",
    points: [
      "Attach a task to a project when you create it",
      "Link existing tasks from a project page",
      "Change or remove a link anytime from the task page",
    ],
    visualLabel: "Project & task linking",
    mockType: "linking",
  },
  {
    id: "dual-ui",
    title: "Choose the look that works for you",
    description:
      "Pro Manager offers two comfortable ways to work. Prefer a classic top menu with flexible views, or a modern side menu with clean tables? Switch whenever you like.",
    points: [
      "Classic view with list, grid, and kanban layouts",
      "Modern view with a simple side menu and tables",
      "Move between styles in one click — your choice is remembered",
    ],
    visualLabel: "Classic & Modern views",
    mockType: "dual-ui",
  },
  {
    id: "search",
    title: "Find what you need in seconds",
    description:
      "Search across your projects and tasks, then narrow results with filters. Sort by status, deadline, or priority so the most important work rises to the top.",
    points: [
      "Search by name across projects and tasks",
      "Filter by status and priority",
      "Sort by deadline, status, and more",
    ],
    visualLabel: "Search & filters",
    mockType: "search",
  },
  {
    id: "collaboration",
    title: "Leave notes and follow the story",
    description:
      "Add comments on projects and tasks to share context. The activity log quietly records what changed, so you can always see how work evolved over time.",
    points: [
      "Post comments directly on a project or task",
      "See a timeline of updates and notes together",
      "Review what changed — like status, priority, or deadline",
    ],
    visualLabel: "Comments & activity",
    mockType: "collaboration",
  },
  {
    id: "profile",
    title: "Make your account feel like yours",
    description:
      "Update your profile details, keep your sign-in secure, and pick a light or dark theme. Small personal touches that make daily work more comfortable.",
    points: [
      "Edit your name and email anytime",
      "Change your username or password when you need to",
      "Switch between light and dark themes",
    ],
    visualLabel: "Profile & themes",
    mockType: "profile",
  },
];

function FeatureScreenshot({ feature }) {
  if (feature.image) {
    return (
      <img
        src={feature.image}
        alt={feature.imageAlt || feature.visualLabel}
        className="feature-shot"
      />
    );
  }

  return (
    <div
      className={`feature-screenshot mock-${feature.mockType}`}
      aria-label={`${feature.visualLabel} preview`}
    >
      <div className="screenshot-chrome">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="screenshot-title poppins-regular">
          {feature.visualLabel}
        </span>
      </div>

      <div className="screenshot-body">
        {feature.mockType === "dashboard" && (
          <div className="mock-ui dashboard-ui">
            <div className="mock-stats">
              <div className="mock-stat">
                <span className="mock-stat-value">4</span>
                <span className="mock-stat-label">In progress</span>
              </div>
              <div className="mock-stat">
                <span className="mock-stat-value">7</span>
                <span className="mock-stat-label">To do</span>
              </div>
              <div className="mock-stat">
                <span className="mock-stat-value">12</span>
                <span className="mock-stat-label">Done</span>
              </div>
            </div>
            <div className="mock-panel">
              <div className="mock-line wide" />
              <div className="mock-line" />
              <div className="mock-line short" />
            </div>
          </div>
        )}

        {feature.mockType === "projects" && (
          <div className="mock-ui projects-ui">
            <div className="mock-tabs">
              <span className="active">Grid</span>
              <span>List</span>
              <span>Board</span>
            </div>
            <div className="mock-cards">
              <div className="mock-card">
                <strong>Website redesign</strong>
                <em className="status in-progress">In progress</em>
              </div>
              <div className="mock-card">
                <strong>Q2 launch</strong>
                <em className="status not-started">Not started</em>
              </div>
              <div className="mock-card">
                <strong>Team handbook</strong>
                <em className="status completed">Completed</em>
              </div>
            </div>
          </div>
        )}

        {feature.mockType === "tasks" && (
          <div className="mock-ui tasks-ui">
            <div className="mock-kanban">
              <div className="mock-column">
                <h4>To do</h4>
                <div className="mock-chip high">Write brief</div>
                <div className="mock-chip medium">Review copy</div>
              </div>
              <div className="mock-column">
                <h4>Doing</h4>
                <div className="mock-chip high">Design homepage</div>
              </div>
              <div className="mock-column">
                <h4>Done</h4>
                <div className="mock-chip low">Kickoff call</div>
              </div>
            </div>
          </div>
        )}

        {feature.mockType === "linking" && (
          <div className="mock-ui linking-ui">
            <div className="mock-project-box">Website redesign</div>
            <div className="mock-links">
              <span />
              <span />
            </div>
            <div className="mock-task-boxes">
              <div>Design homepage</div>
              <div>Write brief</div>
              <div className="standalone">Standalone task</div>
            </div>
          </div>
        )}

        {feature.mockType === "dual-ui" && (
          <div className="mock-ui dual-ui">
            <div className="mock-mode classic">
              <small>Classic</small>
              <div className="mock-topnav" />
              <div className="mock-grid-mini">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="mock-mode modern">
              <small>Modern</small>
              <div className="mock-sidebar-layout">
                <aside />
                <main>
                  <span />
                  <span />
                  <span />
                </main>
              </div>
            </div>
          </div>
        )}

        {feature.mockType === "search" && (
          <div className="mock-ui search-ui">
            <div className="mock-searchbar">Search projects and tasks…</div>
            <div className="mock-filters">
              <span className="active">All</span>
              <span>In progress</span>
              <span>High priority</span>
            </div>
            <div className="mock-results">
              <div>
                <strong>Website redesign</strong>
                <em>Project</em>
              </div>
              <div>
                <strong>Design homepage</strong>
                <em>Task</em>
              </div>
              <div>
                <strong>Review copy</strong>
                <em>Task</em>
              </div>
            </div>
          </div>
        )}

        {feature.mockType === "collaboration" && (
          <div className="mock-ui collaboration-ui">
            <div className="mock-comment">
              <div className="avatar" />
              <div>
                <strong>Alex</strong>
                <p>Updated the deadline to Friday.</p>
              </div>
            </div>
            <div className="mock-comment">
              <div className="avatar" />
              <div>
                <strong>Sam</strong>
                <p>Looks good — moving this to Doing.</p>
              </div>
            </div>
            <div className="mock-activity">Status changed: To do → Doing</div>
          </div>
        )}

        {feature.mockType === "profile" && (
          <div className="mock-ui profile-ui">
            <div className="mock-profile-header">
              <div className="avatar large" />
              <div>
                <strong>Jordan Lee</strong>
                <p>jordan@email.com</p>
              </div>
            </div>
            <div className="mock-theme-toggle">
              <span className="active">Light</span>
              <span>Dark</span>
            </div>
            <div className="mock-line wide" />
            <div className="mock-line" />
            <div className="mock-line short" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="features-page public">
      <div className="container">
        <Header />

        <section className="features-hero">
          <p className="features-eyebrow poppins-semibold">Features</p>
          <h2 className="features-hero-title poppins-bold">
            Everything you need to manage projects with confidence
          </h2>
          <p className="features-hero-subtitle poppins-regular">
            Pro Manager helps you plan projects, track tasks, and stay organized
            — whether you prefer a classic workspace or a modern one.
          </p>
        </section>

        <section className="features-list" aria-label="Product features">
          {features.map((feature, index) => {
            const imageOnLeft = index % 2 === 0;

            return (
              <article
                key={feature.id}
                className={`feature-row ${imageOnLeft ? "image-left" : "image-right"}`}
              >
                <div className="feature-media">
                  <FeatureScreenshot feature={feature} />
                </div>

                <div className="feature-copy">
                  <h3 className="feature-title poppins-semibold">
                    {feature.title}
                  </h3>
                  <p className="feature-description poppins-regular">
                    {feature.description}
                  </p>
                  <ul className="feature-points poppins-regular">
                    {feature.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </section>

        <section className="features-cta">
          <h3 className="features-cta-title poppins-semibold">
            Ready to get organized?
          </h3>
          <p className="features-cta-text poppins-regular">
            Create a free account and start managing your projects and tasks
            today.
          </p>
          <Link to="/signup" className="features-cta-button poppins-semibold">
            Get started
          </Link>
        </section>
      </div>
      <Footer />
    </div>
  );
}
