import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AboutUs from './AboutUs';
import News from './News';
import Contact from './Contact';
import BackgroundSlideshow from './BackgroundSlideshow';
import Gallery from './Gallery';
import Form from './Form';
import './LandingPage.css';

const LandingPage = () => {
  const [visibleSection, setVisibleSection] = useState('aboutus');

  const renderSection = () => {
    switch (visibleSection) {
      case 'aboutus':
        return <AboutUs />;
      case 'contact':
        return <Contact />;
      case 'gallery':
        return <Gallery />;
      case 'news':
        return <News />;
      case 'Form':
          return <Form />;
      default:
        return null;
    }
  };

  return (
    <div className="landing-container">
      <BackgroundSlideshow />
      <nav className="landing-nav">
        <div className="nav-left">
          <Link className="navbar-item" to="/home">
                                  <img src="/beskid-griezlies-logo.png" alt="Beskid Griezlies" className=' logo-icon ' />
                              </Link>
        </div>
        <div className="nav-right">
          <button className="nav-button" onClick={() => setVisibleSection('aboutus')}>O nas</button>
          <button className="nav-button" onClick={() => setVisibleSection('contact')}>Kontakt</button>
          <button className="nav-button" onClick={() => setVisibleSection('gallery')}>Galeria</button>
          <button className="nav-button" onClick={() => setVisibleSection('news')}>Historia Drużyny</button>
          <button className="nav-button" onClick={() => setVisibleSection('Form')}>Zapisz Się</button>

          <Link to="/home" className="nav-button">BeskidApp</Link>
        </div>
      </nav>

      {renderSection()}
    </div>
  );
};

export default LandingPage;
