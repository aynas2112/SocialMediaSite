// Login.js
import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { useAuth } from "../../contexts/authContexts";
import { db } from "../../firebase/firebase"; // Import Firestore
import { collection, query, where, getDocs } from "firebase/firestore"; // Import necessary functions from Firestore

// import { useDispatch } from "react-redux";
// import {useNavigate} from "react-router-dom";
// import { signup } from "../../actions/auth";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        let email = identifier;

        // Check if identifier is not an email
        if (!identifier.includes("@")) {
          // Lookup username in Firestore
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("username", "==", identifier));
          const userQuerySnapshot = await getDocs(q);

          if (userQuerySnapshot.empty) {
            throw new Error("auth/user-not-found");
          }

          // Retrieve the email associated with the username
          email = userQuerySnapshot.docs[0].data().email;
        }
        const response = await doSignInWithEmailAndPassword(email, password);

        if (!response.ok) {
          throw new Error("Failed to send email to backend");
        }
      } catch (error) {
        setIsSigningIn(false);
        if (error.message === "auth/user-not-found") {
          setErrorMessage("User does not exist");
        } else if (error.message === "auth/wrong-password") {
          setErrorMessage("Incorrect password");
        } else {
          setErrorMessage(error.message);
        }
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const res = await doSignInWithGoogle();
        console.log("sending to backend:");
        console.log(res);
        const response = await fetch("http://localhost:6001/user/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(res),
        });
        if (!response.ok) {
          throw new Error("Failed to send user data to backend");
        }

        const data = await response.json(); // Parse the response body as JSON
        console.log("Backend response:", data);
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1B1B1B] text-white">
      {userLoggedIn && <Navigate to="/home" replace />}
      <div className="w-full max-w-md p-8">
        <h1 className="logoHead text-center mb-8 text-[#8E44AD]">UniGram</h1>
        {errorMessage && (
          <div className="error-message text-red-500 mb-4">{errorMessage}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="form-group">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
              placeholder="Email or Username"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded bg-[#1B1B1B] text-white border-[#F1C40F] placeholder-custom"
              placeholder="Password"
            />
          </div>
          <div className="flex justify-end mb-4">
            <Link to="/forgot-password" className="text-[#F1C40F]">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded"
          >
            Login
          </button>
          <button
            onClick={onGoogleSignIn}
            disabled={isSigningIn}
            className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded mt-2"
          >
            Sign In with Google
          </button>
          <Link to="/signup">
            <button className="w-full bg-[#8E44AD] text-[#F1C40F] p-2 rounded mt-2">
              Sign Up
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
