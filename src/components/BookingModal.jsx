import { useState, useEffect, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import QRCode from 'react-qr-code';
import '../styles/components.css';

export default function BookingModal({ car, onClose }) {
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: car.location,
    insurance: 'basic',
    name: '',
    email: '',
    phone: '',
    drivingLicense: null,
  });
  const [step, setStep] = useState(1); // 1=dates, 2=extras, 3=contact, 4=confirm
  const [booked, setBooked] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');
  const { bookCar } = useMarketplace();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const days = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [form.startDate, form.endDate]);

  const subtotal = days * car.price;
  const serviceFee = Math.round(subtotal * 0.12);
  const insuranceFee = form.insurance === 'premium' ? days * 499 : days * 299;
  const total = subtotal + serviceFee + insuranceFee;

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    const booking = bookCar({
      carId: car.id,
      carName: car.name,
      renterName: form.name,
      renterEmail: form.email,
      startDate: form.startDate,
      endDate: form.endDate,
      total: total,
      drivingLicenseUploaded: form.drivingLicense ? true : false,
    });
    setConfirmedBookingId(booking.id);
    setBooked(true);
  };

  const inputStyle = {
    width: '100%',
    background: '#ffffff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    padding: '13px 16px',
    color: '#111827',
    fontSize: '0.92rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>

        {!booked ? (
          <>
            {/* Header */}
            <div style={{
              padding: '28px 32px 20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f8fafc',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <img
                  src={car.image}
                  alt={car.name}
                  style={{ width: '76px', height: '56px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                />
                <div>
                  <h3 style={{ fontFamily: 'Space Grotesk', color: '#111827', fontSize: '1.3rem', fontWeight: 800, marginBottom: '4px' }}>
                    Reserve {car.name}
                  </h3>
                  <div style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>
                    {car.year} · {car.type} · <strong style={{ color: '#009958' }}>₹{car.price.toLocaleString('en-IN')}/day</strong>
                  </div>
                </div>
              </div>

              {/* Step indicator */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {['Dates', 'Protection', 'KYC Contact', 'Payment'].map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: step > i + 1 ? '#00b96b' : step === i + 1 ? 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)' : '#e2e8f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 700,
                      color: step >= i + 1 ? '#ffffff' : '#64748b',
                      transition: 'all 0.3s ease',
                    }}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: step === i + 1 ? '#009958' : '#64748b', fontWeight: step === i + 1 ? 700 : 500 }}>
                      {s}
                    </span>
                    {i < 3 && <div style={{ width: '20px', height: '2px', background: step > i + 1 ? '#00b96b' : '#e2e8f0' }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Body */}
            <div style={{ padding: '28px 32px', overflowY: 'auto', maxHeight: '55vh', background: '#ffffff' }}>
              {/* Step 1: Dates */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>
                      📅 Pick-Up Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      min={today}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      📅 Return Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      min={form.startDate || today}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  {days > 0 && (
                    <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ color: '#009958', fontWeight: 800, fontFamily: 'Space Grotesk', fontSize: '1.2rem' }}>
                        {days} day{days > 1 ? 's' : ''} rental selected
                      </span>
                      <span style={{ color: '#4b5563', fontSize: '0.92rem', marginLeft: '12px', fontWeight: 500 }}>
                        Estimated ₹{subtotal.toLocaleString('en-IN')} base amount
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Extras */}
              {step === 2 && (
                <div>
                  <h4 style={{ color: '#111827', marginBottom: '16px', fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 800 }}>🛡️ Choose Protection & Fastag Plan</h4>
                  {[
                    { value: 'basic', label: 'Standard Comprehensive Insurance', desc: 'Third-party liability + ₹25 Lakh cover with standard deductible', price: `₹299/day` },
                    { value: 'premium', label: 'Zero-Depreciation Peace-of-Mind', desc: '₹50 Lakh full cover + zero deductible + 24/7 Pan-India RSA & Fastag priority', price: `₹499/day`, recommended: true },
                  ].map((ins) => (
                    <div
                      key={ins.value}
                      className="bm-protection-card"
                      onClick={() => setForm({ ...form, insurance: ins.value })}
                      style={{
                        border: `2px solid ${form.insurance === ins.value ? '#00b96b' : '#e5e7eb'}`,
                        background: form.insurance === ins.value ? '#f0fdf4' : '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '50%',
                          border: `2px solid ${form.insurance === ins.value ? '#00b96b' : '#d1d5db'}`,
                          background: form.insurance === ins.value ? '#00b96b' : '#ffffff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {form.insurance === ins.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                            {ins.label}
                            {ins.recommended && <span style={{ marginLeft: '10px', padding: '2px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>Recommended</span>}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '2px' }}>{ins.desc}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, color: form.insurance === ins.value ? '#009958' : '#111827', fontFamily: 'Space Grotesk', fontSize: '1.05rem', flexShrink: 0 }}>
                        {ins.price}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 3: Contact */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={labelStyle}>Driver Full Name (as per Indian Driving License)</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address (for Booking & Tax Invoice)</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="rahul@example.com"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Mobile Phone Number (for WhatsApp trip updates & OTP)</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Upload Driving License (Front & Back)</label>
                    <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                      <div style={{ fontSize: '1.6rem', marginBottom: '8px', color: '#64748b', display: 'flex', justifyContent: 'center' }}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88a9.947 9.947 0 0112.28 0C16.43 19.18 14.03 20 12 20z"></path></svg>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        {form.drivingLicense ? form.drivingLicense.name : 'Click to upload license copy'}
                      </div>
                      <input 
                        type="file" 
                        accept=".pdf,image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => setForm({ ...form, drivingLicense: e.target.files[0] })}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '22px', marginBottom: '20px' }}>
                    <h4 style={{ color: '#111827', marginBottom: '16px', fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 800 }}>Fare Summary</h4>
                    {[
                      [`${days} days × ₹${car.price.toLocaleString('en-IN')}/day`, `₹${subtotal.toLocaleString('en-IN')}`],
                      ['GST & platform service fee (12%)', `₹${serviceFee.toLocaleString('en-IN')}`],
                      [`${form.insurance === 'premium' ? 'Zero-Dep' : 'Basic'} insurance × ${days}d`, `₹${insuranceFee.toLocaleString('en-IN')}`],
                    ].map(([label, value], i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '0.9rem', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#4b5563' }}>{label}</span>
                        <span style={{ color: '#111827', fontWeight: 700 }}>{value}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 4px', fontSize: '1.15rem' }}>
                      <span style={{ fontWeight: 800, color: '#111827' }}>Total Estimated (INR)</span>
                      <span style={{ fontWeight: 900, color: '#009958', fontFamily: 'Space Grotesk', fontSize: '1.6rem' }}>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div style={{ padding: '14px 18px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', fontSize: '0.85rem', color: '#166534', lineHeight: 1.6, marginBottom: '20px' }}>
                    🟢 <strong>Green RTO Plate & Active Fastag:</strong> Ready for expressways with instant automated toll processing. Pay with UPI, Cards, or NetBanking.
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ffffff', border: '1px dashed #d1d5db', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Scan to Pay via UPI</div>
                    <div style={{ padding: '12px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
                      <QRCode 
                        value={`upi://pay?pa=ecogreencab@upi&pn=EcoGreen%20Cab&am=${total}&cu=INR`} 
                        size={160}
                        fgColor="#111827"
                      />
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
                      Open Google Pay, PhonePe, or Paytm and scan this code to complete the payment of <strong style={{ color: '#111827' }}>₹{total.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bm-footer" style={{ padding: '20px 32px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', gap: '14px', background: '#f8fafc' }}>
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} style={{ padding: '12px 24px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e5e7eb', color: '#111827', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                  ← Back
                </button>
              ) : (
                <div />
              )}
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && days === 0}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    cursor: step === 1 && days === 0 ? 'not-allowed' : 'pointer',
                    opacity: step === 1 && days === 0 ? 0.5 : 1,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 14px rgba(0,185,107,0.3)',
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  style={{
                    padding: '12px 32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 16px rgba(0,185,107,0.35)',
                  }}
                >
                  ⚡ Confirm & Pay via UPI / Card
                </button>
              )}
            </div>
          </>
        ) : (
          /* Booking Success */
          <div style={{ padding: '60px 32px', textAlign: 'center', background: '#ffffff' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.8rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '24px', fontSize: '0.95rem' }}>
              We've sent the details to <strong>{form.email || 'your email'}</strong> and WhatsApp.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '28px', textAlign: 'left' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Booking ID</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#009958' }}>{confirmedBookingId}</div>
                </div>
                
                <div className="bm-success-grid">
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Vehicle Details</div>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{car.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Total Paid</div>
                    <div style={{ fontWeight: 600, color: '#111827' }}>₹{total.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Date & Time</div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{form.startDate} to {form.endDate}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Pickup Location</div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{form.pickupLocation}</div>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Owner/Support Phone</div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>+91 98765 43210</div>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={onClose}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 16px rgba(0,185,107,0.3)' }}
              >
                Done ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
