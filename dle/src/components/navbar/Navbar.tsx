import logo from '../../assets/logo.svg';
import profileLogo from '../../assets/profileLogo.svg';
import { useState, useEffect } from 'react';
import './navbar.css';

interface NavbarProps {
  type?: 'authenticated' | 'unauthenticated';
  variant?: 'light' | 'dark';
}

function Navbar({ type = 'unauthenticated', variant = 'light' }: NavbarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls mobile dropdown visibility

  useEffect(() => {
    const handleResize = () => {
      // 1024px targets both phones and standard vertical tablets
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false); // Clean up open menu if resizing back up to desktop
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`navbar navbar-${variant}`}>
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="navbar-logo-image" />
        <h1 className="navbar-logo-text">DLE</h1>
      </div>

      {/* Hamburger menu button for small screens */}
      {isMobile && (
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>
      )}

      {/* Nav links container: conditionally hides or slides down */}
      <div className={`navbar-links ${isMobile ? 'mobile-menu' : ''} ${isMenuOpen ? 'show' : ''}`}>
        <a href="/" className="navbar-link">Home</a>
        <a href="/about" className="navbar-link">Sample</a>
        <a href="/contact" className="navbar-link">Contact Us</a>
        <button className="btn-primary">Create Experience</button>
        
        {type === 'authenticated' && (
          <div className="navbar-profile">
            <img src={profileLogo} alt="Profile" className="navbar-profile-image" />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
