// src/App.jsx

import { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase'; // We don't need 'db' here yet
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import './App.css'; // We'll add styles in the next step

function App() {
  const [user, setUser] = useState(null); // Holds user data if logged in

  // This effect runs once when the app loads to check if a user is already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Clean up the listener
  }, []);

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider); // Triggers the Google popup
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  // Function to handle Sign-Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>VarshaRaksha</h1>
        <p>Your Community's Monsoon Lifeline</p>
      </header>
      
      {/* If a user is logged in, show their info and a sign-out button */}
      {user ? (
        <div className="auth-container">
          <h2>Welcome, {user.displayName}!</h2>
          <img src={user.photoURL} alt="User profile" className="profile-pic" />
          <button onClick={handleSignOut} className="auth-button sign-out">
            Sign Out
          </button>
        </div>
      ) : (
        // Otherwise, show the sign-in button
        <div className="auth-container">
          <button onClick={handleGoogleSignIn} className="auth-button sign-in">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default App;