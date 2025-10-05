// src/components/Login.jsx

import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import logo from '../assets/logo.png'; // Import the logo

const Login = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    // This container holds the centered login box
    <div className="auth-container">
      {/* The new, larger logo */}
      <img src={logo} alt="VarshaRaksha Logo" className="login-logo" />
      
      <p>Your Community's Monsoon Lifeline</p>
      
      <button onClick={handleGoogleSignIn} className="auth-button sign-in">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;

