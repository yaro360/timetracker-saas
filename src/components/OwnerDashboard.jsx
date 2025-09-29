import React, { useState } from 'react';
import { Building2, Users, MapPin, Clock, LogOut, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import JobSiteModal from './JobSiteModal';
import EmployeeModal from './EmployeeModal';
import ManagerModal from './ManagerModal';
import CompanySettingsModal from './CompanySettingsModal';

const OwnerDashboard = ({ onLogout }) => {
  const { user } = useAuth();
  const { 
    companies,
    users, 
    jobSites, 
    timeEntries, 
    addJobSite, 
    updateJobSite, 
    deleteJobSite,
    addUser,
    updateUser,
    deleteUser,
    getCompanyStats
  } = useData();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showJobSiteModal, setShowJobSiteModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showCompanySettingsModal, setShowCompanySettingsModal] = useState(false);
  const [editingJobSite, setEditingJobSite] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingManager, setEditingManager] = useState(null);

  const stats = getCompanyStats();
  const company = companies[0];

  const handleAddJobSite = () => {
    setEditingJobSite(null);
    setShowJobSiteModal(true);
  };

  const handleEditJobSite = (jobSite) => {
    setEditingJobSite(jobSite);
    setShowJobSiteModal(true);
  };

  const handleDeleteJobSite = (jobSiteId) => {
    if (window.confirm('Are you sure you want to delete this job site?')) {
      deleteJobSite(jobSiteId);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also remove all their time entries.')) {
      deleteUser(employeeId);
    }
  };

  const handleAddManager = () => {
    setEditingManager(null);
    setShowManagerModal(true);
  };

  const handleEditManager = (manager) => {
    setEditingManager(manager);
    setShowManagerModal(true);
  };

  const handleDeleteManager = (managerId) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      deleteUser(managerId);
    }
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

  const getActiveEmployees = () => {
    return timeEntries
      .filter(entry => entry.status === 'clocked_in')
      .map(entry => {
        const employee = users.find(u => u.id === entry.userId);
        const jobSite = jobSites.find(site => site.id === entry.jobSiteId);
        return {
          ...entry,
          employee,
          jobSite
        };
      });
  };

  const getWeeklyHours = () => {
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

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <Building2 size={24} />
            <span>TimeTracker Owner</span>
          </div>
          <div className="user-info">
            <span>Welcome, {user.firstName}!</span>
            <button className="btn btn-outline" onClick={onLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Building2 size={20} />
          Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'managers' ? 'active' : ''}`}
          onClick={() => setActiveTab('managers')}
        >
          <Users size={20} />
          Managers
        </button>
        <button 
          className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <Users size={20} />
          Employees
        </button>
        <button 
          className={`nav-btn ${activeTab === 'jobsites' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobsites')}
        >
          <MapPin size={20} />
          Job Sites
        </button>
        <button 
          className={`nav-btn ${activeTab === 'timesheets' ? 'active' : ''}`}
          onClick={() => setActiveTab('timesheets')}
        >
          <Clock size={20} />
          Time Tracking
        </button>
        <button 
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          Company Settings
        </button>
      </nav>

      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="company-info">
              <h1>{company?.name}</h1>
              <p className="company-industry">{company?.industry}</p>
              <p className="company-address">{company?.address}</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <MapPin size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalJobSites}</h3>
                  <p>Job Sites</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stats.activeTimeEntries}</h3>
                  <p>Currently Active</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-content">
                  <h3>{getWeeklyHours().toFixed(1)}h</h3>
                  <p>This Week's Hours</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Currently Active</h2>
              <div className="active-employees">
                {getActiveEmployees().length === 0 ? (
                  <p className="no-data">No employees currently clocked in</p>
                ) : (
                  getActiveEmployees().map(entry => (
                    <div key={entry.id} className="active-employee">
                      <div className="employee-info">
                        <h4>{entry.employee?.firstName} {entry.employee?.lastName}</h4>
                        <p>{entry.jobSite?.name}</p>
                        <p className="clock-in-time">Since {formatTime(entry.clockInTime)}</p>
                      </div>
                      <div className="status-indicator">
                        <div className="status-dot active"></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Managers Tab */}
        {activeTab === 'managers' && (
          <div className="managers-tab">
            <div className="card">
              <div className="card-header">
                <h2>Manager Accounts</h2>
                <button className="btn btn-primary" onClick={handleAddManager}>
                  <Plus size={16} />
                  Add Manager
                </button>
              </div>
              
              <div className="managers-list">
                {users.filter(u => u.role === 'manager').map(manager => (
                  <div key={manager.id} className="manager-item">
                    <div className="manager-info">
                      <h4>{manager.firstName} {manager.lastName}</h4>
                      <p>{manager.email}</p>
                      <p className="role">Manager</p>
                    </div>
                    <div className="manager-actions">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEditManager(manager)}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteManager(manager.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="employees-tab">
            <div className="card">
              <div className="card-header">
                <h2>Employee Accounts</h2>
                <button className="btn btn-primary" onClick={handleAddEmployee}>
                  <Plus size={16} />
                  Add Employee
                </button>
              </div>
              
              <div className="employees-list">
                {users.filter(u => u.role === 'employee').map(employee => (
                  <div key={employee.id} className="employee-item">
                    <div className="employee-info">
                      <h4>{employee.firstName} {employee.lastName}</h4>
                      <p>{employee.email}</p>
                      <p className="role">Employee</p>
                    </div>
                    <div className="employee-actions">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Job Sites Tab */}
        {activeTab === 'jobsites' && (
          <div className="jobsites-tab">
            <div className="card">
              <div className="card-header">
                <h2>Job Sites</h2>
                <button className="btn btn-primary" onClick={handleAddJobSite}>
                  <Plus size={16} />
                  Add Job Site
                </button>
              </div>
              
              <div className="jobsites-grid">
                {jobSites.map(jobSite => (
                  <div key={jobSite.id} className="job-site-card">
                    <div className="job-site-header">
                      <h3>{jobSite.name}</h3>
                      <div className="job-site-actions">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEditJobSite(jobSite)}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteJobSite(jobSite.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="job-site-details">
                      <p className="address">{jobSite.fullAddress}</p>
                      <p className="coordinates">
                        {jobSite.latitude.toFixed(6)}, {jobSite.longitude.toFixed(6)}
                      </p>
                      <p className="radius">Radius: {jobSite.radius}m</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Time Sheets Tab */}
        {activeTab === 'timesheets' && (
          <div className="timesheets-tab">
            <div className="card">
              <h2>All Time Entries</h2>
              <div className="time-entries-list">
                {timeEntries.length === 0 ? (
                  <p className="no-data">No time entries yet</p>
                ) : (
                  timeEntries.map(entry => {
                    const employee = users.find(u => u.id === entry.userId);
                    const jobSite = jobSites.find(site => site.id === entry.jobSiteId);
                    return (
                      <div key={entry.id} className="time-entry-item">
                        <div className="time-entry-info">
                          <h4>{employee?.firstName} {employee?.lastName}</h4>
                          <p>{jobSite?.name}</p>
                          <p className="time-range">
                            {formatTime(entry.clockInTime)} - {entry.clockOutTime ? formatTime(entry.clockOutTime) : 'In Progress'}
                          </p>
                          <p className="entry-date">{formatDate(entry.createdAt)}</p>
                        </div>
                        <div className="time-entry-hours">
                          <span className="hours">{entry.totalHours || 0}h</span>
                          <span className={`status ${entry.status}`}>{entry.status}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="card">
              <div className="card-header">
                <h2>Company Settings</h2>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowCompanySettingsModal(true)}
                >
                  <Settings size={16} />
                  Edit Settings
                </button>
              </div>
              
              <div className="settings-content">
                <div className="setting-item">
                  <label>Company Name</label>
                  <p>{company?.name}</p>
                </div>
                <div className="setting-item">
                  <label>Industry</label>
                  <p>{company?.industry}</p>
                </div>
                <div className="setting-item">
                  <label>Address</label>
                  <p>{company?.address}</p>
                </div>
                <div className="setting-item">
                  <label>Phone</label>
                  <p>{company?.phone}</p>
                </div>
                <div className="setting-item">
                  <label>Email</label>
                  <p>{company?.email}</p>
                </div>
                <div className="setting-item">
                  <label>Created</label>
                  <p>{company?.createdAt ? formatDate(company.createdAt) : 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showJobSiteModal && (
        <JobSiteModal
          jobSite={editingJobSite}
          onClose={() => {
            setShowJobSiteModal(false);
            setEditingJobSite(null);
          }}
          onSave={(jobSiteData) => {
            if (editingJobSite) {
              updateJobSite(editingJobSite.id, jobSiteData);
            } else {
              addJobSite(jobSiteData);
            }
            setShowJobSiteModal(false);
            setEditingJobSite(null);
          }}
        />
      )}

      {showEmployeeModal && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => {
            setShowEmployeeModal(false);
            setEditingEmployee(null);
          }}
          onSave={(employeeData) => {
            if (editingEmployee) {
              updateUser(editingEmployee.id, employeeData);
            } else {
              addUser(employeeData);
            }
            setShowEmployeeModal(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {showManagerModal && (
        <ManagerModal
          manager={editingManager}
          onClose={() => {
            setShowManagerModal(false);
            setEditingManager(null);
          }}
          onSave={(managerData) => {
            if (editingManager) {
              updateUser(editingManager.id, managerData);
            } else {
              addUser(managerData);
            }
            setShowManagerModal(false);
            setEditingManager(null);
          }}
        />
      )}

      {showCompanySettingsModal && (
        <CompanySettingsModal
          company={company}
          onClose={() => setShowCompanySettingsModal(false)}
          onSave={(companyData) => {
            // Update company logic here
            setShowCompanySettingsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;

