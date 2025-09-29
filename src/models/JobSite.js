/**
 * Job Site data model and validation
 */

export const createJobSite = (jobSiteData) => {
  const {
    name,
    address1 = '',
    address2 = '',
    city = '',
    state = '',
    zipCode = '',
    country = 'United States',
    latitude,
    longitude,
    radius = 100,
    companyId,
    createdBy
  } = jobSiteData;

  const fullAddress = formatFullAddress({
    address1,
    address2,
    city,
    state,
    zipCode,
    country
  });

  return {
    id: generateId(),
    name: name?.trim() || '',
    address1: address1?.trim() || '',
    address2: address2?.trim() || '',
    city: city?.trim() || '',
    state: state?.trim() || '',
    zipCode: zipCode?.trim() || '',
    country: country?.trim() || 'United States',
    fullAddress: fullAddress,
    latitude: parseFloat(latitude) || 0,
    longitude: parseFloat(longitude) || 0,
    radius: parseInt(radius) || 100,
    companyId: companyId,
    createdBy: createdBy,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const validateJobSite = (jobSiteData) => {
  const errors = [];

  // Required fields
  if (!jobSiteData.name || jobSiteData.name.trim().length === 0) {
    errors.push('Job site name is required');
  }

  if (!jobSiteData.latitude || isNaN(parseFloat(jobSiteData.latitude))) {
    errors.push('Valid latitude is required');
  }

  if (!jobSiteData.longitude || isNaN(parseFloat(jobSiteData.longitude))) {
    errors.push('Valid longitude is required');
  }

  if (!jobSiteData.companyId) {
    errors.push('Company ID is required');
  }

  if (!jobSiteData.createdBy) {
    errors.push('Created by user ID is required');
  }

  // Coordinate validation
  const lat = parseFloat(jobSiteData.latitude);
  const lng = parseFloat(jobSiteData.longitude);

  if (lat < -90 || lat > 90) {
    errors.push('Latitude must be between -90 and 90 degrees');
  }

  if (lng < -180 || lng > 180) {
    errors.push('Longitude must be between -180 and 180 degrees');
  }

  // Radius validation
  const radius = parseInt(jobSiteData.radius);
  if (isNaN(radius) || radius < 10 || radius > 1000) {
    errors.push('Radius must be between 10 and 1000 meters');
  }

  // Length validation
  if (jobSiteData.name && jobSiteData.name.length > 100) {
    errors.push('Job site name must be 100 characters or less');
  }

  if (jobSiteData.address1 && jobSiteData.address1.length > 100) {
    errors.push('Address line 1 must be 100 characters or less');
  }

  if (jobSiteData.address2 && jobSiteData.address2.length > 100) {
    errors.push('Address line 2 must be 100 characters or less');
  }

  if (jobSiteData.city && jobSiteData.city.length > 50) {
    errors.push('City must be 50 characters or less');
  }

  if (jobSiteData.state && jobSiteData.state.length > 50) {
    errors.push('State must be 50 characters or less');
  }

  if (jobSiteData.zipCode && jobSiteData.zipCode.length > 20) {
    errors.push('ZIP code must be 20 characters or less');
  }

  if (jobSiteData.country && jobSiteData.country.length > 50) {
    errors.push('Country must be 50 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeJobSite = (jobSiteData) => {
  return {
    ...jobSiteData,
    name: jobSiteData.name?.trim() || '',
    address1: jobSiteData.address1?.trim() || '',
    address2: jobSiteData.address2?.trim() || '',
    city: jobSiteData.city?.trim() || '',
    state: jobSiteData.state?.trim() || '',
    zipCode: jobSiteData.zipCode?.trim() || '',
    country: jobSiteData.country?.trim() || 'United States',
    latitude: parseFloat(jobSiteData.latitude) || 0,
    longitude: parseFloat(jobSiteData.longitude) || 0,
    radius: parseInt(jobSiteData.radius) || 100
  };
};

export const formatFullAddress = (addressData) => {
  const {
    address1,
    address2,
    city,
    state,
    zipCode,
    country = 'United States'
  } = addressData;

  const parts = [];

  if (address1) parts.push(address1);
  if (address2) parts.push(address2);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zipCode) parts.push(zipCode);
  if (country && country !== 'United States') parts.push(country);

  return parts.join(', ');
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

export const isWithinRadius = (userLat, userLng, jobSite) => {
  const distance = calculateDistance(
    userLat,
    userLng,
    jobSite.latitude,
    jobSite.longitude
  );
  return distance <= jobSite.radius;
};

export const getDistanceToJobSite = (userLat, userLng, jobSite) => {
  return calculateDistance(
    userLat,
    userLng,
    jobSite.latitude,
    jobSite.longitude
  );
};

export const formatDistance = (distanceInMeters) => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  } else {
    const km = distanceInMeters / 1000;
    return `${km.toFixed(1)}km`;
  }
};

export const getJobSiteStatus = (userLat, userLng, jobSite) => {
  const distance = getDistanceToJobSite(userLat, userLng, jobSite);
  
  if (distance <= jobSite.radius) {
    return {
      status: 'in_range',
      distance: Math.round(distance),
      message: `In range (${formatDistance(distance)})`
    };
  } else {
    return {
      status: 'out_of_range',
      distance: Math.round(distance),
      message: `Out of range (${formatDistance(distance)})`
    };
  }
};

export const getJobSiteStats = (jobSite, timeEntries) => {
  const siteTimeEntries = timeEntries.filter(entry => entry.jobSiteId === jobSite.id);
  
  const totalEntries = siteTimeEntries.length;
  const totalHours = siteTimeEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
  const activeEntries = siteTimeEntries.filter(entry => entry.status === 'clocked_in').length;
  
  const thisWeek = getWeekRange(new Date());
  const thisWeekEntries = siteTimeEntries.filter(entry => 
    isWithinWeek(entry.createdAt, thisWeek.start, thisWeek.end)
  );
  const thisWeekHours = thisWeekEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);

  return {
    totalEntries,
    totalHours: Math.round(totalHours * 100) / 100,
    activeEntries,
    thisWeekEntries: thisWeekEntries.length,
    thisWeekHours: Math.round(thisWeekHours * 100) / 100
  };
};

// Helper functions
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const getWeekRange = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const start = new Date(d.setDate(diff));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

const isWithinWeek = (dateString, weekStart, weekEnd) => {
  const date = new Date(dateString);
  return date >= weekStart && date <= weekEnd;
};

