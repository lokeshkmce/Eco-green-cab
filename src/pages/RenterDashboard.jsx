import { useState } from 'react';
import { 
  MdElectricBolt, MdCalendarToday, MdFavorite, MdPayment, MdPerson, 
  MdSupportAgent, MdHelp, MdDirectionsCar, MdEco, MdStar, MdLocationOn, 
  MdPhone, MdRefresh, MdClose, MdReceipt, MdListAlt, MdFavoriteBorder, 
  MdMail, MdCameraAlt, MdCheckCircle, MdShowChart, MdAttachMoney, 
  MdDashboard, MdAdd, MdExitToApp, MdHome
} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import '../styles/dashboard.css';

const NAV_ITEMS = [
  { id: 'dashboard',  icon: <MdElectricBolt />, label: 'Dashboard' },
  { id: 'bookings',   icon: <MdCalendarToday />, label: 'My Bookings' },
  { id: 'favourites', icon: <MdFavorite />, label: 'Favourites' },
  { id: 'payments',   icon: <MdPayment />, label: 'Payments' },
  { id: 'profile',    icon: <MdPerson />, label: 'Profile' },
  { id: 'support',    icon: <MdSupportAgent />, label: 'Support' },
  { id: 'help',       icon: <MdHelp />, label: 'Help' },
];

