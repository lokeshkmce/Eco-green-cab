import Hero from '../components/Hero';

import SearchWidget from '../components/SearchWidget';
import EVMarketplace from '../components/EVMarketplace';
import HowItWorks from '../components/HowItWorks';
import EarningsCalculator from '../components/EarningsCalculator';
import GreenImpact from '../components/GreenImpact';
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
      <section className="section" style={{ background: '#ffffff', paddingTop: '10px' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">⚡ Featured Vehicles</span>
            <h2 className="section-title">Top-Rated Electric Vehicles</h2>
            <p className="section-subtitle">
              Hand-picked premium EVs from verified hosts — available now in your city.
            </p>
          </div>

          <EVMarketplace limit={6} />

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
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

      {/* Green Impact */}
      <GreenImpact />

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
