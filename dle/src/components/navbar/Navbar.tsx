import logo from '../../assets/logo.svg';
import profileLogo from '../../assets/profileLogo.svg';
import './navbar.css';
interface NavbarProps {
  type?: 'authenticated' | 'unauthenticated';
  variant?: 'light' | 'dark';
}

function Navbar ({ type = 'unauthenticated', variant = 'light' }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
      <img src={logo} alt="Logo" className="navbar-logo-image" />
      <h1 className="navbar-logo-text">DLE</h1>
      </div>
      <div className="navbar-links">
        {type === 'unauthenticated' ? (
          <>
            
            <a href="/" className="navbar-link">Home</a>
            <a href="/about" className="navbar-link">Sample</a>
            <a href="/contact" className="navbar-link">Contact Us</a>
            <button className="btn-primary">Create Experience</button>
          </>
        ) : (
          <>
            <a href="/" className="navbar-link">Home</a>
            <a href="/about" className="navbar-link">Sample</a>
            <a href="/contact" className="navbar-link">Contact Us</a>
            <button className="btn-primary">Create Experience</button>
            <div className="navbar-profile">
              <img src={profileLogo} alt="Profile" className="navbar-profile-image" />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;