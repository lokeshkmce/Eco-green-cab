import { useState } from 'react';
import '../styles/marketplace.css';
import { MdFavorite, MdFavoriteBorder, MdLocationOn } from 'react-icons/md';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const Stars = ({ rating }) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} className="ev-rating-star">
      {i < Math.floor(rating) ? <FaStar color="#f59e0b" /> : i < rating ? <FaStarHalfAlt color="#f59e0b" /> : <FaRegStar color="#d1d5db" />}
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

        {car.isGroup && car.cars && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0, 0, 0, 0.7)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            {car.cars.length} Available
          </div>
        )}
        {/* Favorite */}
        <button
          className={`ev-card-fav${favorited ? ' favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setFavorited(!favorited);
          }}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorited ? <MdFavorite color="#ef4444" size={20} /> : <MdFavoriteBorder color="#6b7280" size={20} />}
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
            <span className="ev-rating-star"><FaStar size={14} color="#f59e0b"/></span>
            <span className="ev-rating-value">{car.rating}</span>
            <span className="ev-rating-count">({car.reviews})</span>
          </div>
        </div>

        {/* Location */}
        <div className="ev-location">
          <MdLocationOn style={{marginRight:'4px'}}/> {car.location}
        </div>


        {/* Footer */}
        <div className="ev-card-footer">
          <div className="ev-card-price">
            <span className="ev-price-current">{car.isGroup ? 'From ' : ''}₹{car.price.toLocaleString('en-IN')}</span>
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
            {'Book Now →'}
          </button>
        </div>
      </div>
    </article>
  );
}
