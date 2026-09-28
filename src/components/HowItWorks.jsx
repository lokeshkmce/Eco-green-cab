import { Link } from 'react-router-dom';
import { howItWorksSteps } from '../data/cars';
import { MdOutlineListAlt, MdElectricBolt } from 'react-icons/md';
import '../styles/components.css';

export default function HowItWorks() {
  return (
    <section className="section how-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MdOutlineListAlt/> Simple Process</span>
          <h2 className="section-title">How EcoGreen Cab Works</h2>
          <p className="section-subtitle">
            From discovery to driving — your premium EV experience in just 4 easy steps.
          </p>
        </div>

        <div className="how-horizontal-grid">
          {howItWorksSteps.map((step, index) => {
            const icons = [
              <span key="1" className="float-emoji" style={{ fontSize: '1.8rem', display: 'block' }}>🔍</span>,
              <span key="2" className="float-emoji" style={{ fontSize: '1.8rem', display: 'block' }}>📱</span>,
              <span key="3" className="float-emoji" style={{ fontSize: '1.8rem', display: 'block' }}>🚘</span>,
              <span key="4" className="float-emoji" style={{ fontSize: '1.8rem', display: 'block' }}>🛣️</span>
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdElectricBolt/> Start Your EV Journey</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
