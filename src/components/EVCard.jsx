import { useState } from 'react';
import '../styles/marketplace.css';

const Stars = ({ rating }) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className="ev-rating-star">
      {i < Math.floor(rating) ? '★' : i < rating ? '⭑' : '☆'}
    </span>
  ));

export default function EVCard({ car, onViewDetails, onBook }) {
  const [favorited, setFavorited] = useState(false);

  const savings = Math.round(((car.originalPrice - car.price) / car.originalPrice) * 100);

  return (
    <article className="ev-card" onClick={() => onViewDetails(car)}>
      {/* Image */}
      <div className="ev-card-image">
        <img src={car.image} alt={car.name} loading="lazy" />

        {/* Badges Removed */}

        {/* Favorite */}
        <button
          className={`ev-card-fav${favorited ? ' favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setFavorited(!favorited);
          }}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorited ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Body */}
      <div className="ev-card-body">
        <div className="ev-card-header">
          <div>
            <div className="ev-card-title">{car.name}</div>
            <div className="ev-card-type">
              {car.year} · {car.type} · {car.category}
            </div>
          </div>
          <div className="ev-card-rating">
            <span className="ev-rating-star">★</span>
            <span className="ev-rating-value">{car.rating}</span>
            <span className="ev-rating-count">({car.reviews})</span>
          </div>
        </div>

        {/* Location */}
        <div className="ev-location">
          📍 {car.location}, {car.city}
        </div>


        {/* Footer */}
        <div className="ev-card-footer">
          <div className="ev-card-price">
            <span className="ev-price-current">₹{car.price.toLocaleString('en-IN')}</span>
            <span className="ev-price-period">/day</span>
            {car.originalPrice > car.price && (
              <span className="ev-price-original">₹{car.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            className="ev-card-book-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBook(car);
            }}
          >
            Book Now →
          </button>
        </div>
      </div>
    </article>
  );
}
