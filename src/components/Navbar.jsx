import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { MdHome, MdElectricBolt, MdHelpOutline, MdOutlineDirectionsCar, MdInfoOutline, MdMailOutline, MdPerson } from 'react-icons/md';
import '../styles/navbar.css';

const navLinks = [
  { path: '/', label: 'Home', icon: <MdHome /> },
  { path: '/rent', label: 'Browse EVs', icon: <MdElectricBolt /> },
  { path: '/how-it-works', label: 'How It Works', icon: <MdHelpOutline /> },
  { path: '/list-your-ev', label: 'List Your EV', icon: <MdOutlineDirectionsCar /> },
  { path: '/about', label: 'About', icon: <MdInfoOutline /> },
  { path: '/contact', label: 'Contact', icon: <MdMailOutline /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setAuthOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const openAuth = () => {
    closeMenu();
    setAuthOpen(true);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo-container" onClick={closeMenu}>
            <img src="/images/logo.jpg" alt="ieco EcoGreen Cab" style={{ height: '45px', objectFit: 'contain' }} />
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-links">
            {navLinks.filter(link => !(link.path === '/list-your-ev' && isLoggedIn && user?.roles?.includes('renter') && !user?.roles?.includes('owner'))).map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `nav-link${isActive ? ' active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="navbar-actions">
            {!isLoggedIn ? (
              <button className="navbar-btn-outline" onClick={openAuth} style={{ border: 'none' }}>
                Sign In
              </button>
            ) : (
              <Link 
                to={user?.roles?.includes('admin') ? '/admin/dashboard' : user?.roles?.includes('renter') ? '/renter/dashboard' : '/owner/dashboard'} 
                className="navbar-btn-outline" 
                style={{ border: 'none', color: '#00b96b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MdPerson size={18} /> {user?.name || 'My Account'}
              </Link>
            )}
            
            {isLoggedIn && user?.roles?.includes('owner') ? (
              <Link to="/list-your-ev" className="navbar-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MdOutlineDirectionsCar size={18} /> List Your EV
              </Link>
            ) : (
              <Link to="/rent" className="navbar-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MdElectricBolt size={18} /> Rent Now
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.filter(link => !(link.path === '/list-your-ev' && isLoggedIn && user?.roles?.includes('renter') && !user?.roles?.includes('owner'))).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `mobile-nav-link${isActive ? ' active' : ''}`
              }
              onClick={closeMenu}
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}

          <div className="mobile-menu-divider" />

          <div className="mobile-menu-actions">
            {!isLoggedIn ? (
              <button
                className="mobile-btn mobile-btn-outline"
                onClick={openAuth}
                style={{ border: 'none', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <MdPerson size={20} /> Sign In
              </button>
            ) : (
              <Link
                to={user?.roles?.includes('admin') ? '/admin/dashboard' : user?.roles?.includes('renter') ? '/renter/dashboard' : '/owner/dashboard'}
                className="mobile-btn mobile-btn-outline"
                onClick={closeMenu}
                style={{ border: 'none', background: '#e6f9f1', color: '#00b96b', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <MdPerson size={20} /> {user?.name || 'My Account'}
              </Link>
            )}
            
            {isLoggedIn && user?.roles?.includes('owner') ? (
              <Link
                to="/list-your-ev"
                className="mobile-btn mobile-btn-primary"
                onClick={closeMenu}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <MdOutlineDirectionsCar size={20} /> List Your EV
              </Link>
            ) : (
              <Link
                to="/rent"
                className="mobile-btn mobile-btn-primary"
                onClick={closeMenu}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <MdElectricBolt size={20} /> Rent an EV Now
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setAuthOpen(false)} 
      />
    </>
  );
}
