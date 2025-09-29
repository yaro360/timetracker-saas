/**
 * Time Entry data model and validation
 */

export const TIME_ENTRY_STATUS = {
  CLOCKED_IN: 'clocked_in',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const createTimeEntry = (timeEntryData) => {
  const {
    userId,
    jobSiteId,
    companyId,
    clockInTime = new Date().toISOString(),
    clockOutTime = null,
    totalHours = 0,
    status = TIME_ENTRY_STATUS.CLOCKED_IN,
    notes = ''
  } = timeEntryData;

  return {
    id: generateId(),
    userId: userId,
    jobSiteId: jobSiteId,
    companyId: companyId,
    clockInTime: clockInTime,
    clockOutTime: clockOutTime,
    totalHours: parseFloat(totalHours) || 0,
    status: status,
    notes: notes?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const validateTimeEntry = (timeEntryData) => {
  const errors = [];

  // Required fields
  if (!timeEntryData.userId) {
    errors.push('User ID is required');
  }

  if (!timeEntryData.jobSiteId) {
    errors.push('Job site ID is required');
  }

  if (!timeEntryData.companyId) {
    errors.push('Company ID is required');
  }

  if (!timeEntryData.clockInTime) {
    errors.push('Clock in time is required');
  }

  // Status validation
  if (timeEntryData.status && !Object.values(TIME_ENTRY_STATUS).includes(timeEntryData.status)) {
    errors.push('Valid status is required');
  }

  // Time validation
  if (timeEntryData.clockInTime && !isValidDate(timeEntryData.clockInTime)) {
    errors.push('Valid clock in time is required');
  }

  if (timeEntryData.clockOutTime && !isValidDate(timeEntryData.clockOutTime)) {
    errors.push('Valid clock out time is required');
  }

  // Clock out time must be after clock in time
  if (timeEntryData.clockInTime && timeEntryData.clockOutTime) {
    const clockIn = new Date(timeEntryData.clockInTime);
    const clockOut = new Date(timeEntryData.clockOutTime);
    
    if (clockOut <= clockIn) {
      errors.push('Clock out time must be after clock in time');
    }
  }

  // Hours validation
  if (timeEntryData.totalHours !== undefined) {
    const hours = parseFloat(timeEntryData.totalHours);
    if (isNaN(hours) || hours < 0) {
      errors.push('Total hours must be a positive number');
    }
    
    if (hours > 24) {
      errors.push('Total hours cannot exceed 24 hours per day');
    }
  }

  // Notes length validation
  if (timeEntryData.notes && timeEntryData.notes.length > 500) {
    errors.push('Notes must be 500 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeTimeEntry = (timeEntryData) => {
  return {
    ...timeEntryData,
    totalHours: parseFloat(timeEntryData.totalHours) || 0,
    status: timeEntryData.status || TIME_ENTRY_STATUS.CLOCKED_IN,
    notes: timeEntryData.notes?.trim() || ''
  };
};

export const calculateHours = (clockInTime, clockOutTime) => {
  if (!clockInTime) return 0;
  
  const start = new Date(clockInTime);
  const end = clockOutTime ? new Date(clockOutTime) : new Date();
  
  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
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

export const getTimeEntryDuration = (timeEntry) => {
  if (!timeEntry.clockInTime) return 'N/A';
  
  const clockIn = new Date(timeEntry.clockInTime);
  const clockOut = timeEntry.clockOutTime ? new Date(timeEntry.clockOutTime) : new Date();
  
  const diffMs = clockOut - clockIn;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};

export const isCurrentlyClockedIn = (timeEntry) => {
  return timeEntry && timeEntry.status === TIME_ENTRY_STATUS.CLOCKED_IN;
};

export const canClockOut = (timeEntry) => {
  return isCurrentlyClockedIn(timeEntry);
};

export const canClockIn = (timeEntry) => {
  return !timeEntry || timeEntry.status !== TIME_ENTRY_STATUS.CLOCKED_IN;
};

export const clockOutTimeEntry = (timeEntry) => {
  if (!canClockOut(timeEntry)) {
    throw new Error('Cannot clock out - not currently clocked in');
  }

  const clockOutTime = new Date().toISOString();
  const totalHours = calculateHours(timeEntry.clockInTime, clockOutTime);

  return {
    ...timeEntry,
    clockOutTime: clockOutTime,
    totalHours: totalHours,
    status: TIME_ENTRY_STATUS.COMPLETED,
    updatedAt: new Date().toISOString()
  };
};

export const getTimeEntryStats = (timeEntries, userId = null, jobSiteId = null) => {
  let filteredEntries = timeEntries;

  if (userId) {
    filteredEntries = filteredEntries.filter(entry => entry.userId === userId);
  }

  if (jobSiteId) {
    filteredEntries = filteredEntries.filter(entry => entry.jobSiteId === jobSiteId);
  }

  const totalEntries = filteredEntries.length;
  const totalHours = filteredEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
  const activeEntries = filteredEntries.filter(entry => entry.status === TIME_ENTRY_STATUS.CLOCKED_IN).length;
  const completedEntries = filteredEntries.filter(entry => entry.status === TIME_ENTRY_STATUS.COMPLETED).length;

  const thisWeek = getWeekRange(new Date());
  const thisWeekEntries = filteredEntries.filter(entry => 
    isWithinWeek(entry.createdAt, thisWeek.start, thisWeek.end)
  );
  const thisWeekHours = thisWeekEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);

  const thisMonth = getMonthRange(new Date());
  const thisMonthEntries = filteredEntries.filter(entry => 
    isWithinMonth(entry.createdAt, thisMonth.start, thisMonth.end)
  );
  const thisMonthHours = thisMonthEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);

  return {
    totalEntries,
    totalHours: Math.round(totalHours * 100) / 100,
    activeEntries,
    completedEntries,
    thisWeekEntries: thisWeekEntries.length,
    thisWeekHours: Math.round(thisWeekHours * 100) / 100,
    thisMonthEntries: thisMonthEntries.length,
    thisMonthHours: Math.round(thisMonthHours * 100) / 100
  };
};

export const getTimeEntriesForPeriod = (timeEntries, startDate, endDate) => {
  return timeEntries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate >= startDate && entryDate <= endDate;
  });
};

export const exportTimeEntriesToCSV = (timeEntries, users, jobSites) => {
  const csvData = timeEntries.map(entry => {
    const user = users.find(u => u.id === entry.userId);
    const jobSite = jobSites.find(s => s.id === entry.jobSiteId);
    
    return {
      'Employee Name': user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      'Job Site': jobSite ? jobSite.name : 'Unknown',
      'Clock In': formatDateTime(entry.clockInTime),
      'Clock Out': entry.clockOutTime ? formatDateTime(entry.clockOutTime) : 'In Progress',
      'Total Hours': entry.totalHours,
      'Status': entry.status,
      'Date': formatDate(entry.createdAt),
      'Notes': entry.notes
    };
  });

  return csvData;
};

// Helper functions
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
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

const getMonthRange = (date) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start, end };
};

const isWithinWeek = (dateString, weekStart, weekEnd) => {
  const date = new Date(dateString);
  return date >= weekStart && date <= weekEnd;
};

const isWithinMonth = (dateString, monthStart, monthEnd) => {
  const date = new Date(dateString);
  return date >= monthStart && date <= monthEnd;
};

