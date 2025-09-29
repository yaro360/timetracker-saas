/**
 * Data management utilities for localStorage operations
 */

export const STORAGE_KEYS = {
  USERS: 'users',
  COMPANIES: 'companies',
  JOB_SITES: 'jobSites',
  TIME_ENTRIES: 'timeEntries',
  CURRENT_USER: 'currentUser'
};

export const getStorageData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
};

export const addStorageItem = (key, item) => {
  const data = getStorageData(key);
  const newItem = {
    ...item,
    id: item.id || generateId(),
    createdAt: item.createdAt || new Date().toISOString()
  };
  
  data.push(newItem);
  setStorageData(key, data);
  return newItem;
};

export const updateStorageItem = (key, id, updates) => {
  const data = getStorageData(key);
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    setStorageData(key, data);
    return data[index];
  }
  
  return null;
};

export const deleteStorageItem = (key, id) => {
  const data = getStorageData(key);
  const filteredData = data.filter(item => item.id !== id);
  setStorageData(key, filteredData);
  return true;
};

export const findStorageItem = (key, predicate) => {
  const data = getStorageData(key);
  return data.find(predicate);
};

export const filterStorageItems = (key, predicate) => {
  const data = getStorageData(key);
  return data.filter(predicate);
};

export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const validateUser = (userData) => {
  const errors = [];

  if (!userData.firstName || userData.firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!userData.lastName || userData.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if (!userData.username || userData.username.trim().length === 0) {
    errors.push('Username is required');
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('Valid email is required');
  }

  if (!userData.role || !['owner', 'manager', 'employee'].includes(userData.role)) {
    errors.push('Valid role is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCompany = (companyData) => {
  const errors = [];

  if (!companyData.name || companyData.name.trim().length === 0) {
    errors.push('Company name is required');
  }

  if (!companyData.industry || companyData.industry.trim().length === 0) {
    errors.push('Industry is required');
  }

  if (!companyData.email || !isValidEmail(companyData.email)) {
    errors.push('Valid company email is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateJobSite = (jobSiteData) => {
  const errors = [];

  if (!jobSiteData.name || jobSiteData.name.trim().length === 0) {
    errors.push('Job site name is required');
  }

  if (!jobSiteData.latitude || isNaN(parseFloat(jobSiteData.latitude))) {
    errors.push('Valid latitude is required');
  }

  if (!jobSiteData.longitude || isNaN(parseFloat(jobSiteData.longitude))) {
    errors.push('Valid longitude is required');
  }

  if (!jobSiteData.radius || isNaN(parseInt(jobSiteData.radius)) || parseInt(jobSiteData.radius) < 10) {
    errors.push('Valid radius (minimum 10m) is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  try {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return 'Invalid time';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return 'Invalid date/time';
  }
};

export const calculateHours = (clockInTime, clockOutTime) => {
  if (!clockInTime) return 0;
  
  const start = new Date(clockInTime);
  const end = clockOutTime ? new Date(clockOutTime) : new Date();
  
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
};

export const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const getWeekEnd = (date = new Date()) => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
};

export const isWithinWeek = (date, weekStart, weekEnd) => {
  const d = new Date(date);
  return d >= weekStart && d <= weekEnd;
};

export const getTimeEntriesForWeek = (timeEntries, weekStart, weekEnd) => {
  return timeEntries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return isWithinWeek(entryDate, weekStart, weekEnd);
  });
};

export const calculateWeeklyHours = (timeEntries, weekStart, weekEnd) => {
  const weekEntries = getTimeEntriesForWeek(timeEntries, weekStart, weekEnd);
  return weekEntries.reduce((total, entry) => total + (entry.totalHours || 0), 0);
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export const exportAllData = () => {
  const data = {
    users: getStorageData(STORAGE_KEYS.USERS),
    companies: getStorageData(STORAGE_KEYS.COMPANIES),
    jobSites: getStorageData(STORAGE_KEYS.JOB_SITES),
    timeEntries: getStorageData(STORAGE_KEYS.TIME_ENTRIES),
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `timetracker-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

