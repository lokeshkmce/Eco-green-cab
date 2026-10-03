import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { 
  MdDashboard, MdNotificationsActive, MdDirectionsCar, MdListAlt, 
  MdSupportAgent, MdCheckCircle, MdCancel, 
  MdAttachMoney, MdPerson, MdClose, MdEdit 
} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  const [chartFilter, setChartFilter] = useState('month'); // 'month' or 'year'
  const [apiUsers, setApiUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', phone: '', role: '' });
  const [userOverrides, setUserOverrides] = useState({});
  const [selectedFleetCarId, setSelectedFleetCarId] = useState(null);

  useEffect(() => {
    if (activeTab === 'users') {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const response = await fetch('http://127.0.0.1:8000/ecogreencab/users/');
          if (response.ok) {
            const data = await response.json();
            setApiUsers(data);
          } else {
            console.error('Failed to fetch users:', response.statusText);
          }
        } catch (error) {
          console.error("API connection failed:", error);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab]);

  const handleDeleteUser = async (userId, userPhone) => {
    if (!window.confirm(`Are you sure you want to delete ${userPhone}?`)) return;

    if (userId) {
      // Optimistically update UI for API users
      setApiUsers(prev => prev.filter(u => u.id !== userId));
      try {
        const response = await fetch(`http://127.0.0.1:8000/ecogreencab/user/${userId}/delete/`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          console.error("Failed to delete user on API:", response.statusText);
        }
      } catch (error) {
        console.error("API connection failed:", error);
      }
    } else {
      // Fallback for local demo users (no ID)
      const demoUsersRaw = JSON.parse(localStorage.getItem('eco_demo_users') || '{}');
      if (demoUsersRaw[userPhone]) {
        delete demoUsersRaw[userPhone];
        localStorage.setItem('eco_demo_users', JSON.stringify(demoUsersRaw));
        // We'll force a state update to trigger a re-render
        setUserFilter(prev => prev === 'car' ? 'car ' : 'car'); // Hacky way to re-render local users
        setTimeout(() => setUserFilter(prev => prev.trim()), 0);
      }
    }
  };

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

    const apiUsersFormatted = apiUsers.map(u => ({
      id: u.id,
      name: u.name || 'API User',
      phone: u.phone || 'N/A',
      role: u.role || u.roles?.[0] || 'renter',
      status: 'Active'
    }));

    const combinedUsers = [...apiUsersFormatted, ...realUsers, ...mockUsers].reduce((acc, current) => {
      const x = acc.find(item => item.phone === current.phone);
      if (!x) {
        const overridden = userOverrides[current.phone];
        return acc.concat([overridden ? { ...current, ...overridden } : current]);
      }
      return acc;
    }, []);

    const owners = combinedUsers.filter(u => u.role === 'owner');
    const renters = combinedUsers.filter(u => u.role === 'renter');

    const UserTable = ({ title, users, badgeColor }) => (
      <div className="rd-panel" style={{ marginBottom: '24px' }}>
        <div className="rd-panel-header">
          <h2 className="rd-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdPerson /> {title} ({users.length})</h2>
        </div>
        <div className="rd-bookings-list" style={{ padding: '0 8px 12px 8px' }}>
          {users.map((u, i) => (
            <div 
              key={i} 
              className="rd-user-row-mobile"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                margin: '12px 0',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: `${badgeColor}15`,
                color: badgeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                marginRight: '16px'
              }}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{u.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {u.phone} 
                </div>
              </div>
              <div className="rd-user-actions-mobile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  background: badgeColor, 
                  color: '#fff', 
                  padding: '6px 14px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  marginRight: '12px'
                }}>
                  {u.role === 'owner' ? 'Host User' : u.role === 'renter' ? 'Rental User' : u.role}
                </span>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={() => { setEditingUser(u); setEditUserForm({ name: u.name, phone: u.phone, role: u.role }); }}
                    style={{ 
                      background: '#f1f5f9',
                      border: 'none',
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      borderRadius: '10px',
                      transition: 'background 0.2s, color 0.2s'
                    }}
                    title="Edit User"
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(u.id, u.phone)}
                    style={{ 
                      background: '#fef2f2',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      borderRadius: '10px',
                      transition: 'background 0.2s'
                    }}
                    title="Delete User"
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                  >
                    <MdClose size={18} />
                  </button>
                </div>
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
            <p className="rd-header-sub">View and manage all registered Rental Users and Host Users.</p>
          </div>
          <div className="rd-header-right">
            <Link to="/" className="rd-btn-primary">Go to Home</Link>
          </div>
        </header>
        <div style={{ padding: '24px 28px' }}>
          
          {/* Tabs for Toggle */}
          <div className="rd-chart-header-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
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
              Host Users
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
              Rental Users
            </button>
            </div>
            {loadingUsers && <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Syncing with live API...</div>}
          </div>

          {userFilter === 'car' && (
            <UserTable title="Host Users" users={owners} badgeColor="#f59e0b" />
          )}
          {userFilter === 'rent' && (
            <UserTable title="Rental Users" users={renters} badgeColor="#3b82f6" />
          )}

        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const monthlyChartData = [
      { name: 'Week 1', bookings: 12 },
      { name: 'Week 2', bookings: 19 },
      { name: 'Week 3', bookings: 15 },
      { name: 'Week 4', bookings: Math.max(22, bookings.length) },
    ];

    const yearlyChartData = [
      { name: 'Jan', bookings: 45 },
      { name: 'Feb', bookings: 52 },
      { name: 'Mar', bookings: 48 },
      { name: 'Apr', bookings: 61 },
      { name: 'May', bookings: 59 },
      { name: 'Jun', bookings: 75 },
      { name: 'Jul', bookings: 82 },
      { name: 'Aug', bookings: 70 },
      { name: 'Sep', bookings: 85 },
      { name: 'Oct', bookings: 68 },
      { name: 'Nov', bookings: 90 },
      { name: 'Dec', bookings: 110 },
    ];

    const chartData = chartFilter === 'month' ? monthlyChartData : yearlyChartData;

    return (
      <div className="rd-content" style={{ padding: 0 }}>
      <header className="rd-header">
        <div className="rd-header-left">
          <div className="rd-header-greeting">Admin Overview</div>
          <p className="rd-header-sub">High-level metrics and platform health.</p>
        </div>
        <div className="rd-header-right">
          <Link to="/" className="rd-btn-primary">Go to Home</Link>
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

        {/* Bookings Visualization Chart */}
        <div className="rd-panel" style={{ marginBottom: '30px' }}>
          <div className="rd-panel-header rd-chart-header-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="rd-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdDashboard /> Bookings Overview
            </h2>
            <select 
              value={chartFilter} 
              onChange={(e) => setChartFilter(e.target.value)}
              className="rd-select"
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
            >
              <option value="month">This Month</option>
              <option value="year">Full Year</option>
            </select>
          </div>
          <div style={{ width: '100%', height: 320, padding: '10px 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b96b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00b96b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#00b96b', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#00b96b" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
};

  const renderApprovals = () => (
    <div className="rd-content" style={{ padding: 0 }}>
      <header className="rd-header">
        <div className="rd-header-left">
          <div className="rd-header-greeting">Pending Approvals</div>
          <p className="rd-header-sub">Review vehicle quality and details before allowing them on the marketplace.</p>
        </div>
        <div className="rd-header-right">
          <Link to="/" className="rd-btn-primary">Go to Home</Link>
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
              <div style={{ flex: '1 1 280px', minHeight: '220px', background: '#f8fafc', position: 'relative' }}>
                <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', inset: 0 }} />
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
      
      {/* Approval History Display */}
      {approvedCars.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px' }}>Approval History</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Show last 5 approved cars */}
            {[...approvedCars].reverse().slice(0, 5).map(car => (
              <div key={car.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={car.image} alt={car.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{car.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Owner: {car.ownerName || 'Platform'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Approved Price</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>₹{car.price}/day</div>
                  </div>
                  <span style={{ background: '#d1fae5', color: '#065f46', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <MdCheckCircle style={{ verticalAlign: 'middle', marginRight: '4px' }} /> APPROVED
                  </span>
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
        <div className="rd-header-right">
          <Link to="/" className="rd-btn-primary">Go to Home</Link>
        </div>
      </header>

      <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {approvedCars.map(car => {
          const isSelected = selectedFleetCarId === car.id;
          return (
            <div 
              key={car.id} 
              onClick={() => setSelectedFleetCarId(isSelected ? null : car.id)}
              style={{ 
                background: '#ffffff', 
                borderRadius: '16px', 
                border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb', 
                overflow: 'hidden', 
                cursor: 'pointer', 
                transition: 'all 0.2s', 
                boxShadow: isSelected ? '0 12px 30px rgba(59,130,246,0.15)' : 'none',
                transform: isSelected ? 'translateY(-4px)' : 'none'
              }}
            >
              <div style={{ height: '200px', position: 'relative', background: '#f8fafc' }}>
                <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  Active
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px', color: '#111827' }}>{car.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700 }}>
                    {isSelected ? 'Less info' : 'View Owner'}
                  </div>
                </div>
                <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '0.9rem' }}>{car.city} • ₹{car.price}/day</p>
                
                {isSelected && (
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid #3b82f6', animation: 'fadeIn 0.2s ease-out' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>👤 Owner Details</div>
                    <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem', color: '#334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>Name</span> 
                        <span>{car.ownerName || 'Platform Owner'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>Phone</span> 
                        <span>{car.ownerPhone || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>Email</span> 
                        <span style={{ wordBreak: 'break-all', textAlign: 'right', paddingLeft: '12px' }}>{car.ownerEmail || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={(e) => { e.stopPropagation(); updateCarStatus(car.id, 'REJECTED'); }}
                  style={{ width: '100%', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                >
                  Delist Vehicle
                </button>
              </div>
            </div>
          );
        })}
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
        <div className="rd-header-right">
          <Link to="/" className="rd-btn-primary">Go to Home</Link>
        </div>
      </header>

      <div style={{ padding: '24px 28px' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Booking ID & Date</th>
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
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem', marginBottom: '4px' }}>{b.id}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {b.createdAt ? new Date(b.createdAt).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'N/A'}
                    </div>
                  </td>
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
    <>
      <style>{`
        @media (max-width: 1024px) {
          .rd-layout { flex-direction: column !important; }
          .rd-sidebar { 
            position: fixed !important; 
            top: 0 !important; 
            left: 0 !important; 
            bottom: 0 !important; 
            width: 280px !important; 
            z-index: 9999 !important; 
            transform: translateX(-100%); 
            transition: transform 0.3s ease !important;
          }
          .rd-sidebar.open { transform: translateX(0) !important; }
          .rd-mobile-header { display: flex !important; z-index: 101 !important; }
          .rd-overlay { display: block !important; z-index: 9998 !important; }
        }
      `}</style>
      <div className="rd-layout">
        {/* MOBILE HEADER */}
      <div className="rd-mobile-header">
        <Link to="/" className="brand-logo-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src="/images/logo.jpg" alt="ieco" style={{ height: '36px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', fontFamily: '"Space Grotesk", sans-serif' }}>
            I Eco <span style={{ color: '#00d4aa' }}>Green</span> Cab
          </span>
        </Link>
        <button className="rd-hamburger" onClick={() => setIsSidebarOpen(true)}>☰</button>
      </div>

      {isSidebarOpen && <div className="rd-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`rd-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <Link to="/" className="brand-logo-dashboard" onClick={() => setIsSidebarOpen(false)} style={{ margin: 0, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/images/logo.jpg" alt="ieco Admin" style={{ height: '36px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 212, 170, 0.3)' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', whiteSpace: 'nowrap', fontFamily: '"Space Grotesk", sans-serif' }}>
              I Eco <span style={{ color: '#00d4aa' }}>Green</span> Cab
            </span>
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
              <div className="rd-header-right">
                <Link to="/" className="rd-btn-primary">Go to Home</Link>
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

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#fff', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '420px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdEdit color="#00b96b" /> Edit User
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Full Name</label>
              <input 
                type="text" 
                value={editUserForm.name} 
                onChange={e => setEditUserForm({...editUserForm, name: e.target.value})}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Phone Number</label>
              <input 
                type="text" 
                value={editUserForm.phone} 
                onChange={e => setEditUserForm({...editUserForm, phone: e.target.value})}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Role</label>
              <select 
                value={editUserForm.role} 
                onChange={e => setEditUserForm({...editUserForm, role: e.target.value})}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              >
                <option value="owner">Host User (Owner)</option>
                <option value="renter">Rental User (Renter)</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setEditingUser(null)}
                style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setUserOverrides(prev => ({ ...prev, [editingUser.phone]: editUserForm }));
                  if (editUserForm.phone !== editingUser.phone) {
                    setUserOverrides(prev => ({ ...prev, [editingUser.phone]: { ...editUserForm, phone: editUserForm.phone } }));
                  }
                  setEditingUser(null);
                }}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #00b96b 0%, #009657 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,185,107,0.3)' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
