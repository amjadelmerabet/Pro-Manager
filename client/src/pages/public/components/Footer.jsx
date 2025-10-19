import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <h2 className="application-name poppins-bold">Pro Manager</h2>
      <div className="quick-links">
        <h4 className="title poppins-bold">Quick links</h4>
        <ul className="poppins-regular">
          <li className="quick-link">Home</li>
          <li className="quick-link">Features</li>
          <li className="quick-link">Pricing</li>
          <li className="quick-link">Privacy Policy</li>
          <li className="quick-link">Terms of Service</li>
          <li className="quick-link">Contact us</li>
        </ul>
      </div>
      <div className="social-media-links">
        <h4 className="title poppins-bold">Social Media</h4>
        <ul className="poppins-regular">
          <li className="social-media-link">Facebook</li>
          <li className="social-media-link">Instagram</li>
          <li className="social-media-link">Twitter</li>
          <li className="social-media-link">Youtube</li>
        </ul>
      </div>
      <div className="contact-info">
        <h4 className="title poppins-bold">Contact</h4>
        <ul className="poppins-regular">
          <li className="contact-by-email">support@promanager.com</li>
          <li className="contact-by-phone">+212 6 98 09 45 55</li>
          <li className="send-message">Send us a message</li>
        </ul>
      </div>
    </footer>
  );
}
