import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home/Home';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Trainings from './components/Trainings/Trainings';
import Matches from './components/Matches/Matches';
import Profile from './components/Profile/Profile';
import AdminPanel from './components/AdminPanel/AdminPanel';
import PlayersData from './components/Player/PlayersData';
import ZlkData from "./components/ZLKdata/ZlkData";
import Files from "./components/Files/Files";

import 'bulma/css/bulma.min.css';
import './App.css';

const AppContent = () => {
    const location = useLocation();
    const [user, setUser ] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedUser  = localStorage.getItem('user');
        if (storedUser ) {
            setUser (JSON.parse(storedUser ));
        }
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    }, []);

    const handleLogin = (userData) => {
        setUser (userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // Redirect to /home after login
        window.history.pushState({}, '', '/home');
    };

    const handleLogout = () => {
        setUser (null);
        localStorage.removeItem('user');
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
    };

    return (
        <div className={`main-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="content-wrapper">

        {location.pathname === '/' ? null : (
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/home">
                        <img src="/beskid-griezlies-logo.png" alt="Beskid Griezlies" width="30" height="300" />
                    </Link>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-end">
                        {user ? (
                            <>
                                <Link className="navbar-item" to="/">Powrót na stronę</Link>
                                <Link className="navbar-item" to="/matches">Mecze</Link>
                                <Link className="navbar-item" to="/trainings">Treningi</Link>
                                <Link className="navbar-item" to="/profile">Profil</Link>
                                <Link className="navbar-item" to="/pliki">Pliki</Link>
                                <Link className="navbar-item" to="/dane">Dane Żlk</Link>


                                {user.role === 'admin' && (
                                    <Link className="navbar-item" to="/admin">Panel Administracyjny</Link>
                                )}
                                {user.role === 'admin' && (
                                    <Link className="navbar-item" to="/players">Informacje o Zawodnikach</Link>
                                )}
                                <a className="navbar-item" onClick={handleLogout}>Wyloguj</a>
                            </>
                        ) : (
                            <Link className="navbar-item" to="/">Powrót na stronę</Link>
                        )}
                        
                        <div className="navbar-item">
                            <button className="button" onClick={toggleTheme}>
                                {isDarkMode ? 'Tryb Jasny' : 'Tryb ciemny'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        )}

            <Routes>
                <Route path="/" element={<LandingPage user={user} />} />
                <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/matches" element={user ? <Matches user={user} /> : <Navigate to="/login" />} />
                <Route path="/trainings" element={user ? <Trainings user={user} /> : <Navigate to="/login" />} />
                <Route path="/dane" element={<ZlkData />} />
                <Route path="/pliki" element={<Files />} />
                <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
                <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
                <Route path="/players" element={user && user.role === 'admin' ? <PlayersData /> : <Navigate to="/players" />} />
            </Routes>
        </div>
    </div>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
