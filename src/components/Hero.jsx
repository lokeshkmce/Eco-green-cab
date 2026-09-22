import { Link } from 'react-router-dom';
import { MdElectricBolt, MdPlayArrow } from 'react-icons/md';
import '../styles/hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* Background */}
      <div className="hero-bg">
        <div className="hero-bg-gradient" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Left */}
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text"><MdElectricBolt style={{ color: '#fbbf24', marginRight: '4px' }}/> The Easiest Way to Rent an EV</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line1">Rent an Electric Car.</span>
            <span className="hero-title-line2">Save Money & the Planet.</span>
          </h1>

          <p className="hero-subtitle">
            Book a self-drive EV in minutes. Enjoy zero fuel costs, no security deposits, and hassle-free instant approvals.
          </p>

          <div className="hero-actions">
            <Link to="/rent" className="hero-btn-primary">
              <MdElectricBolt size={20} /> Explore Indian EVs
              <span>→</span>
            </Link>
            <Link to="/how-it-works" className="hero-btn-secondary">
              <MdPlayArrow size={22} /> How It Works
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">98K+</div>
              <div className="hero-stat-label">Trips Across India</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">4.8M</div>
              <div className="hero-stat-label">kg CO₂ Prevented</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">28+</div>
              <div className="hero-stat-label">Indian Cities</div>
            </div>
          </div>
        </div>

        {/* Right — Featured Car */}
        <div className="hero-right">
          <div className="hero-car-wrapper">
            <div className="hero-car-glow" />
            <img
              src="/hero_green_ev.jpg"
              alt="Tata Nexon EV — India's No. 1 Electric SUV"
              className="hero-car-img"
            />

          </div>
        </div>
      </div>
    </section>
  );
}
