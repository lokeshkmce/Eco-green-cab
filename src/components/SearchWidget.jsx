import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cities } from '../data/cars';
import '../styles/marketplace.css';

export default function SearchWidget({ onSearch, compact = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: '',
    startDate: '',
    endDate: '',
    type: '',
  });
  const [locationOpen, setLocationOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(form);
    } else {
      navigate('/rent', { state: { search: form } });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form className={`search-widget-pro ${compact ? 'compact' : ''}`} onSubmit={handleSearch}>
      <div className="search-pro-container">
        
        {/* Location */}
        <div className="search-pro-field" style={{ position: 'relative' }}>
          <label>Pick-up Location</label>
          <div className="input-with-icon" onClick={() => setLocationOpen(!locationOpen)}>
            <span className="icon">📍</span>
            <div 
              className="pro-input" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>{form.location || 'All Cities'}</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>▼</span>
            </div>
          </div>
          
          {locationOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginTop: '8px',
              maxHeight: '280px',
              overflowY: 'auto',
              zIndex: 100,
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div 
                onClick={() => { handleChange({ target: { name: 'location', value: '' }}); setLocationOpen(false); }}
                style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', background: form.location === '' ? '#e6f9f1' : '#fff', color: form.location === '' ? '#00b96b' : '#111827', fontWeight: form.location === '' ? 700 : 500 }}
                onMouseEnter={(e) => { if(form.location !== '') e.target.style.background = '#f8fafc' }}
                onMouseLeave={(e) => { if(form.location !== '') e.target.style.background = '#fff' }}
              >
                All Cities
              </div>
              {cities.slice(1).map((c) => (
                <div 
                  key={c}
                  onClick={() => { handleChange({ target: { name: 'location', value: c }}); setLocationOpen(false); }}
                  style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', background: form.location === c ? '#e6f9f1' : '#fff', color: form.location === c ? '#00b96b' : '#111827', fontWeight: form.location === c ? 700 : 500 }}
                  onMouseEnter={(e) => { if(form.location !== c) e.target.style.background = '#f8fafc' }}
                  onMouseLeave={(e) => { if(form.location !== c) e.target.style.background = '#fff' }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
          
          {/* Backdrop for click outside */}
          {locationOpen && (
            <div 
              style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
              onClick={() => setLocationOpen(false)}
            />
          )}
        </div>

        {/* Start Date */}
        <div className="search-pro-field">
          <label>Pick-up Date</label>
          <div className="input-with-icon">
            <span className="icon">📅</span>
            <input
              type="date"
              name="startDate"
              className="pro-input"
              value={form.startDate}
              min={today}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="search-pro-field">
          <label>Return Date</label>
          <div className="input-with-icon">
            <span className="icon">📅</span>
            <input
              type="date"
              name="endDate"
              className="pro-input"
              value={form.endDate}
              min={form.startDate || today}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="search-pro-btn">
          Find Your EV
        </button>

      </div>
    </form>
  );
}
