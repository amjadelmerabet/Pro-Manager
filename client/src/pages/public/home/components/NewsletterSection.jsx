import "./NewsletterSection.css";

export default function NewsletterSection() {
  return <div className="newsletter-section">
    <h2 className="section-title poppins-bold">Join our Newsletter</h2>
    <form method="post">
      <input type="email" name="email" id="email" className="poppins-regular" placeholder="Type your email here ..." />
      <button type="submit" className="submit-button poppins-bold">Submit</button>
    </form>
  </div>
}