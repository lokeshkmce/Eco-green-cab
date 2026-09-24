import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { 
  MdDashboard, MdNotificationsActive, MdDirectionsCar, MdListAlt, 
  MdSupportAgent, MdCheckCircle, MdCancel, MdElectricBolt, 
  MdAttachMoney, MdPerson, MdClose 
} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css'; // Re-use the existing 70/30 dashboard styles

export default function AdminDashboard() {
  const { cars, updateCarStatus, bookings, sendCounterOffer, messages, replyToMessage } = useMarketplace();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, approvals, fleet, bookings, support, users
  const [userFilter, setUserFilter] = useState('car'); // 'car' or 'rent'
  const [counterInputs, setCounterInputs] = useState({}); // { carId: price }
  const [replyInputs, setReplyInputs] = useState({}); // { msgId: text }
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pendingCars = cars.filter(c => c.status === 'PENDING');
  const counteredCars = cars.filter(c => c.status === 'COUNTERED');
  const approvedCars = cars.filter(c => c.status === 'APPROVED');
  const rejectedCars = cars.filter(c => c.status === 'REJECTED');

  // KPI Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total || 0), 0);
  const platformEarnings = totalRevenue * 0.15; // 15% platform fee
  
  // Recent activity
  const recentBookings = [...bookings].reverse().slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MdDashboard /> Overview</span> },
    { id: 'approvals', label: <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MdNotificationsActive /> Approvals</span> },
    { id: 'fleet', label: <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MdDirectionsCar /> Active Fleet</span> },
    { id: 'bookings', label: <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MdListAlt /> All Bookings</span> },
    { id: 'users', label: <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MdPerson /> User List</span> },
    { id: 'support', label: <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><MdSupportAgent /> Support Tickets</span> },
  ];
  const renderUsers = () => {
    const demoUsersRaw = JSON.parse(localStorage.getItem('eco_demo_users') || '{}');
    const realUsers = Object.keys(demoUsersRaw).map(phone => ({
      name: 'User ' + phone.slice(-4),
      phone,
      role: demoUsersRaw[phone],
      status: 'Active'
    }));

    const mockUsers = [
      { name: 'Arjun Kumar', phone: '9876543210', role: 'owner', status: 'Active' },
      { name: 'Priya Sharma', phone: '9123456789', role: 'renter', status: 'Active' },
      { name: 'Rahul Desai', phone: '9988776655', role: 'renter', status: 'Active' },
      { name: 'Kavita Singh', phone: '9876512345', role: 'owner', status: 'Active' },
    ];

    const combinedUsers = [...realUsers, ...mockUsers].reduce((acc, current) => {
      const x = acc.find(item => item.phone === current.phone);
      if (!x) return acc.concat([current]);
      return acc;
    }, []);

    const owners = combinedUsers.filter(u => u.role === 'owner');
    const renters = combinedUsers.filter(u => u.role === 'renter');

    const UserTable = ({ title, users, badgeColor }) => (
      <div className="rd-panel" style={{ marginBottom: '24px' }}>
        <div className="rd-panel-header">
          <h2 className="rd-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdPerson /> {title} ({users.length})</h2>
        </div>
        <div className="rd-bookings-list">
          {users.map((u, i) => (
            <div className="rd-booking-row" key={i}>
              <div className="rd-booking-num">{i + 1}</div>
              <div className="rd-booking-info" style={{ flex: 1 }}>
                <div className="rd-booking-vehicle">{u.name}</div>
                <div className="rd-booking-dates">{u.phone}</div>
              </div>
              <div className="rd-booking-right">
                <span style={{ 
                  background: badgeColor, 
                  color: '#fff', 
                  padding: '6px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {u.role === 'owner' ? 'Car User' : u.role === 'renter' ? 'Rent User' : u.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="rd-content" style={{ padding: 0 }}>
        <header className="rd-header">
          <div className="rd-header-left">
            <div className="rd-header-greeting">User Management</div>
            <p className="rd-header-sub">View and manage all registered Rent Users and Car Users.</p>
          </div>
        </header>
        <div style={{ padding: '24px 28px' }}>
          
          {/* Tabs for Toggle */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', background: '#f8fafc', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
            <button 
              onClick={() => setUserFilter('car')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: userFilter === 'car' ? '#ffffff' : 'transparent',
                color: userFilter === 'car' ? '#111827' : '#64748b',
                fontWeight: userFilter === 'car' ? 700 : 500,
                boxShadow: userFilter === 'car' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Car Users
            </button>
            <button 
              onClick={() => setUserFilter('rent')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: userFilter === 'rent' ? '#ffffff' : 'transparent',
                color: userFilter === 'rent' ? '#111827' : '#64748b',
                fontWeight: userFilter === 'rent' ? 700 : 500,
                boxShadow: userFilter === 'rent' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Rent Users
            </button>
          </div>

          {userFilter === 'car' && (
            <UserTable title="Car Users" users={owners} badgeColor="#f59e0b" />
          )}
          {userFilter === 'rent' && (
            <UserTable title="Rent Users" users={renters} badgeColor="#3b82f6" />
          )}

        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="rd-content" style={{ padding: 0 }}>
      <header className="rd-header">
        <div className="rd-header-left">
          <div className="rd-header-greeting">Admin Overview</div>
          <p className="rd-header-sub">High-level metrics and platform health.</p>
        </div>
      </header>

      <div style={{ padding: '24px 28px' }}>
        {/* KPI Cards */}
        <div className="rd-stats-grid" style={{ marginBottom: '30px' }}>
          {[
            { id: 'bookings', label: 'Total Bookings', value: bookings.length, color: '#3b82f6', icon: <MdListAlt size={24} />, bg: 'rgba(59,130,246,0.1)' },
            { id: 'fleet', label: 'Active Fleet', value: approvedCars.length, color: '#00e676', icon: <MdDirectionsCar size={24} />, bg: 'rgba(0,230,118,0.1)' },
            { id: 'approvals', label: 'Pending Approvals', value: pendingCars.length, color: '#f59e0b', icon: <MdNotificationsActive size={24} />, bg: 'rgba(245,158,11,0.1)' },
            { id: 'overview', label: 'Est. Revenue', value: `₹${platformEarnings.toLocaleString('en-IN')}`, color: '#8b5cf6', icon: <MdAttachMoney size={24} />, bg: 'rgba(139,92,246,0.1)' },
          ].map((kpi, i) => (
            <div 
              className="rd-stat-card" 
              key={i} 
              style={{ '--card-color': kpi.color, '--card-bg': kpi.bg, cursor: 'pointer' }}
              onClick={() => setActiveTab(kpi.id)}
            >
              <div className="rd-stat-icon-wrap"><span className="rd-stat-icon">{kpi.icon}</span></div>
              <div className="rd-stat-glow" />
              <div className="rd-stat-info">
                <div className="rd-stat-value" style={{ fontSize: '1.6rem' }}>{kpi.value}</div>
                <div className="rd-stat-label">{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>

      {/* Recent Bookings */}
      <div className="rd-panel">
        <div className="rd-panel-header">
          <h2 className="rd-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdListAlt /> Recent Bookings</h2>
        </div>
        <div className="rd-bookings-list">
          {recentBookings.length === 0 ? (
            <div className="empty-state"><p>No bookings yet.</p></div>
          ) : (
            recentBookings.map((b, i) => (
              <div className="rd-booking-row" key={b.id}>
                <div className="rd-booking-num">{i + 1}</div>
                <div className="rd-booking-info">
                  <div className="rd-booking-vehicle">{b.carName}</div>
                  <div className="rd-booking-dates">Renter: {b.renterName} ({b.renterEmail})</div>
                </div>
                <div className="rd-booking-right">
                  <div className="rd-booking-amount">₹{b.total?.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'monospace' }}>{b.id}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="rd-content" style={{ padding: 0 }}>
      <header className="rd-header">
        <div className="rd-header-left">
          <div className="rd-header-greeting">Pending Approvals</div>
          <p className="rd-header-sub">Review vehicle quality and details before allowing them on the marketplace.</p>
        </div>
      </header>

      <div style={{ padding: '24px 28px' }}>
      {pendingCars.length === 0 ? (
        <div style={{ padding: '60px', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#10b981', display: 'flex', justifyContent: 'center' }}><MdCheckCircle size={48} /></div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>All caught up!</h3>
          <p style={{ color: '#64748b' }}>There are no vehicles waiting for approval right now.</p>
          <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#94a3b8', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
            Diagnostic: Total Cars in Database = {cars.length}. 
            Cars with 'PENDING' status = {cars.filter(c => c.status === 'PENDING').length}.
            Recently Added = {cars.length > 36 ? cars[cars.length - 1].name : 'None'} 
            ({cars.length > 36 ? cars[cars.length - 1].status : 'N/A'})
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px' }}>
          {pendingCars.map(car => (
            <div key={car.id} className="flex-responsive" style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
              <div style={{ flex: '1 1 280px', minHeight: '200px', background: '#f1f5f9', position: 'relative' }}>
                <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#f59e0b', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  Pending Review
                </div>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: '0 0 4px', fontFamily: 'Space Grotesk' }}>{car.name}</h3>
                    <div style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                      <span>📍 {car.city} ({car.location})</span>
                      <span>•</span>
                      <span>💰 ₹{car.price}/day</span>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Category</div>
                    <div style={{ fontWeight: 700, color: '#111827' }}>{car.category}</div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                  <div className="grid-responsive-4" style={{ gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Brand</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{car.brand}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Model</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{car.model}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Range</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{car.range} km</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Seats</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{car.seats}</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', borderLeft: '3px solid #3b82f6' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>👤 Host Details & Documents</div>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Name</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{car.ownerName || 'Unknown Owner'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{car.ownerPhone || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email</div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{car.ownerEmail || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Uploaded Docs</div>
                      <div style={{ fontWeight: 600, color: '#111827', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {car.hasPhotos ? <span title="Photos Uploaded" style={{ color: '#10b981' }}>📸 Photos</span> : <span title="No Photos" style={{ opacity: 0.3 }}>📸</span>}
                        {car.hasDocuments ? <span title="Documents Uploaded" style={{ color: '#10b981' }}>📄 RC/Ins</span> : <span title="No Documents" style={{ opacity: 0.3 }}>📄</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-responsive" style={{ gap: '12px', marginTop: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 300px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '150px' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>₹</span>
                      <input 
                        type="number" 
                        placeholder={`Suggest new price`}
                        value={counterInputs[car.id] || ''}
                        onChange={(e) => setCounterInputs({...counterInputs, [car.id]: e.target.value})}
                        style={{ width: '100%', padding: '12px 12px 12px 28px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600, color: '#111827', outline: 'none' }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (counterInputs[car.id]) {
                          sendCounterOffer(car.id, counterInputs[car.id]);
                        } else {
                          alert('Please enter a new price to counter.');
                        }
                      }}
                      style={{ padding: '12px 16px', borderRadius: '12px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Bargain Price
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                    <button
                      onClick={() => updateCarStatus(car.id, 'REJECTED')}
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ef4444', color: '#ef4444', background: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <MdCancel /> Reject
                    </button>
                    <button
                      onClick={() => updateCarStatus(car.id, 'APPROVED')}
                      style={{ flex: 1.5, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <MdCheckCircle /> Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Countered Cars Display */}
      {counteredCars.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px' }}>Awaiting Owner's Response</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {counteredCars.map(car => (
              <div key={car.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={car.image} alt={car.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{car.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Owner: {car.ownerName} ({car.ownerPhone})</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Original Quote: <span style={{textDecoration: 'line-through'}}>₹{car.price}</span></div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6' }}>You Countered: ₹{car.counterPrice}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );

  const renderFleet = () => (
    <div className="rd-content" style={{ padding: 0 }}>
      <header className="rd-header">
        <div className="rd-header-left">
          <div className="rd-header-greeting">Active Fleet Vehicles</div>
          <p className="rd-header-sub">Manage all currently approved and active vehicles on the platform.</p>
        </div>
      </header>

      <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {approvedCars.map(car => (
          <div key={car.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ height: '160px', position: 'relative' }}>
              <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                Active
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px', color: '#111827' }}>{car.name}</h3>
              <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '0.9rem' }}>{car.city} • ₹{car.price}/day</p>
              
              <button 
                onClick={() => updateCarStatus(car.id, 'REJECTED')}
                style={{ width: '100%', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Delist Vehicle
              </button>
            </div>
          </div>
        ))}
      </div>

      {rejectedCars.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '20px' }}>Rejected / Delisted Vehicles</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {rejectedCars.map(car => (
              <div key={car.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e5e7eb', opacity: 0.7 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#111827' }}>{car.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{car.city}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, background: '#fef2f2', padding: '4px 10px', borderRadius: '12px' }}>REJECTED</span>
                  <button onClick={() => updateCarStatus(car.id, 'PENDING')} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Move to Pending</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="rd-content" style={{ padding: 0 }}>
      <header className="rd-header">
        <div className="rd-header-left">
          <div className="rd-header-greeting">All Bookings</div>
          <p className="rd-header-sub">Comprehensive ledger of all transactions and reservations.</p>
        </div>
      </header>

      <div style={{ padding: '24px 28px' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Booking ID</th>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Renter Details</th>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Vehicle & Dates</th>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Paid</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No bookings on the platform yet.</td>
              </tr>
            ) : (
              [...bookings].reverse().map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>{b.id}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{b.renterName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>{b.renterEmail}</div>
                    {b.drivingLicenseUploaded ? (
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#d1fae5', color: '#065f46', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MdCheckCircle size={12} /> DL Uploaded</span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#fef2f2', color: '#991b1b', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MdCancel size={12} /> No DL</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{b.carName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{b.startDate} to {b.endDate}</div>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 700, color: '#009958' }}>
                    ₹{b.total?.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );

  return (
    <div className="rd-layout">
      {/* MOBILE HEADER */}
      <div className="rd-mobile-header">
        <Link to="/" className="brand-logo-dashboard">
          <img src="/images/logo.jpg" alt="ieco" />
        </Link>
        <button className="rd-hamburger" onClick={() => setIsSidebarOpen(true)}>☰</button>
      </div>

      {isSidebarOpen && <div className="rd-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`rd-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <Link to="/" className="brand-logo-dashboard" onClick={() => setIsSidebarOpen(false)} style={{ margin: 0, padding: '4px 8px' }}>
            <img src="/images/logo.jpg" alt="ieco Admin" style={{ height: '32px' }} />
          </Link>
          
          <div className="rd-user-block" style={{ margin: 0, padding: 0, background: 'transparent', border: 'none' }}>
            <div>
              <div className="rd-user-name" style={{ fontSize: '0.9rem' }}>Super Admin</div>
              <div className="rd-user-badge" style={{color: '#3b82f6', background: 'rgba(59,130,246,0.1)', fontSize: '0.65rem'}}>🔵 Platform</div>
            </div>
          </div>
        </div>

        <nav className="rd-nav">
          {navItems.map(item => (
            <button key={item.id} className={`rd-nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}>
              <span>{item.label}</span>
              {activeTab === item.id && <span className="rd-nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="rd-sidebar-footer">
          <button className="rd-logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="rd-main">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'approvals' && renderApprovals()}
        {activeTab === 'fleet' && renderFleet()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'support' && (
          <div className="rd-content" style={{ padding: 0 }}>
            <header className="rd-header">
              <div className="rd-header-left">
                <div className="rd-header-greeting">Support Tickets</div>
                <p className="rd-header-sub">Manage incoming queries and contact requests.</p>
              </div>
            </header>
            
            <div style={{ padding: '24px 28px', display: 'grid', gap: '16px' }}>
              {!messages || messages.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', color: '#64748b' }}>
                  No support tickets at the moment.
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: '#111827', fontSize: '1.1rem' }}>{msg.name}</span>
                          <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                            {msg.type}
                          </span>
                          {msg.status === 'RESOLVED' && (
                            <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                              RESOLVED
                            </span>
                          )}
                        </div>
                        <div style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600 }}>{msg.email}</div>
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Subject: {msg.subject}</div>
                      <p style={{ color: '#475569', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {msg.message}
                      </p>
                    </div>

                    {msg.status === 'RESOLVED' ? (
                      <div style={{ marginTop: '16px', background: '#ecfdf5', padding: '16px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                        <div style={{ fontWeight: 700, color: '#065f46', marginBottom: '8px' }}>Admin Reply ({new Date(msg.replyDate).toLocaleDateString()}):</div>
                        <p style={{ color: '#047857', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {msg.reply}
                        </p>
                      </div>
                    ) : (
                      <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        <input
                          type="text"
                          value={replyInputs[msg.id] || ''}
                          onChange={(e) => setReplyInputs({ ...replyInputs, [msg.id]: e.target.value })}
                          placeholder="Type your reply here..."
                          style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                        />
                        <button 
                          onClick={() => {
                            if(replyInputs[msg.id]) {
                              replyToMessage(msg.id, replyInputs[msg.id]);
                            }
                          }}
                          style={{ padding: '10px 20px', background: '#00e676', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Send Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
