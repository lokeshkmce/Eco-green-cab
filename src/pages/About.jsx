import { Link } from 'react-router-dom';
import { greenStats } from '../data/cars';

const team = [
  { name: 'Rajiv Menon', role: 'CEO & Co-Founder', bio: 'Former Tata Motors EV Division Lead with 14 years in Indian automotive innovation and clean mobility.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Dr. Ananya Sharma', role: 'CTO & Co-Founder', bio: 'IIT Bombay alumna & clean energy researcher, building IoT telemetry for Indian smart road networks.', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Rohan Deshmukh', role: 'Head of Operations', bio: 'Fleet logistics veteran, former BluSmart & Ola Fleet Operations director across Bengaluru & Mumbai.', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { name: 'Priya Nair', role: 'Head of Product & Design', bio: 'Award-winning product leader passionate about building intuitive, multilingual mobility apps for Bharat.', avatar: 'https://randomuser.me/api/portraits/women/48.jpg' },
];

export default function About() {
  return (
    <main style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Hero — 30% Dark Anchor Banner */}
      <div style={{
        background: '#0d1117',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #1e293b',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,185,107,0.15) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto' }}>
          <span className="section-badge">🌿 Our Story</span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 800, color: '#ffffff', margin: '16px 0 20px' }}>
            We're Building a Greener India, One Ride at a Time
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.8 }}>
            Founded in 2020 in Bengaluru, EcoGreen Cab was born from a simple belief: premium self-drive travel and environmental responsibility can transform Indian cities. Today, we're India's premier community-driven electric mobility platform across 28+ smart cities.
          </p>
        </div>
      </div>

      {/* Mission — 70% Clean Light Section */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <span className="section-badge">🎯 Our Mission</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginTop: '16px', marginBottom: '20px', color: '#111827' }}>
                Accelerating India's Transition to Electric Mobility
              </h2>
              <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '20px', fontSize: '1.02rem' }}>
                We believe every journey across our nation is an opportunity to reduce urban smog and carbon emissions. By connecting verified Indian EV hosts with environmentally conscious drivers, we're creating an ecosystem where driving electric is affordable, prestigious, and effortless.
              </p>
              <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: '32px', fontSize: '1.02rem' }}>
                Our community has prevented over 4.2 million kilograms of CO₂ emissions across expressways like Mumbai-Pune, Yamuna, and Bengaluru-Mysuru — helping our cities breathe cleaner.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/rent" className="btn btn-primary">
                  ⚡ Explore Indian EVs
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  📬 Contact Us
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { icon: '🚗', value: greenStats.rentals, label: 'EV Rentals', sub: 'Across India' },
                { icon: '🌱', value: greenStats.co2Saved, label: 'kg CO₂ Saved', sub: 'Total impact' },
                { icon: '👥', value: greenStats.members, label: 'Happy Drivers', sub: 'Pan-India community' },
                { icon: '🏙️', value: greenStats.cities, label: 'Smart Cities', sub: 'Across India' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#ffffff', border: '1px solid #d1fae5', borderRadius: '18px', padding: '28px 20px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '2rem', fontWeight: 800, color: '#009958', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem', margin: '6px 0 2px' }}>{s.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values — 70% Light Section */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">💚 Our Values</span>
            <h2 className="section-title" style={{ color: '#111827' }}>What We Stand For</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: '🇮🇳', title: 'Desh Ka Vikas', desc: 'Supporting the National Electric Mobility Mission (NEMMP) & Swachh Bharat with 100% zero tailpipe emissions.' },
              { icon: '🤝', title: 'Community-Driven', desc: 'Our platform empowers Indian vehicle hosts to earn ₹35,000–₹75,000/month by sharing their idle green vehicles.' },
              { icon: '⚡', title: 'Smart Telematics', desc: 'Real-time battery SOC monitoring, integrated Fastag, and live charging network maps across Tata Power & Jio-bp.' },
              { icon: '🛡️', title: 'Safety & Trust', desc: 'Every vehicle, host, and renter is KYC-verified via Aadhaar & DL. ₹50 Lakh comprehensive insurance covers every single booking.' },
              { icon: '💳', title: 'Radical Transparency', desc: 'No hidden surge pricing. Clear GST breakdowns, instant UPI refunds, and transparent battery charging rules.' },
              { icon: '🚀', title: 'Net-Zero India 2030', desc: 'Our goal: make electric vehicle rentals cheaper and more accessible than petrol cabs in every tier-1 and tier-2 Indian city.' },
            ].map((v, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: '52px', height: '52px', background: '#e6f9f1', border: '1px solid #a7f3d0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '18px' }}>
                  {v.icon}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk', color: '#111827', fontWeight: 700, marginBottom: '10px', fontSize: '1.1rem' }}>{v.title}</h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team — 70% Light Section */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">👥 Meet the Team</span>
            <h2 className="section-title" style={{ color: '#111827' }}>The People Behind the Platform</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {team.map((member) => (
              <div key={member.name} style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                padding: '28px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,185,107,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)'; }}
              >
                <img src={member.avatar} alt={member.name} style={{ width: '76px', height: '76px', borderRadius: '50%', border: '3px solid #a7f3d0', objectFit: 'cover', margin: '0 auto 16px' }} />
                <h4 style={{ fontFamily: 'Space Grotesk', color: '#111827', fontWeight: 700, marginBottom: '4px' }}>{member.name}</h4>
                <div style={{ color: '#009958', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>{member.role}</div>
                <p style={{ color: '#4b5563', fontSize: '0.85rem', lineHeight: 1.6 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — 30% Dark Anchor Banner */}
      <section style={{ padding: '90px 24px', textAlign: 'center', background: '#0d1117', borderTop: '1px solid #1e293b' }}>
        <span className="section-badge" style={{ marginBottom: '20px' }}>🚀 Join Us</span>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
          Ready to Drive the Change?
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto 32px' }}>
          Join 45,000+ members who are already contributing to cleaner air and zero-emission travel.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/rent" className="btn btn-primary btn-lg">⚡ Rent an EV</Link>
          <Link to="/list-your-ev" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.25)' }}>🚗 List Your EV</Link>
        </div>
      </section>
    </main>
  );
}
