import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';

const CompanySettingsModal = ({ company, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: 'construction',
    address: '',
    phone: '',
    email: ''
  });
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

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || 'construction',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || ''
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onSave(formData);
    } catch (error) {
      console.error('Company settings save error:', error);
      alert('Failed to save company settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Company Settings</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-header">
            <Building2 size={32} className="form-icon" />
            <h3>Update Company Information</h3>
            <p>Modify your company details and settings</p>
          </div>

          <div className="form-group">
            <label htmlFor="name">Company Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industry *</label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
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
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter company address"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Company Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter company email"
              />
            </div>
          </div>

          <div className="form-note">
            <p><strong>Note:</strong> Changes to company settings will be applied immediately and affect all users in your organization.</p>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySettingsModal;

