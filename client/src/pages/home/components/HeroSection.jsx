import { IconContext } from "react-icons/lib";
import { FaPlay } from "react-icons/fa";

import "./HeroSection.css";

export default function HeroSection() {
  return (
    <div className="hero-section">
      <div className="overview">
        <p className="overview-text poppins-regular">
          Welcome to <span className="poppins-semibold">Pro Manager</span>, the
          ultimate tool for managing your projects and tasks effortlessly.
          Whether you're working solo or collaborating with a team, our app
          helps you stay organized, prioritize effectively, and achieve your
          goals faster
        </p>
        <button className="signup-button poppins-bold">Sign up for free</button>
      </div>
      <div className="video-container">
        <div className="video">
          <IconContext.Provider value={{ style: { color: "white", fontSize: "64px" } }}>
            <FaPlay />
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
}
