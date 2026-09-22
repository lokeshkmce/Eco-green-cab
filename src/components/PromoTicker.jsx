import '../styles/components.css';

const items = [
  { icon: '⚡', text: 'Zero Tailpipe Emissions · Swachh & Green Bharat' },
  { icon: '🌿', text: '4.8M kg CO₂ Saved Across 28+ Indian Cities' },
  { icon: '💚', text: 'Flat 20% Off Your First Booking — Use Code: NAMASTE20' },
  { icon: '🔋', text: '500+ Superfast Charging Hubs on Indian Highways' },
  { icon: '⭐', text: 'Rated 4.9/5 by 62,000+ Indian Drivers' },
  { icon: '🚗', text: 'Top Indian EVs — Tata Curvv & Nexon · Mahindra BE 6 · Creta Electric · BYD eMAX 7' },
  { icon: '🟢', text: 'Verified Green RTO Number Plates & Active Fastag' },
  { icon: '🇮🇳', text: '#1 Electric Self-Drive Car Rental Platform in India' },
];

const doubled = [...items, ...items];

export default function PromoTicker() {
  return (
    <div className="promo-ticker" aria-hidden="true">
      <div className="promo-ticker-inner">
        {doubled.map((item, i) => (
          <span key={i} className="promo-ticker-item">
            <span className="ticker-icon">{item.icon}</span>
            {item.text}
            <span className="promo-ticker-divider">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
