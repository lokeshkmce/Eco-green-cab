import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      setIsLoading(false);
      
      const db = JSON.parse(localStorage.getItem('eco_users_db') || '[]');
      let userData = null;

      if (activeTab === 'register') {
        // Check if user already exists
        if (db.some(u => u.email === formData.email)) {
          setError('Email is already registered!');
          return;
        }
        
        userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password, // Storing plaintext for mock purposes
          roles: ['renter'], // Default role for new signups
          phone: '' // default empty profile fields
        };
        db.push(userData);
        localStorage.setItem('eco_users_db', JSON.stringify(db));
      } else {
        // Login Flow
        userData = db.find(u => u.email === formData.email && u.password === formData.password);
        
        // If not found in DB, fallback to dummy accounts for ease of testing
        if (!userData) {
           if (formData.email === 'admin@ecogreen.com' && formData.password === 'admin') {
             userData = { name: 'Super Admin', email: 'admin@ecogreen.com', roles: ['admin'] };
           } else if (formData.email === 'owner@ecogreen.com' && formData.password === 'owner') {
             userData = { name: 'Demo Owner', email: 'owner@ecogreen.com', roles: ['owner'] };
           } else {
             setError('Invalid email or password.');
             return;
           }
        }
      }
      
      // Update global context (strip password just in case)
      const { password, ...safeUserData } = userData;
      login(safeUserData);
      onClose();

      // Redirect based on role priority (Admin > Owner > Renter)
      if (safeUserData.roles?.includes('admin')) {
        navigate('/admin/dashboard');
      } else if (safeUserData.roles?.includes('owner')) {
        navigate('/owner/dashboard');
      } else {
        navigate('/renter/dashboard');
      }
    }, 800);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="auth-header">
          <h2 className="auth-title">
            {activeTab === 'login' ? 'Welcome Back' : 'Join EcoGreen Cab'}
          </h2>
          
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="auth-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}
            
            {activeTab === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="auth-input" placeholder="Rahul Sharma" required />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="auth-input" placeholder="name@example.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="auth-input" placeholder="••••••••" required />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-auth-submit" 
                disabled={isLoading} 
                style={{ 
                  opacity: isLoading ? 0.7 : 1,
                  background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)',
                  boxShadow: '0 8px 20px rgba(0, 185, 107, 0.25)'
                }}
              >
                {isLoading ? 'Processing...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>

          <div className="auth-divider">or</div>

          <div className="social-auth">
            <button className="btn-social" type="button">
              <span className="social-icon">G</span>
              Google
            </button>
            <button className="btn-social" type="button">
              <span className="social-icon">A</span>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
