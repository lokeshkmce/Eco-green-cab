import { useState, useMemo } from 'react';
import '../styles/components.css';

export default function EarningsCalculator() {
  const [dailyRate, setDailyRate] = useState(2200);
  const [daysPerMonth, setDaysPerMonth] = useState(15);
  const [platformFee] = useState(20); // 20%

  const monthlyGross = useMemo(() => dailyRate * daysPerMonth, [dailyRate, daysPerMonth]);
  const platformCut = useMemo(() => Math.round(monthlyGross * (platformFee / 100)), [monthlyGross, platformFee]);
  const monthlyNet = useMemo(() => monthlyGross - platformCut, [monthlyGross, platformCut]);
  const annualNet = useMemo(() => monthlyNet * 12, [monthlyNet]);

  return (
    <section className="section calculator-section" id="earnings-calculator">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">💰 Host Earnings in India</span>
          <h2 className="section-title">Calculate Your Monthly Host Revenue</h2>
          <p className="section-subtitle">
            Earn reliable passive income by listing your electric vehicle on EcoGreen Cab across Indian metro cities.
          </p>
        </div>

        <div className="calculator-card">
          <div className="calculator-grid">
            {/* Inputs */}
            <div className="calculator-inputs">
              {/* Daily Rate */}
              <div className="calc-field">
                <label>Daily Rental Rate (INR)</label>
                <input
                  type="range"
                  className="calc-slider"
                  min={800}
                  max={8000}
                  step={100}
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #00b96b 0%, #00b96b ${((dailyRate - 800) / 7200) * 100}%, #e2e8f0 ${((dailyRate - 800) / 7200) * 100}%, #e2e8f0 100%)`,
                  }}
                />
                <div className="calc-value">
                  <span className="calc-value-main">₹{dailyRate.toLocaleString('en-IN')}</span>
                  <span className="calc-value-sub">per day</span>
                </div>
              </div>

              {/* Days per month */}
              <div className="calc-field">
                <label>Days Available Per Month</label>
                <input
                  type="range"
                  className="calc-slider"
                  min={1}
                  max={30}
                  step={1}
                  value={daysPerMonth}
                  onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #0284c7 0%, #0284c7 ${((daysPerMonth - 1) / 29) * 100}%, #e2e8f0 ${((daysPerMonth - 1) / 29) * 100}%, #e2e8f0 100%)`,
                  }}
                />
                <div className="calc-value">
                  <span className="calc-value-main" style={{ color: '#0284c7' }}>{daysPerMonth}</span>
                  <span className="calc-value-sub">days/month</span>
                </div>
              </div>

              {/* Platform note */}
              <div style={{
                padding: '12px 14px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                fontSize: '0.8rem',
                color: '#166534',
                lineHeight: 1.5,
              }}>
                💡 EcoGreen Cab charges just a <strong style={{ color: '#009958' }}>20% platform fee</strong>. We provide ₹50 Lakh commercial insurance, automated Fastag settlement, verified customer Aadhaar/DL KYC, and weekly NEFT bank payouts.
              </div>
            </div>

            {/* Result */}
            <div className="calculator-result">
              <div className="calc-result-card">
                <div className="calc-result-label">Estimated Take-Home Revenue</div>
                <div className="calc-result-amount">₹{monthlyNet.toLocaleString('en-IN')}</div>
                <div className="calc-result-period">net earnings per month</div>

                <div className="calc-breakdown">
                  <div className="calc-breakdown-item">
                    <span className="calc-breakdown-label">Gross booking value</span>
                    <span className="calc-breakdown-value">₹{monthlyGross.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="calc-breakdown-item">
                    <span className="calc-breakdown-label">Platform fee (20%)</span>
                    <span className="calc-breakdown-value" style={{ color: '#ef4444' }}>−₹{platformCut.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="calc-breakdown-item" style={{ borderBottom: 'none' }}>
                    <span className="calc-breakdown-label">Annual projected earnings</span>
                    <span className="calc-breakdown-value" style={{ color: '#009958' }}>₹{annualNet.toLocaleString('en-IN')}/year</span>
                  </div>
                </div>

                <a href="/list-your-ev" style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(0,185,107,0.3)',
                  transition: 'all 0.3s ease',
                }}>
                  🚗 List Your EV in 2 Minutes
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
