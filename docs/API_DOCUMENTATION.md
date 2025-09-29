# TimeTracker API Documentation

## Data Models

### Company Model
```javascript
{
  id: string,              // Unique identifier
  name: string,            // Company name
  industry: string,        // Industry type
  address: string,         // Company address
  phone: string,           // Contact phone
  email: string,           // Contact email
  createdAt: string        // ISO date string
}
```

### User Model
```javascript
{
  id: string,              // Unique identifier
  username: string,        // Login username
  email: string,           // User email
  password: string,        // Hashed password
  role: string,            // 'owner', 'manager', 'employee'
  companyId: string,       // Reference to company
  firstName: string,       // First name
  lastName: string,        // Last name
  createdAt: string        // ISO date string
}
```

### Job Site Model
```javascript
{
  id: string,              // Unique identifier
  name: string,            // Site name
  address1: string,        // Primary address
  address2: string,        // Secondary address (optional)
  city: string,            // City
  state: string,           // State/Province
  zipCode: string,         // ZIP/Postal code
  country: string,         // Country
  fullAddress: string,     // Complete formatted address
  latitude: number,        // GPS latitude
  longitude: number,       // GPS longitude
  radius: number,          // Allowed radius in meters (default: 100)
  companyId: string,       // Reference to company
  createdBy: string,       // User ID who created
  createdAt: string        // ISO date string
}
```

### Time Entry Model
```javascript
{
  id: string,              // Unique identifier
  userId: string,          // Reference to user
  jobSiteId: string,       // Reference to job site
  companyId: string,       // Reference to company
  clockInTime: string,     // ISO date string
  clockOutTime: string,    // ISO date string (null if still clocked in)
  totalHours: number,      // Calculated hours worked
  status: string,          // 'clocked_in', 'clocked_out'
  clockInLocation: {       // GPS location at clock in
    latitude: number,
    longitude: number
  },
  clockOutLocation: {      // GPS location at clock out
    latitude: number,
    longitude: number
  },
  createdAt: string        // ISO date string
}
```

## LocalStorage Structure

### Storage Keys
- `timetracker_companies`: Array of company objects
- `timetracker_users`: Array of user objects
- `timetracker_jobsites`: Array of job site objects
- `timetracker_timeentries`: Array of time entry objects
- `timetracker_current_user`: Currently logged in user object

### Data Operations

#### Create Company
```javascript
function createCompany(companyData) {
  const companies = JSON.parse(localStorage.getItem('timetracker_companies') || '[]');
  const newCompany = {
    id: generateId(),
    ...companyData,
    createdAt: new Date().toISOString()
  };
  companies.push(newCompany);
  localStorage.setItem('timetracker_companies', JSON.stringify(companies));
  return newCompany;
}
```

#### Create User
```javascript
function createUser(userData) {
  const users = JSON.parse(localStorage.getItem('timetracker_users') || '[]');
  const newUser = {
    id: generateId(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem('timetracker_users', JSON.stringify(users));
  return newUser;
}
```

#### Authentication
```javascript
function authenticateUser(username, password) {
  const users = JSON.parse(localStorage.getItem('timetracker_users') || '[]');
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('timetracker_current_user', JSON.stringify(user));
    return user;
  }
  return null;
}
```

## GPS & Location Services

### Geolocation API Usage
```javascript
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}
```

### Distance Calculation
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}
```

## Geocoding Services

### Primary Geocoding (Nominatim)
```javascript
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  
  return null;
}
```

### Fallback Geocoding Services
- Maps.co API
- Mapbox Geocoding API
- Google Geocoding API (requires API key)

## Map Integration

### Leaflet.js Setup
```javascript
function initializeMap(containerId, lat = 40.7128, lng = -74.0060) {
  const map = L.map(containerId).setView([lat, lng], 13);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  return map;
}
```

### Adding Markers
```javascript
function addJobSiteMarker(map, jobSite) {
  const marker = L.marker([jobSite.latitude, jobSite.longitude])
    .addTo(map)
    .bindPopup(`
      <strong>${jobSite.name}</strong><br>
      ${jobSite.fullAddress}
    `);
  
  return marker;
}
```

## Security Considerations

### Input Validation
```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  return input.replace(/[<>\"']/g, '');
}
```

### Role-Based Access Control
```javascript
function hasPermission(user, action, resource) {
  const permissions = {
    owner: ['create', 'read', 'update', 'delete'],
    manager: ['create', 'read', 'update', 'delete'],
    employee: ['read']
  };
  
  return permissions[user.role]?.includes(action);
}
```

## Error Handling

### GPS Errors
```javascript
function handleLocationError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      return "Location access denied by user";
    case error.POSITION_UNAVAILABLE:
      return "Location information unavailable";
    case error.TIMEOUT:
      return "Location request timed out";
    default:
      return "Unknown location error";
  }
}
```

### Network Errors
```javascript
function handleNetworkError(error) {
  if (!navigator.onLine) {
    return "No internet connection";
  }
  return "Network error occurred";
}
```

## Performance Optimization

### Debounced Location Updates
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedLocationUpdate = debounce(updateLocation, 1000);
```

### Efficient Data Queries
```javascript
function getCompanyUsers(companyId) {
  const users = JSON.parse(localStorage.getItem('timetracker_users') || '[]');
  return users.filter(user => user.companyId === companyId);
}

function getUserTimeEntries(userId, startDate, endDate) {
  const entries = JSON.parse(localStorage.getItem('timetracker_timeentries') || '[]');
  return entries.filter(entry => 
    entry.userId === userId &&
    new Date(entry.createdAt) >= startDate &&
    new Date(entry.createdAt) <= endDate
  );
}
```

