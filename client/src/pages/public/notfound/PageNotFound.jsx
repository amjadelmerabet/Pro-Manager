// Hooks
import { useState } from "react";

// Components
import { Link } from "react-router";

// Icons
import { IoArrowBack } from "react-icons/io5";

// Styles
import "./PageNotFound.css";

export default function PageNotFound() {
  const [goBackLink, setGoBackLink] = useState(false);

  const mouseOnGoBackLink = () => {
    setGoBackLink(true);
    setTimeout(() => {
      setGoBackLink(false);
    }, 250);
  };

  return (
    <div className="not-found-page">
      <h1 className="app-name poppins-bold">
        <Link to="/">Pro Manager</Link>
      </h1>
      <h2 className="message poppins-semibold">404 Page Not Found</h2>
      <Link
        to="/"
        className={
          "go-back-home poppins-regular" + (goBackLink ? " mouse-on" : "")
        }
        onMouseEnter={() => mouseOnGoBackLink()}
      >
        <IoArrowBack />
        <span>Go back home</span>
      </Link>
    </div>
  );
}
