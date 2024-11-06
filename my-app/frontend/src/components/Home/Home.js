import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ user }) => {
  return (
    <div className="container">
      <h1 className="title is-2 has-text-centered">Witaj {user ? user.username : 'gościu'}!</h1>
      <div className="columns is-rows">
        <div className="kolumn">
          <Link to="/trainings" className="home-button">
            <img src="/path-to-cone-icon.png" alt="Treningi" />
            <span>Treningi</span>
          </Link>
        </div>
        <div className="kolumn">
          <Link to="/matches" className="home-button">
            <img src="/path-to-ball-icon.png" alt="Mecze" />
            <span>Mecze</span>
          </Link>
        </div>
        <div className="kolumn">
          <Link to="/profile" className="home-button">
            <img src="/path-to-profile-icon.png" alt="Twój Profil" />
            <span>Twój Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;