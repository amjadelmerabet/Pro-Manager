// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router";

// Styles
import "./About.css";

const principles = [
  {
    number: "01",
    title: "Keep work clear",
    description:
      "Projects provide a home for bigger goals. Tasks make the next steps easy to see, with priorities and progress that help you decide what to focus on.",
  },
  {
    number: "02",
    title: "Make it fit your work",
    description:
      "Some tasks belong to a project and some stand on their own. Switch between list, grid, board, and table views to see your work in a way that feels useful.",
  },
  {
    number: "03",
    title: "Keep the context close",
    description:
      "Comments and activity history keep notes and changes alongside the project or task they relate to, so it is easier to pick up where you left off.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page public">
      <div className="container">
        <Header />

        <main>
          <section className="about-hero">
            <p className="about-eyebrow poppins-semibold">About Pro Manager</p>
            <h2 className="about-hero-title poppins-bold">
              Make progress easier to see
            </h2>
            <p className="about-hero-subtitle poppins-regular">
              Pro Manager is a workspace for bringing personal projects and
              everyday tasks together. Plan what matters, keep track of the
              details, and see how your work is moving forward.
            </p>
          </section>

          <section className="about-intro">
            <div className="about-intro-heading">
              <p className="about-eyebrow poppins-semibold">Why it exists</p>
              <h3 className="poppins-semibold">
                Less scattered work. A clearer next step.
              </h3>
            </div>
            <div className="about-intro-copy poppins-regular">
              <p>
                Ideas, deadlines, and small tasks can quickly end up in
                different places. Pro Manager brings them into one workspace,
                where a project can be broken into manageable tasks and each
                item has a clear status.
              </p>
              <p>
                It is designed to be flexible: use a project when work needs a
                shared destination, keep a task independent when it does not,
                and choose the view that helps you think through the work.
              </p>
            </div>
          </section>

          <section className="about-principles" aria-labelledby="about-principles-title">
            <div className="about-section-heading">
              <p className="about-eyebrow poppins-semibold">A few guiding ideas</p>
              <h3 id="about-principles-title" className="poppins-bold">
                A workspace built around how work moves
              </h3>
            </div>
            <div className="about-principle-grid">
              {principles.map((principle) => (
                <article className="about-principle" key={principle.number}>
                  <span className="about-principle-number poppins-semibold">
                    {principle.number}
                  </span>
                  <h4 className="poppins-semibold">{principle.title}</h4>
                  <p className="poppins-regular">{principle.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about-cta">
            <div>
              <p className="about-eyebrow poppins-semibold">Start where you are</p>
              <h3 className="poppins-semibold">
                Give your next project a clear place to grow.
              </h3>
              <p className="poppins-regular">
                Create a free account and bring your plans and tasks together.
              </p>
            </div>
            <Link to="/signup" className="about-cta-button poppins-semibold">
              Get started
            </Link>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
