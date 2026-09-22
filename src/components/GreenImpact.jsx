import { Link } from 'react-router-dom';
import { greenStats } from '../data/cars';
import '../styles/components.css';

const highlights = [
  { icon: '🌱', title: '4.2 Million kg CO₂ Prevented', sub: 'From 98K+ completed EV rentals' },
  { icon: '🌳', title: '182K Trees Equivalent', sub: 'Annual carbon offset impact' },
  { icon: '☀️', title: '100% Green Energy Partners', sub: 'All our charging stations use renewables' },
];

export default function GreenImpact() {
  return (
    <section className="section green-section" id="green-impact">
      <div className="container">
        <div className="green-content">
          {/* Left Text */}
          <div className="green-left">
            <span className="section-badge">🌍 Environmental Impact</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              Every Ride Saves the Planet
            </h2>
            <p className="green-description">
              At EcoGreen Cab, sustainability isn't a feature — it's our foundation. Every electric mile driven on our platform contributes to a measurable reduction in global carbon emissions.
            </p>

            <div className="green-highlights">
              {highlights.map((h, i) => (
                <div key={i} className="green-highlight">
                  <div className="green-highlight-icon">{h.icon}</div>
                  <div>
                    <div className="green-highlight-title">{h.title}</div>
                    <div className="green-highlight-sub">{h.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn btn-primary">
              🌿 Our Green Mission
            </Link>
          </div>

          {/* Right Stats */}
          <div>
            <div className="green-stats-grid">
              {[
                { value: greenStats.co2Saved, label: 'kg CO₂ Saved', icon: '💨' },
                { value: greenStats.treesEquivalent, label: 'Trees Equivalent', icon: '🌳' },
                { value: greenStats.rentals, label: 'EV Rentals', icon: '⚡' },
                { value: greenStats.members, label: 'Green Members', icon: '👥' },
                { value: greenStats.cities, label: 'Cities Covered', icon: '🏙️' },
                { value: greenStats.partners, label: 'EV Partners', icon: '🤝' },
              ].map((stat, i) => (
                <div key={i} className="green-stat-card">
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{stat.icon}</div>
                  <div className="green-stat-value">{stat.value}</div>
                  <div className="green-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CO2 Tracker */}
            <div style={{
              marginTop: '20px',
              padding: '24px',
              background: '#ffffff',
              border: '1px solid #d1fae5',
              borderRadius: '18px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                🌍 Live CO₂ Savings Today
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '2.2rem', fontWeight: 800, color: '#009958', marginBottom: '8px' }}>
                3,247 kg
              </div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: '73%',
                  background: 'linear-gradient(90deg, #00b96b 0%, #00d4aa 100%)',
                  borderRadius: '4px',
                }} />
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '8px', fontWeight: 500 }}>
                73% of today's daily goal achieved
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
