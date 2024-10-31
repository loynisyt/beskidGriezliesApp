import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ user }) => {
  return (
    <div className="home-container">
      <h1>Witaj {user ? user.username : 'gościu'}!</h1>
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/trainings" className="button is-primary">Treningi</Link>
        </li>
        <li>
          <Link to="/matches" className="button is-primary">Mecze</Link>
        </li>
        <li>
          <Link to="/profile" className="button is-primary">Twój Profil</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
