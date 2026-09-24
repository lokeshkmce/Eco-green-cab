import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const EV_BRANDS = {
  'Tata Motors': ['Punch EV', 'Nexon EV', 'Tiago EV', 'Tigor EV', 'Curvv EV', 'Harrier EV', 'Sierra EV'],
  'MG Motor India': ['Comet EV', 'Windsor EV'],
  'Mahindra Electric': ['XUV400 EV', 'BE 6', 'XEV 9e'],
  'Hyundai India': ['Creta Electric'],
  'Maruti Suzuki India': ['e Vitara']
};

export default function ListYourEV() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    carBrand: '', carModel: '', carYear: '', carType: '',
    dailyRate: '', location: '', city: '',
    description: '', features: '',
    agreed: false,
    photos: null,
    documents: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const { addCar } = useMarketplace();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let imageUrl = '/images/cars/car_4.jpg'; // Fallback
    if (form.photos && form.photos.length > 0) {
      try {
        imageUrl = await fileToBase64(form.photos[0]);
      } catch (err) {
        console.error("Failed to read image", err);
      }
    }

    // Call Backend API
    try {
      const response = await fetch(`${API_BASE_URL}rental-car/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          rental_person: user?.id || 1, // Requires a valid user ID/foreign key
          car_brand: form.carBrand,
          car_model: form.carModel,
          car_year: form.carYear,
          car_type: form.carType,
          description: form.description || 'A great EV ready for rent!',
          daily_rate: form.dailyRate,
          city: form.city,
          location: form.location
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Backend validation failed:", errData);
      } else {
        console.log("Successfully created on backend!");
      }
    } catch (err) {
      console.error("Network error when connecting to API:", err);
    }

    // Add vehicle to local context (so it appears in the frontend Demo immediately)
    addCar({
      name: `${form.carBrand} ${form.carModel} ${form.carYear}`,
      brand: form.carBrand,
      model: form.carModel,
      variant: 'Base',
      category: form.carType.includes('SUV') ? 'premium' : 'budget',
      price: parseInt(form.dailyRate, 10),
      city: form.city,
      location: form.location,
      image: imageUrl,
      gallery: [imageUrl],
      range: 300,
      seats: 5,
      acceleration: '8.5s',
      topSpeed: 140,
      chargingTime: '60 min',
      transmission: 'Automatic',
      description: form.description || 'A great EV ready for rent!',
      features: ['Green RTO Plate 🟢', 'Fastag', 'Clean Interior'],
      specs: {
        battery: 'Standard Range',
        motor: 'Single Motor RWD',
        weight: '1,400 kg',
      },
      status: 'PENDING', // Requires Admin approval
      owner: {
        name: form.name || 'New Host',
        avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(form.name || 'Host') + '&background=00b96b&color=fff',
        rating: 5.0,
        trips: 0,
        joined: new Date().getFullYear().toString(),
        verified: true,
      },
      ownerName: form.name,
      ownerEmail: user?.email || form.email,
      ownerPhone: form.phone,
      hasPhotos: form.photos ? true : false,
      hasDocuments: form.documents ? true : false,
    });
    
    setSubmitted(true);
  };

  const fieldStyle = {
    width: '100%',
    background: '#ffffff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#111827',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  };

  return (
    <main style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Hero — 30% Dark Anchor Banner */}
      <div style={{
        background: '#0d1117',
        padding: '64px 24px 44px',
        borderBottom: '1px solid #1e293b',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 0%, rgba(0,185,107,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-badge">🚗 Become a Host</span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', margin: '16px 0 12px' }}>
            List Your EV. Start Earning.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto' }}>
            Join 4,000+ EV hosts earning ₹35,000–₹85,000/month on EcoGreen Cab India.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '36px', flexWrap: 'wrap' }}>
            {[
              { value: '₹38,400', label: 'Avg. Monthly Earnings' },
              { value: '4,000+', label: 'Active Indian Hosts' },
              { value: '15%', label: 'Platform Fee Only' },
              { value: '24/7', label: 'Host Concierge' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.6rem', fontWeight: 800, color: '#00b96b' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form — 70% Clean Light Section */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        {!submitted ? (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
          }}>
            {/* Step tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
              {['Your Info', 'Vehicle Details', 'Listing & Terms'].map((s, i) => (
                <button
                  key={s}
                  onClick={() => setStep(i + 1)}
                  style={{
                    flex: 1,
                    padding: '18px 12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    fontFamily: 'Inter, sans-serif',
                    background: step === i + 1 ? '#ffffff' : 'transparent',
                    color: step === i + 1 ? '#009958' : step > i + 1 ? '#111827' : '#64748b',
                    borderBottom: step === i + 1 ? '3px solid #00b96b' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {i + 1}. {s}
                  {step > i + 1 && ' ✓'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
              {/* Step 1 */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', color: '#111827', fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>👤 Your Contact Information</h3>
                  {[
                    { name: 'name', label: 'Full Name', placeholder: 'Rajesh Kulkarni', type: 'text' },
                    { name: 'email', label: 'Email Address', placeholder: 'rajesh@gmail.com', type: 'email' },
                    { name: 'phone', label: 'Mobile Number', placeholder: '+91 98200 84733', type: 'tel' },
                  ].map((f) => (
                    <div key={f.name}>
                      <label style={labelStyle}>{f.label}</label>
                      <input
                        name={f.name}
                        type={f.type}
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required
                        style={fieldStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', color: '#111827', fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>🚗 Vehicle Details</h3>
                  <div className="grid-responsive-2">
                    <div>
                      <label style={labelStyle}>Brand</label>
                      <select
                        name="carBrand"
                        value={form.carBrand}
                        onChange={(e) => setForm({ ...form, carBrand: e.target.value, carModel: '' })}
                        required
                        style={fieldStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="">Select Brand</option>
                        {Object.keys(EV_BRANDS).map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Model</label>
                      <select
                        name="carModel"
                        value={form.carModel}
                        onChange={handleChange}
                        required
                        disabled={!form.carBrand}
                        style={{ ...fieldStyle, opacity: form.carBrand ? 1 : 0.6 }}
                        onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="">Select Model</option>
                        {(EV_BRANDS[form.carBrand] || []).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Registration Year</label>
                      <select
                        name="carYear"
                        value={form.carYear}
                        onChange={handleChange}
                        required
                        style={fieldStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="">Select Year</option>
                        {[2025, 2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Vehicle Type</label>
                      <select
                        name="carType"
                        value={form.carType}
                        onChange={handleChange}
                        required
                        style={fieldStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="">Select type</option>
                        {['Compact SUV', 'Electric SUV', 'Premium Sedan', 'Electric Hatchback', 'Luxury EV'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Vehicle Description & Battery Health</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="e.g. Nexon EV Empowered+ LR with 7.2 kW AC fast charger, clean interior, 100% battery health, and Fastag included..."
                      rows={4}
                      style={{ ...fieldStyle, resize: 'vertical' }}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div className="grid-responsive-2">
                    <div>
                      <label style={labelStyle}>Vehicle Photos (Max 5)</label>
                      <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📸</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                          {form.photos ? `${form.photos.length} photo(s) selected` : 'Click to upload photos'}
                        </div>
                        <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => setForm({ ...form, photos: e.target.files })} />
                      </label>
                    </div>
                    <div>
                      <label style={labelStyle}>Original Documents (RC, Insurance, etc.)</label>
                      <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📄</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                          {form.documents ? `${form.documents.length} document(s) selected` : 'Click to upload documents'}
                        </div>
                        <input type="file" multiple accept=".pdf,image/*" style={{ display: 'none' }} onChange={(e) => setForm({ ...form, documents: e.target.files })} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', color: '#111827', fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>📋 Listing & Terms</h3>
                  <div className="grid-responsive-2">
                    <div>
                      <label style={labelStyle}>Daily Rate (₹ INR)</label>
                      <input
                        name="dailyRate"
                        type="number"
                        value={form.dailyRate}
                        onChange={handleChange}
                        placeholder="e.g. 1899"
                        min="600"
                        max="25000"
                        required
                        style={fieldStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Bengaluru, Mumbai, Delhi NCR..."
                        required
                        style={fieldStyle}
                        onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Pickup Location / Hub</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Indiranagar, HSR Layout, BKC, Connaught Place..."
                      required
                      style={fieldStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Benefits recap */}
                  <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px' }}>
                    <div style={{ fontWeight: 700, color: '#166534', marginBottom: '10px', fontSize: '0.92rem' }}>✨ Included Host Perks (India):</div>
                    {['₹50 Lakh comprehensive insurance on every booking', 'Weekly direct UPI & NEFT bank settlements', '24/7 dedicated Indian host concierge & RTO helpline', 'Fastag automated toll logging & telematics'].map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.88rem', color: '#166534' }}>
                        <span style={{ color: '#009958', fontWeight: 800 }}>✓</span> {b}
                      </div>
                    ))}
                  </div>

                  {/* Terms */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={form.agreed}
                      onChange={handleChange}
                      required
                      style={{ marginTop: '3px', accentColor: '#00b96b', width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.6 }}>
                      I agree to the EcoGreen Cab India{' '}
                      <a href="#" style={{ color: '#009958', fontWeight: 600 }}>Host Terms of Service</a>{' '}
                      and confirm this EV has a valid Green RTO registration, active insurance, and Fastag.
                    </span>
                  </label>
                </div>
              )}

              {/* Nav Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', gap: '14px' }}>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    style={{ padding: '14px 28px', borderRadius: '12px', background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111827', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    ← Back
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    style={{ padding: '14px 32px', borderRadius: '12px', background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 16px rgba(0,185,107,0.3)' }}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    style={{ padding: '14px 32px', borderRadius: '12px', background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 20px rgba(0,185,107,0.4)' }}
                  >
                    🚗 Submit My Listing
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* Success */
          <div style={{ textAlign: 'center', padding: '60px 24px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🎊</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
              Application Submitted!
            </h2>
            <p style={{ color: '#4b5563', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7, fontSize: '1.02rem' }}>
              Thanks, <strong style={{ color: '#111827' }}>{form.name}</strong>! We've received your listing application for your{' '}
              <strong style={{ color: '#009958' }}>{form.carYear} {form.carBrand} {form.carModel}</strong>. Our onboarding team will review and activate your listing within 24 hours.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/owner/dashboard" style={{ padding: '14px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', color: '#ffffff', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 16px rgba(0,185,107,0.3)' }}>
                📊 View Host Dashboard
              </Link>
              <Link to="/" style={{ padding: '14px 28px', borderRadius: '12px', background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111827', fontWeight: 700, textDecoration: 'none' }}>
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
