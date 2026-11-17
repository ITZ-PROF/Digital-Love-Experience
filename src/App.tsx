import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './pages/home/Homepage';
import LoadingPage from './components/loadingpage/loader';
import { useEffect, useState } from 'react';
import Login from './pages/auth/login';
import VerifyEmail from './pages/auth/VerifyEmail';
import ResetPassword from './pages/auth/ResetPassword';
import RequireAuth from './pages/auth/RequireAuth';
import Form from './pages/form/form';
import BirthdayTemplate1 from './components/templates/birthdaytemplate1/BirthdayTemplate1';
import Dashboard from './pages/dashboard/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { getCurrentUser } from './services/auth.service';
import { useAuth } from './stores/authstore';

function Applive() {
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const setAuthenticated = useAuth((state) => state.setAuthenticated);
  const setUnauthenticated = useAuth((state) => state.setUnauthenticated);
  const setUnavailable = useAuth((state) => state.setUnavailable);

  useEffect(() => {
    const startTransition = window.setTimeout(() => {
      setTransitioning(true);
    }, 2000);
    const finishTransition = window.setTimeout(() => {
      setLoading(false);
    }, 2700);

    return () => {
      window.clearTimeout(startTransition);
      window.clearTimeout(finishTransition);
    };
  }, []);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((response) => {
        if (active) setAuthenticated(response.data.user);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setUnauthenticated();
          return;
        }
        console.error('Unable to verify the current session:', error);
        setUnavailable();
      });

    return () => {
      active = false;
    };
  }, [setAuthenticated, setUnauthenticated, setUnavailable]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="App">
        {/* The Loader handles initial page mount presentation */}
        {loading && <LoadingPage isExiting={transitioning} />}

        {/* Configure path mappings so elements don't stack on top of each other */}
        <Routes>
          {/* Main Landing/Home route layout */}
          <Route 
            path="/" 
            element={
              <div className={`home-transition ${transitioning ? 'is-visible' : ''}`}>
                <Homepage />
              </div>
            } 
          />
          <Route 
            path="/birthday" 
            element={
              <div className={`home-transition ${transitioning ? 'is-visible' : ''}`}>
                <BirthdayTemplate1 />
              </div>
            } 
          />
          <Route
            path="/form" 
            element={
              <RequireAuth>
                <div className={`home-transition ${transitioning ? 'is-visible' : ''}`}>
                  <Form />
                </div>
              </RequireAuth>
            } 
          />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          
          {/* Dedicated Authentication Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default Applive;
