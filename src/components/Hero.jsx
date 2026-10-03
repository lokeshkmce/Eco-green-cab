import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdElectricBolt, MdPlayArrow } from 'react-icons/md';
import '../styles/hero.css';

const SLIDES = [
  {
    img: '/hero_ev_1.jpg',
    car: 'Tata Nexon EV',
    location: 'Kerala Coastal Highway, NH66',
    bgPosition: 'center 55%',
  },
  {
    img: '/hero_ev_2.jpg',
    car: 'Mahindra BE Electric',
    location: 'Ooty Hill Station, Tamil Nadu',
    bgPosition: 'center 65%',
  },
  {
    img: '/hero_ev_3.jpg',
    car: 'Hyundai Ioniq 5',
    location: 'Outer Ring Road, Bengaluru',
    bgPosition: 'center 60%',
  },
  {
    img: '/hero_ev_4.jpg',
    car: 'Tata Punch EV',
    location: 'East Coast Road, Chennai',
    bgPosition: 'center center',
  },
  {
    img: '/hero_ev_5.jpg',
    car: 'MG ZS EV',
    location: 'Alleppey Backwaters, Kerala',
    bgPosition: 'center center',
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Simple, bulletproof auto-slide — runs once, uses functional update so it
  // always gets the LATEST state without stale closure issues.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Dynamic Background Slides */}
      <div className="hero-slides">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.img}
            className={`hero-slide${i === activeSlide ? ' active' : ''}`}
            style={{ backgroundImage: `url(${slide.img})`, backgroundPosition: slide.bgPosition }}
          />
        ))}
        {/* Gradient overlay — ensures text readability over any slide */}
        <div className="hero-slide-overlay" />
      </div>

      {/* Static Content */}
      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text"><MdElectricBolt style={{ color: '#fbbf24', marginRight: '4px' }}/> The Easiest Way to Rent an EV</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line1">Rent an Electric Car.</span>
            <span className="hero-title-line2">Save Money &amp; the Planet.</span>
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

      </div>
    </section>
  );
}
