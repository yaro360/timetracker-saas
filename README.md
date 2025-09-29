# TimeTracker - Multi-Company SaaS Platform

A comprehensive location-based timesheet application with GPS verification for multi-company use.

## 🚀 Features

### Core Functionality
- **GPS-Based Clock In/Out**: Employees can only clock in when physically at designated job sites
- **Real-Time Location Tracking**: Lightweight monitoring while employees are on-site
- **Multi-Company Support**: Complete SaaS platform for unlimited companies
- **Role-Based Access**: Owner → Manager → Employee hierarchy
- **Automatic Payroll Calculations**: Weekly hour totals for easy payroll processing

### User Roles
- **Company Owner**: Full control over company settings, users, and job sites
- **Manager**: Team management, job site creation, employee oversight
- **Employee**: Simple clock in/out interface with GPS verification

### Advanced Features
- **Interactive Maps**: Visual job site selection with OpenStreetMap integration
- **Detailed Address Management**: Complete address fields with geocoding
- **Employee Management**: Edit/delete employees with role-based permissions
- **Mobile Responsive**: Works perfectly on phones, tablets, and desktops
- **Data Isolation**: Each company's data is completely separate and secure

## 📁 Project Structure

```
timetracker-complete-project/
├── README.md                    # This file
├── index.html                   # Main application (single-file version)
├── package.json                 # Node.js dependencies (for development)
├── docs/
│   ├── API_DOCUMENTATION.md     # API structure and data models
│   ├── DEPLOYMENT_GUIDE.md      # Deployment instructions
│   └── USER_GUIDE.md           # User manual
├── src/
│   ├── components/             # React components (extracted)
│   ├── models/                 # Data models and schemas
│   ├── utils/                  # Utility functions
│   └── styles/                 # CSS styles (extracted)
└── examples/
    ├── sample-data.json        # Sample data for testing
    └── demo-accounts.json      # Demo account credentials
```

## 🛠 Technology Stack

- **Frontend**: React 18 (via CDN)
- **Styling**: Custom CSS with responsive design
- **Maps**: Leaflet.js with OpenStreetMap
- **Storage**: LocalStorage (client-side)
- **Geocoding**: Multiple services (Nominatim, Maps.co, Mapbox)
- **Icons**: Lucide React icons

## 🚀 Quick Start

### Option 1: Single-File Version (Recommended for demos)
1. Open `index.html` in any modern web browser
2. Use demo accounts or create new company
3. Start using immediately - no setup required

### Option 2: Development Setup
1. Install Node.js dependencies: `npm install`
2. Start development server: `npm start`
3. Open http://localhost:3000

## 👥 Demo Accounts

The application comes with pre-configured demo accounts:

- **Owner**: `demo-owner` / `password`
- **Manager**: `demo-manager` / `password`  
- **Employee**: `demo-employee` / `password`

## 📍 GPS & Location Features

### How GPS Works
- Uses browser's Geolocation API
- Accesses real GPS, WiFi, and cell tower data
- Calculates distance to job sites in real-time
- Only allows clock-in when within specified radius (default: 100m)

### Address Management
- Complete address fields (Address 1, Address 2, City, State, ZIP, Country)
- Automatic geocoding to convert addresses to GPS coordinates
- Interactive map for visual location selection
- Fallback options when geocoding fails

## 🏢 Multi-Company Architecture

### Company Registration Flow
1. Click "Start Company" 
2. Enter company details (name, industry, address, contact info)
3. Create owner account
4. Add managers and employees
5. Set up job sites with GPS coordinates

### Data Isolation
- Each company's data is completely separate
- Users can only access their company's information
- Secure role-based permissions
- No cross-company data leakage

## 📱 Mobile Optimization

### Touch-Friendly Design
- Minimum 44px touch targets
- Responsive grid layouts
- Mobile-optimized forms
- Smooth touch scrolling

### Cross-Platform Compatibility
- Works on iOS and Android
- Compatible with all modern browsers
- Progressive Web App ready
- Offline capability (with service worker)

## 🔧 Development Guide

### Key Components
- **Authentication System**: Login/registration with role validation
- **Location Services**: GPS tracking and distance calculation
- **Map Integration**: Interactive job site selection
- **Data Management**: LocalStorage with JSON structure
- **UI Components**: Reusable React components

### Data Models
```javascript
// Company
{
  id, name, industry, address, phone, email, createdAt
}

// User
{
  id, username, email, password, role, companyId, 
  firstName, lastName, createdAt
}

// Job Site
{
  id, name, address1, address2, city, state, zipCode, 
  country, fullAddress, latitude, longitude, radius, 
  companyId, createdBy, createdAt
}

// Time Entry
{
  id, userId, jobSiteId, companyId, clockInTime, 
  clockOutTime, totalHours, status, createdAt
}
```

### Extending the Application
- Add new user roles
- Implement reporting features
- Add notification system
- Integrate with payroll systems
- Add photo verification
- Implement geofencing alerts

## 🚀 Deployment Options

### Static Hosting (Current)
- Deploy `index.html` to any static host
- Works with Netlify, Vercel, GitHub Pages
- No server required

### Full-Stack Deployment
- Convert to separate frontend/backend
- Use Node.js/Express for API
- PostgreSQL/MongoDB for database
- Add user authentication with JWT

### SaaS Platform
- Multi-tenant database architecture
- Subscription management
- Admin dashboard
- Analytics and reporting

## 🔐 Security Considerations

### Current Implementation
- Client-side data storage
- Basic role-based access
- Input validation and sanitization

### Production Recommendations
- Server-side authentication
- Encrypted data transmission
- Database security
- Rate limiting
- Audit logging

## 📊 Analytics & Reporting

### Current Features
- Basic time tracking
- Employee activity monitoring
- Job site statistics

### Future Enhancements
- Detailed reporting dashboard
- Export to CSV/PDF
- Time tracking analytics
- Productivity metrics
- Cost analysis

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- Use ES6+ JavaScript
- Follow React best practices
- Maintain responsive design
- Add comments for complex logic
- Test on multiple devices

## 📞 Support

For questions or issues:
- Check the documentation in `/docs`
- Review the code comments
- Test with demo accounts
- Verify GPS permissions in browser

## 📄 License

This project is available for commercial and personal use.

---

**Built with ❤️ for modern workforce management**

