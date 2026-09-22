import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [registerStep, setRegisterStep] = useState(1); // 1 = Phone, 2 = OTP, 3 = Password
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    password: '',
    loginIdentifier: '', 
    otp: ''
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  if (!isOpen) return null;

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError("Please enter your name and phone number.");
      return;
    }
    const db = JSON.parse(localStorage.getItem('eco_users_db') || '[]');
    if (db.some(u => u.phone === formData.phone && u.phone !== '')) {
       setError('Phone number is already registered! Please sign in.');
       return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRegisterStep(2); // Move to OTP step
    }, 800);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (formData.otp === '1234') {
        setRegisterStep(3); // Move to Password step
        setError('');
      } else {
        setError("Invalid OTP. Try '1234'.");
      }
    }, 800);
  }

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
       setIsLoading(false);
       const db = JSON.parse(localStorage.getItem('eco_users_db') || '[]');
       const userData = {
          name: formData.name,
          email: '', 
          phone: formData.phone,
          password: formData.password, // Storing plaintext for mock purposes
          roles: ['renter'],
        };
        db.push(userData);
        localStorage.setItem('eco_users_db', JSON.stringify(db));
        
        const { password, ...safeUserData } = userData;
        login(safeUserData);
        onClose();
        navigate('/renter/dashboard');
    }, 800);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      setIsLoading(false);
      const db = JSON.parse(localStorage.getItem('eco_users_db') || '[]');
      
      let userData = db.find(u => 
         u.phone === formData.loginIdentifier && u.phone !== '' && u.password === formData.password
      );
      
      if (!userData) {
         if (formData.loginIdentifier === '9999999999' && formData.password === 'admin') {
           userData = { name: 'Super Admin', phone: '9999999999', roles: ['admin'] };
         } else if (formData.loginIdentifier === '8888888888' && formData.password === 'owner') {
           userData = { name: 'Demo Owner', phone: '8888888888', roles: ['owner'] };
         } else {
           setError('Invalid credentials. Please check your phone number and password.');
           return;
         }
      }
      
      const { password, ...safeUserData } = userData;
      login(safeUserData);
      onClose();

      if (safeUserData.roles?.includes('admin')) {
        navigate('/admin/dashboard');
      } else if (safeUserData.roles?.includes('owner')) {
        navigate('/owner/dashboard');
      } else {
        navigate('/renter/dashboard');
      }
    }, 800);
  };

  const resetRegister = () => {
    setActiveTab('register');
    setRegisterStep(1);
    setFormData({ ...formData, otp: '', password: '' });
    setError('');
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>

        <div className="auth-header">
          <h2 className="auth-title">
            {activeTab === 'login' ? 'Welcome Back' : 'Join EcoGreen Cab'}
          </h2>
          
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              Sign In
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={resetRegister}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="auth-body">
          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="loginIdentifier" 
                  value={formData.loginIdentifier} 
                  onChange={handleInputChange} 
                  className="auth-input" 
                  placeholder="+91 98765 43210 (Admin: 9999999999)" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleInputChange} 
                  className="auth-input" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-auth-submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', boxShadow: '0 8px 20px rgba(0, 185, 107, 0.25)' }}>
                  {isLoading ? 'Processing...' : 'Sign In'}
                </button>
              </div>
            </form>
          ) : (
            <>
              {registerStep === 1 && (
                <form onSubmit={handleSendOTP}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="auth-input" placeholder="Rahul Sharma" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="auth-input" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-auth-submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', boxShadow: '0 8px 20px rgba(0, 185, 107, 0.25)' }}>
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                </form>
              )}

              {registerStep === 2 && (
                <form onSubmit={handleVerifyOTP}>
                  <div style={{ textAlign: 'center', marginBottom: '16px', color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    We've sent a verification code to <br/><strong style={{ color: '#111827' }}>{formData.phone}</strong>.<br/>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>(For testing, enter OTP: 1234)</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ textAlign: 'center' }}>Enter 4-Digit OTP</label>
                    <input 
                      type="text" 
                      name="otp" 
                      value={formData.otp} 
                      onChange={handleInputChange} 
                      className="auth-input" 
                      placeholder="1234" 
                      maxLength={4} 
                      style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '0.5em', fontWeight: 700 }} 
                      required 
                    />
                  </div>
                  <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setRegisterStep(1)} className="btn-auth-submit" style={{ background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}>
                      Back
                    </button>
                    <button type="submit" className="btn-auth-submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', boxShadow: '0 8px 20px rgba(0, 185, 107, 0.25)' }}>
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </form>
              )}

              {registerStep === 3 && (
                <form onSubmit={handleRegister}>
                  <div style={{ textAlign: 'center', padding: '12px', background: '#ecfdf5', borderRadius: '8px', marginBottom: '16px', color: '#059669', fontWeight: 600, fontSize: '0.9rem' }}>
                    ✓ Phone Number Verified
                  </div>
                  <div className="form-group">
                    <label className="form-label">Create a Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      className="auth-input" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-auth-submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', boxShadow: '0 8px 20px rgba(0, 185, 107, 0.25)' }}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          <div className="auth-divider">or</div>

          <div className="social-auth">
            <button className="btn-social" type="button">
              <span className="social-icon">G</span> Google
            </button>
            <button className="btn-social" type="button">
              <span className="social-icon">A</span> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
