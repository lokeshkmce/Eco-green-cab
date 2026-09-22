import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = OTP Input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({ 
    phone: '',
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
    if (!formData.phone) {
      setError("Please enter your phone number.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Move to OTP step
    }, 800);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      setIsLoading(false);
      
      // Verify Mock OTP
      if (formData.otp !== '1234') {
        setError("Invalid OTP. Try '1234'.");
        return;
      }
      
      const db = JSON.parse(localStorage.getItem('eco_users_db') || '[]');
      
      // Check if user exists
      let userData = db.find(u => u.phone === formData.phone && u.phone !== '');
      
      // If user doesn't exist in DB
      if (!userData) {
         if (formData.phone === '9999999999') {
           userData = { name: 'Super Admin', phone: '9999999999', roles: ['admin'] };
         } else if (formData.phone === '8888888888') {
           userData = { name: 'Demo Owner', phone: '8888888888', roles: ['owner'] };
         } else {
           // Auto-create new renter account
           userData = {
             name: 'User', // Can be updated in profile later
             phone: formData.phone,
             roles: ['renter'],
           };
           db.push(userData);
           localStorage.setItem('eco_users_db', JSON.stringify(db));
         }
      }
      
      // Clean up password field if it existed in old DB entries
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
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>

        <div className="auth-header" style={{ paddingBottom: '16px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
          <h2 className="auth-title" style={{ textAlign: 'center', margin: '0' }}>
            {step === 1 ? 'Sign In' : 'Verify Phone'}
          </h2>
        </div>

        <div className="auth-body">
          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <div style={{ textAlign: 'center', marginBottom: '24px', color: '#4b5563', fontSize: '0.95rem' }}>
                Enter your mobile number to instantly log in or create a new account.
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ display: 'flex', border: '1.5px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRight: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>
                    +91
                  </div>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className="auth-input"
                    style={{ border: 'none', borderRadius: '0' }}
                    placeholder="98765 43210" 
                    required 
                    autoFocus
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-auth-submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', boxShadow: '0 8px 20px rgba(0, 185, 107, 0.25)' }}>
                  {isLoading ? 'Sending OTP...' : 'Continue'}
                </button>
              </div>
              
              <div className="auth-divider">or</div>

              <div className="social-auth">
                <button className="btn-social" type="button">
                  <span className="social-icon">G</span> Google
                </button>
                <button className="btn-social" type="button">
                  <span className="social-icon">A</span> Apple
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <div style={{ textAlign: 'center', marginBottom: '24px', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
                We've sent a 4-digit verification code to <br/><strong style={{ color: '#111827' }}>+91 {formData.phone}</strong>.<br/>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>(For testing, enter OTP: 1234)</span>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ textAlign: 'center' }}>Enter OTP</label>
                <input 
                  type="text" 
                  name="otp" 
                  value={formData.otp} 
                  onChange={handleInputChange} 
                  className="auth-input" 
                  placeholder="1 2 3 4" 
                  maxLength={4} 
                  style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.6em', fontWeight: 700 }} 
                  required 
                  autoFocus
                />
              </div>
              <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(1)} className="btn-auth-submit" style={{ background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}>
                  Back
                </button>
                <button type="submit" className="btn-auth-submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, background: 'linear-gradient(135deg, #00b96b 0%, #00d4aa 100%)', boxShadow: '0 8px 20px rgba(0, 185, 107, 0.25)' }}>
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
