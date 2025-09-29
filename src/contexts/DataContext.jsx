import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobSites, setJobSites] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadData = () => {
    try {
      const companiesData = JSON.parse(localStorage.getItem('companies') || '[]');
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      const jobSitesData = JSON.parse(localStorage.getItem('jobSites') || '[]');
      const timeEntriesData = JSON.parse(localStorage.getItem('timeEntries') || '[]');

      setCompanies(companiesData);
      setUsers(usersData);
      setJobSites(jobSitesData);
      setTimeEntries(timeEntriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadUserData = () => {
    if (!user) return;

    try {
      const allCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const allJobSites = JSON.parse(localStorage.getItem('jobSites') || '[]');
      const allTimeEntries = JSON.parse(localStorage.getItem('timeEntries') || '[]');

      // Filter data based on user's company
      const userCompany = allCompanies.find(c => c.id === user.companyId);
      const companyUsers = allUsers.filter(u => u.companyId === user.companyId);
      const companyJobSites = allJobSites.filter(j => j.companyId === user.companyId);
      const companyTimeEntries = allTimeEntries.filter(t => t.companyId === user.companyId);

      setCompanies(userCompany ? [userCompany] : []);
      setUsers(companyUsers);
      setJobSites(companyJobSites);
      setTimeEntries(companyTimeEntries);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported by this browser. Please use a modern browser with GPS support.');
        console.error(error);
        reject(error);
        return;
      }

      console.log('Requesting location permission...');
      
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
          
          console.log('Location obtained:', location);
          setCurrentLocation(location);
          resolve(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          let errorMessage = 'Unknown geolocation error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please allow location access in your browser settings and refresh the page.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your GPS settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }
          
          // Don't use fallback location - let user know they need to enable location
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000 // 1 minute
        }
      );
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

  const addJobSite = (jobSiteData) => {
    try {
      const newJobSite = {
        id: Date.now().toString(),
        ...jobSiteData,
        companyId: user.companyId,
        createdBy: user.id,
        createdAt: new Date().toISOString()
      };

      const updatedJobSites = [...jobSites, newJobSite];
      setJobSites(updatedJobSites);
      localStorage.setItem('jobSites', JSON.stringify(updatedJobSites));

      return newJobSite;
    } catch (error) {
      console.error('Error adding job site:', error);
      return null;
    }
  };

  const updateJobSite = (jobSiteId, updates) => {
    try {
      const updatedJobSites = jobSites.map(site => 
        site.id === jobSiteId ? { ...site, ...updates } : site
      );
      setJobSites(updatedJobSites);
      localStorage.setItem('jobSites', JSON.stringify(updatedJobSites));
      return true;
    } catch (error) {
      console.error('Error updating job site:', error);
      return false;
    }
  };

  const deleteJobSite = (jobSiteId) => {
    try {
      const updatedJobSites = jobSites.filter(site => site.id !== jobSiteId);
      setJobSites(updatedJobSites);
      localStorage.setItem('jobSites', JSON.stringify(updatedJobSites));
      return true;
    } catch (error) {
      console.error('Error deleting job site:', error);
      return false;
    }
  };

  const addUser = (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        companyId: user.companyId,
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Update global users list
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      allUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(allUsers));

      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  };

  const updateUser = (userId, updates) => {
    try {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      );
      setUsers(updatedUsers);
      
      // Update global users list
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedAllUsers = allUsers.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedAllUsers));
      
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const deleteUser = (userId) => {
    try {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      
      // Update global users list
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedAllUsers = allUsers.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedAllUsers));
      
      // Remove time entries for deleted user
      const updatedTimeEntries = timeEntries.filter(t => t.userId !== userId);
      setTimeEntries(updatedTimeEntries);
      localStorage.setItem('timeEntries', JSON.stringify(updatedTimeEntries));
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  const clockIn = async (jobSiteId) => {
    try {
      const location = await getCurrentLocation();
      const jobSite = jobSites.find(site => site.id === jobSiteId);
      
      if (!jobSite) {
        throw new Error('Job site not found');
      }

      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        jobSite.latitude,
        jobSite.longitude
      );

      if (distance > jobSite.radius) {
        throw new Error(`You are ${Math.round(distance)}m away from the job site. Please get closer to clock in.`);
      }

      const newTimeEntry = {
        id: Date.now().toString(),
        userId: user.id,
        jobSiteId: jobSiteId,
        companyId: user.companyId,
        clockInTime: new Date().toISOString(),
        clockOutTime: null,
        totalHours: 0,
        status: 'clocked_in',
        createdAt: new Date().toISOString()
      };

      const updatedTimeEntries = [...timeEntries, newTimeEntry];
      setTimeEntries(updatedTimeEntries);
      localStorage.setItem('timeEntries', JSON.stringify(updatedTimeEntries));

      return newTimeEntry;
    } catch (error) {
      console.error('Error clocking in:', error);
      throw error;
    }
  };

  const clockOut = (timeEntryId) => {
    try {
      const timeEntry = timeEntries.find(t => t.id === timeEntryId);
      if (!timeEntry) {
        throw new Error('Time entry not found');
      }

      const clockOutTime = new Date();
      const clockInTime = new Date(timeEntry.clockInTime);
      const totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);

      const updatedTimeEntries = timeEntries.map(t => 
        t.id === timeEntryId 
          ? { 
              ...t, 
              clockOutTime: clockOutTime.toISOString(),
              totalHours: Math.round(totalHours * 100) / 100,
              status: 'completed'
            }
          : t
      );
      
      setTimeEntries(updatedTimeEntries);
      localStorage.setItem('timeEntries', JSON.stringify(updatedTimeEntries));

      return true;
    } catch (error) {
      console.error('Error clocking out:', error);
      return false;
    }
  };

  const getCurrentTimeEntry = () => {
    return timeEntries.find(t => t.userId === user.id && t.status === 'clocked_in');
  };

  const getUserTimeEntries = (userId = user.id) => {
    return timeEntries.filter(t => t.userId === userId);
  };

  const getJobSiteTimeEntries = (jobSiteId) => {
    return timeEntries.filter(t => t.jobSiteId === jobSiteId);
  };

  const getCompanyStats = () => {
    const totalUsers = users.length;
    const totalJobSites = jobSites.length;
    const totalTimeEntries = timeEntries.length;
    const totalHours = timeEntries.reduce((sum, t) => sum + (t.totalHours || 0), 0);
    const activeTimeEntries = timeEntries.filter(t => t.status === 'clocked_in').length;

    return {
      totalUsers,
      totalJobSites,
      totalTimeEntries,
      totalHours: Math.round(totalHours * 100) / 100,
      activeTimeEntries
    };
  };

  const value = {
    companies,
    users,
    jobSites,
    timeEntries,
    currentLocation,
    getCurrentLocation,
    calculateDistance,
    addJobSite,
    updateJobSite,
    deleteJobSite,
    addUser,
    updateUser,
    deleteUser,
    clockIn,
    clockOut,
    getCurrentTimeEntry,
    getUserTimeEntries,
    getJobSiteTimeEntries,
    getCompanyStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
