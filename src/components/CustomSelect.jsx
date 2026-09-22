import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ value, onChange, options, placeholder, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const displayValue = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}>
      
      {/* Select Box */}
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          background: disabled ? '#f8fafc' : '#fff',
          fontSize: '0.95rem',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue}
        </span>
        <svg style={{ width: '16px', height: '16px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* Dropdown Menu (Forced Downwards) */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginTop: '4px',
          maxHeight: '280px',
          overflowY: 'auto',
          zIndex: 9999, // High z-index to stay on top
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          
          <div 
            onClick={() => handleSelect('')}
            style={{ 
              padding: '10px 16px', 
              borderBottom: '1px solid #f3f4f6', 
              background: value === '' ? '#e6f9f1' : '#fff', 
              color: value === '' ? '#00b96b' : '#111827', 
              fontWeight: value === '' ? 700 : 500 
            }}
            onMouseEnter={(e) => { if(value !== '') e.target.style.background = '#f8fafc' }}
            onMouseLeave={(e) => { if(value !== '') e.target.style.background = '#fff' }}
          >
            {placeholder}
          </div>
          
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{ 
                padding: '10px 16px', 
                borderBottom: '1px solid #f3f4f6', 
                background: value === opt.value ? '#e6f9f1' : '#fff', 
                color: value === opt.value ? '#00b96b' : '#111827', 
                fontWeight: value === opt.value ? 700 : 500 
              }}
              onMouseEnter={(e) => { if(value !== opt.value) e.target.style.background = '#f8fafc' }}
              onMouseLeave={(e) => { if(value !== opt.value) e.target.style.background = '#fff' }}
            >
              {opt.label}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
