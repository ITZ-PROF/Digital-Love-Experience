import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import profileLogo from '../../assets/profileLogo.svg';
import { useState, useEffect } from 'react';
import './navbar.css';
import { useAuth } from '../../stores/authstore';

interface NavbarProps {
  variant?: 'light' | 'dark';
}

function Navbar({ variant = 'light' }: NavbarProps) {

  const authStatus = useAuth((state) => state.status);
  const authenticated = authStatus === 'authenticated';
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleClick = () => {
    setIsMenuOpen(false);
    navigate('/form');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`navbar navbar-${variant}`} aria-label="Main navigation">
      <Link to="/" className="navbar-logo" aria-label="Digital Love Experience home" onClick={closeMenu}>
        <img src={logo} alt="" className="navbar-logo-image" />
        <span className="navbar-logo-text">DLE</span>
      </Link>

      {isMobile && (
        <button
          type="button"
          id="navbar-menu-toggle"
          className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="navbar-links"
        >
          <span className="hamburger-bar" aria-hidden="true"></span>
          <span className="hamburger-bar" aria-hidden="true"></span>
          <span className="hamburger-bar" aria-hidden="true"></span>
        </button>
      )}

      <div
        id="navbar-links"
        className={`navbar-links ${isMobile ? 'mobile-menu' : ''} ${isMenuOpen ? 'show' : ''}`}
        aria-labelledby={isMobile ? 'navbar-menu-toggle' : undefined}
      >
        <Link to="/" className="navbar-link" onClick={closeMenu}>Home</Link>
        <Link to="/birthday" className="navbar-link" onClick={closeMenu}>Samples</Link>
        <Link to="/pricing" className="navbar-link" onClick={closeMenu}>Pricing</Link>
        <Link to="/contact" className="navbar-link" onClick={closeMenu}>Contact Us</Link>
        {!authenticated && authStatus === 'unauthenticated' && (
          <>
            <Link to="/login?mode=signup" className="navbar-link" onClick={closeMenu}>Sign up</Link>
            <Link to="/login?mode=login" className="navbar-link" onClick={closeMenu}>Log in</Link>
          </>
        )}
        <button className="btn-primary" onClick={handleClick}>Create Experience</button>

        {authenticated && (
          <button
            type="button"
            className="navbar-profile"
            onClick={() => {
              closeMenu();
              navigate('/dashboard');
            }}
            aria-label="Open your dashboard"
          >
            <img src={profileLogo} alt="" className="navbar-profile-image" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
