import { BsStars } from 'react-icons/bs';
import '../styles/components.css';

const features = [
  {
    icon: '🔑',
    title: 'Keyless Entry',
    desc: 'Unlock your EV directly from the app — no physical key handoff required. Arrive and drive.',
    accent: '#00e676',
  },
  {
    icon: '🛡️',
    title: 'Comprehensive Insurance',
    desc: 'Every rental includes liability coverage. Upgrade to premium for zero-deductible full protection.',
    accent: '#00bcd4',
  },
  {
    icon: '⚡',
    title: 'Fast Charging Access',
    desc: 'Unlimited access to our 500+ station network during your rental. Never range-anxious again.',
    accent: '#69f0ae',
  },
  {
    icon: '🌱',
    title: 'CO₂ Savings Tracker',
    desc: 'See exactly how much carbon you\'ve offset with every trip — in real time.',
    accent: '#00e676',
  }
];

export default function Features() {
  return (
    <section className="section features-section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BsStars/> Platform Features</span>
          <h2 className="section-title">Everything You Need, Nothing You Don't</h2>
          <p className="section-subtitle">
            EcoGreen Cab is built from the ground up to make EV rentals effortless, safe, and rewarding.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card"
              style={{ '--accent': feature.accent }}
            >
              <div
                className="feature-icon"
                style={{
                  background: `${feature.accent}18`,
                  borderColor: `${feature.accent}30`,
                }}
              >
                <span className="float-emoji" style={{ fontSize: '1.5rem', display: 'block' }}>{feature.icon}</span>
              </div>
              <div className="feature-content-wrap">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
