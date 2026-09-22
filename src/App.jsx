import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { MdElectricBolt } from 'react-icons/md';

// Pages
import Home from './pages/Home';
import Rent from './pages/Rent';
import ListYourEV from './pages/ListYourEV';
import OwnerDashboard from './pages/OwnerDashboard';
import RenterDashboard from './pages/RenterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HowItWorksPage from './pages/HowItWorksPage';
import About from './pages/About';
import Contact from './pages/Contact';

// Global Styles
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';

// Scroll to top on route change
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith('/owner/dashboard') || pathname.startsWith('/renter/dashboard') || pathname.startsWith('/admin/dashboard');

  return (
    <>
      <ScrollToTop />
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/list-your-ev" element={<ListYourEV />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/owner/dashboard" 
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/renter/dashboard" 
          element={
            <ProtectedRoute allowedRole="renter">
              <RenterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
}

function NotFound() {
  return (
    <main style={{ paddingTop: '72px', minHeight: '100vh', background: '#020811', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '72px 24px' }}>
      <div style={{ fontSize: '5rem', marginBottom: '24px', color: '#00e676', display: 'flex', justifyContent: 'center' }}><MdElectricBolt /></div>
      <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '3rem', fontWeight: 800, color: '#f0f9ff', marginBottom: '16px' }}>
        404 — Lost in the Grid
      </h1>
      <p style={{ color: 'rgba(240,249,255,0.55)', maxWidth: '400px', marginBottom: '32px', lineHeight: 1.7 }}>
        Looks like this page ran out of charge. Let's get you back on the road.
      </p>
      <a href="/" style={{ padding: '14px 32px', borderRadius: '12px', background: 'linear-gradient(135deg, #00e676 0%, #00bcd4 100%)', color: '#020811', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
        Back to Home →
      </a>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
