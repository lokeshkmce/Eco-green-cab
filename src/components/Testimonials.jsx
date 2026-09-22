import { useState } from 'react';
import { testimonials } from '../data/cars';
import { MdStar, MdStarBorder, MdMessage, MdCheckCircle, MdEmojiEvents, MdDirectionsCar, MdElectricBolt } from 'react-icons/md';
import { BsStars } from 'react-icons/bs';
import '../styles/components.css';

export default function Testimonials() {
  const [active, setActive] = useState(null);

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BsStars/> Community Reviews</span>
          <h2 className="section-title">Loved by Drivers & Hosts Alike</h2>
          <p className="section-subtitle">
            Real experiences from our community of eco-conscious renters and EV hosts.
          </p>
        </div>

        <div className="testimonials-carousel-wrapper">
          {/* Left Blur Overlay */}
          <div className="carousel-blur carousel-blur-left"></div>
          
          {/* Right Blur Overlay */}
          <div className="carousel-blur carousel-blur-right"></div>

          <div className="testimonials-track">
            {/* Double the array for infinite CSS scrolling */}
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="testimonial-card"
              >
                {/* Stars */}
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }, (_, si) => (
                    <span key={si} className="t-star">
                      {si < t.rating ? <MdStar color="#f59e0b" /> : <MdStarBorder color="#d1d5db" />}
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.comment}</p>

                {/* Author & Metadata Footer */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid #f3f4f6', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="testimonial-avatar"
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <div className="testimonial-name">
                        {t.name}
                        {t.verified && (
                          <span style={{ marginLeft: '6px', color: '#00e676', display: 'flex', alignItems: 'center' }}><MdCheckCircle size={14}/></span>
                        )}
                      </div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>

                  {/* Date & Car Tag Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>
                      {t.date}
                    </div>
                    <span className="testimonial-car" style={{ margin: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{t.isOwner ? <MdDirectionsCar/> : <MdElectricBolt/>} {t.car}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{
          marginTop: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          padding: '16px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}>
          {[
            { icon: <MdStar size={24}/>, value: '4.9/5', label: 'Average Rating' },
            { icon: <MdMessage size={24}/>, value: '12,400+', label: 'Verified Reviews' },
            { icon: <MdCheckCircle size={24}/>, value: '98%', label: 'Would Recommend' },
            { icon: <MdEmojiEvents size={24}/>, value: '#1', label: 'EV Rental Platform' },
          ].map((b, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{b.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: '1.2rem', fontWeight: 800, color: '#009958' }}>{b.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: 600 }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
