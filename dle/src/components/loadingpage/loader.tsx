import { useState, useEffect } from 'react';
import './loader.css';

// 1. Import your 5 distinct assets or icons
import icon1 from '../../assets/loaderIcons/heart.svg';
import icon2 from '../../assets/loaderIcons/give.svg';
import icon3 from '../../assets/loaderIcons/family.svg';
import icon4 from '../../assets/loaderIcons/person.svg';
import icon5 from '../../assets/loaderIcons/person.svg';
import icon6 from '../../assets/loaderIcons/lover.svg';

const LOADING_ICONS = [icon1, icon2, icon3, icon4, icon5, icon6];

interface LoadingPageProps {
  isExiting?: boolean;
}

function LoadingPage({ isExiting = false }: LoadingPageProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Change icons every 400 milliseconds
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % LOADING_ICONS.length);
    }, 400);

    // Clean up the timer loop when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`loading-page-container ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-label="Loading your experience"
    >
      <div className="loading-icon-wrapper">
        {LOADING_ICONS.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="Loading step"
            /* 
               Only applies the 'active' class containing visibility styles 
               to the icon matching our state's current index value
            */
            className={`loading-icon ${index === activeIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <p className="loading-text"></p>
    </div>
  );
}

export default LoadingPage;
