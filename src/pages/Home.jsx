import Hero from '../components/Hero';
import FeatureShowcase from '../components/FeatureShowcase';

import SearchWidget from '../components/SearchWidget';
import EVMarketplace from '../components/EVMarketplace';
import HowItWorks from '../components/HowItWorks';
import EarningsCalculator from '../components/EarningsCalculator';
import EVLocationFinder from '../components/EVLocationFinder';

import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>


      {/* Hero Section */}
      <Hero />

      {/* 3D Feature Showcase */}
      <FeatureShowcase />

      {/* Search Widget */}
      <div style={{
        maxWidth: '1100px',
        margin: '40px auto',
        padding: '0 24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <SearchWidget compact={true} />
      </div>


      {/* Featured EVs Preview */}
      <section className="section" style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f7fafb 100%)',
        paddingTop: '16px',
        paddingBottom: '32px',
        position: 'relative',
      }}>
        {/* Decorative top border */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, transparent, #00c472, #00d4aa, #38bdf8, transparent)',
        }} />
        <div className="container">
          <div className="section-header">
            <span className="section-badge">⚡ Featured Vehicles</span>
            <h2 className="section-title">Top-Rated Electric Vehicles</h2>
            <p className="section-subtitle">
              Hand-picked premium EVs from verified hosts — available now in your city.
            </p>
          </div>

          <EVMarketplace limit={8} />

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/rent" className="btn btn-outline btn-lg">
              View All EVs →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Features */}
      <Features />

      {/* EV Location Finder */}
      <EVLocationFinder />



      {/* Testimonials */}
      <Testimonials />


      {/* Earnings Calculator */}
      <EarningsCalculator />

      {/* CTA */}
      <CTA />


    </main>
  );
}
