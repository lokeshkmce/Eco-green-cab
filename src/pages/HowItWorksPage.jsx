import HowItWorks from '../components/HowItWorks';
import { faqs } from '../data/cars';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState(null);

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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0,185,107,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-badge">📋 How It Works</span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', margin: '16px 0 12px' }}>
            Simple. Fast. Sustainable.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto' }}>
            Everything you need to know about renting or listing an EV on EcoGreen Cab.
          </p>
        </div>
      </div>

      {/* Steps (70% Clean Light) */}
      <HowItWorks />

      {/* For Hosts (70% Light) */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">🏠 For Hosts</span>
            <h2 className="section-title" style={{ color: '#111827' }}>How to List Your EV</h2>
          </div>
          <div className="grid-responsive-3">
            {[
              { step: 1, icon: '📝', title: 'Create Your Listing', desc: 'Sign up and add your EV details, photos, daily rate, and availability in minutes.' },
              { step: 2, icon: '✅', title: 'Get Verified', desc: 'Our team reviews your listing and vehicle. Once approved, you go live instantly.' },
              { step: 3, icon: '💰', title: 'Start Earning', desc: 'Receive instant booking notifications. Get paid weekly. It\'s that simple.' },
            ].map((step) => (
              <div key={step.step} style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                padding: '36px 28px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,185,107,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 800, margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(0,185,107,0.3)' }}>
                  {step.step}
                </div>
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{step.icon}</div>
                <h3 style={{ fontFamily: 'Space Grotesk', color: '#111827', fontWeight: 700, marginBottom: '10px', fontSize: '1.15rem' }}>{step.title}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/list-your-ev" className="btn btn-primary btn-lg">
              🚗 List Your EV Today
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ (70% Light) */}
      <section className="section" style={{ background: '#f8fafc', borderTop: '1px solid #e5e7eb' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div className="section-header">
            <span className="section-badge">❓ FAQ</span>
            <h2 className="section-title" style={{ color: '#111827' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  border: `1.5px solid ${openFaq === i ? '#00b96b' : '#e5e7eb'}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: openFaq === i ? '0 8px 24px rgba(0,185,107,0.1)' : '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '22px 24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    textAlign: 'left',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>{faq.q}</span>
                  <span style={{ color: '#009958', fontSize: '1.3rem', fontWeight: 700, transition: 'transform 0.3s ease', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', flexShrink: 0 }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 22px', color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.7, animation: 'fadeIn 0.25s ease' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
