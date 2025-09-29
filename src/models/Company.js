/**
 * Company data model and validation
 */

export const COMPANY_INDUSTRIES = {
  CONSTRUCTION: 'construction',
  HEALTHCARE: 'healthcare',
  RETAIL: 'retail',
  MANUFACTURING: 'manufacturing',
  TRANSPORTATION: 'transportation',
  SECURITY: 'security',
  CLEANING: 'cleaning',
  OTHER: 'other'
};

export const createCompany = (companyData) => {
  const {
    name,
    industry = COMPANY_INDUSTRIES.OTHER,
    address = '',
    phone = '',
    email = '',
    website = ''
  } = companyData;

  return {
    id: generateId(),
    name: name?.trim() || '',
    industry: industry,
    address: address?.trim() || '',
    phone: phone?.trim() || '',
    email: email?.trim() || '',
    website: website?.trim() || '',
    isActive: true,
    settings: {
      timezone: 'America/New_York',
      workWeekStart: 1, // Monday
      defaultClockInRadius: 100, // meters
      requirePhotoVerification: false,
      allowOvertime: true,
      maxDailyHours: 12
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const validateCompany = (companyData) => {
  const errors = [];

  // Required fields
  if (!companyData.name || companyData.name.trim().length === 0) {
    errors.push('Company name is required');
  }

  if (!companyData.industry) {
    errors.push('Industry is required');
  }

  if (!companyData.email || companyData.email.trim().length === 0) {
    errors.push('Company email is required');
  }

  // Format validation
  if (companyData.email && !isValidEmail(companyData.email)) {
    errors.push('Valid company email address is required');
  }

  if (companyData.website && !isValidUrl(companyData.website)) {
    errors.push('Valid website URL is required');
  }

  if (companyData.phone && !isValidPhone(companyData.phone)) {
    errors.push('Valid phone number is required');
  }

  if (companyData.industry && !Object.values(COMPANY_INDUSTRIES).includes(companyData.industry)) {
    errors.push('Valid industry is required');
  }

  // Length validation
  if (companyData.name && companyData.name.length > 100) {
    errors.push('Company name must be 100 characters or less');
  }

  if (companyData.address && companyData.address.length > 200) {
    errors.push('Address must be 200 characters or less');
  }

  if (companyData.email && companyData.email.length > 100) {
    errors.push('Email must be 100 characters or less');
  }

  if (companyData.website && companyData.website.length > 200) {
    errors.push('Website must be 200 characters or less');
  }

  if (companyData.phone && companyData.phone.length > 20) {
    errors.push('Phone number must be 20 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeCompany = (companyData) => {
  return {
    ...companyData,
    name: companyData.name?.trim() || '',
    address: companyData.address?.trim() || '',
    phone: companyData.phone?.trim() || '',
    email: companyData.email?.trim().toLowerCase() || '',
    website: companyData.website?.trim().toLowerCase() || '',
    industry: companyData.industry || COMPANY_INDUSTRIES.OTHER
  };
};

export const getIndustryDisplayName = (industry) => {
  const industryNames = {
    [COMPANY_INDUSTRIES.CONSTRUCTION]: 'Construction',
    [COMPANY_INDUSTRIES.HEALTHCARE]: 'Healthcare',
    [COMPANY_INDUSTRIES.RETAIL]: 'Retail',
    [COMPANY_INDUSTRIES.MANUFACTURING]: 'Manufacturing',
    [COMPANY_INDUSTRIES.TRANSPORTATION]: 'Transportation',
    [COMPANY_INDUSTRIES.SECURITY]: 'Security',
    [COMPANY_INDUSTRIES.CLEANING]: 'Cleaning Services',
    [COMPANY_INDUSTRIES.OTHER]: 'Other'
  };

  return industryNames[industry] || 'Unknown';
};

export const getIndustryIcon = (industry) => {
  const industryIcons = {
    [COMPANY_INDUSTRIES.CONSTRUCTION]: '🏗️',
    [COMPANY_INDUSTRIES.HEALTHCARE]: '🏥',
    [COMPANY_INDUSTRIES.RETAIL]: '🛍️',
    [COMPANY_INDUSTRIES.MANUFACTURING]: '🏭',
    [COMPANY_INDUSTRIES.TRANSPORTATION]: '🚚',
    [COMPANY_INDUSTRIES.SECURITY]: '🛡️',
    [COMPANY_INDUSTRIES.CLEANING]: '🧹',
    [COMPANY_INDUSTRIES.OTHER]: '🏢'
  };

  return industryIcons[industry] || '🏢';
};

export const updateCompanySettings = (company, settings) => {
  return {
    ...company,
    settings: {
      ...company.settings,
      ...settings
    },
    updatedAt: new Date().toISOString()
  };
};

export const getCompanyStats = (company, users, jobSites, timeEntries) => {
  const companyUsers = users.filter(user => user.companyId === company.id);
  const companyJobSites = jobSites.filter(site => site.companyId === company.id);
  const companyTimeEntries = timeEntries.filter(entry => entry.companyId === company.id);

  const totalUsers = companyUsers.length;
  const totalJobSites = companyJobSites.length;
  const totalTimeEntries = companyTimeEntries.length;
  const totalHours = companyTimeEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
  const activeTimeEntries = companyTimeEntries.filter(entry => entry.status === 'clocked_in').length;

  const thisWeek = getWeekRange(new Date());
  const thisWeekEntries = companyTimeEntries.filter(entry => 
    isWithinWeek(entry.createdAt, thisWeek.start, thisWeek.end)
  );
  const thisWeekHours = thisWeekEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);

  return {
    totalUsers,
    totalJobSites,
    totalTimeEntries,
    totalHours: Math.round(totalHours * 100) / 100,
    activeTimeEntries,
    thisWeekHours: Math.round(thisWeekHours * 100) / 100,
    thisWeekEntries: thisWeekEntries.length
  };
};

// Helper functions
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
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

