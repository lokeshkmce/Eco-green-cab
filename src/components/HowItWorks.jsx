import { Link } from 'react-router-dom';
import { howItWorksSteps } from '../data/cars';
import '../styles/components.css';

export default function HowItWorks() {
  return (
    <section className="section how-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">📋 Simple Process</span>
          <h2 className="section-title">How EcoGreen Cab Works</h2>
          <p className="section-subtitle">
            From discovery to driving — your premium EV experience in just 4 easy steps.
          </p>
        </div>

        <div className="how-horizontal-grid">
          {howItWorksSteps.map((step, index) => {
            const icons = [
              <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00b96b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
              <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00b96b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
              <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00b96b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>,
              <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00b96b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
            ];
            
            return (
              <div key={step.step} className="how-horizontal-card">
                <div className="how-horizontal-icon">
                  {icons[index]}
                </div>
                <div className="how-horizontal-content">
                  <h3 className="how-horizontal-title">Step {step.step}: {step.title}</h3>
                  <p className="how-horizontal-desc">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/rent" className="btn btn-primary btn-lg">
            ⚡ Start Your EV Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
