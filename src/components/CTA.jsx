import { Link } from 'react-router-dom';
import '../styles/components.css';

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <span className="section-badge" style={{ marginBottom: '16px' }}>
          🌿 Join the Movement
        </span>
        <h2 className="cta-title">
          Ready to Drive the Future?
        </h2>
        <p className="cta-subtitle">
          Join 45,000+ eco-conscious drivers and EV hosts across 28+ Indian cities driving India towards a greener tomorrow.
          Your perfect electric vehicle is just one click away.
        </p>
        <div className="cta-buttons">
          <Link to="/rent" className="btn btn-primary btn-lg">
            ⚡ Browse Electric Vehicles
          </Link>
          <Link to="/list-your-ev" className="btn btn-ghost btn-lg">
            🚗 List Your EV & Earn ₹45k/mo
          </Link>
        </div>

        {/* Trust signals */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          {[
            '✓ Free to join',
            '✓ Fastag & Toll Ready',
            '✓ ₹50 Lakh Insurance Cover',
            '✓ 24/7 Pan-India Roadside Support',
          ].map((s, i) => (
            <span key={i} style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
