import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = OTP Input, 3 = Role Selection
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedUserData, setVerifiedUserData] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ 
    username: '',
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
    if (!formData.username.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!formData.phone) {
      setError("Please enter your phone number.");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // --- DEMO MODE BYPASS (Start) ---
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      setStep(2);
      /* 
      // Original Backend Code (Commented out for demo)
      const response = await fetch('/ecogreencab/send-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ 
          phone: formData.phone
        })
      });
      
      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        console.warn("Backend error:", data);
        let errorMsg = data.detail || data.message || data.error || 'Failed to send OTP.';
        if (typeof errorMsg === 'object') {
          errorMsg = Object.values(errorMsg).flat()[0] || JSON.stringify(errorMsg);
        }
        throw new Error(errorMsg);
      }
      
      setStep(2);
      */
      // --- DEMO MODE BYPASS (End) ---
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
      // --- DEMO MODE BYPASS (Start) ---
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (formData.otp !== '1234') {
        throw new Error("Invalid Demo OTP. Please use 1234.");
      }

      // Hardcoded Admin Account Bypass
      if (formData.phone === '9003797945') {
        const adminUserData = {
          name: 'Alex',
          phone: '9003797945',
          roles: ['admin']
        };
        login(adminUserData);
        onClose();
        navigate('/admin/dashboard');
        return;
      }

      // Automatically mock a successful verification and proceed to role selection
      const demoUsers = JSON.parse(localStorage.getItem('eco_demo_users') || '{}');
      const savedRole = demoUsers[formData.phone];

      const userData = {
        name: formData.username.trim() || 'Demo User',
        phone: formData.phone,
        roles: savedRole ? [savedRole] : [] // Force role selection if not saved
      };

      if (savedRole) {
        login(userData);
        onClose();
        navigate(savedRole === 'owner' ? '/owner/dashboard' : '/renter/dashboard');
        return;
      }

      setVerifiedUserData(userData);
      setStep(3);

      /*
      // Original Backend Code (Commented out for demo)
      const response = await fetch('/ecogreencab/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ 
          phone: formData.phone,
          otp: formData.otp 
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.warn("Backend verification error:", data);
        let errorMsg = data.detail || data.message || data.error || 'Invalid OTP.';
        if (typeof errorMsg === 'object') {
          errorMsg = Object.values(errorMsg).flat()[0] || JSON.stringify(errorMsg);
        }
        throw new Error(errorMsg);
      }
      
      if (data.token) {
        localStorage.setItem('eco_auth_token', data.token);
      }

      const userData = data.user || {
        name: formData.username.trim() || 'User',
        phone: formData.phone,
        roles: []
      };

      // Admin bypass — skip role selection
      if (userData.roles?.includes('admin')) {
        login(userData);
        onClose();
        navigate('/admin/dashboard');
        return;
      }

      // If backend already assigned a concrete role, skip role selection
      if (userData.roles?.includes('owner') || userData.roles?.includes('renter')) {
        login(userData);
        onClose();
        navigate(userData.roles.includes('owner') ? '/owner/dashboard' : '/renter/dashboard');
        return;
      }

      // New user → show role selection
      setVerifiedUserData(userData);
      setStep(3);
      */
      // --- DEMO MODE BYPASS (End) ---
      
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleRoleConfirm = () => {
    if (!selectedRole) return;
    const finalUserData = { ...verifiedUserData, roles: [selectedRole] };
    
    // Save to demo database
    const demoUsers = JSON.parse(localStorage.getItem('eco_demo_users') || '{}');
    demoUsers[finalUserData.phone] = selectedRole;
    localStorage.setItem('eco_demo_users', JSON.stringify(demoUsers));

    login(finalUserData);
    handleClose();
    navigate(selectedRole === 'owner' ? '/owner/dashboard' : '/renter/dashboard');
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ username: '', phone: '', otp: '' });
    setError('');
    setSelectedRole(null);
    setVerifiedUserData(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div
        className={`auth-modal-content${step === 3 ? ' auth-modal-content--wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-modal-close" onClick={handleClose}>✕</button>

        {/* Step 1 & 2 header */}
        {step !== 3 && (
          <div className="auth-header" style={{ paddingBottom: '16px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
            <h2 className="auth-title" style={{ textAlign: 'center', margin: '0' }}>
              {step === 1 ? 'Sign In' : 'Verify Phone'}
            </h2>
          </div>
        )}

        <div className="auth-body">
          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          {/* ── STEP 1: Name + Phone ── */}
          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <div style={{ textAlign: 'center', marginBottom: '24px', color: '#6b7280', fontSize: '0.9rem' }}>
                Enter your details to get started.
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>👤</span> Your Name
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="auth-input"
                    placeholder="e.g. Arjun Kumar"
                    required
                    autoFocus
                    autoComplete="name"
                    style={{ paddingLeft: '16px', borderRadius: '12px', border: '1.5px solid #e5e7eb' }}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📱</span> Phone Number
                  </span>
                </label>
                <div style={{ display: 'flex', border: '1.5px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRight: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                    🇮🇳 +91
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
                    autoComplete="tel"
                  />
                </div>
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
                  {isLoading ? 'Sending OTP...' : 'Continue →'}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <div style={{ textAlign: 'center', marginBottom: '24px', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
                We've sent a 4-digit verification code to <br/><strong style={{ color: '#111827' }}>+91 {formData.phone}</strong>.
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

          {/* ── STEP 3: Role Selection ── */}
          {step === 3 && (
            <div className="role-selection-container">
              {/* Animated success check */}
              <div className="role-success-ring">
                <div className="role-success-badge">✓</div>
              </div>

              <h2 className="role-selection-title">You're Verified! 🎉</h2>
              <p className="role-selection-subtitle">
                How would you like to use <strong>EcoGreen Cab</strong>?<br/>
                <span style={{ fontSize: '0.82rem', opacity: 0.6 }}>Pick a role — you can change it anytime later.</span>
              </p>

              <div className="role-cards-grid">
                {/* ── Renter Card ── */}
                <button
                  className={`role-card role-card--renter${selectedRole === 'renter' ? ' selected' : ''}`}
                  onClick={() => handleRoleSelect('renter')}
                  type="button"
                  id="role-renter-btn"
                >
                  <div className="role-card-bg role-card-bg--renter" />
                  <div className="role-card-icon-wrap role-card-icon-wrap--renter">
                    <span className="role-card-emoji">🚗</span>
                  </div>
                  <div className="role-card-label">Rent a Car</div>
                  <div className="role-card-desc">Browse and book EVs near you in minutes</div>
                  <ul className="role-card-perks">
                    <li>⚡ Instant booking</li>
                    <li>🌱 100+ EV models</li>
                    <li>💸 Affordable rates</li>
                  </ul>
                  <div className={`role-card-check${selectedRole === 'renter' ? ' visible' : ''}`}>✓</div>
                </button>

                {/* ── Owner / Host Card ── */}
                <button
                  className={`role-card role-card--owner${selectedRole === 'owner' ? ' selected' : ''}`}
                  onClick={() => handleRoleSelect('owner')}
                  type="button"
                  id="role-owner-btn"
                >
                  <div className="role-card-bg role-card-bg--owner" />
                  <div className="role-card-icon-wrap role-card-icon-wrap--owner">
                    <span className="role-card-emoji">🏠</span>
                  </div>
                  <div className="role-card-label">Host a Car</div>
                  <div className="role-card-desc">List your EV and earn passive income daily</div>
                  <ul className="role-card-perks">
                    <li>📋 Easy listing</li>
                    <li>💰 Earn every day</li>
                    <li>🔒 Full control</li>
                  </ul>
                  <div className={`role-card-check role-card-check--owner${selectedRole === 'owner' ? ' visible' : ''}`}>✓</div>
                </button>
              </div>

              <button
                className={`btn-role-confirm${selectedRole ? ' btn-role-confirm--active' : ''}`}
                disabled={!selectedRole}
                onClick={handleRoleConfirm}
                type="button"
                id="role-confirm-btn"
              >
                {!selectedRole && '👆 Select a role to continue'}
                {selectedRole === 'renter' && '🚀 Go to Renter Dashboard →'}
                {selectedRole === 'owner' && '🏠 Go to Owner Dashboard →'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
