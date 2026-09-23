import { useState, useEffect } from 'react';
import '../styles/components.css';

import { MdClose, MdLocationOn, MdBatteryChargingFull, MdSpeed, MdPerson, MdCheckCircle, MdElectricBolt } from 'react-icons/md';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { IoSpeedometerOutline } from 'react-icons/io5';

export default function CarDetailsModal({ car, onClose, onBook }) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredHostCar, setHoveredHostCar] = useState(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Side-by-Side Modal Box */}
      <div
        className="modal-box car-details-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MdClose size={24}/></button>

        {/* ─── LEFT: IMAGE GALLERY ─── */}
        <div className="car-details-image-col">
          <img
            src={hoveredHostCar ? hoveredHostCar.gallery[activeImage] || hoveredHostCar.image : (car.gallery[activeImage] || car.image)}
            alt={car.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Badges Removed */}
          {/* Thumbnails */}
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
            {(hoveredHostCar || car).gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                style={{
                  width: i === activeImage ? '24px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === activeImage ? '#00b96b' : 'rgba(255,255,255,0.7)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              />
            ))}
          </div>
        </div>

        {/* ─── RIGHT: COMPACT CONTENT ─── */}
        <div className="car-details-content-col">
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
                {car.name}
              </h2>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                {car.year} · {car.type} · <MdLocationOn style={{verticalAlign:'text-bottom'}}/> {car.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}><FaStar/></span>
                <span style={{ fontWeight: 800, color: '#111827', fontSize: '0.9rem' }}>{car.rating}</span>
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>({car.reviews} reviews)</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', paddingRight: '24px' }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.6rem', fontWeight: 900, color: '#009958', lineHeight: 1 }}>
                ₹{car.price.toLocaleString('en-IN')}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500, marginTop: '2px' }}>per day</div>
              {car.originalPrice > car.price && (
                <div style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.75rem' }}>
                  ₹{car.originalPrice.toLocaleString('en-IN')}/day
                </div>
              )}
            </div>
          </div>

          {/* Compact Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
            {['overview', 'specs', car.isGroup ? 'hosts' : 'owner'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease',
                  background: activeTab === tab ? '#e6f9f1' : 'transparent',
                  color: activeTab === tab ? '#009958' : '#64748b',
                  borderBottom: activeTab === tab ? '2px solid #00b96b' : '2px solid transparent',
                  textTransform: 'capitalize',
                  borderRadius: '6px 6px 0 0'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Area (Flex 1 to push button down) */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
            
            {activeTab === 'overview' && (
              <div>
                <p style={{ color: '#4b5563', lineHeight: 1.5, marginBottom: '16px', fontSize: '0.85rem' }}>
                  {car.description}
                </p>

                {/* Ultra Compact Specs Grid */}
                <div className="car-details-specs-grid">
                  {[
                    { icon: <MdBatteryChargingFull size={20}/>, label: 'Range', value: `${car.range} km` },
                    { icon: <MdElectricBolt size={20}/>, label: '0-100', value: car.acceleration },
                    { icon: <IoSpeedometerOutline size={20}/>, label: 'Speed', value: `${car.topSpeed} km/h` },
                    { icon: <MdPerson size={20}/>, label: 'Seats', value: `${car.seats}` },
                  ].map((s, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{s.icon}</div>
                      <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.85rem' }}>{s.value}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Compact Highlights */}
                <div>
                  <h4 style={{ fontFamily: 'Space Grotesk', color: '#111827', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}><BsStars/> Highlights</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {car.features.map((f, i) => (
                      <span key={i} style={{ padding: '4px 10px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '99px', fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {[
                  ['Battery Capacity', car.specs.battery],
                  ['Drivetrain', car.specs.motor],
                  ['Curb Weight', car.specs.weight],
                  ['Fast Charging', car.chargingTime],
                  ['Transmission', car.transmission],
                  ['Acceleration', car.acceleration],
                ].map(([label, value], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{label}</span>
                    <span style={{ color: '#111827', fontWeight: 700, fontSize: '0.8rem' }}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'owner' && !car.isGroup && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <img src={car.owner.avatar} alt={car.owner.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #00b96b', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>{car.owner.name}</span>
                    {car.owner.verified && <span style={{ color: '#009958', fontSize: '0.7rem', fontWeight: 700, background: '#d1fae5', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}><MdCheckCircle/> Verified</span>}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '8px' }}>Host since {car.owner.joined}</div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#009958', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}><FaStar size={12}/> {car.owner.rating}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Rating</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.9rem' }}>{car.owner.trips}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Trips</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hosts' && car.isGroup && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' }}>
                  Select a specific host to book this EV model:
                </div>
                {car.cars.map((hostCar, idx) => (
                  <div 
                    key={idx} 
                    onMouseEnter={() => setHoveredHostCar(hostCar)}
                    onMouseLeave={() => setHoveredHostCar(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s ease', borderColor: hoveredHostCar?.id === hostCar.id ? '#00b96b' : '#e2e8f0' }}
                  >
                    <div style={{ position: 'relative', width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={hostCar.image} alt={hostCar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#fff', borderRadius: '50%', padding: '2px' }}>
                        <img src={hostCar.owner.avatar} alt={hostCar.owner.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{hostCar.owner.name}</span>
                        {hostCar.owner.verified && <span style={{ color: '#009958', fontSize: '0.65rem', fontWeight: 700, background: '#d1fae5', padding: '2px 4px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}><MdCheckCircle/></span>}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontWeight: 700 }}><FaStar size={10}/> {hostCar.owner.rating}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><MdLocationOn /> {hostCar.location}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#009958', fontSize: '0.95rem' }}>₹{hostCar.price.toLocaleString('en-IN')}</div>
                      <button
                        onClick={() => onBook(hostCar)}
                        style={{ marginTop: '4px', background: '#00b96b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Book Button (Anchored to Bottom) */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            {car.isGroup && activeTab !== 'hosts' ? (
              <button
                onClick={() => setActiveTab('hosts')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 14px rgba(0,185,107,0.3)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                View Available Hosts →
              </button>
            ) : !car.isGroup ? (
              <button
                onClick={() => onBook(car)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 14px rgba(0,185,107,0.3)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}><MdElectricBolt/> Reserve This EV — ₹{car.price.toLocaleString('en-IN')}/day</span>
              </button>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}
