import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import '../styles/dashboard.css';

export default function OwnerDashboard() {
  const { user, logout, addRole, updateUser } = useAuth();
  const { cars, updateCarStatus, updateOwnerEmail, messages, bookings } = useMarketplace();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [confirmingCar, setConfirmingCar] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const myCars = cars.filter(c => c.ownerEmail === user?.email);
  const counteredCars = myCars.filter(c => c.status === 'COUNTERED');
  const activeCars = myCars.filter(c => c.status === 'APPROVED');
  const pendingCars = myCars.filter(c => c.status === 'PENDING');

  const myBookings = bookings.filter(b => myCars.some(c => c.id === b.carId));
  const totalEarnings = myBookings.reduce((sum, b) => sum + (b.total || 0), 0);

  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'my_evs', label: '🚗 My EVs' },
    { id: 'profile', label: '👤 Profile' },
    { id: 'support', label: '💬 Support Tickets' },
  ];

  const handleRenterAction = () => {
    if (user?.roles?.includes('renter')) {
      navigate('/renter/dashboard');
    } else {
      addRole('renter');
      navigate('/renter/dashboard');
    }
  };

  // Mock Placeholder Component for other tabs
  const PlaceholderView = ({ title, icon, description }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '40px' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{icon}</div>
      <h2 style={{ fontSize: '1.8rem', fontFamily: 'Space Grotesk', color: '#111827', marginBottom: '8px' }}>{title}</h2>
      <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '400px', textAlign: 'center' }}>{description}</p>
      <button className="btn btn-outline" style={{ marginTop: '24px' }} onClick={() => setActiveTab('dashboard')}>← Back to Dashboard</button>
    </div>
  );

  return (
    <div className="dashboard-layout">
      
      {/* ─── MOBILE HEADER (Visible only on <1024px) ─── */}
      <div className="dashboard-mobile-header">
        <Link to="/" className="sidebar-logo">
          <span style={{ color: '#00b96b' }}>⚡</span> EcoGreen
        </Link>
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </button>
      </div>

      {/* ─── SIDEBAR OVERLAY ─── */}
      <div 
        className={`dashboard-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ─── SIDEBAR (30%) ─── */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Link to="/" className="sidebar-logo">
          <span style={{ color: '#00b96b' }}>⚡</span> EcoGreen <span style={{ color: '#fff', fontWeight: 600 }}>Owner</span>
        </Link>
        
        <div style={{ padding: '0 12px', marginBottom: '24px' }}>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>LOGGED IN AS</div>
            <div style={{ color: '#fff', fontWeight: 600 }}>{user?.name || 'Owner'}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              style={{ borderTop: 'none', borderRight: 'none', borderBottom: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              {item.label}
            </button>
          ))}
          <Link to="/list-your-ev" className="sidebar-item" style={{ borderTop: 'none', borderRight: 'none', borderBottom: 'none' }}>➕ Add EV</Link>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT (70% Light) ─── */}
      <main className="dashboard-main">
        
        <header className="dashboard-header">
          <div className="dashboard-header-inner">
            <div>
              <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '1.6rem', color: '#111827', marginBottom: '4px', textTransform: 'capitalize' }}>
                {activeTab === 'dashboard' ? `Welcome back, ${user?.name || 'Arun'}!` : activeTab.replace('_', ' ')}
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                {activeTab === 'dashboard' ? 'Manage your fleet, track earnings, and review bookings.' : `Manage your ${activeTab.replace('_', ' ')} easily and securely.`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-outline" 
                onClick={handleRenterAction}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {user?.roles?.includes('renter') ? '🔄 Switch to Renter View' : '🚗 Rent an EV'}
              </button>
              <Link to="/list-your-ev" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>➕ Add Your EV</Link>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          
          {/* TAB ROUTING */}
          {activeTab === 'dashboard' && (
            <>
              {/* COMPACT METRICS */}
              <div className="metric-grid">
                <div className="metric-card">
                  <div className="metric-icon">💰</div>
                  <div>
                    <div className="metric-title">Total Earnings</div>
                    <div className="metric-value">₹{totalEarnings.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>📅</div>
                  <div>
                    <div className="metric-title">This Month</div>
                    <div className="metric-value">₹38.4K</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>💳</div>
                  <div>
                    <div className="metric-title">Balance</div>
                    <div className="metric-value">₹12.5K</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>⭐</div>
                  <div>
                    <div className="metric-title">Avg Rating</div>
                    <div className="metric-value">4.96</div>
                  </div>
                </div>
              </div>

              {/* NO-SCROLL SPLIT VIEW */}
              <div className="dashboard-split-view">
                
                <div className="split-left">
                  <h2 className="section-title-compact">Recent Completed Bookings</h2>
                  <div className="dash-table-container">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Vehicle</th>
                          <th>Renter</th>
                          <th>Dates</th>
                          <th style={{ textAlign: 'right' }}>Earned</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myBookings.length > 0 ? (
                          [...myBookings].reverse().map(b => (
                            <tr key={b.id}>
                              <td style={{ fontWeight: 600 }}>{b.carName}</td>
                              <td>{b.renterName}</td>
                              <td>{b.startDate} to {b.endDate}</td>
                              <td style={{ textAlign: 'right', fontWeight: 600, color: '#00b96b' }}>+₹{b.total.toLocaleString('en-IN')}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No completed bookings yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>



              </div>
            </>
          )}

          {activeTab === 'my_evs' && (
            <div className="dashboard-content-scroll" style={{ padding: 0 }}>
              
              {/* Negotiation Section */}
              {counteredCars.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⚠️ Action Required: Price Negotiation
                  </h2>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {counteredCars.map(car => (
                      <div key={car.id} style={{ background: '#fff', border: '2px solid #3b82f6', borderRadius: '16px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <img src={car.image} alt={car.name} style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px' }}>{car.name}</h3>
                          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
                            Admin has proposed a new daily rate of <strong style={{ color: '#3b82f6', fontSize: '1.1rem' }}>₹{car.counterPrice}</strong>. Your original quote was <span style={{ textDecoration: 'line-through' }}>₹{car.price}</span>.
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                          <button 
                            onClick={() => setConfirmingCar(car)}
                            style={{ padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Review & Accept
                          </button>
                          <button 
                            onClick={() => updateCarStatus(car.id, 'REJECTED')}
                            style={{ padding: '12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Reject & Delist
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Fleet Overview */}
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>My Active Fleet ({activeCars.length})</h2>
                {activeCars.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', color: '#64748b' }}>
                    You don't have any active vehicles listed yet.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {activeCars.map(car => (
                      <div key={car.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <div style={{ height: '140px', position: 'relative' }}>
                          <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>Active</div>
                        </div>
                        <div style={{ padding: '20px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>{car.name}</h3>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'line-through' }}>List Price: ₹{car.price}/day</div>
                              <div style={{ color: '#00b96b', fontWeight: 800, fontSize: '1.15rem' }}>₹{Math.round(car.price * 0.85)}/day</div>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#10b981', background: '#ecfdf5', padding: '4px 8px', borderRadius: '8px', fontWeight: 700 }}>
                              Your Net (85%)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Queue */}
              {pendingCars.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>Pending Admin Review</h2>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {pendingCars.map(car => (
                      <div key={car.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                        <span style={{ fontWeight: 600 }}>{car.name}</span>
                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>Pending Review</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'profile' && (
            <div className="dashboard-content-scroll" style={{ padding: 0 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '24px' }}>Owner Profile</h2>
              
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px', maxWidth: '600px' }}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (profileForm.email !== user.email) {
                    updateOwnerEmail(user.email, profileForm.email);
                  }
                  updateUser(profileForm);
                  alert('Profile updated successfully!');
                }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
                    <input 
                      type="text" 
                      value={profileForm.name}
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={profileForm.email}
                      onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      value={profileForm.phone}
                      onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <button type="submit" style={{ padding: '14px 24px', background: '#00b96b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%' }}>
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="dashboard-content-scroll" style={{ padding: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>My Support Tickets</h2>
                <Link to="/contact" style={{ padding: '10px 20px', background: '#00b96b', color: '#fff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
                  Open New Ticket
                </Link>
              </div>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {messages?.filter(m => m.email === user?.email).length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', color: '#64748b' }}>
                    You have no active support tickets.
                  </div>
                ) : (
                  messages?.filter(m => m.email === user?.email).map(msg => (
                    <div key={msg.id} style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, color: '#111827', fontSize: '1.1rem' }}>{msg.subject}</span>
                            <span style={{ fontSize: '0.75rem', background: msg.status === 'RESOLVED' ? '#ecfdf5' : '#fffbeb', color: msg.status === 'RESOLVED' ? '#10b981' : '#f59e0b', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                              {msg.status || 'OPEN'}
                            </span>
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <p style={{ color: '#475569', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                      </div>

                      {msg.status === 'RESOLVED' && (
                        <div style={{ marginTop: '16px', background: '#ecfdf5', padding: '16px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                          <div style={{ fontWeight: 700, color: '#065f46', marginBottom: '8px' }}>EcoGreen Support Reply:</div>
                          <p style={{ color: '#047857', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {msg.reply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmingCar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', width: '90%', maxWidth: '440px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Confirm New Price</h2>
            <p style={{ color: '#64748b', margin: '0 0 24px', fontSize: '0.95rem' }}>Review the final earning breakdown for your <strong>{confirmingCar.name}</strong> before accepting.</p>
            
            <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                <span style={{ color: '#64748b' }}>Bargained Daily Rate</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>₹{confirmingCar.counterPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.95rem' }}>
                <span style={{ color: '#ef4444' }}>Platform Commission (15%)</span>
                <span style={{ fontWeight: 600, color: '#ef4444' }}>- ₹{Math.round(confirmingCar.counterPrice * 0.15)}</span>
              </div>
              
              <div style={{ height: '1px', background: '#cbd5e1', marginBottom: '16px' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#111827', fontSize: '1.1rem' }}>Your Net Earning</span>
                <span style={{ fontWeight: 800, color: '#00b96b', fontSize: '1.4rem' }}>₹{Math.round(confirmingCar.counterPrice * 0.85)}<span style={{ fontSize: '0.9rem', color: '#64748b' }}>/day</span></span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setConfirmingCar(null)}
                style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  updateCarStatus(confirmingCar.id, 'APPROVED', confirmingCar.counterPrice);
                  setConfirmingCar(null);
                }}
                style={{ flex: 1.5, padding: '14px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}
              >
                Accept & List Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
