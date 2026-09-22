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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      setError("Please enter your phone number.");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/ecogreencab/send-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        // The backend error "Mobile number is required" indicates it expects 'mobile' or 'mobile_number'
        body: JSON.stringify({ 
          phone: formData.phone,
          phone_number: formData.phone,
          mobile: formData.phone,
          mobile_number: formData.phone
        })
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || data.error || 'Failed to send OTP.');
      }
      
      setStep(2); // Move to OTP step
    } catch (err) {
      setError(err.message || 'An error occurred connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/ecogreencab/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ 
          phone: formData.phone,
          phone_number: formData.phone,
          mobile: formData.phone,
          mobile_number: formData.phone,
          otp: formData.otp 
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || data.message || data.error || 'Invalid OTP.');
      }
      
      // Successfully verified by Django backend!
      // Keep existing logic to auto-login based on roles
      const db = JSON.parse(localStorage.getItem('eco_users_db') || '[]');
      let userData = db.find(u => u.phone === formData.phone && u.phone !== '');
      
      if (!userData) {
         if (formData.phone === '9999999999' || formData.phone === '+919999999999') {
           userData = { name: 'Super Admin', phone: formData.phone, roles: ['admin'] };
         } else if (formData.phone === '8888888888' || formData.phone === '+918888888888') {
           userData = { name: 'Demo Owner', phone: formData.phone, roles: ['owner'] };
         } else {
           // Auto-create new renter account
           userData = {
             name: 'User',
             phone: formData.phone,
             roles: ['renter'],
           };
           db.push(userData);
           localStorage.setItem('eco_users_db', JSON.stringify(db));
         }
      }
      
      if (data.token) {
         localStorage.setItem('eco_auth_token', data.token); // Store token if backend returns one
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
      
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                Enter your mobile number to continue.
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
                  {isLoading ? 'Sending OTP...' : 'Sign In'}
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
