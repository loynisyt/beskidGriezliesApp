import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import WorkoutShortcut from "../WorkoutShortcut/WorkoutShortcut";

const Home = ({ user }) => {
  return (
    <div className="container">
      <h1 className="title is-2 has-text-centered">
        Witaj {user ? user.username : "gościu"}!
      </h1>
      <div className="columns is-rows">
        <div className="kolumn">
          <Link to="/trainings" className="home-button">
            <figure className="image is-128x128">
              <img src="/trainings.webp" alt="Treningi" />
              <p>Treningi</p>
            </figure>
          </Link>
        </div>
        <div className="kolumn">
          <Link to="/matches" className="home-button">
            <figure className="image is-128x128">
              <img src="/match.png" alt="Mecze" />
              <p>Mecze</p>
            </figure>
          </Link>
        </div>
        <div className="kolumn">
          <Link to="/profile" className="home-button">
            <figure className="image is-128x128">
              <img className="" src="/profile.png" alt="Twój Profil" />
              <p>Mój Profil</p>
            </figure>
          </Link>
        </div>
      </div>
      <WorkoutShortcut />
    </div>
  );
};

export default Home;
