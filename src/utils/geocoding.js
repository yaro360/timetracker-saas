/**
 * Geocoding utilities for converting addresses to coordinates
 */

export const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') {
    throw new Error('Address is required and must be a string');
  }

  const geocodingServices = [
    {
      name: 'Nominatim',
      url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      parser: (data) => {
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            address: data[0].display_name
          };
        }
        return null;
      }
    },
    {
      name: 'Maps.co',
      url: `https://api.maps.co/geocoding/v1/search?q=${encodeURIComponent(address)}&api_key=YOUR_API_KEY`,
      parser: (data) => {
        if (data && data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          return {
            lat,
            lng,
            address: data.features[0].place_name
          };
        }
        return null;
      }
    }
  ];

  let lastError = null;

  for (const service of geocodingServices) {
    try {
      const response = await fetch(service.url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const result = service.parser(data);

      if (result) {
        return {
          ...result,
          service: service.name
        };
      }
    } catch (error) {
      console.warn(`Geocoding service ${service.name} failed:`, error);
      lastError = error;
      continue;
    }
  }

  throw new Error(`All geocoding services failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

export const reverseGeocode = async (lat, lng) => {
  if (!lat || !lng) {
    throw new Error('Latitude and longitude are required');
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data && data.display_name) {
      return {
        address: data.display_name,
        components: data.address || {}
      };
    }

    throw new Error('No address found for coordinates');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

export const formatAddress = (addressData) => {
  if (!addressData) return '';

  const {
    address1,
    address2,
    city,
    state,
    zipCode,
    country = 'United States'
  } = addressData;

  const parts = [address1];
  
  if (address2) {
    parts.push(address2);
  }
  
  if (city) {
    parts.push(city);
  }
  
  if (state) {
    parts.push(state);
  }
  
  if (zipCode) {
    parts.push(zipCode);
  }
  
  if (country && country !== 'United States') {
    parts.push(country);
  }

  return parts.join(', ');
};

export const validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return { valid: false, error: 'Invalid coordinate format' };
  }

  if (latitude < -90 || latitude > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }

  if (longitude < -180 || longitude > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }

  return { valid: true, lat: latitude, lng: longitude };
};

