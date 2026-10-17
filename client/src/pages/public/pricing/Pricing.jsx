// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router";

// Styles
import "./Pricing.css";

const includedFeatures = [
  "Organize projects and set deadlines",
  "Create and prioritize tasks",
  "Link tasks to projects or keep them standalone",
  "Use search, filters, and multiple work views",
  "Add comments and review activity history",
  "Choose between Classic and Modern layouts",
];

const faqs = [
  {
    question: "Is Pro Manager free to use?",
    answer:
      "Yes. You can create an account and use the project and task management features at no cost.",
  },
  {
    question: "Do I need a payment method to sign up?",
    answer:
      "No payment method is needed to create an account and get started.",
  },
  {
    question: "Can I use Pro Manager for both projects and everyday tasks?",
    answer:
      "Yes. Keep tasks connected to a project or manage them on their own, and track progress in the same workspace.",
  },
];

export default function PricingPage() {
  return (
    <div className="pricing-page public">
      <div className="container">
        <Header />

        <main>
          <section className="pricing-hero">
            <p className="pricing-eyebrow poppins-semibold">Pricing</p>
            <h2 className="pricing-hero-title poppins-bold">
              A simpler way to get your work organized
            </h2>
            <p className="pricing-hero-subtitle poppins-regular">
              Start planning projects, tracking tasks, and keeping your work in
              one place. Pro Manager is free to use.
            </p>
          </section>

          <section className="pricing-plan-section" aria-label="Available plan">
            <article className="pricing-plan">
              <div className="pricing-plan-heading">
                <p className="pricing-plan-label poppins-semibold">Personal</p>
                <h3 className="pricing-plan-name poppins-bold">Free</h3>
                <p className="pricing-plan-description poppins-regular">
                  Everything you need to manage your projects and tasks.
                </p>
              </div>

              <p className="pricing-amount poppins-bold">
                $0 <span className="poppins-regular">/ forever</span>
              </p>

              <Link to="/signup" className="pricing-button poppins-semibold">
                Get started free
              </Link>

              <div className="pricing-includes">
                <h4 className="poppins-semibold">Included</h4>
                <ul className="poppins-regular">
                  {includedFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </article>
          </section>

          <section className="pricing-faq" aria-labelledby="pricing-faq-title">
            <div className="pricing-faq-heading">
              <p className="pricing-eyebrow poppins-semibold">Good to know</p>
              <h3 id="pricing-faq-title" className="poppins-bold">
                Frequently asked questions
              </h3>
            </div>
            <div className="pricing-faq-list">
              {faqs.map(({ question, answer }) => (
                <article className="pricing-faq-item" key={question}>
                  <h4 className="poppins-semibold">{question}</h4>
                  <p className="poppins-regular">{answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pricing-cta">
            <h3 className="poppins-semibold">Ready to make a plan?</h3>
            <p className="poppins-regular">
              Create your free account and bring your projects and tasks
              together.
            </p>
            <Link to="/signup" className="pricing-cta-button poppins-semibold">
              Create your account
            </Link>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
