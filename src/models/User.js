/**
 * User data model and validation
 */

export const USER_ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

export const createUser = (userData) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    role = USER_ROLES.EMPLOYEE,
    companyId = null
  } = userData;

  return {
    id: generateId(),
    firstName: firstName?.trim() || '',
    lastName: lastName?.trim() || '',
    username: username?.trim() || '',
    email: email?.trim() || '',
    password: password || '',
    role: role,
    companyId: companyId,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const validateUser = (userData) => {
  const errors = [];

  // Required fields
  if (!userData.firstName || userData.firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (!userData.lastName || userData.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }

  if (!userData.username || userData.username.trim().length === 0) {
    errors.push('Username is required');
  }

  if (!userData.email || userData.email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!userData.role) {
    errors.push('Role is required');
  }

  // Format validation
  if (userData.email && !isValidEmail(userData.email)) {
    errors.push('Valid email address is required');
  }

  if (userData.role && !Object.values(USER_ROLES).includes(userData.role)) {
    errors.push('Valid role is required');
  }

  // Length validation
  if (userData.firstName && userData.firstName.length > 50) {
    errors.push('First name must be 50 characters or less');
  }

  if (userData.lastName && userData.lastName.length > 50) {
    errors.push('Last name must be 50 characters or less');
  }

  if (userData.username && userData.username.length > 30) {
    errors.push('Username must be 30 characters or less');
  }

  if (userData.email && userData.email.length > 100) {
    errors.push('Email must be 100 characters or less');
  }

  // Username format validation
  if (userData.username && !/^[a-zA-Z0-9_-]+$/.test(userData.username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeUser = (userData) => {
  return {
    ...userData,
    firstName: userData.firstName?.trim() || '',
    lastName: userData.lastName?.trim() || '',
    username: userData.username?.trim().toLowerCase() || '',
    email: userData.email?.trim().toLowerCase() || '',
    role: userData.role || USER_ROLES.EMPLOYEE
  };
};

export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  return `${user.firstName} ${user.lastName}`.trim() || user.username || 'Unknown User';
};

export const getUserInitials = (user) => {
  if (!user) return '??';
  
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }
  
  if (lastName) {
    return lastName.charAt(0).toUpperCase();
  }
  
  return user.username?.charAt(0).toUpperCase() || '?';
};

export const canManageUsers = (userRole) => {
  return userRole === USER_ROLES.OWNER || userRole === USER_ROLES.MANAGER;
};

export const canManageJobSites = (userRole) => {
  return userRole === USER_ROLES.OWNER || userRole === USER_ROLES.MANAGER;
};

export const canViewAllTimeEntries = (userRole) => {
  return userRole === USER_ROLES.OWNER || userRole === USER_ROLES.MANAGER;
};

export const canManageCompany = (userRole) => {
  return userRole === USER_ROLES.OWNER;
};

// Helper functions
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

