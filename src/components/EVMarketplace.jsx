import { useState, useMemo, useEffect } from 'react';
import { categories } from '../data/cars';
import { useMarketplace } from '../context/MarketplaceContext';
import EVCard from './EVCard';
import CarDetailsModal from './CarDetailsModal';
import BookingModal from './BookingModal';
import CustomSelect from './CustomSelect';
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

  // Extract unique brands from data (raw values to match car.brand exactly)
  const brands = useMemo(
    () => [...new Set(approvedCars.map(c => c.brand).filter(Boolean))].sort(),
    [approvedCars]
  );

  // Compute available cities
  const cities = useMemo(
    () => [...new Set(approvedCars.map(c => c.city))].sort(),
    [approvedCars]
  );

  // Compute available models based on selected brand + city
  const models = useMemo(() => {
    let pool = approvedCars;
    if (selectedCity) pool = pool.filter(c => c.city === selectedCity);
    return selectedBrand ? [...new Set(pool.filter(c => c.brand === selectedBrand).map(c => c.model))] : [];
  }, [selectedBrand, selectedCity, approvedCars]);

  // Compute available variants based on selected model + city
  const variants = useMemo(() => {
    let pool = approvedCars;
    if (selectedCity) pool = pool.filter(c => c.city === selectedCity);
    return selectedModel ? [...new Set(pool.filter(c => c.model === selectedModel).map(c => c.variant))] : [];
  }, [selectedModel, selectedCity, approvedCars]);

  // Sync incoming searchFilters (from Home page SearchWidget) into local filter state
  useEffect(() => {
    if (!searchFilters) return;
    if (searchFilters.city) setSelectedCity(searchFilters.city);
    if (searchFilters.brand) setSelectedBrand(searchFilters.brand);
    if (searchFilters.model) setSelectedModel(searchFilters.model);
    if (searchFilters.variant) setSelectedVariant(searchFilters.variant);
  }, [searchFilters]);

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

    // All filters flow through local state (synced from searchFilters prop via useEffect)
    if (selectedCity) {
      result = result.filter((c) => c.city === selectedCity);
    }
    if (selectedBrand) {
      result = result.filter((c) => c.brand === selectedBrand);
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
  }, [activeCategory, sortBy, limit, selectedCity, selectedBrand, selectedModel, selectedVariant, approvedCars]);


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
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'flex-end', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          
          {/* City */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdLocationOn /> City</label>
            <CustomSelect
              value={selectedCity}
              onChange={setSelectedCity}
              options={cities.map(c => ({ value: c, label: c }))}
              placeholder="All Cities"
            />
          </div>

          {/* Brand */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdLabel /> Brand</label>
            <CustomSelect
              value={selectedBrand}
              onChange={setSelectedBrand}
              options={brands.map(b => ({ value: b, label: b }))}
              placeholder="All Brands"
            />
          </div>
          
          {/* Model */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdDirectionsCar /> Model</label>
            <CustomSelect
              value={selectedModel}
              onChange={setSelectedModel}
              options={models.map(m => ({ value: m, label: m }))}
              placeholder="All Models"
              disabled={!selectedBrand}
            />
          </div>

          {/* Variant */}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MdSettings /> Variant</label>
            <CustomSelect
              value={selectedVariant}
              onChange={setSelectedVariant}
              options={variants.map(v => ({ value: v, label: v }))}
              placeholder="All Variants"
              disabled={!selectedModel}
            />
          </div>
          
          <div style={{ flex: '0 0 auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => {
                // Filters are reactive via useMemo — this button just provides explicit trigger UX
                // Force a re-render by toggling a dummy state if needed; filters already applied
                setSelectedCity(prev => prev);
              }}
              style={{
                background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 185, 107, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1rem',
                height: '46px'
              }}>
              Search
            </button>
            {(selectedCity || selectedBrand || selectedModel || selectedVariant) && (
              <button
                onClick={() => {
                  setSelectedCity('');
                  setSelectedBrand('');
                  setSelectedModel('');
                  setSelectedVariant('');
                }}
                style={{
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  height: '46px',
                  whiteSpace: 'nowrap'
                }}>
                ✕ Clear
              </button>
            )}
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
