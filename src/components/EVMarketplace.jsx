import { useState, useMemo, useEffect } from 'react';
import { categories } from '../data/cars';
import { useMarketplace } from '../context/MarketplaceContext';
import EVCard from './EVCard';
import CarDetailsModal from './CarDetailsModal';
import BookingModal from './BookingModal';
import SearchWidget from './SearchWidget';
import { MdLocationOn, MdLabel, MdDirectionsCar, MdSettings } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa';
import '../styles/marketplace.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'range', label: 'Most Range' },
];

export default function EVMarketplace({ limit, searchFilters }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingCar, setBookingCar] = useState(null);
  const { cars } = useMarketplace();

  // Only show approved cars in the public marketplace
  const approvedCars = useMemo(() => cars.filter(c => c.status === 'APPROVED'), [cars]);

  // Cascading Filters State
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');

  // Extract unique brands from data — normalize known aliases to canonical names, then sort
  const brandNormalizer = (b) => {
    if (!b) return b;
    if (b === 'Tata') return 'Tata Motors';
    if (b === 'BYD') return 'BYD India';
    if (b === 'Kia') return 'Kia India';
    if (b === 'Mahindra') return 'Mahindra Electric';
    if (b === 'Toyota') return 'Toyota India';
    if (b === 'VinFast') return 'VinFast India';
    if (b === 'Citroën' || b === 'Citroen') return 'Citroën India';
    return b;
  };
  const brands = useMemo(
    () => [...new Set(approvedCars.map(c => brandNormalizer(c.brand)))].sort(),
    [approvedCars]
  );

  // Compute available cities
  const cities = useMemo(
    () => [...new Set(approvedCars.map(c => c.city))].sort(),
    [approvedCars]
  );

  // Compute available models based on selected brand
  const models = useMemo(() => {
    return selectedBrand ? [...new Set(approvedCars.filter(c => c.brand === selectedBrand).map(c => c.model))] : [];
  }, [selectedBrand, approvedCars]);

  // Compute available variants based on selected model
  const variants = useMemo(() => {
    return selectedModel ? [...new Set(approvedCars.filter(c => c.model === selectedModel).map(c => c.variant))] : [];
  }, [selectedModel, approvedCars]);

  // Reset downstream filters when upstream filter changes
  useEffect(() => {
    setSelectedModel('');
    setSelectedVariant('');
  }, [selectedBrand]);

  useEffect(() => {
    setSelectedVariant('');
  }, [selectedModel]);

  const filteredCars = useMemo(() => {
    let result = [...approvedCars];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((c) => c.category === activeCategory);
    }

    // Search filters from prop
    if (searchFilters?.location) {
      result = result.filter((c) =>
        c.city.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    // Cascading Filters
    if (selectedCity) {
      result = result.filter((c) => c.city === selectedCity);
    }
    if (selectedBrand) {
      result = result.filter((c) => brandNormalizer(c.brand) === selectedBrand);
    }
    if (selectedModel) {
      result = result.filter((c) => c.model === selectedModel);
    }
    if (selectedVariant) {
      result = result.filter((c) => c.variant === selectedVariant);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'range':
        result.sort((a, b) => b.range - a.range);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Limit for homepage preview
    if (limit) result = result.slice(0, limit);

    return result;
  }, [activeCategory, sortBy, searchFilters, limit, selectedBrand, selectedModel, selectedVariant, approvedCars]);

  return (
    <div className="ev-marketplace">
      {/* Category Filters */}
      {!limit && (
        <div className="filter-bar" style={{ marginBottom: '28px' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}

          {/* Sort */}
          <div className="filter-sort">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Advanced Cascading Filters */}
      {!limit && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          
          {/* City */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdLocationOn /> City</label>
            <select
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontSize: '0.95rem' }}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Brand */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdLabel /> Brand</label>
            <select
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', fontSize: '0.95rem' }}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          
          {/* Model */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdDirectionsCar /> Model</label>
            <select
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', background: selectedBrand ? '#fff' : '#f3f4f6', fontSize: '0.95rem', cursor: selectedBrand ? 'pointer' : 'not-allowed' }}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
            >
              <option value="">All Models</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Variant */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdSettings /> Variant</label>
            <select
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', background: selectedModel ? '#fff' : '#f3f4f6', fontSize: '0.95rem', cursor: selectedModel ? 'pointer' : 'not-allowed' }}
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              disabled={!selectedModel}
            >
              <option value="">All Variants</option>
              {variants.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          
        </div>
      )}

      {/* Results Info */}
      {!limit && (
        <div className="results-info">
          <div className="results-count">
            Showing <strong>{filteredCars.length}</strong> electric vehicles
            {activeCategory !== 'all' && ` in ${activeCategory}`}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="ev-grid">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <EVCard
              key={car.id}
              car={car}
              onViewDetails={(c) => setSelectedCar(c)}
              onBook={(c) => setBookingCar(c)}
            />
          ))
        ) : (
          <div className="ev-empty">
            <div className="ev-empty-icon"><FaSearch /></div>
            <div className="ev-empty-title">No EVs Found</div>
            <div className="ev-empty-sub">
              Try adjusting your filters or search terms.
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onBook={(c) => {
            setSelectedCar(null);
            setBookingCar(c);
          }}
        />
      )}

      {bookingCar && (
        <BookingModal
          car={bookingCar}
          onClose={() => setBookingCar(null)}
        />
      )}
    </div>
  );
}
