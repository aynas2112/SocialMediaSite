import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/authComponents/Login';
import Home from './components/Home';
import SignUp from './components/authComponents/Signup';
import ForgotPassword from './components/authComponents/ForgotPassword';
import MessageApp from './components/messageComponents/MessageApp';
import { AuthProvider } from './contexts/authContexts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/messages" element={<MessageApp />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
