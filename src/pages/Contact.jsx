import { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';

const contactMethods = [
  { icon: '📧', title: 'Email Support', value: 'support@ecogreencab.in', sub: 'Response within 2 hours', color: '#009958' },
  { icon: '📱', title: 'Toll-Free & WhatsApp', value: '1800-209-4733', sub: '24/7 Pan-India Roadside Assist', color: '#0284c7' },
  { icon: '🏢', title: 'HQ Bengaluru', value: '100ft Road, Indiranagar', sub: 'Bengaluru, Karnataka 560038', color: '#009958' },
];

export default function Contact() {
  const { addMessage } = useMarketplace();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: 'renter' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMessage(form);
    setSent(true);
  };

  const inputStyle = {
    width: '100%',
    background: '#ffffff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#111827',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'all 0.2s ease',
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
        padding: '64px 24px 50px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #1e293b',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,185,107,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-badge">📬 Contact Us</span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', margin: '16px 0 12px' }}>
            We're Here to Help
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto' }}>
            Have a question, feedback, or partnership inquiry? Our dedicated team responds within 2 hours.
          </p>
        </div>
      </div>

      {/* Contact Methods — 70% Clean Light Section */}
      <div className="container" style={{ padding: '56px 24px' }}>
        <div className="grid-responsive-3" style={{ marginBottom: '64px' }}>
          {contactMethods.map((method) => (
            <div key={method.title} style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '18px',
              padding: '28px 20px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              cursor: 'default',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = method.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{method.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#111827', marginBottom: '4px', fontSize: '1.05rem' }}>{method.title}</div>
              <div style={{ fontWeight: 700, color: method.color, fontSize: '0.9rem', marginBottom: '4px' }}>{method.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{method.sub}</div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="grid-responsive-2" style={{ alignItems: 'start', maxWidth: '1100px', margin: '0 auto' }}>
          {/* Left */}
          <div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '1.9rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
              Send Us a Message
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '32px', fontSize: '1.02rem' }}>
              Whether you're a renter with a question, a host with a listing inquiry, or a corporate fleet partner — our team is eager to support you.
            </p>

            {/* Quick links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📋', label: 'Booking Support', sub: 'Modifications, cancellations, and trip assistance' },
                { icon: '🚗', label: 'Host Support', sub: 'Listing creation, weekly payouts, and insurance' },
                { icon: '🤝', label: 'Partnerships', sub: 'Fleet management, corporate discounts, B2B' },
                { icon: '🐛', label: 'Report an Issue', sub: 'Platform technical feedback and bug reporting' },
              ].map((link) => (
                <div key={link.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00b96b'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = ''; }}
                >
                  <div style={{ width: '40px', height: '40px', background: '#e6f9f1', border: '1px solid #a7f3d0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{link.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>{link.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{link.sub}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#00b96b', fontWeight: 700, fontSize: '1rem' }}>→</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '24px', padding: '40px', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Type */}
                <div>
                  <label style={labelStyle}>I am a...</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[['renter', '🚘 Renter'], ['host', '🏠 Host'], ['other', '✉️ Other']].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm({ ...form, type: val })}
                        style={{
                          flex: 1,
                          padding: '11px',
                          borderRadius: '10px',
                          border: `1.5px solid ${form.type === val ? '#00b96b' : '#e5e7eb'}`,
                          background: form.type === val ? '#e6f9f1' : '#ffffff',
                          color: form.type === val ? '#009958' : '#4b5563',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid-responsive-2">
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Vikram Malhotra" required style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help you?" required style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Provide details about your question..." required rows={5}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={(e) => { e.target.style.borderColor = '#00b96b'; e.target.style.boxShadow = '0 0 0 3px rgba(0,185,107,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                <button type="submit" style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 16px rgba(0,185,107,0.3)',
                  transition: 'all 0.3s ease',
                }}>
                  📬 Send Message
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: 'Space Grotesk', color: '#111827', marginBottom: '12px', fontSize: '1.5rem', fontWeight: 800 }}>Message Received!</h3>
                <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px' }}>
                  Thank you, <strong style={{ color: '#111827' }}>{form.name}</strong>! We've received your request and will reply to{' '}
                  <strong style={{ color: '#009958' }}>{form.email}</strong> within 2 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '', type: 'renter' }); }}
                  style={{ padding: '12px 28px', borderRadius: '12px', background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111827', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
