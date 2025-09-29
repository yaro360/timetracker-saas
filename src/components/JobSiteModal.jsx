import React, { useState, useEffect } from 'react';
import { X, MapPin, Search } from 'lucide-react';

const JobSiteModal = ({ jobSite, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    latitude: '',
    longitude: '',
    radius: 100
  });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    if (jobSite) {
      setFormData({
        name: jobSite.name || '',
        address1: jobSite.address1 || '',
        address2: jobSite.address2 || '',
        city: jobSite.city || '',
        state: jobSite.state || '',
        zipCode: jobSite.zipCode || '',
        country: jobSite.country || 'United States',
        latitude: jobSite.latitude || '',
        longitude: jobSite.longitude || '',
        radius: jobSite.radius || 100
      });
    }
  }, [jobSite]);

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      initializeMap();
    }
  }, [formData.latitude, formData.longitude]);

  const initializeMap = () => {
    if (formData.latitude && formData.longitude) {
      initializeMapWithCoordinates(parseFloat(formData.latitude), parseFloat(formData.longitude));
    }
  };

  const initializeMapWithCoordinates = (lat, lng) => {
    try {
      // Remove existing map
      if (map) {
        map.remove();
      }

      // Create new map
      const mapInstance = L.map('job-site-map').setView([lat, lng], 15);
      setMap(mapInstance);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Add marker
      const newMarker = L.marker([lat, lng], {
        draggable: true
      }).addTo(mapInstance);

      setMarker(newMarker);

      // Add circle to show radius
      const radiusCircle = L.circle([lat, lng], {
        color: '#4F46E5',
        fillColor: '#4F46E5',
        fillOpacity: 0.1,
        radius: formData.radius || 100
      }).addTo(mapInstance);

      // Marker drag event
      newMarker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        setFormData(prev => ({
          ...prev,
          latitude: position.lat.toFixed(6),
          longitude: position.lng.toFixed(6)
        }));
        
        // Update circle position
        radiusCircle.setLatLng(position);
      });

      // Map click event
      mapInstance.on('click', (e) => {
        const position = e.latlng;
        newMarker.setLatLng(position);
        radiusCircle.setLatLng(position);
        setFormData(prev => ({
          ...prev,
          latitude: position.lat.toFixed(6),
          longitude: position.lng.toFixed(6)
        }));
      });

      // Update radius circle when radius changes
      const updateRadiusCircle = () => {
        if (radiusCircle) {
          radiusCircle.setRadius(formData.radius || 100);
        }
      };

      // Store update function for later use
      mapInstance.updateRadiusCircle = updateRadiusCircle;

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map. Please try again.');
    }
  };

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    
    // Update radius circle if radius changed
    if (e.target.name === 'radius' && map && map.updateRadiusCircle) {
      setTimeout(() => {
        map.updateRadiusCircle();
      }, 100);
    }
  };

  const geocodeAddress = async () => {
    if (!formData.address1 || !formData.city || !formData.state) {
      alert('Please fill in at least Address 1, City, and State');
      return;
    }

    setIsLoading(true);
    setMapError('');

    try {
      const address = `${formData.address1}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`;
      console.log('Geocoding address:', address);
      
      // Use Nominatim (OpenStreetMap) geocoding service
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`;
      
      const response = await fetch(geocodingUrl, {
        headers: {
          'User-Agent': 'TimeTracker-App/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Geocoding response:', data);
      
      if (data && data.length > 0) {
        const coordinates = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        
        console.log('Found coordinates:', coordinates);
        
        setFormData(prev => ({
          ...prev,
          latitude: coordinates.lat.toFixed(6),
          longitude: coordinates.lng.toFixed(6)
        }));
        
        // Initialize map with new coordinates
        setTimeout(() => {
          initializeMapWithCoordinates(coordinates.lat, coordinates.lng);
        }, 100);
        
      } else {
        throw new Error('Address not found. Please try a different address or select on the map.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setMapError(`Could not find location: ${error.message}. Please try a different address or select on the map.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.latitude || !formData.longitude) {
      alert('Please fill in all required fields and ensure location is set');
      return;
    }

    const fullAddress = `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`.trim();
    
    const jobSiteData = {
      ...formData,
      fullAddress,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      radius: parseInt(formData.radius)
    };

    onSave(jobSiteData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{jobSite ? 'Edit Job Site' : 'Add Job Site'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label htmlFor="name">Job Site Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter job site name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address1">Address Line 1 *</label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              required
              placeholder="Street address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address2">Address Line 2</label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              placeholder="Suite, building, apartment (optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">ZIP/Postal Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="ZIP code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location on Map</label>
            <div className="map-container">
              <div className="map-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={geocodeAddress}
                  disabled={isLoading}
                >
                  <Search size={16} />
                  {isLoading ? 'Finding...' : 'Find Location on Map'}
                </button>
                <div className="coordinates">
                  <span>Lat: {formData.latitude || 'Not set'}</span>
                  <span>Lng: {formData.longitude || 'Not set'}</span>
                </div>
              </div>
              <div id="job-site-map" className="map"></div>
              {mapError && <p className="map-error">{mapError}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="radius">Clock-in Radius (meters)</label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              min="10"
              max="1000"
              placeholder="100"
            />
            <small>Employees must be within this distance to clock in</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {jobSite ? 'Update Job Site' : 'Create Job Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSiteModal;
