import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/location-finder.css';

// Component to dynamically update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13);
    }
  }, [center, map]);
  return null;
}

const customStationIcon = (isActive) => L.divIcon({
  className: `lf-leaflet-pin ${isActive ? 'active' : ''}`,
  html: `
    <div class="lf-pin-bubble station">
      <span>⚡</span>
    </div>
    <div class="lf-pin-tail"></div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const userIcon = L.divIcon({
  className: 'lf-leaflet-pin',
  html: `
    <div class="lf-pin-bubble" style="background:#3b82f6;color:white;border-color:#3b82f6;">
      <span>🎯</span>
    </div>
    <div class="lf-pin-tail" style="border-top-color:#3b82f6;"></div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

export default function EVLocationFinder() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default India center
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 2 && !hasSearched) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
          const data = await res.json();
          setSuggestions(data || []);
        } catch (e) {
          console.error(e);
        }
      } else {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, hasSearched]);
  
  const fetchStationsByCoords = async (lat, lon, locationName) => {
    setLoading(true);
    setError(null);
    setLocations([]);
    setHasSearched(true);
    setSuggestions([]);
    
    if (locationName) setSearchQuery(locationName);
    setMapCenter([lat, lon]);

    try {
      // Fetch Charging Stations via OpenChargeMap API
      const apiKey = 'e17a646a-70ac-4671-9f10-489ae12a9854';
      const ocmUrl = `https://api.openchargemap.io/v3/poi?key=${apiKey}&latitude=${lat}&longitude=${lon}&distance=15&distanceunit=KM&maxresults=50&camelcase=true`;
      
      const ocmRes = await fetch(ocmUrl);
      
      if (!ocmRes.ok) {
        throw new Error(`OpenChargeMap API error: ${ocmRes.status}`);
      }
      
      const ocmData = await ocmRes.json();
      
      if (ocmData && Array.isArray(ocmData)) {
        const fetchedStations = ocmData.map((station) => {
          const address = station.addressInfo || {};
          const connections = station.connections || [];
          const operator = station.operatorInfo ? station.operatorInfo.title : 'Public Station';
          
          let totalConnectors = 0;
          connections.forEach(conn => {
            totalConnectors += (conn.quantity || 1);
          });
          
          return {
            id: `station-${station.id}`,
            type: 'station',
            title: address.title || operator,
            dist: address.distance ? `${address.distance.toFixed(1)} km away` : 'Live Data',
            meta: `${totalConnectors} Connectors • ${operator}`,
            price: station.usageCost ? station.usageCost : (station.usageType ? station.usageType.title : 'Varies'),
            lat: address.latitude,
            lon: address.longitude,
          };
        });
        
        setLocations(fetchedStations);
      }
      
    } catch (err) {
      console.error(err);
      setError("Failed to fetch live data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (explicitQuery) => {
    const queryToUse = typeof explicitQuery === 'string' ? explicitQuery : searchQuery;
    if (!queryToUse.trim()) return;
    
    setLoading(true);
    setError(null);
    setLocations([]);
    setHasSearched(true);
    setSuggestions([]);
    
    try {
      // Geocode location using Nominatim
      const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryToUse)}&limit=1`);
      const geocodeData = await geocodeRes.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        setError("Location not found. Try a different city.");
        setLoading(false);
        return;
      }
      
      const lat = parseFloat(geocodeData[0].lat);
      const lon = parseFloat(geocodeData[0].lon);
      await fetchStationsByCoords(lat, lon, queryToUse);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch live data. Please try again later.");
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(loc => {
    if (filter === 'car' && loc.type !== 'car') return false;
    if (filter === 'station' && loc.type !== 'station') return false;
    return true;
  });

  return (
    <section className="location-finder-section" id="location-finder">
      <div className="location-finder-header">
        <h2 className="location-finder-title">Find EVs & Charging Stations Near You</h2>
        <p className="location-finder-subtitle">
          Instantly locate the nearest electric vehicles available for rent and fast-charging hubs in your city using real-time open data.
        </p>
      </div>

      <div className="lf-container">
        {/* Top Controls */}
        <div className="lf-controls">
          <div className="lf-search-bar">
            <div className="lf-input-wrapper" style={{ position: 'relative' }}>
              <span className="lf-input-icon">📍</span>
              <input 
                type="text" 
                className="lf-input" 
                placeholder="Enter your location (e.g. Erode, Chennai)..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHasSearched(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {suggestions.length > 0 && (
                <ul className="lf-suggestions">
                  {suggestions.map((s, i) => (
                    <li key={i} onClick={() => {
                      setSearchQuery(s.display_name);
                      handleSearch(s.display_name);
                    }}>
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="lf-btn-search" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button className="lf-btn-location" onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  const lat = pos.coords.latitude;
                  const lon = pos.coords.longitude;
                  setUserLocation([lat, lon]);
                  fetchStationsByCoords(lat, lon, "Current Location");
                });
              }
            }}>
              <span>🎯</span> Current Location
            </button>
          </div>

          <div className="lf-filters">
            <button 
              className={`lf-filter-chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`lf-filter-chip ${filter === 'station' ? 'active' : ''}`}
              onClick={() => setFilter('station')}
            >
              ⚡ Charging Stations
            </button>
          </div>
        </div>

        {/* Body (Map + List) */}
        <div className="lf-body">
          {/* Map Area */}
          <div className="lf-map-area">
            <MapContainer center={mapCenter} zoom={hasSearched ? 13 : 5} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapUpdater center={mapCenter} />
              
              {userLocation && (
                <Marker position={userLocation} icon={userIcon}>
                  <Popup><strong>🎯 You are here</strong></Popup>
                </Marker>
              )}
              
              {filteredLocations.map(loc => (
                <Marker 
                  key={loc.id} 
                  position={[loc.lat, loc.lon]}
                  icon={customStationIcon(activeItem === loc.id)}
                  eventHandlers={{
                    click: () => setActiveItem(loc.id),
                    mouseover: () => setActiveItem(loc.id),
                    mouseout: () => setActiveItem(null)
                  }}
                >
                  <Popup>
                    <strong>{loc.title}</strong><br/>
                    {loc.meta}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* List Area */}
          <div className="lf-list-area">
            {error && <div className="lf-empty-state" style={{color: '#ef4444'}}>{error}</div>}
            
            {loading ? (
              <div className="lf-empty-state">
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📡</div>
                <h3>Scanning for charging stations...</h3>
                <p>Connecting to OpenStreetMap live database.</p>
              </div>
            ) : !hasSearched ? (
               <div className="lf-empty-state lf-empty-start">
                <div className="lf-empty-icon-wrap">
                  <div className="lf-empty-icon">📍</div>
                  <div className="lf-empty-ring"></div>
                </div>
                <h3 style={{ color: '#111827', marginBottom: '8px' }}>Ready to Explore?</h3>
                <p style={{ maxWidth: '280px', margin: '0 auto', lineHeight: '1.5' }}>
                  Enter a city name above or try a popular location to discover live EV charging stations.
                </p>
                <div className="lf-empty-actions">
                  <button className="lf-btn-outline" onClick={() => {
                    setSearchQuery("Bengaluru");
                    handleSearch("Bengaluru");
                  }}>
                    Bengaluru
                  </button>
                  <button className="lf-btn-outline" onClick={() => {
                    setSearchQuery("Delhi");
                    handleSearch("Delhi");
                  }}>
                    Delhi
                  </button>
                </div>
              </div>
            ) : filteredLocations.length > 0 ? (
              filteredLocations.map(loc => (
                <div 
                  key={loc.id} 
                  className={`lf-result-card ${activeItem === loc.id ? 'active' : ''}`}
                  onMouseEnter={() => setActiveItem(loc.id)}
                  onMouseLeave={() => setActiveItem(null)}
                >
                  <div className="lf-card-img">
                    {loc.type === 'car' ? '🚘' : '🔌'}
                  </div>
                  <div className="lf-card-content">
                    <div className="lf-card-header">
                      <div>
                        <h3 className="lf-card-title">{loc.title}</h3>
                        <div className="lf-card-meta">{loc.meta}</div>
                      </div>
                      <div className="lf-card-dist">{loc.dist}</div>
                    </div>
                    <div className="lf-card-footer">
                      <div className="lf-card-price">{loc.price}</div>
                      <div className="lf-card-action">
                        {loc.type === 'car' ? (
                          'Rent Now →'
                        ) : (
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1${userLocation ? `&origin=${userLocation[0]},${userLocation[1]}` : ''}&destination=${loc.lat},${loc.lon}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'inherit', textDecoration: 'none' }}
                          >
                            Get Directions ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="lf-empty-state">
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤷</div>
                <h3>No stations found</h3>
                <p>We couldn't find any mapped charging stations in a 15km radius of this location.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
