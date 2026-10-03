import { useState, useRef, useEffect } from 'react';
import { MdElectricBolt, MdSecurity, MdSpeed, MdSupportAgent, MdZoomIn, MdZoomOut } from 'react-icons/md';

export default function FeatureShowcase() {
  const [scale, setScale] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the image container (-1 to 1)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setScale(prev => {
      const newScale = prev - e.deltaY * 0.002;
      return Math.min(Math.max(newScale, 0.8), 3); // Max zoom 3x, min 0.8x
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.3, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.3, 0.8));

  const features = [
    { icon: <MdElectricBolt size={24} />, title: "100% Electric Fleet", desc: "Drive the future with zero tailpipe emissions." },
    { icon: <MdSecurity size={24} />, title: "Zero Security Deposit", desc: "Rent premium EVs without locking up your money." },
    { icon: <MdSpeed size={24} />, title: "Instant Approvals", desc: "Get AI-verified and approved in under 2 minutes." },
    { icon: <MdSupportAgent size={24} />, title: "24/7 Roadside Assistance", desc: "Drive with peace of mind. We're always here to help." },
  ];

  // Calculate parallax rotation values (max 15 degrees tilt)
  const tiltX = isHovered ? mousePosition.y * -15 : 0;
  const tiltY = isHovered ? mousePosition.x * 15 : 0;

  return (
    <section style={{ padding: '50px 24px', background: '#ffffff', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '48px' }}>
        
        {/* Left Side: 3D Parallax Image with Zoom */}
        <div style={{ flex: '1 1 320px', perspective: '1500px', padding: '10px', position: 'relative', maxWidth: '100%' }}>
          
          {/* Zoom Controls */}
          <div style={{ position: 'absolute', top: '0', right: '0', zIndex: 10, display: 'flex', gap: '8px' }}>
            <button onClick={zoomIn} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', color: '#111827' }}>
              <MdZoomIn size={18} />
            </button>
            <button onClick={zoomOut} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', color: '#111827' }}>
              <MdZoomOut size={18} />
            </button>
          </div>

          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              width: '100%',
              height: '320px', // Fixed height
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
              transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out', // Smooth return to center
              userSelect: 'none'
            }}
          >
            {/* Image Container */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              borderRadius: '24px',
              boxShadow: isHovered 
                ? `\${mousePosition.x * -20}px \${mousePosition.y * -20 + 20}px 50px rgba(0, 0, 0, 0.15)`
                : '0 20px 50px rgba(0, 0, 0, 0.12)',
              transition: 'box-shadow 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                <video 
                  src="/videos/car_video.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    mixBlendMode: 'multiply', 
                    transform: `scale(${1.4 * scale}) translateZ(30px)`, // translateZ adds depth
                    transition: 'transform 0.1s ease-out'
                  }} 
                />
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '16px', color: '#6b7280', fontSize: '0.85rem', fontWeight: 600 }}>
            Hover to tilt in 3D • Scroll or use buttons to zoom
          </div>
        </div>

        {/* Right Side: Features List */}
        <div style={{ flex: '1 1 320px', maxWidth: '100%' }}>
          <span style={{ color: '#00b96b', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Why Choose I Eco Green Cab
          </span>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, color: '#111827', margin: '12px 0 20px', lineHeight: 1.2 }}>
            The Smartest Way To Drive An EV.
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#00b96b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(0, 185, 107, 0.1)'
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{feature.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.4 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
