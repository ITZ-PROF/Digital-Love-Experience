import './App.css';
import Homepage from './pages/home/Homepage';
import LoadingPage from './components/loadingpage/loader';
import { useEffect, useState } from 'react';
import Login from './pages/auth/login';




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
    <div className="App">
      {/* <div className={`home-transition ${transitioning ? 'is-visible' : ''}`}>
        <Homepage />
      </div>
      {loading && <LoadingPage isExiting={transitioning} />} */}
      <Login/>
    </div>
  );
}

export default Applive;
