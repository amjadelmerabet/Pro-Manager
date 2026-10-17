// Components
import Header from "../components/Header";
import Footer from "../components/Footer";

// Styles
import "./Contact.css";

export default function ContactPage() {
  return (
    <div className="contact-page public">
      <div className="container">
        <Header />

        <main>
          <section className="contact-hero">
            <p className="contact-eyebrow poppins-semibold">Contact</p>
            <h2 className="contact-hero-title poppins-bold">
              We’re here to help
            </h2>
            <p className="contact-hero-subtitle poppins-regular">
              Have a question about Pro Manager or need a hand getting
              organized? Reach out using the details below, or leave us a note.
            </p>
          </section>

          <section className="contact-content" aria-label="Contact information and message form">
            <div className="contact-details">
              <p className="contact-eyebrow poppins-semibold">Get in touch</p>
              <h3 className="poppins-semibold">A good place to start</h3>
              <p className="contact-details-intro poppins-regular">
                For questions or general enquiries, use one of the contact
                options below. We’d be glad to hear from you.
              </p>

              <div className="contact-detail-card">
                <span className="contact-detail-icon" aria-hidden="true">
                  @
                </span>
                <div>
                  <h4 className="poppins-semibold">Email</h4>
                  <a className="poppins-regular" href="mailto:support@promanager.com">
                    support@promanager.com
                  </a>
                </div>
              </div>

              <div className="contact-detail-card">
                <span className="contact-detail-icon" aria-hidden="true">
                  ☎
                </span>
                <div>
                  <h4 className="poppins-semibold">Phone</h4>
                  <a className="poppins-regular" href="tel:+212698094555">
                    +212 6 98 09 45 55
                  </a>
                </div>
              </div>

              <div className="contact-note poppins-regular">
                We’re happy to hear feedback, questions, and ideas for making
                project planning a little easier.
              </div>
            </div>

            <div className="contact-form-card">
              <h3 className="poppins-semibold">Send us a message</h3>
              <p className="contact-form-intro poppins-regular">
                Fill in a few details and we’ll be in touch.
              </p>
              <form className="contact-form">
                <label className="poppins-medium" htmlFor="contact-name">
                  Your name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="poppins-regular"
                />

                <label className="poppins-medium" htmlFor="contact-email">
                  Email address
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="poppins-regular"
                />

                <label className="poppins-medium" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What can we help with?"
                  className="poppins-regular"
                />

                <label className="poppins-medium" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  placeholder="Write your message here..."
                  className="poppins-regular"
                />

                <button type="button" className="contact-submit poppins-semibold">
                  Send message
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
