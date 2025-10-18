import { LuExternalLink } from "react-icons/lu";
import { IconContext } from "react-icons/lib";
import { FaRegImages } from "react-icons/fa";
import { Link } from "react-router";

import "./DeepDiveSection.css";

export default function DeepDiveSection() {
  return (
    <div className="deep-dive-section">
      <h2 className="section-title poppins-semibold">Dive Deeper</h2>
      <div className="deep-dive-features">
        <div className="deep-dive-feature poppins-regular" data-feature-index="1">
          <div>
            <div className="attachment">
              <IconContext.Provider
                value={{ style: { color: "white", fontSize: "48px" } }}
              >
                <FaRegImages />
              </IconContext.Provider>
            </div>
          </div>
          <div>
            <div className="feature-explained">
              <div className="short-description poppins-semibold">
                A secure system to manage user access, ensuring data privacy and
                personalized user experiences.
              </div>
              <ul className="key-points poppins-regular">
                <li className="key-point">
                  Ensures data security by restricting unauthorized access.
                </li>
                <li className="key-point">
                  Creates a personalized experience for users based on their
                  accounts.
                </li>
              </ul>
              <div className="link">
                <a
                  href="/auth/dashboard"
                  className="read-more poppins-regular-italic"
                >
                  Read more ...
                </a>
                <IconContext.Provider
                  value={{ style: { color: "blue", fontSize: "120%" } }}
                >
                  <LuExternalLink />
                </IconContext.Provider>
              </div>
            </div>
          </div>
        </div>
        <div className="deep-dive-feature poppins-regular" data-feature-index="2">
          <div>
            <div className="attachment">
              <IconContext.Provider
                value={{ style: { color: "white", fontSize: "48px" } }}
              >
                <FaRegImages />
              </IconContext.Provider>
            </div>
          </div>
          <div>
            <div className="feature-explained">
              <div className="short-description poppins-semibold">
                A dynamic feature that provides live updates on the status of
                tasks, projects, and team activities.
              </div>
              <ul className="key-points poppins-regular">
                <li className="key-point">
                  Promotes transparency within teams.
                </li>
                <li className="key-point">
                  Reduces delays caused by miscommunication or outdated
                  information.
                </li>
                <li className="key-point">
                  Enhances user experience by making updates instantaneous.
                </li>
              </ul>
              <div className="link">
                <a href="" className="read-more poppins-regular-italic">
                  Read more ...
                </a>
                <IconContext.Provider
                  value={{ style: { color: "blue", fontSize: "120%" } }}
                >
                  <LuExternalLink />
                </IconContext.Provider>
              </div>
            </div>
          </div>
        </div>
        <div className="deep-dive-feature poppins-regular" data-feature-index="3">
          <div>
            <div className="attachment">
              <IconContext.Provider
                value={{ style: { color: "white", fontSize: "48px" } }}
              >
                <FaRegImages />
              </IconContext.Provider>
            </div>
          </div>
          <div>
            <div className="feature-explained">
              <div className="short-description poppins-semibold">
                A flexible tool to help users organize and view relevant data
                quickly.
              </div>
              <ul className="key-points poppins-regular">
                <li className="key-point">
                  Saves time by reducing the need to sift through unnecessary
                  data.
                </li>
                <li className="key-point">
                  Helps users focus on the most critical tasks or projects.
                </li>
                <li className="key-point">
                  Improves workflow organization, especially in complex
                  projects.
                </li>
              </ul>
              <div className="link">
                <a href="" className="read-more poppins-regular-italic">
                  Read more ...
                </a>
                <IconContext.Provider
                  value={{ style: { color: "blue", fontSize: "120%" } }}
                >
                  <LuExternalLink />
                </IconContext.Provider>
              </div>
            </div>
          </div>
        </div>
        <div className="deep-dive-feature poppins-regular" data-feature-index="4">
          <div>
            <div className="attachment">
              <IconContext.Provider
                value={{ style: { color: "white", fontSize: "48px" } }}
              >
                <FaRegImages />
              </IconContext.Provider>
            </div>
          </div>
          <div>
            <div className="feature-explained">
              <div className="short-description poppins-semibold">
                Visual and analytical tools to help users measure and understand
                project and team performance.
              </div>
              <ul className="key-points poppins-regular">
                <li className="key-point">
                  Enhances decision-making with data-driven insights.
                </li>
                <li className="key-point">
                  Helps users identify bottlenecks and areas for improvement.
                </li>
                <li className="key-point">
                  Provides accountability by tracking and showcasing progress.
                </li>
              </ul>
              <div className="link">
                <a href="" className="read-more poppins-regular-italic">
                  Read more ...
                </a>
                <IconContext.Provider
                  value={{ style: { color: "blue", fontSize: "120%" } }}
                >
                  <LuExternalLink />
                </IconContext.Provider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="see-more-features">
        <Link to="/features" className="see-more poppins-regular-italic">
          See more features
        </Link>
      </div>
    </div>
  );
}
