import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import EVMarketplace from '../components/EVMarketplace';
import SearchWidget from '../components/SearchWidget';
import { cars } from '../data/cars';
import '../styles/marketplace.css';

export default function Rent() {
  const location = useLocation();
  const [searchFilters, setSearchFilters] = useState(
    location.state?.search || {}
  );

  return (
    <main style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Page Hero Header — 30% Dark Anchor Banner */}
      <div style={{
        background: '#0d1117',
        padding: '60px 0 44px',
        borderBottom: '1px solid #1e293b',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,185,107,0.15) 0%, transparent 65%)',
          pointerEvents: 'none',
          overflow: 'hidden',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="section-badge">⚡ EV Marketplace</span>
            <h1 style={{
              fontFamily: 'Space Grotesk',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              marginTop: '16px',
              marginBottom: '12px',
            }}>
              Find Your Perfect EV
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              {cars.length}+ verified self-drive EVs across Bengaluru, Mumbai, Delhi NCR, Hyderabad & 28+ Indian smart cities
            </p>
          </div>

          {/* Search */}
          <SearchWidget onSearch={setSearchFilters} compact={true} />
        </div>
      </div>

      {/* Marketplace — 70% Clean Light Area */}
      <div className="container section" style={{ padding: '64px 24px' }}>
        <EVMarketplace searchFilters={searchFilters} />
      </div>
    </main>
  );
}
