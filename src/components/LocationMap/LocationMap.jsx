import React, { useState, useRef, useEffect } from 'react';
import './LocationMap.css';

const LocationMap = ({ 
  onLocationSelect, 
  initialLocation = null, 
  height = '400px',
  readonly = false 
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const searchRef = useRef(null);

  // Sample locations data - in real app, this would come from a mapping service
  const sampleLocations = [
    {
      id: 1,
      name: 'Central Park',
      address: 'Central Park, New York, NY',
      lat: 40.7829,
      lng: -73.9654,
      type: 'park'
    },
    {
      id: 2,
      name: 'Times Square',
      address: 'Times Square, Manhattan, NY',
      lat: 40.7580,
      lng: -73.9855,
      type: 'landmark'
    },
    {
      id: 3,
      name: 'Empire State Building',
      address: '350 5th Ave, New York, NY',
      lat: 40.7484,
      lng: -73.9857,
      type: 'landmark'
    },
    {
      id: 4,
      name: 'Brooklyn Bridge',
      address: 'Brooklyn Bridge, New York, NY',
      lat: 40.7061,
      lng: -73.9969,
      type: 'landmark'
    },
    {
      id: 5,
      name: 'Metropolitan Museum',
      address: '1000 5th Ave, New York, NY',
      lat: 40.7794,
      lng: -73.9632,
      type: 'museum'
    }
  ];

  // Popular locations for quick selection
  const popularLocations = [
    { name: 'Parks', icon: '🌳' },
    { name: 'Shopping Malls', icon: '🛍️' },
    { name: 'Restaurants', icon: '🍽️' },
    { name: 'Public Transport', icon: '🚆' },
    { name: 'Schools', icon: '🎓' },
    { name: 'Beaches', icon: '🏖️' }
  ];

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
      initializeMap();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const initializeMap = () => {
    // In a real application, this would initialize a map library like Google Maps or Leaflet
    console.log('Map initialized');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      const results = sampleLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleLocationSelect = (location) => {
    if (readonly) return;

    setSelectedLocation(location);
    setSearchQuery(location.address);
    setSearchResults([]);
    
    if (onLocationSelect) {
      onLocationSelect({
        name: location.name,
        address: location.address,
        coordinates: {
          lat: location.lat,
          lng: location.lng
        },
        type: location.type
      });
    }
  };

  const handleCurrentLocation = () => {
    if (readonly) return;

    // Simulate getting current location
    const currentLocation = {
      id: 'current',
      name: 'Current Location',
      address: 'Your current location',
      lat: 40.7589,
      lng: -73.9851,
      type: 'current'
    };

    handleLocationSelect(currentLocation);
  };

  const handlePopularLocationSelect = (category) => {
    if (readonly) return;

    setSearchQuery(category.name);
    // Filter sample locations by type/category
    const categoryLocations = sampleLocations.filter(loc => 
      loc.type === category.name.toLowerCase().replace(' ', '_')
    );
    setSearchResults(categoryLocations);
  };

  const clearSelection = () => {
    if (readonly) return;

    setSelectedLocation(null);
    setSearchQuery('');
    setSearchResults([]);
    
    if (onLocationSelect) {
      onLocationSelect(null);
    }
  };

  const getMapMarkerColor = (type) => {
    const colors = {
      park: '#10b981',
      landmark: '#f59e0b',
      museum: '#8b5cf6',
      current: '#ef4444',
      default: '#3b82f6'
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="location-map">
      {/* Search and Controls */}
      <div className="map-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a location..."
              className="search-input"
              disabled={readonly}
            />
            {searchQuery && !readonly && (
              <button 
                className="clear-search"
                onClick={clearSelection}
              >
                ×
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(location => (
                <div
                  key={location.id}
                  className="search-result-item"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="location-icon">
                    {location.type === 'park' && '🌳'}
                    {location.type === 'landmark' && '🏛️'}
                    {location.type === 'museum' && '🏛️'}
                    {!['park', 'landmark', 'museum'].includes(location.type) && '📍'}
                  </div>
                  <div className="location-info">
                    <div className="location-name">{location.name}</div>
                    <div className="location-address">{location.address}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!readonly && (
          <button 
            className="current-location-btn"
            onClick={handleCurrentLocation}
          >
            <span className="btn-icon">📍</span>
            Use Current Location
          </button>
        )}
      </div>

      {/* Map Container */}
      <div 
        className={`map-container ${mapLoaded ? 'loaded' : 'loading'}`}
        style={{ height }}
        ref={mapRef}
      >
        {!mapLoaded ? (
          <div className="map-loading">
            <div className="loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        ) : (
          <>
            {/* Map Visualization */}
            <div className="map-visualization">
              {/* This would be replaced with actual map library */}
              <div className="mock-map">
                <div className="map-grid">
                  {[...Array(10)].map((_, row) => (
                    <div key={row} className="map-row">
                      {[...Array(15)].map((_, col) => (
                        <div key={col} className="map-cell"></div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Markers */}
                {sampleLocations.map(location => (
                  <div
                    key={location.id}
                    className={`map-marker ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                    style={{
                      left: `${(location.lng + 180) / 360 * 100}%`,
                      top: `${(90 - location.lat) / 180 * 100}%`,
                      backgroundColor: getMapMarkerColor(location.type)
                    }}
                    onClick={() => !readonly && handleLocationSelect(location)}
                  >
                    <div className="marker-pin"></div>
                    <div className="marker-tooltip">
                      {location.name}
                    </div>
                  </div>
                ))}

                {/* Selected Location Marker */}
                {selectedLocation && (
                  <div
                    className="map-marker selected"
                    style={{
                      left: `${(selectedLocation.lng + 180) / 360 * 100}%`,
                      top: `${(90 - selectedLocation.lat) / 180 * 100}%`,
                      backgroundColor: getMapMarkerColor(selectedLocation.type)
                    }}
                  >
                    <div className="marker-pin"></div>
                    <div className="marker-tooltip active">
                      {selectedLocation.name}
                    </div>
                  </div>
                )}

                {/* Current Location Marker */}
                {selectedLocation?.type === 'current' && (
                  <div
                    className="map-marker current-location"
                    style={{
                      left: `${(selectedLocation.lng + 180) / 360 * 100}%`,
                      top: `${(90 - selectedLocation.lat) / 180 * 100}%`
                    }}
                  >
                    <div className="current-location-ring"></div>
                    <div className="current-location-dot"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Controls */}
            <div className="map-toolbar">
              <button className="map-control-btn zoom-in">
                <span>+</span>
              </button>
              <button className="map-control-btn zoom-out">
                <span>-</span>
              </button>
              <button className="map-control-btn reset-view">
                <span>⟲</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Popular Locations */}
      {!readonly && (
        <div className="popular-locations">
          <h4>Popular Locations</h4>
          <div className="popular-locations-grid">
            {popularLocations.map((location, index) => (
              <button
                key={index}
                className="popular-location-btn"
                onClick={() => handlePopularLocationSelect(location)}
              >
                <span className="location-icon">{location.icon}</span>
                <span className="location-name">{location.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="selected-location-info">
          <div className="selected-location-header">
            <h4>Selected Location</h4>
            {!readonly && (
              <button 
                className="clear-selection-btn"
                onClick={clearSelection}
              >
                Change
              </button>
            )}
          </div>
          <div className="selected-location-details">
            <div className="location-icon">
              {selectedLocation.type === 'park' && '🌳'}
              {selectedLocation.type === 'landmark' && '🏛️'}
              {selectedLocation.type === 'museum' && '🏛️'}
              {selectedLocation.type === 'current' && '📍'}
              {!['park', 'landmark', 'museum', 'current'].includes(selectedLocation.type) && '📍'}
            </div>
            <div className="location-details">
              <div className="location-name">{selectedLocation.name}</div>
              <div className="location-address">{selectedLocation.address}</div>
              {selectedLocation.coordinates && (
                <div className="location-coordinates">
                  {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;