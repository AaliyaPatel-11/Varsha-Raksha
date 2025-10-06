// src/App.jsx

import { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './App.css';
import logo from './assets/logo.png';

// Import all our components
import Login from './components/Login';
import PostForm from './components/PostForm';
import Feed from './components/Feed';
import OfficialInfo from './components/OfficialInfo';
import EmergencyHelp from './components/EmergencyHelp';
import Profile from './components/Profile';
import MapView from './components/MapView';
import Chatbot from './components/Chatbot';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // UPDATED: Use a dedicated layout for the Login screen
  if (!user) {
    return (
      <div className="login-container">
        <header className="login-header">
          <h1>VarshaRaksha</h1>
        </header>
        <Login />
      </div>
    );
  }

  // Layout for logged-in users
  return (
    <div className="container">
      <header className="app-header">
        <div className="logo-title">
          <img src={logo} alt="VarshaRaksha Logo" className="logo" />
          <h1>VarshaRaksha</h1>
        </div>
        <div className="header-user-info">
          <span>Welcome, {user.displayName}!</span>
          {/* UPDATED: "My Profile" link moved here */}
          <NavLink to="/profile" className="profile-link">My Profile</NavLink>
          <button onClick={handleSignOut} className="auth-button sign-out-small">
            Sign Out
          </button>
        </div>
      </header>

      <nav className="main-nav">
        <NavLink to="/">Community Feed</NavLink>
        <NavLink to="/official-info">Official Info</NavLink>
        <NavLink to="/emergency-help">Emergency Help</NavLink>
        <NavLink to="/map">Live Map</NavLink>
      </nav>
      
      <main>
        <Routes>
          <Route path="/" element={<><PostForm /><Feed /></>} />
          <Route path="/official-info" element={<OfficialInfo />} />
          <Route path="/emergency-help" element={<EmergencyHelp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </main>
       <Chatbot />
    </div>
  );
}

export default App;

