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
  const { isLoggedIn, user, isAuthModalOpen, setAuthModalOpen } = useAuth();
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
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo-container" onClick={closeMenu} style={{ gap: '12px' }}>
            <img src="/images/logo.jpg" alt="ieco EcoGreen Cab" className="navbar-logo-img" />
            <span className="navbar-logo-text-gradient">Eco Green Cab</span>
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
                to="/admin/dashboard" 
                className="navbar-btn-primary" 
                style={{ 
                  background: 'linear-gradient(135deg, #00b96b 0%, #009657 100%)', 
                  color: 'white', 
                  border: 'none', 
                  boxShadow: '0 8px 20px rgba(0, 185, 107, 0.35)',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '10px 28px',
                  borderRadius: '50px',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}
              >
                <MdPerson size={20} /> Admin
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
                to="/admin/dashboard"
                className="mobile-btn mobile-btn-primary"
                onClick={closeMenu}
                style={{ 
                  border: 'none', 
                  background: 'linear-gradient(135deg, #00b96b 0%, #009657 100%)', 
                  color: 'white', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(0, 185, 107, 0.35)',
                  padding: '12px',
                  borderRadius: '12px',
                  letterSpacing: '0.5px'
                }}
              >
                <MdPerson size={22} /> Admin
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}
