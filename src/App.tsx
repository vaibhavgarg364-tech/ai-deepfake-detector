import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AccessibilityProvider from './components/AccessibilityProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Demo from './pages/Demo';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LoadingSpinner from './components/LoadingSpinner';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('deepguard_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string) => {
    const userData = { email };
    setUser(userData);
    localStorage.setItem('deepguard_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('deepguard_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" role="alert" aria-label="Loading application">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <AccessibilityProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {user && <Navbar user={user} onLogout={handleLogout} />}
          
          <main id="main-content" className="flex-1" tabIndex={-1}>
            <Routes>
              <Route 
                path="/login" 
                element={
                  !user ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/" replace aria-label="Redirecting to home page" />
                  )
                } 
              />
              <Route 
                path="/signup" 
                element={
                  !user ? (
                    <Signup onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/" replace aria-label="Redirecting to home page" />
                  )
                } 
              />
              <Route 
                path="/" 
                element={
                  user ? (
                    <Home />
                  ) : (
                    <Navigate to="/login" replace aria-label="Redirecting to login page" />
                  )
                } 
              />
              <Route 
                path="/about" 
                element={
                  user ? (
                    <About />
                  ) : (
                    <Navigate to="/login" replace aria-label="Redirecting to login page" />
                  )
                } 
              />
              <Route 
                path="/features" 
                element={
                  user ? (
                    <Features />
                  ) : (
                    <Navigate to="/login" replace aria-label="Redirecting to login page" />
                  )
                } 
              />
              <Route 
                path="/demo" 
                element={
                  user ? (
                    <Demo />
                  ) : (
                    <Navigate to="/login" replace aria-label="Redirecting to login page" />
                  )
                } 
              />
              <Route 
                path="/contact" 
                element={
                  user ? (
                    <Contact />
                  ) : (
                    <Navigate to="/login" replace aria-label="Redirecting to login page" />
                  )
                } 
              />
            </Routes>
          </main>

          {user && <Footer />}
        </div>
      </AccessibilityProvider>
    </Router>
  );
}

export default App;