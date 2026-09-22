import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cars, cities } from '../data/cars';
import { MdLocationOn } from 'react-icons/md';
import CustomSelect from './CustomSelect';
import '../styles/marketplace.css';

export default function SearchWidget({ onSearch, compact = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    city: '',
    brand: '',
    model: '',
    variant: '',
  });

  // Extract unique brands, models, and variants from cars data
  const uniqueBrands = [...new Set(cars.map(c => c.brand))].filter(Boolean).sort();
  const uniqueModels = [...new Set(cars.map(c => c.model))].filter(Boolean).sort();
  const uniqueVariants = [...new Set(cars.map(c => c.variant))].filter(Boolean).sort();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // In a real app, you might trigger onSearch or navigate here
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (onSearch) {
      onSearch(form);
    } else {
      navigate('/rent', { state: { search: form } });
    }
  };

  return (
    <form className={`search-widget-pro ${compact ? 'compact' : ''}`} onSubmit={handleSearch} style={{ 
      padding: '20px', 
      background: '#fff', 
      borderRadius: '12px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      display: 'flex',
      gap: '20px',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      border: '1px solid #eee'
    }}>
      
      {/* City */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '8px', letterSpacing: '0.5px' }}>
          <MdLocationOn size={14} style={{ marginRight: '6px' }} /> CITY
        </label>
        <CustomSelect 
          value={form.city} 
          onChange={(val) => handleChange({ target: { name: 'city', value: val } })}
          options={cities.slice(1).map(c => ({ value: c, label: c }))}
          placeholder="All Cities"
        />
      </div>

      {/* Brand */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '8px', letterSpacing: '0.5px' }}>
          <svg style={{ marginRight: '6px', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          BRAND
        </label>
        <CustomSelect 
          value={form.brand} 
          onChange={(val) => handleChange({ target: { name: 'brand', value: val } })}
          options={uniqueBrands.map(b => ({ value: b, label: b }))}
          placeholder="All Brands"
        />
      </div>

      {/* Model */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '8px', letterSpacing: '0.5px' }}>
          <svg style={{ marginRight: '6px', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M3 11l2-7h14l2 7"></path><circle cx="7" cy="16" r="1"></circle><circle cx="17" cy="16" r="1"></circle></svg>
          MODEL
        </label>
        <CustomSelect 
          value={form.model} 
          onChange={(val) => handleChange({ target: { name: 'model', value: val } })}
          options={uniqueModels.map(m => ({ value: m, label: m }))}
          placeholder="All Models"
        />
      </div>

      {/* Variant */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '8px', letterSpacing: '0.5px' }}>
          <svg style={{ marginRight: '6px', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          VARIANT
        </label>
        <CustomSelect 
          value={form.variant} 
          onChange={(val) => handleChange({ target: { name: 'variant', value: val } })}
          options={uniqueVariants.map(v => ({ value: v, label: v }))}
          placeholder="All Variants"
        />
      </div>

      <div style={{ flex: '0 0 auto' }}>
        <button type="submit" style={{
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
      </div>

    </form>
  );
}
