import React, { useState } from 'react';
import { Building2, UserPlus, Eye, EyeOff } from 'lucide-react';

const CompanyRegistration = ({ onCompanyRegistration }) => {
  const [step, setStep] = useState(1);
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: 'construction',
    address: '',
    phone: '',
    email: ''
  });
  const [ownerData, setOwnerData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const industries = [
    { value: 'construction', label: 'Construction' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'security', label: 'Security' },
    { value: 'cleaning', label: 'Cleaning Services' },
    { value: 'other', label: 'Other' }
  ];

  const handleCompanyChange = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value
    });
  };

  const handleOwnerChange = (e) => {
    setOwnerData({
      ...ownerData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate company data
      if (!companyData.name || !companyData.industry || !companyData.email) {
        alert('Please fill in all required company fields');
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (ownerData.password !== ownerData.confirmPassword) {
      alert('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (ownerData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const success = onCompanyRegistration(companyData, {
        ...ownerData,
        role: 'owner'
      });
      
      if (!success) {
        alert('Company registration failed. Username or email may already exist.');
      }
    } catch (error) {
      console.error('Company registration error:', error);
      alert('Company registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="company-registration">
      <div className="step-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Company Info</div>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Owner Account</div>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="form">
          <div className="form-header">
            <Building2 size={32} className="form-icon" />
            <h2>Company Information</h2>
            <p>Tell us about your company</p>
          </div>

          <div className="form-group">
            <label htmlFor="name">Company Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={companyData.name}
              onChange={handleCompanyChange}
              required
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industry *</label>
            <select
              id="industry"
              name="industry"
              value={companyData.industry}
              onChange={handleCompanyChange}
              required
            >
              {industries.map(industry => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Company Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={companyData.address}
              onChange={handleCompanyChange}
              placeholder="Enter company address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={companyData.phone}
                onChange={handleCompanyChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Company Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={companyData.email}
                onChange={handleCompanyChange}
                required
                placeholder="Enter company email"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Next: Owner Account
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-header">
            <UserPlus size={32} className="form-icon" />
            <h2>Owner Account</h2>
            <p>Create your owner account for {companyData.name}</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={ownerData.firstName}
                onChange={handleOwnerChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={ownerData.lastName}
                onChange={handleOwnerChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={ownerData.username}
              onChange={handleOwnerChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={ownerData.email}
              onChange={handleOwnerChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={ownerData.password}
                onChange={handleOwnerChange}
                required
                placeholder="Create a password"
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={ownerData.confirmPassword}
                onChange={handleOwnerChange}
                required
                placeholder="Confirm your password"
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleBack}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Company...' : 'Create Company'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyRegistration;

