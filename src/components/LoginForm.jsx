import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = onLogin(formData.username, formData.password);
      if (!success) {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      owner: { username: 'demo-owner', password: 'password' },
      manager: { username: 'demo-manager', password: 'password' },
      employee: { username: 'demo-employee', password: 'password' }
    };

    const credentials = demoCredentials[role];
    if (credentials) {
      setFormData(credentials);
      onLogin(credentials.username, credentials.password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Enter your username"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
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

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : (
          <>
            <LogIn size={20} />
            Sign In
          </>
        )}
      </button>

      <div className="demo-section">
        <p className="demo-label">Quick Demo Access:</p>
        <div className="demo-buttons">
          <button
            type="button"
            className="btn btn-demo"
            onClick={() => handleDemoLogin('owner')}
          >
            Owner Demo
          </button>
          <button
            type="button"
            className="btn btn-demo"
            onClick={() => handleDemoLogin('manager')}
          >
            Manager Demo
          </button>
          <button
            type="button"
            className="btn btn-demo"
            onClick={() => handleDemoLogin('employee')}
          >
            Employee Demo
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

