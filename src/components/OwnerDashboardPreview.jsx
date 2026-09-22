import { Link } from 'react-router-dom';
import '../styles/components.css';

const chartData = [45, 62, 55, 78, 90, 85, 110]; // weekly earnings
const months = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxVal = Math.max(...chartData);

export default function OwnerDashboardPreview() {
  return (
    <section className="section owner-preview-section" id="list-your-ev">
      <div className="container">
        <div className="owner-preview-content">
          {/* Left text */}
          <div>
            <span className="section-badge">🚗 Host with Pride</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '12px' }}>
              Turn Your EV Into a Revenue Machine in India
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '20px', fontSize: '0.9rem' }}>
              Join 4,000+ Indian EV hosts earning reliable monthly revenue.
              Our platform handles bookings, Aadhaar/DL KYC, Fastag toll processing, and ₹50 Lakh insurance — you just collect weekly payouts directly to your bank account.
            </p>

            {/* Benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[
                { icon: '💰', title: 'Earn ₹25,000–₹75,000/month', sub: 'Average ₹38,400/mo on Nexon EV & XUV400' },
                { icon: '🛡️', title: '₹50 Lakh Comprehensive Insurance', sub: 'Full host protection on every Indian booking' },
                { icon: '⚡', title: 'Weekly Direct Bank Deposits', sub: 'Automated NEFT/UPI settlement every Friday' },
                { icon: '🟢', title: 'Green RTO Plate & Fastag Sync', sub: 'Automated expressway toll tracking' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: '#e6f9f1', border: '1px solid #a7f3d0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                    {b.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem', marginBottom: '2px' }}>{b.title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/list-your-ev" className="btn btn-primary btn-lg">
                🚗 List My EV in India
              </Link>
              <Link to="/owner" className="btn btn-outline btn-lg">
                📊 View Live Host Dashboard
              </Link>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="owner-preview-right">
            {/* Browser Bar */}
            <div className="dashboard-header">
              <div className="dashboard-dot d-dot-red" />
              <div className="dashboard-dot d-dot-yellow" />
              <div className="dashboard-dot d-dot-green" />
              <div className="dashboard-title-bar">ecogreencab.in/owner/dashboard</div>
            </div>

            <div className="dashboard-body">
              {/* Stats Row */}
              <div className="dashboard-stats">
                <div className="dash-stat">
                  <div className="dash-stat-value">₹38,400</div>
                  <div className="dash-stat-label">This Month</div>
                </div>
                <div className="dash-stat">
                  <div className="dash-stat-value">18</div>
                  <div className="dash-stat-label">Trips Done</div>
                </div>
                <div className="dash-stat">
                  <div className="dash-stat-value">4.96</div>
                  <div className="dash-stat-label">Host Rating</div>
                </div>
              </div>

              {/* Chart */}
              <div className="dashboard-chart">
                <div className="chart-header">📈 Weekly Earnings Trend (₹)</div>
                <div className="chart-bars">
                  {chartData.map((val, i) => (
                    <div
                      key={i}
                      className="chart-bar"
                      style={{ height: `${(val / maxVal) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="chart-labels">
                  {months.map((m) => (
                    <div key={m} className="chart-label">{m}</div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="dashboard-recent">
                <div className="recent-header">Recent Trips (Bengaluru & Mumbai)</div>
                {[
                  { car: 'Tata Nexon EV LR', days: 3, earning: '₹5,697', status: 'confirmed' },
                  { car: 'Mahindra XUV400', days: 5, earning: '₹10,995', status: 'confirmed' },
                  { car: 'Tata Punch EV', days: 2, earning: '₹2,598', status: 'pending' },
                ].map((r, i) => (
                  <div key={i} className="recent-item">
                    <div>
                      <div className="recent-car">{r.car}</div>
                      <div style={{ fontSize: '0.74rem', color: '#9ca3af' }}>{r.days} days trip</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="recent-earning">{r.earning}</div>
                      <div className={`recent-status status-${r.status}`}>
                        {r.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
