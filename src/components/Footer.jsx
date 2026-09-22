import { Link } from 'react-router-dom';
import '../styles/components.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00e676 0%, #00bcd4 100%)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: '0 0 16px rgba(0,230,118,0.3)' }}>
                ⚡
              </div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.2rem', color: '#f0f9ff' }}>
                Eco<span style={{ color: '#00e676' }}>Green</span> Cab
              </span>
            </Link>
            <p className="footer-brand-desc">
              India's premier self-drive electric vehicle marketplace. Driving sustainable, zero-emission smart mobility across Bengaluru, Mumbai, Delhi NCR, and 28+ Indian smart cities.
            </p>
            <div style={{ marginTop: '10px', fontSize: '0.84rem', color: '#64748b' }}>
              🇮🇳 HQ: Indiranagar, Bengaluru, KA | Helpline: 1800-209-4733
            </div>
            <div className="footer-social">
              {[
                { icon: '𝕏', label: 'Twitter' },
                { icon: '📘', label: 'Facebook' },
                { icon: '📸', label: 'Instagram' },
                { icon: '💼', label: 'LinkedIn' },
                { icon: '▶️', label: 'YouTube' },
              ].map((s) => (
                <a key={s.label} href="#" className="footer-social-link" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/how-it-works" className="footer-link">How It Works</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Press</a>
              <a href="#" className="footer-link">Careers</a>
            </div>
          </div>

          {/* For Renters */}
          <div>
            <div className="footer-col-title">For Renters</div>
            <div className="footer-links">
              <Link to="/rent" className="footer-link">Browse EVs</Link>
              <a href="#" className="footer-link">Pricing</a>
              <a href="#" className="footer-link">Insurance</a>
              <a href="#" className="footer-link">Charging Map</a>
              <a href="#" className="footer-link">FAQ</a>
              <a href="#" className="footer-link">Roadside Assist</a>
            </div>
          </div>

          {/* For Hosts */}
          <div>
            <div className="footer-col-title">For Hosts</div>
            <div className="footer-links">
              <Link to="/list-your-ev" className="footer-link">List Your EV</Link>
              <Link to="/owner" className="footer-link">Host Dashboard</Link>
              <a href="#" className="footer-link">Earnings Calculator</a>
              <a href="#" className="footer-link">Host Insurance</a>
              <a href="#" className="footer-link">Superhost Program</a>
              <a href="#" className="footer-link">Host Community</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} EcoGreen Cab. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Privacy Policy</a>
            <a href="#" className="footer-bottom-link">Terms of Service</a>
            <a href="#" className="footer-bottom-link">Cookie Policy</a>
          </div>
          <div className="footer-eco-badge">
            🌱 Carbon Neutral Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
