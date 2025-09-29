import React, { useState, useEffect } from 'react';
import { Clock, MapPin, LogOut, Menu, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDashboard = ({ onLogout }) => {
  const { user } = useAuth();
  const { 
    jobSites, 
    currentLocation, 
    getCurrentLocation, 
    calculateDistance, 
    clockIn, 
    clockOut, 
    getCurrentTimeEntry, 
    getUserTimeEntries 
  } = useData();
  
  const [currentTimeEntry, setCurrentTimeEntry] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);

  useEffect(() => {
    setCurrentTimeEntry(getCurrentTimeEntry());
    setTimeEntries(getUserTimeEntries());
    
    // Request location permission on mount
    const requestLocation = async () => {
      try {
        await getCurrentLocation();
      } catch (error) {
        console.warn('Initial location request failed:', error.message);
        // Don't show alert on initial load - user can use refresh button
      }
    };
    
    requestLocation();
  }, [getCurrentTimeEntry, getUserTimeEntries, getCurrentLocation]);

  const handleClockIn = async (jobSiteId) => {
    setIsLoading(true);
    try {
      // Get current location first
      const location = await getCurrentLocation();
      console.log('Current location:', location);
      
      // Find the job site
      const jobSite = jobSites.find(site => site.id === jobSiteId);
      if (!jobSite) {
        throw new Error('Job site not found');
      }
      
      // Calculate distance
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        jobSite.latitude,
        jobSite.longitude
      );
      
      console.log(`Distance to ${jobSite.name}: ${distance}m (radius: ${jobSite.radius}m)`);
      
      // Check if within radius
      if (distance > jobSite.radius) {
        throw new Error(`You are ${Math.round(distance)}m away from "${jobSite.name}". Please get within ${jobSite.radius}m to clock in.`);
      }
      
      // Proceed with clock in
      await clockIn(jobSiteId);
      setCurrentTimeEntry(getCurrentTimeEntry());
      setTimeEntries(getUserTimeEntries());
      
      alert(`Successfully clocked in at ${jobSite.name}!`);
    } catch (error) {
      console.error('Clock in error:', error);
      alert(`Clock in failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = () => {
    if (currentTimeEntry) {
      clockOut(currentTimeEntry.id);
      setCurrentTimeEntry(null);
      setTimeEntries(getUserTimeEntries());
    }
  };

  const handleRefreshLocation = async () => {
    setIsRefreshingLocation(true);
    try {
      await getCurrentLocation();
      alert('Location updated successfully!');
    } catch (error) {
      console.error('Location refresh error:', error);
      alert(`Failed to get location: ${error.message}`);
    } finally {
      setIsRefreshingLocation(false);
    }
  };

  const getJobSiteStatus = (jobSite) => {
    if (!currentLocation) return { status: 'loading', distance: 0, message: 'Getting location...' };
    
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      jobSite.latitude,
      jobSite.longitude
    );

    const roundedDistance = Math.round(distance);
    
    if (distance <= jobSite.radius) {
      return { 
        status: 'in_range', 
        distance: roundedDistance,
        message: `In range (${roundedDistance}m)`
      };
    } else {
      return { 
        status: 'out_of_range', 
        distance: roundedDistance,
        message: `Out of range (${roundedDistance}m)`
      };
    }
  };

  const getTotalHoursThisWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    return timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= startOfWeek && entryDate <= endOfWeek;
      })
      .reduce((total, entry) => total + (entry.totalHours || 0), 0);
  };

  const getTotalHoursThisMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= startOfMonth && entryDate <= endOfMonth;
      })
      .reduce((total, entry) => total + (entry.totalHours || 0), 0);
  };

  const getTotalHoursAllTime = () => {
    return timeEntries.reduce((total, entry) => total + (entry.totalHours || 0), 0);
  };

  const getHoursByJobSite = () => {
    const hoursBySite = {};
    timeEntries.forEach(entry => {
      const jobSite = jobSites.find(site => site.id === entry.jobSiteId);
      const siteName = jobSite ? jobSite.name : 'Unknown Site';
      if (!hoursBySite[siteName]) {
        hoursBySite[siteName] = 0;
      }
      hoursBySite[siteName] += entry.totalHours || 0;
    });
    return hoursBySite;
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <Clock size={24} />
            <span>TimeTracker</span>
          </div>
          <div className="user-info">
            <span>Welcome back, {user.firstName}!</span>
            <button className="btn btn-outline" onClick={onLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
          <button 
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Current Status */}
        <div className="card status-card">
          <h2>Current Status</h2>
          {currentTimeEntry ? (
            <div className="clocked-in-status">
              <CheckCircle size={48} className="status-icon success" />
              <div className="status-info">
                <h3>Clocked In</h3>
                <p>Since {formatTime(currentTimeEntry.clockInTime)}</p>
                <p>Job Site: {jobSites.find(site => site.id === currentTimeEntry.jobSiteId)?.name}</p>
                <button 
                  className="btn btn-danger"
                  onClick={handleClockOut}
                  disabled={isLoading}
                >
                  <Clock size={16} />
                  Clock Out
                </button>
              </div>
            </div>
          ) : (
            <div className="clocked-out-status">
              <AlertCircle size={48} className="status-icon warning" />
              <div className="status-info">
                <h3>Not Currently Clocked In</h3>
                <p>Select a job site below to clock in</p>
              </div>
            </div>
          )}
        </div>

        {/* Job Sites */}
        <div className="card">
          <div className="card-header">
            <h2>Available Job Sites</h2>
            <button 
              className="btn btn-outline btn-sm"
              onClick={handleRefreshLocation}
              disabled={isRefreshingLocation}
            >
              <RefreshCw size={16} className={isRefreshingLocation ? 'spinning' : ''} />
              {isRefreshingLocation ? 'Updating...' : 'Refresh Location'}
            </button>
          </div>
          <div className="job-sites-grid">
            {jobSites.map(jobSite => {
              const status = getJobSiteStatus(jobSite);
              const isClockedInHere = currentTimeEntry?.jobSiteId === jobSite.id;
              
              return (
                <div key={jobSite.id} className="job-site-card">
                  <div className="job-site-header">
                    <h3>{jobSite.name}</h3>
                    <div className={`status-badge ${status.status}`}>
                      {status.status === 'in_range' ? 'In Range' : 'Out of Range'}
                    </div>
                  </div>
                  
                  <div className="job-site-details">
                    <p className="address">{jobSite.fullAddress}</p>
                    <p className="distance">
                      {status.message}
                    </p>
                    <p className="coordinates">
                      Site: {jobSite.latitude.toFixed(4)}, {jobSite.longitude.toFixed(4)}
                    </p>
                  </div>

                  <div className="job-site-actions">
                    {isClockedInHere ? (
                      <button className="btn btn-success" disabled>
                        <CheckCircle size={16} />
                        Currently Clocked In
                      </button>
                    ) : status.status === 'in_range' ? (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleClockIn(jobSite.id)}
                        disabled={isLoading || currentTimeEntry}
                      >
                        <Clock size={16} />
                        Clock In
                      </button>
                    ) : (
                      <button className="btn btn-disabled" disabled>
                        <MapPin size={16} />
                        Get Closer to Clock In
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Entries */}
        <div className="card">
          <h2>Recent Time Entries</h2>
          <div className="time-entries">
            {timeEntries.length === 0 ? (
              <p className="no-entries">No time entries yet</p>
            ) : (
              timeEntries.slice(0, 10).map(entry => {
                const jobSite = jobSites.find(site => site.id === entry.jobSiteId);
                return (
                  <div key={entry.id} className="time-entry">
                    <div className="time-entry-info">
                      <h4>{jobSite?.name || 'Unknown Job Site'}</h4>
                      <p className="time-range">
                        {formatTime(entry.clockInTime)} - {entry.clockOutTime ? formatTime(entry.clockOutTime) : 'In Progress'}
                      </p>
                      <p className="entry-date">{formatDate(entry.createdAt)}</p>
                    </div>
                    <div className="time-entry-hours">
                      <span className="hours">{entry.totalHours || 0}h</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Hours Summary */}
        <div className="card summary-card">
          <h2>Hours Worked</h2>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-value">{getTotalHoursThisWeek().toFixed(1)}h</span>
              <span className="stat-label">This Week</span>
            </div>
            <div className="stat">
              <span className="stat-value">{getTotalHoursThisMonth().toFixed(1)}h</span>
              <span className="stat-label">This Month</span>
            </div>
            <div className="stat">
              <span className="stat-value">{getTotalHoursAllTime().toFixed(1)}h</span>
              <span className="stat-label">All Time</span>
            </div>
            <div className="stat">
              <span className="stat-value">{timeEntries.length}</span>
              <span className="stat-label">Total Entries</span>
            </div>
          </div>
        </div>

        {/* Hours by Job Site */}
        <div className="card">
          <h2>Hours by Job Site</h2>
          <div className="hours-by-site">
            {Object.keys(getHoursByJobSite()).length === 0 ? (
              <p className="no-data">No hours recorded yet</p>
            ) : (
              Object.entries(getHoursByJobSite()).map(([siteName, hours]) => (
                <div key={siteName} className="site-hours-item">
                  <div className="site-name">{siteName}</div>
                  <div className="site-hours">{hours.toFixed(1)}h</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
