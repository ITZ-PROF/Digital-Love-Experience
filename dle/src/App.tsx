import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './pages/home/Homepage';
import LoadingPage from './components/loadingpage/loader';
import { useEffect, useState } from 'react';
import Login from './pages/auth/login';
import Form from './pages/form/form';
import BirthdayTemplate1 from './components/templates/birthdaytemplate1/BirthdayTemplate1';

function Applive() {
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
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
              <div className={`home-transition ${transitioning ? 'is-visible' : ''}`}>
                <Form />
              </div>
            } 
          />
          
          {/* Dedicated Authentication Route */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default Applive;
