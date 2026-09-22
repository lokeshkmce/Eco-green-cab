import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cars, cities } from '../data/cars';
import { MdLocationOn, MdCalendarToday } from 'react-icons/md';
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

  return (
    <div className={`search-widget-pro ${compact ? 'compact' : ''}`} style={{ 
      padding: '20px', 
      background: '#fff', 
      borderRadius: '12px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid #eee'
    }}>
      
      {/* City */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '8px', letterSpacing: '0.5px' }}>
          <MdLocationOn size={14} style={{ marginRight: '6px' }} /> CITY
        </label>
        <select 
          name="city" 
          value={form.city} 
          onChange={handleChange}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', appearance: 'none', background: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 12px center / 16px', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }}
        >
          <option value="">All Cities</option>
          {cities.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Brand */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '8px', letterSpacing: '0.5px' }}>
          <svg style={{ marginRight: '6px', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          BRAND
        </label>
        <select 
          name="brand" 
          value={form.brand} 
          onChange={handleChange}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', appearance: 'none', background: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 12px center / 16px', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }}
        >
          <option value="">All Brands</option>
          {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Model */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '8px', letterSpacing: '0.5px' }}>
          <svg style={{ marginRight: '6px', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M3 11l2-7h14l2 7"></path><circle cx="7" cy="16" r="1"></circle><circle cx="17" cy="16" r="1"></circle></svg>
          MODEL
        </label>
        <select 
          name="model" 
          value={form.model} 
          onChange={handleChange}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', appearance: 'none', background: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 12px center / 16px', fontSize: '0.95rem', color: '#1e293b', outline: 'none', backgroundColor: '#f8fafc' }}
        >
          <option value="">All Models</option>
          {uniqueModels.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Variant */}
      <div style={{ flex: 1 }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '8px', letterSpacing: '0.5px' }}>
          <svg style={{ marginRight: '6px', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          VARIANT
        </label>
        <select 
          name="variant" 
          value={form.variant} 
          onChange={handleChange}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', appearance: 'none', background: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 12px center / 16px', fontSize: '0.95rem', color: '#1e293b', outline: 'none', backgroundColor: '#f8fafc' }}
        >
          <option value="">All Variants</option>
          {uniqueVariants.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

    </div>
  );
}