const STATS = [
  { icon: <MdDirectionsCar />, label: 'Total Trips',  value: '12',     sub: '+2 this month',    color: '#00e676', bg: 'rgba(0,230,118,0.08)'  },
  { icon: '₹',  label: 'Total Spent',  value: '₹42.5K', sub: '₹8.2K this month', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
  { icon: <MdCalendarToday />, label: 'Upcoming',     value: '1',      sub: 'Next: Oct 12',      color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  { icon: <MdFavorite />, label: 'Saved Cars',   value: '4',      sub: '2 available now',   color: '#f472b6', bg: 'rgba(244,114,182,0.08)' },
  { icon: <MdEco />, label: 'CO₂ Saved',    value: '48 kg',  sub: 'vs petrol car',     color: '#34d399', bg: 'rgba(52,211,153,0.08)'  },
  { icon: <MdStar />, label: 'Avg Rating',   value: '4.9',    sub: 'Excellent renter',  color: '#fbbf24', bg: 'rgba(251,191,36,0.08)'  },
];

const ALL_BOOKINGS = [
  { id: 'BK2024001', vehicle: 'Tata Nexon EV', dates: 'Oct 12–14, 2026', amount: '₹4,200', status: 'Upcoming', badge: '#f59e0b', img: '/images/cars/car_4_tata_nexon_ev.jpg' },
  { id: 'BK2024002', vehicle: 'Mahindra XUV400', dates: 'Sep 15–18, 2026', amount: '₹6,800', status: 'Completed', badge: '#00e676', img: '/images/cars/car_7_mahindra_xuv400_ev.jpg' },
  { id: 'BK2024003', vehicle: 'MG ZS EV Excite', dates: 'Aug 02–04, 2026', amount: '₹4,200', status: 'Completed', badge: '#00e676', img: '/images/cars/car_6_mg_windsor_ev.jpg' },
  { id: 'BK2024004', vehicle: 'Tata Tiago EV', dates: 'Jul 12–13, 2026', amount: '₹1,800', status: 'Completed', badge: '#00e676', img: '/images/cars/car_1_tata_tiago_ev.jpg' },
  { id: 'BK2024005', vehicle: 'BYD Atto 3', dates: 'Jun 05–07, 2026', amount: '₹5,500', status: 'Completed', badge: '#00e676', img: '/images/cars/car_4_tata_nexon_ev.jpg' },
  { id: 'BK2024006', vehicle: 'Hyundai Creta EV', dates: 'May 20–22, 2026', amount: '₹4,900', status: 'Cancelled', badge: '#ef4444', img: '/images/cars/car_8_hyundai_creta_electric.jpg' },
];

const FAV_CARS = [
  { name: 'Tata Nexon EV', type: 'Electric SUV', range: '465 km', price: '₹2,100/day', rating: 4.9, img: '/images/cars/car_4_tata_nexon_ev.jpg', available: true },
  { name: 'Hyundai Creta Electric', type: 'Electric SUV', range: '473 km', price: '₹2,500/day', rating: 4.8, img: '/images/cars/car_8_hyundai_creta_electric.jpg', available: true },
  { name: 'MG Windsor EV', type: 'Electric CUV', range: '331 km', price: '₹1,900/day', rating: 4.7, img: '/images/cars/car_6_mg_windsor_ev.jpg', available: false },
  { name: 'Tata Curvv EV', type: 'Electric Coupe SUV', range: '502 km', price: '₹2,800/day', rating: 4.9, img: '/images/cars/car_10_tata_curvv_ev.jpg', available: true },
];

const TRANSACTIONS = [
  { id: 'TXN001', desc: 'Tata Nexon EV — Oct 12–14', date: 'Oct 10, 2026', amount: '−₹4,200', type: 'debit',  method: 'UPI · PhonePe' },
  { id: 'TXN002', desc: 'Security Deposit Refund — XUV400', date: 'Sep 19, 2026', amount: '+₹2,000', type: 'credit', method: 'Bank Transfer' },
  { id: 'TXN003', desc: 'Mahindra XUV400 — Sep 15–18', date: 'Sep 13, 2026', amount: '−₹6,800', type: 'debit',  method: 'Credit Card · HDFC' },
  { id: 'TXN004', desc: 'MG ZS EV Excite — Aug 02–04', date: 'Aug 01, 2026', amount: '−₹4,200', type: 'debit',  method: 'UPI · Google Pay' },
  { id: 'TXN005', desc: 'Loyalty Cashback', date: 'Jul 31, 2026', amount: '+₹500', type: 'credit', method: 'Wallet Credit' },
  { id: 'TXN006', desc: 'Tata Tiago EV — Jul 12–13', date: 'Jul 10, 2026', amount: '−₹1,800', type: 'debit',  method: 'UPI · Paytm' },
];

const SUPPORT_TICKETS = [
  { id: 'TKT001', subject: 'Charging cable not found in car', status: 'Open',     date: 'Oct 08, 2026', priority: 'High',   color: '#ef4444' },
  { id: 'TKT002', subject: 'Request for booking date change', status: 'Resolved', date: 'Sep 17, 2026', priority: 'Medium', color: '#00e676' },
  { id: 'TKT003', subject: 'Incorrect invoice amount billed', status: 'Resolved', date: 'Aug 04, 2026', priority: 'High',   color: '#00e676' },
];

const FAQ_DATA = [
  { q: 'How do I extend my booking?', a: 'Go to My Bookings → select your active booking → tap "Extend". Extensions are allowed up to 12 hours before drop-off, subject to vehicle availability.' },
  { q: 'Is security deposit refundable?', a: 'Yes, 100% of the security deposit is refunded within 3–5 business days after successful vehicle return and inspection.' },
  { q: 'What if the EV runs out of charge?', a: 'Call our 24/7 Roadside Assistance at 1800-XXX-XXXX. We\'ll coordinate emergency charging at the nearest station at no extra cost.' },
  { q: 'Can I cancel my booking?', a: 'Free cancellation up to 24 hours before pickup. Cancellations within 24 hours attract a 20% charge. No-shows are charged 50%.' },
  { q: 'Which charging networks are supported?', a: 'All our EVs work with Tata Power EZ Charge, Jio-bp pulse, Statiq, and Zeon. The in-app map shows all nearby chargers in real time.' },
];

// ── Sub-views ──────────────────────────────────────────────────────

function BookingsView({ bookings }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Upcoming', 'Completed', 'Cancelled'];
  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);
  return (
    <div className="tab-view">
      <div className="tab-view-header">
        <h2 className="tab-view-title"><MdCalendarToday /> My Bookings</h2>
        <div className="tab-filter-pills">
          {filters.map(f => (
            <button key={f} className={`tab-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="bookings-list">
        {filtered.map(b => (
          <div className="booking-card" key={b.id}>
            <img src={b.img} alt={b.vehicle} className="booking-card-img" onError={e => e.target.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80'} />
            <div className="booking-card-info">
              <div className="booking-card-top">
                <div>
                  <div className="booking-card-name">{b.vehicle}</div>
                  <div className="booking-card-dates"><MdCalendarToday /> {b.dates}</div>
                  <div className="booking-card-id">ID: {b.id}</div>
                </div>
                <div className="booking-card-right">
                  <div className="booking-card-amount">{b.amount}</div>
                  <span className="booking-status-badge" style={{background: b.badge + '22', color: b.badge, border: `1px solid ${b.badge}44`}}>{b.status}</span>
                </div>
              </div>
              {b.status === 'Upcoming' && (
                <div className="booking-card-actions">
                  <button className="rd-btn-ghost"><MdLocationOn /> Get Directions</button>
                  <button className="rd-btn-ghost"><MdPhone /> Call Host</button>
                  <button className="rd-btn-ghost"><MdRefresh /> Modify</button>
                  <button className="rd-btn-danger"><MdClose /> Cancel</button>
                </div>
              )}
              {b.status === 'Completed' && (
                <div className="booking-card-actions">
                  <button className="rd-btn-ghost"><MdStar /> Rate Trip</button>
                  <button className="rd-btn-ghost"><MdReceipt /> Download Invoice</button>
                  <button className="rd-btn-ghost" style={{color:'#00b96b',borderColor:'#00b96b22',background:'rgba(0,185,107,0.06)'}}><MdRefresh /> Book Again</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state"><div className="empty-icon"><MdListAlt /></div><p>No {filter.toLowerCase()} bookings found.</p></div>
        )}
      </div>
    </div>
  );
}

function FavouritesView() {
  const [favs, setFavs] = useState(FAV_CARS.map((_, i) => i));
  const removeFav = (i) => setFavs(favs.filter(f => f !== i));
  return (
    <div className="tab-view">
      <div className="tab-view-header">
        <h2 className="tab-view-title"><MdFavorite /> Favourites</h2>
        <span className="tab-view-sub">{favs.length} saved vehicles</span>
      </div>
      <div className="favs-grid">
        {favs.map(i => {
          const c = FAV_CARS[i];
          return (
            <div className="fav-card" key={i}>
              <div className="fav-img-wrap">
                <img src={c.img} alt={c.name} className="fav-img" onError={e => e.target.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80'}/>
                <button className="fav-remove-btn" onClick={() => removeFav(i)} title="Remove"><MdClose /></button>
                <span className={`fav-avail-badge ${c.available ? 'avail' : 'unavail'}`}>{c.available ? '✓ Available' : '✗ Booked'}</span>
              </div>
              <div className="fav-info">
                <div className="fav-name">{c.name}</div>
                <div className="fav-type">{c.type}</div>
                <div className="fav-meta">
                  <span><MdElectricBolt /> {c.range}</span>
                  <span><MdStar /> {c.rating}</span>
                </div>
                <div className="fav-footer">
                  <span className="fav-price">{c.price}</span>
                  {c.available
                    ? <Link to="/rent" className="fav-book-btn">Book Now →</Link>
                    : <span className="fav-unavail-btn">Notify Me</span>
                  }
                </div>
              </div>
            </div>
          );
        })}
        {favs.length === 0 && (
          <div className="empty-state" style={{gridColumn:'1/-1'}}><div className="empty-icon"><MdFavoriteBorder /></div><p>No favourites yet. <Link to="/rent" style={{color:'#00b96b'}}>Browse EVs</Link> and save your picks!</p></div>
        )}
      </div>
    </div>
  );
}

function PaymentsView() {
  return (
    <div className="tab-view">
      <div className="tab-view-header">
        <h2 className="tab-view-title"><MdPayment /> Payments</h2>
      </div>

      <div className="payments-stats" style={{ width: '100%', marginBottom: '24px' }}>
        <div className="pay-stat"><div className="pay-stat-val">₹42,500</div><div className="pay-stat-label">Total Spent</div></div>
        <div className="pay-stat"><div className="pay-stat-val" style={{color:'#00e676'}}>₹2,500</div><div className="pay-stat-label">Total Refunds</div></div>
        <div className="pay-stat"><div className="pay-stat-val" style={{color:'#fbbf24'}}>₹500</div><div className="pay-stat-label">Cashback Earned</div></div>
      </div>

      {/* Saved methods */}
      <div className="section-label">Saved Payment Methods</div>
      <div className="pay-methods">
        <div className="pay-method"><span className="pay-method-icon"><MdPayment /></span><div><div className="pay-method-name">HDFC Credit Card</div><div className="pay-method-sub">•••• 4821 · Expires 08/27</div></div><span className="pay-default-badge">Default</span></div>
        <div className="pay-method"><span className="pay-method-icon">📱</span><div><div className="pay-method-name">Google Pay UPI</div><div className="pay-method-sub">lokesh@okaxis</div></div></div>
        <div className="pay-method pay-method-add"><span>+</span> Add new payment method</div>
      </div>
    </div>
  );
}

function ProfileView({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Lokesh Kumar',
    email: user?.email || 'lokesh.k@gmail.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru, Karnataka',
    dob: '1995-03-15'
  });

  const handleSave = () => {
    // In a real app, you would dispatch an update API call here
    setIsEditing(false);
  };

  const profileFields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: <MdPerson /> },
    { key: 'email', label: 'Email', type: 'email', icon: '📧' },
    { key: 'phone', label: 'Phone', type: 'tel', icon: '📱' },
    { key: 'city', label: 'City', type: 'text', icon: <MdLocationOn /> },
    { key: 'dob', label: 'Date of Birth', type: 'date', icon: '🎂' },
  ];

  return (
    <div className="tab-view">
      <div className="tab-view-header">
        <h2 className="tab-view-title"><MdPerson /> Profile</h2>
        {isEditing ? (
          <div style={{display: 'flex', gap: '8px'}}>
            <button className="rd-btn-ghost" style={{fontSize:'0.82rem',padding:'8px 18px'}} onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="rd-btn-primary" style={{fontSize:'0.82rem',padding:'8px 18px'}} onClick={handleSave}>💾 Save Profile</button>
          </div>
        ) : (
          <button className="rd-btn-primary" style={{fontSize:'0.82rem',padding:'8px 18px'}} onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
        )}
      </div>

      <div className="profile-layout">
        {/* Left: Avatar & badges */}
        <div className="profile-sidebar-card">
          <div className="profile-avatar-lg">{profileData.name[0].toUpperCase()}</div>
          <div className="profile-name">{profileData.name}</div>
          <div className="profile-email">{profileData.email}</div>
          <div className="profile-badges">
            <span className="profile-badge green">✓ Verified Renter</span>
            <span className="profile-badge blue"><MdStar /> 4.9 Rating</span>
            <span className="profile-badge amber"><MdDirectionsCar /> 12 Trips</span>
          </div>
          <div className="profile-member-since">Member since Jan 2024</div>
        </div>

        {/* Right: Details */}
        <div className="profile-details-card">
          <div className="profile-section-title">Personal Information</div>
          <div className="profile-fields">
            {profileFields.map(f => (
              <div className="profile-field" key={f.key}>
                <div className="profile-field-label">{f.icon} {f.label}</div>
                {isEditing ? (
                  <input
                    type={f.type}
                    className="profile-edit-input"
                    value={profileData[f.key]}
                    onChange={(e) => setProfileData({...profileData, [f.key]: e.target.value})}
                  />
                ) : (
                  <div className="profile-field-value">{f.type === 'date' ? new Date(profileData[f.key]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : profileData[f.key]}</div>
                )}
              </div>
            ))}
          </div>

          <div className="profile-section-title" style={{marginTop:'20px'}}>Documents</div>
          <div className="profile-docs">
            <div className="profile-doc verified"><span>🪪</span><div><div className="doc-name">Driving License</div><div className="doc-status">KA-19 20110012345 · Valid till 2031</div></div><span className="doc-verified">✓ Verified</span></div>
            <div className="profile-doc verified"><span>🪪</span><div><div className="doc-name">Aadhaar Card</div><div className="doc-status">•••• •••• 4521</div></div><span className="doc-verified">✓ Verified</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportView() {
  return (
    <div className="tab-view support-tab">
      <div className="support-hero">
        <div className="support-hero-content">
          <h2 className="support-hero-title">How can we help?</h2>
          <p className="support-hero-sub">Our team is available around the clock to ensure you have a seamless experience with EcoGreen.</p>
        </div>
        <div className="support-hero-icon">🤝</div>
      </div>

      <div className="support-grid">
        <div className="support-card-h">
          <div className="support-card-h-icon" style={{background: 'rgba(0, 230, 118, 0.1)', color: '#00e676'}}><MdPhone /></div>
          <div className="support-card-h-info">
            <div className="support-card-h-name">24/7 Helpline</div>
            <div className="support-card-h-desc">Immediate assistance for roadside emergencies or urgent queries.</div>
          </div>
          <div className="support-card-h-val">1800-XXX-XXXX</div>
        </div>
        
        <div className="support-card-h">
          <div className="support-card-h-icon" style={{background: 'rgba(0, 176, 255, 0.1)', color: '#00b0ff'}}>📧</div>
          <div className="support-card-h-info">
            <div className="support-card-h-name">Email Support</div>
            <div className="support-card-h-desc">Drop us a line anytime. We usually respond within 2-4 hours.</div>
          </div>
          <div className="support-card-h-val">help@ecogreencab.in</div>
        </div>
      </div>
    </div>
  );
}

function HelpView() {
  const [open, setOpen] = useState(null);
  return (
    <div className="tab-view">
      <div className="tab-view-header">
        <h2 className="tab-view-title"><MdHelp /> Help &amp; FAQs</h2>
      </div>

      <div className="help-search-wrap">
        <span className="help-search-icon">🔍</span>
        <input className="help-search-input" placeholder="Search help topics..." />
      </div>

      <div className="faq-list">
        {FAQ_DATA.map((item, i) => (
          <div className="faq-item" key={i} onClick={() => setOpen(open === i ? null : i)}>
            <div className="faq-question">
              <span>{item.q}</span>
              <span className={`faq-arrow ${open === i ? 'open' : ''}`}>▾</span>
            </div>
            {open === i && <div className="faq-answer">{item.a}</div>}
          </div>
        ))}
      </div>

      <div className="help-footer-card">
        <div className="help-footer-icon">🛟</div>
        <div>
          <div className="help-footer-title">Still need help?</div>
          <div className="help-footer-sub">Our support team is available 24/7 to assist you.</div>
        </div>
        <button className="rd-btn-primary" style={{fontSize:'0.875rem',whiteSpace:'nowrap'}}>Contact Support</button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

const RECENT_BOOKINGS = [
  { vehicle: 'Mahindra XUV400', dates: 'Sep 15–18', amount: '₹6,800', status: 'Completed', statusColor: '#00e676' },
  { vehicle: 'MG ZS EV Excite', dates: 'Aug 02–04', amount: '₹4,200', status: 'Completed', statusColor: '#00e676' },
  { vehicle: 'Tata Tiago EV',   dates: 'Jul 12–13', amount: '₹1,800', status: 'Completed', statusColor: '#00e676' },
  { vehicle: 'BYD Atto 3',      dates: 'Jun 05–07', amount: '₹5,500', status: 'Completed', statusColor: '#00e676' },
];

export default function RenterDashboard() {
  const { user, logout, addRole } = useAuth();
  const { bookings } = useMarketplace();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOwnerAction = () => { addRole('owner'); navigate('/owner/dashboard'); };
  const closeSidebar = () => setIsSidebarOpen(false);

  const realBookings = bookings
    .filter(b => b.renterEmail === user?.email)
    .map(b => ({
      id: b.id,
      vehicle: b.carName,
      dates: `${b.startDate} to ${b.endDate}`,
      amount: `₹${(b.total || 0).toLocaleString('en-IN')}`,
      status: 'Upcoming',
      badge: '#f59e0b',
      img: '/images/cars/car_1_tata_tiago_ev.jpg'
    }));
    
  const combinedBookings = [...realBookings, ...ALL_BOOKINGS];

  return (
    <div className="rd-layout">
      {/* MOBILE HEADER */}
      <div className="rd-mobile-header">
        <Link to="/" className="brand-logo-dashboard">
          <img src="/images/logo.jpg" alt="ieco" />
        </Link>
        <button className="rd-hamburger" onClick={() => setIsSidebarOpen(true)}>☰</button>
      </div>

      {isSidebarOpen && <div className="rd-overlay" onClick={closeSidebar} />}

      {/* SIDEBAR */}
      <aside className={`rd-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
          <Link to="/" className="brand-logo-dashboard" onClick={closeSidebar} style={{ margin: 0, padding: '4px 8px' }}>
            <img src="/images/logo.jpg" alt="ieco Renter" style={{ height: '32px' }} />
          </Link>
          
          <div className="rd-user-block" style={{ margin: 0, padding: 0, background: 'transparent', border: 'none' }}>
            <div>
              <div className="rd-user-name" style={{ fontSize: '0.9rem' }}>{user?.name || 'Rahul'}</div>
              <div className="rd-user-badge" style={{ fontSize: '0.65rem' }}><MdCheckCircle /> Verified</div>
            </div>
          </div>
        </div>

        <nav className="rd-nav">
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={`rd-nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); closeSidebar(); }}>
              <span className="rd-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {activeTab === item.id && <span className="rd-nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="rd-sidebar-footer">
          <button className="rd-logout-btn" onClick={logout}><MdExitToApp /> Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="rd-main">
        <header className="rd-header">
          <div className="rd-header-left">
            <div className="rd-header-greeting">
              {activeTab === 'dashboard' ? <>Good Morning, <span className="rd-header-name">{user?.name?.split(' ')[0] || 'Lokesh'} 👋</span></> : NAV_ITEMS.find(n=>n.id===activeTab)?.label}
            </div>
            <p className="rd-header-sub">{activeTab === 'dashboard' ? 'Track your journeys & upcoming rentals.' : 'Manage your account easily.'}</p>
          </div>
          <div className="rd-header-actions" style={{ display: 'flex', gap: '12px' }}>
            <Link to="/" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 700, borderRadius: '12px', padding: '10px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdHome size={18} /> Go to Homescreen
            </Link>
            <Link to="/rent" className="rd-btn-primary"><span><MdElectricBolt /></span> Find an EV</Link>
          </div>
        </header>

        <div className="rd-content">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div className="rd-stats-grid">
                {STATS.map((s,i) => (
                  <div className="rd-stat-card" key={i} style={{'--card-color':s.color,'--card-bg':s.bg}}>
                    <div className="rd-stat-icon-wrap"><span className="rd-stat-icon">{s.icon}</span></div>
                    <div className="rd-stat-glow" />
                    <div className="rd-stat-info">
                      <div className="rd-stat-value">{s.value}</div>
                      <div className="rd-stat-label">{s.label}</div>
                      <div className="rd-stat-sub">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rd-split">
                <div className="rd-panel">
                  <div className="rd-panel-header">
                    <h2 className="rd-panel-title">🚗 Active Rental</h2>
                    <span className="rd-badge-upcoming">Upcoming Tomorrow</span>
                  </div>
                  <div className="rd-rental-card">
                    <div className="rd-rental-img-wrap">
                      <img src="/images/cars/car_4_tata_nexon_ev.jpg" alt="Tata Nexon EV" className="rd-rental-img" onError={e=>{e.target.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80';}}/>
                      <div className="rd-rental-img-overlay"><span className="rd-rental-plate"><MdCheckCircle /> EV Plate</span></div>
                    </div>
                    <div className="rd-rental-info">
                      <div className="rd-rental-top">
                        <div>
                          <h3 className="rd-rental-name">Tata Nexon EV</h3>
                          <p className="rd-rental-meta"><MdCheckCircle /> Green RTO &nbsp;•&nbsp; <MdDirectionsCar /> Fastag Active &nbsp;•&nbsp; <MdElectricBolt /> 100% Charged</p>
                        </div>
                        <div className="rd-rental-price">₹4,200</div>
                      </div>
                      <div className="rd-rental-timeline">
                        <div className="rd-timeline-item"><div className="rd-timeline-dot pickup" /><div><div className="rd-timeline-label">PICKUP</div><div className="rd-timeline-val">Oct 12, 10:00 AM</div></div></div>
                        <div className="rd-timeline-line" />
                        <div className="rd-timeline-item"><div className="rd-timeline-dot dropoff" /><div><div className="rd-timeline-label">DROP-OFF</div><div className="rd-timeline-val">Oct 14, 08:00 PM</div></div></div>
                      </div>
                      <div className="rd-rental-actions">
                        <button className="rd-btn-ghost"><MdLocationOn /> View Route</button>
                        <button className="rd-btn-ghost"><MdPhone /> Contact Host</button>
                        <button className="rd-btn-danger"><MdClose /> Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rd-panel">
                  <div className="rd-panel-header">
                    <h2 className="rd-panel-title"><MdListAlt /> Recent Bookings</h2>
                    <button className="rd-link-btn" onClick={() => setActiveTab('bookings')}>View All →</button>
                  </div>
                  <div className="rd-bookings-list">
                    {RECENT_BOOKINGS.map((b,i) => (
                      <div className="rd-booking-row" key={i}>
                        <div className="rd-booking-num">{i+1}</div>
                        <div className="rd-booking-info"><div className="rd-booking-vehicle">{b.vehicle}</div><div className="rd-booking-dates">{b.dates}</div></div>
                        <div className="rd-booking-right"><div className="rd-booking-amount">{b.amount}</div><span className="rd-booking-status" style={{color:b.statusColor}}>✔ {b.status}</span></div>
                      </div>
                    ))}
                  </div>
                  <Link to="/rent" className="rd-quick-find"><span><MdElectricBolt /> Find Your Next EV</span><span className="rd-arrow">→</span></Link>
                </div>
              </div>
            </>
          )}

          {activeTab === 'bookings'   && <BookingsView bookings={combinedBookings} />}
          {activeTab === 'favourites' && <FavouritesView />}
          {activeTab === 'payments'   && <PaymentsView />}
          {activeTab === 'profile'    && <ProfileView user={user} />}
          {activeTab === 'support'    && <SupportView />}
          {activeTab === 'help'       && <HelpView />}
        </div>
      </main>
    </div>
  );
}
