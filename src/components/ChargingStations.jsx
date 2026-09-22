import { chargingStations } from '../data/cars';
import '../styles/components.css';

export default function ChargingStations() {
  return (
    <section className="section charging-section" id="charging-stations">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">⚡ Charging Network</span>
          <h2 className="section-title">500+ Charging Stations Nationwide</h2>
          <p className="section-subtitle">
            Never worry about range. Our charging network spans every major city, with ultra-fast 350 kW connectors.
          </p>
        </div>

        <div className="charging-grid">
          {chargingStations.map((station) => (
            <div key={station.id} className="charging-card">
              <div className="charging-card-header">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                  <div className="charging-card-icon">⚡</div>
                  <div>
                    <div className="charging-card-name">{station.name}</div>
                    <div className="charging-card-address">📍 {station.address}</div>
                  </div>
                </div>
                <div className={`charging-status ${station.open24h ? 'open' : 'closed'}`}>
                  <span className="charging-status-dot" />
                  {station.open24h ? '24/7 Open' : 'Limited Hrs'}
                </div>
              </div>

              <div className="charging-stats">
                <div className="charging-stat">
                  <span className="charging-stat-value">{station.available}</span>
                  <span className="charging-stat-label">Available</span>
                </div>
                <div className="charging-stat">
                  <span className="charging-stat-value">{station.connectors}</span>
                  <span className="charging-stat-label">Connectors</span>
                </div>
                <div className="charging-stat">
                  <span className="charging-stat-value">{station.speed}</span>
                  <span className="charging-stat-label">Max Speed</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                <div className="charging-amenities">
                  {station.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="charging-amenity">{a}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', color: '#f59e0b', flexShrink: 0 }}>
                  ★ <span style={{ color: '#111827', fontWeight: 700, marginLeft: '2px' }}>{station.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Network Summary */}
        <div style={{
          marginTop: '48px',
          padding: '32px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          textAlign: 'center',
        }}>
          {[
            { value: '500+', label: 'Total Stations', icon: '⚡' },
            { value: '350 kW', label: 'Max Charge Speed', icon: '🔋' },
            { value: '28', label: 'Cities Covered', icon: '🏙️' },
            { value: '24/7', label: 'Network Support', icon: '🆘' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.7rem', fontWeight: 800, color: '#009958' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
