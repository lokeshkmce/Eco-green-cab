import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

export default function OfferPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup after 4 seconds, only once per session
    const shown = sessionStorage.getItem('offer-popup-shown');
    if (!shown) {
      const timer = setTimeout(() => {
        setVisible(true);
        sessionStorage.setItem('offer-popup-shown', 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaim = (e) => {
    e.preventDefault();
    navigate('/rent');
    setVisible(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText('NAMASTE20').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <div className="offer-overlay" onClick={() => setVisible(false)}>
      <div className="offer-popup" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="offer-popup-header">
          <button className="offer-popup-close" onClick={() => setVisible(false)}>✕</button>
          <span className="offer-popup-emoji">🙏</span>
          <h2 className="offer-popup-title">Namaste & Welcome!</h2>
          <p className="offer-popup-sub">Flat 20% discount on your first EV self-drive rental in India</p>
        </div>

        {/* Body */}
        <div className="offer-popup-body">
          <div className="offer-discount-badge">
            <div>
              <div className="offer-discount-value">20%</div>
              <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: '2px', fontWeight: 600 }}>DISCOUNT</div>
            </div>
            <div className="offer-discount-text">
              Valid across all 28+ Indian cities.<br />
              <strong style={{ color: '#111827' }}>Fastag & Green Plate included.</strong>
            </div>
          </div>

          {/* Code */}
          <div className="offer-code-box" onClick={copyCode} style={{ cursor: 'pointer' }}>
            <div className="offer-code-label">Your Exclusive Promo Code</div>
            <div className="offer-code">NAMASTE20</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '6px', fontWeight: 600 }}>
              {copied ? '✓ Copied to clipboard!' : 'Click to copy code'}
            </div>
          </div>

          {/* Email */}
          <form onSubmit={handleClaim} style={{ marginBottom: '12px' }}>
            <input
              type="email"
              placeholder="Enter your email to claim"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              style={{ marginBottom: '12px' }}
            />
            <button type="submit" className="offer-cta-btn">
              ⚡ Claim My 20% Discount
            </button>
          </form>

          <button className="offer-dismiss" onClick={() => setVisible(false)}>
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
