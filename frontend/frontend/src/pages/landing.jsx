import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import mobileImg from "../assets/e1a84655-61ae-495b-9c9d-b62e50f2c9e1.jpg";

export default function LandingPage() {
  const navigate = useNavigate();
  const goTo = (path) => navigate(path);

  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Apna Video Call</h2>
        </div>
        <div className="navlist">
          <button onClick={() => goTo("/guest")}>Join as Guest</button>
          <button onClick={() => goTo("/auth")}>Register</button>
          <button onClick={() => goTo("/auth")}>Login</button>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1><span className="highlight">Connect</span> with your loved Ones</h1>
          <p>Cover a distance by Apna Video Call</p>
          <div role="button" className="ctaBtn">
            <Link to="/auth">Get Started</Link>
          </div>
        </div>
        <div className="imageContainer">
          <img src={mobileImg} alt="mobile preview" />
        </div>
      </div>
    </div>
  );
}