import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, UserButton, useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import axios from 'axios';

function App() {
  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (isLoaded && user) {
      // Sync user with our DB
      const syncUser = async () => {
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/auth/sync`, {
            clerkId: user.id,
            email: user.primaryEmailAddress.emailAddress,
            username: user.fullName || user.firstName
          });
        } catch (err) {
          console.error("Sync failed", err);
        }
      };
      syncUser();
    }
  }, [isLoaded, user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <SignedOut>
              <LandingPage />
            </SignedOut>
            <SignedIn>
              <Dashboard />
            </SignedIn>
          </>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
