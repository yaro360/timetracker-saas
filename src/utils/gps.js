/**
 * GPS and location utilities
 */

export const getCurrentLocation = (options = {}) => {
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5 minutes
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        resolve(location);
      },
      (error) => {
        let errorMessage = 'Unknown geolocation error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        console.error('Geolocation error:', error);
        reject(new Error(errorMessage));
      },
      mergedOptions
    );
  });
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

export const isWithinRadius = (userLat, userLng, siteLat, siteLng, radius) => {
  const distance = calculateDistance(userLat, userLng, siteLat, siteLng);
  return distance <= radius;
};

export const formatDistance = (distanceInMeters) => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  } else {
    const km = distanceInMeters / 1000;
    return `${km.toFixed(1)}km`;
  }
};

export const getLocationAccuracy = (accuracy) => {
  if (accuracy <= 10) {
    return { level: 'excellent', description: 'GPS accuracy' };
  } else if (accuracy <= 50) {
    return { level: 'good', description: 'Good accuracy' };
  } else if (accuracy <= 100) {
    return { level: 'fair', description: 'Fair accuracy' };
  } else {
    return { level: 'poor', description: 'Poor accuracy' };
  }
};

export const watchLocation = (callback, errorCallback, options = {}) => {
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000
  };

  const mergedOptions = { ...defaultOptions, ...options };

  if (!navigator.geolocation) {
    errorCallback(new Error('Geolocation is not supported by this browser'));
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
      callback(location);
    },
    (error) => {
      let errorMessage = 'Unknown geolocation error';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }
      
      errorCallback(new Error(errorMessage));
    },
    mergedOptions
  );
};

export const stopWatchingLocation = (watchId) => {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

export const getFallbackLocation = () => {
  // Default to New York City coordinates as fallback
  return {
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: 1000,
    isFallback: true
  };
};

export const requestLocationPermission = async () => {
  if (!navigator.permissions) {
    // Fallback for browsers that don't support permissions API
    return { granted: false, error: 'Permissions API not supported' };
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    
    if (permission.state === 'granted') {
      return { granted: true };
    } else if (permission.state === 'denied') {
      return { granted: false, error: 'Location permission denied' };
    } else {
      return { granted: false, error: 'Location permission not determined' };
    }
  } catch (error) {
    return { granted: false, error: error.message };
  }
};

