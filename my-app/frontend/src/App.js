// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Trainings from './components/Trainings/Trainings';
import Matches from './components/Matches/Matches';
import Profile from './components/Profile/Profile';
import AdminPanel from './components/AdminPanel/AdminPanel';
import 'bulma/css/bulma.min.css';
import './App.css';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for stored user data on component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <div className="container">
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <Link className="navbar-item" to="/">Beskid Griezlies</Link>
                    </div>
                    <div className="navbar-menu">
                        <div className="navbar-end">
                            {user ? (
                                <>
                                    <Link className="navbar-item" to="/matches">Matches</Link>
                                    <Link className="navbar-item" to="/trainings">Trainings</Link>
                                    <Link className="navbar-item" to="/profile">Profile</Link>
                                    {user.role === 'admin' && (
                                        <Link className="navbar-item" to="/admin">Admin Panel</Link>
                                    )}
                                    <a className="navbar-item" onClick={handleLogout}>Logout</a>
                                </>
                            ) : (
                                <Link className="navbar-item" to="/login">Login</Link>
                            )}
                        </div>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/matches" element={user ? <Matches /> : <Navigate to="/login" />} />
                    <Route path="/trainings" element={user ? <Trainings /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
                    <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;