import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const ManagerModal = ({ manager, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'manager'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (manager) {
      setFormData({
        firstName: manager.firstName || '',
        lastName: manager.lastName || '',
        username: manager.username || '',
        email: manager.email || '',
        password: '', // Don't pre-fill password
        role: manager.role || 'manager'
      });
    }
  }, [manager]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!manager && !formData.password) {
      alert('Password is required for new managers');
      setIsLoading(false);
      return;
    }

    if (formData.password && formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const managerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        role: formData.role
      };

      // Only include password if it's provided
      if (formData.password) {
        managerData.password = formData.password;
      }

      onSave(managerData);
    } catch (error) {
      console.error('Manager save error:', error);
      alert('Failed to save manager. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{manager ? 'Edit Manager' : 'Add Manager'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="manager">Manager</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password {manager ? '(leave blank to keep current)' : '*'}
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!manager}
                placeholder={manager ? 'Enter new password (optional)' : 'Create a password'}
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
            {manager && (
              <small>Leave password blank to keep the current password</small>
            )}
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
              {isLoading ? 'Saving...' : (manager ? 'Update Manager' : 'Create Manager')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerModal;

