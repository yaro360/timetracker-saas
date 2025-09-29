import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        const userData = { ...foundUser };
        delete userData.password; // Don't store password in state
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if username already exists
      if (users.find(u => u.username === userData.username)) {
        alert('Username already exists');
        return false;
      }

      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        alert('Email already exists');
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto-login after registration
      const userDataForState = { ...newUser };
      delete userDataForState.password;
      setUser(userDataForState);
      localStorage.setItem('currentUser', JSON.stringify(userDataForState));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const createCompany = (companyData, ownerData) => {
    try {
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if company name already exists
      if (companies.find(c => c.name === companyData.name)) {
        alert('Company name already exists');
        return false;
      }

      // Check if username already exists
      if (users.find(u => u.username === ownerData.username)) {
        alert('Username already exists');
        return false;
      }

      // Check if email already exists
      if (users.find(u => u.email === ownerData.email)) {
        alert('Email already exists');
        return false;
      }

      const companyId = Date.now().toString();
      const ownerId = (Date.now() + 1).toString();

      const newCompany = {
        id: companyId,
        ...companyData,
        createdAt: new Date().toISOString()
      };

      const newOwner = {
        id: ownerId,
        ...ownerData,
        companyId: companyId,
        role: 'owner',
        createdAt: new Date().toISOString()
      };

      companies.push(newCompany);
      users.push(newOwner);
      
      localStorage.setItem('companies', JSON.stringify(companies));
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto-login as owner
      const userDataForState = { ...newOwner };
      delete userDataForState.password;
      setUser(userDataForState);
      localStorage.setItem('currentUser', JSON.stringify(userDataForState));
      
      return true;
    } catch (error) {
      console.error('Company creation error:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    createCompany
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

