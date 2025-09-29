# TimeTracker User Guide

## Getting Started

### System Requirements
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **GPS-enabled device** (smartphone, tablet, or laptop with location services)
- **Internet connection** (for maps and geocoding)
- **Location permissions** enabled in browser

### First Time Setup
1. **Open TimeTracker** in your web browser
2. **Allow location access** when prompted by browser
3. **Choose registration type**:
   - **Start Company**: Create new company account
   - **Login**: Use existing credentials

## Company Registration

### Creating Your Company
1. Click **"Start Company"** button
2. Fill out company information:
   - **Company Name**: Your business name
   - **Industry**: Select from dropdown (Construction, Healthcare, Retail, etc.)
   - **Address**: Complete business address
   - **Phone**: Business contact number
   - **Email**: Business contact email

3. Create owner account:
   - **First/Last Name**: Your personal information
   - **Username**: Login username (must be unique)
   - **Email**: Your email address
   - **Password**: Secure password (minimum 6 characters)

4. Click **"Create Company"** to complete registration

### Demo Company
For testing purposes, use these demo credentials:
- **Owner**: demo-owner / password
- **Manager**: demo-manager / password
- **Employee**: demo-employee / password

## User Roles and Permissions

### 🔵 Company Owner
**Full access to all features:**
- Manage company settings
- Create and manage manager accounts
- View all employee activity
- Create and manage job sites
- Access all reports and analytics
- Delete company data

### 🟢 Manager
**Team management capabilities:**
- Create and manage employee accounts
- Edit employee information
- Delete employees
- Create and manage job sites
- View team activity and reports
- Cannot access company settings

### 🟡 Employee
**Basic time tracking features:**
- Clock in/out at job sites
- View personal timesheet
- See available job sites
- Update personal profile
- Cannot manage other users or job sites

## Dashboard Overview

### Owner/Manager Dashboard
**Navigation Tabs:**
- **Dashboard**: Overview of company activity
- **Team Management**: Manage employees
- **Job Sites**: Manage work locations
- **Reports**: View time tracking reports
- **Company Settings**: Company information (owners only)

**Key Metrics:**
- Total active employees
- Employees currently clocked in
- Total job sites
- Today's total hours

### Employee Dashboard
**Main Features:**
- **Current Status**: Shows if clocked in or out
- **Available Job Sites**: List of work locations with distances
- **Clock In/Out Buttons**: GPS-verified time tracking
- **Recent Time Entries**: Personal timesheet history

## Job Site Management

### Creating Job Sites

#### Method 1: Address Entry
1. Go to **Job Sites** tab
2. Click **"Add Job Site"**
3. Enter job site details:
   - **Site Name**: Descriptive name for the location
   - **Address Line 1**: Primary street address
   - **Address Line 2**: Suite, building, etc. (optional)
   - **City**: Job site city
   - **State/Province**: State or province
   - **ZIP/Postal Code**: Postal code
   - **Country**: Select country (defaults to United States)

4. Click **"Find Location on Map"** to geocode address
5. **Review coordinates** and address on map
6. Click **"Create Job Site"** to save

#### Method 2: Map Selection
1. **Click directly on map** to select location
2. **Coordinates auto-populate** from map click
3. **Address fields auto-fill** if geocoding successful
4. **Adjust details** as needed
5. **Create job site** with verified location

### Job Site Settings
- **Radius**: Default 100 meters (can be customized)
- **Active Status**: Enable/disable job sites
- **Address Verification**: Automatic geocoding validation

### Managing Existing Job Sites
- **Edit**: Update job site information and location
- **Delete**: Remove job sites (with confirmation)
- **View on Map**: See exact location and radius

## Employee Management

### Adding Employees
1. Go to **Team Management** tab
2. Click **"Add Employee"**
3. Fill out employee information:
   - **First/Last Name**: Employee's full name
   - **Username**: Unique login username
   - **Email**: Employee's email address
   - **Password**: Initial password (employee can change later)
   - **Role**: Employee or Manager

4. Click **"Add Employee"** to create account

### Managing Employees

#### Editing Employee Information
1. Find employee in **Team Management** list
2. Click **Edit (✏️)** button
3. Update any field:
   - Personal information
   - Contact details
   - Username/password
   - Role assignment
4. Click **"Update Employee"** to save changes

#### Deleting Employees
1. Find employee in **Team Management** list
2. Click **Delete (🗑️)** button
3. **Confirm deletion** in popup dialog
4. **All time entries** for that employee are also removed

### Employee Status
- **Active**: Can log in and clock in/out
- **Recently Added**: New employees appear with creation date
- **Role Indicators**: Visual badges for Employee/Manager roles

## Time Tracking

### GPS-Based Clock In/Out

#### Clock In Process
1. **Arrive at job site** physically
2. **Open TimeTracker** on mobile device or computer
3. **Allow location access** if prompted
4. **Check job site list** for "In Range" status
5. **Click "Clock In"** button (only available when in range)
6. **Confirm location** and start work timer

#### Clock Out Process
1. **Finish work** at job site
2. **Open TimeTracker** application
3. **Click "Clock Out"** button
4. **Confirm location** for clock out
5. **Review total hours** worked

### Location Requirements
- **GPS Accuracy**: Must be within job site radius (default 100m)
- **Range Indicator**: 
  - 🟢 **"In Range"**: Can clock in/out
  - 🔴 **"Out of Range"**: Shows distance to job site
- **Real-Time Updates**: Distance updates as you move

### Timesheet Viewing
**Employee View:**
- Personal time entries only
- Clock in/out times
- Total hours per entry
- Job site names
- Date/time stamps

**Manager/Owner View:**
- All employee time entries
- Filterable by employee
- Sortable by date/hours
- Exportable reports

## Mobile Usage

### Mobile Browser Setup
1. **Open browser** (Chrome, Safari, Firefox, Edge)
2. **Navigate to TimeTracker URL**
3. **Allow location permissions** when prompted
4. **Add to home screen** for app-like experience

### Mobile-Specific Features
- **Touch-optimized interface**: Large buttons and touch targets
- **Responsive design**: Adapts to phone and tablet screens
- **GPS integration**: Uses phone's built-in location services
- **Offline capability**: Basic functionality works without internet

### Location Permissions
**iOS Safari:**
1. Settings → Safari → Location Services → Allow
2. Or allow when prompted in browser

**Android Chrome:**
1. Settings → Site Settings → Location → Allow
2. Or allow when prompted in browser

### Troubleshooting Mobile Issues
- **Location not working**: Check browser permissions
- **Slow GPS**: Move to open area with clear sky view
- **App not loading**: Check internet connection
- **Buttons too small**: Use landscape mode or zoom in

## Reports and Analytics

### Available Reports
**Time Summary:**
- Total hours by employee
- Hours by job site
- Daily/weekly/monthly breakdowns
- Overtime calculations

**Activity Reports:**
- Clock in/out history
- Location verification logs
- Employee attendance patterns
- Job site utilization

### Exporting Data
- **CSV Export**: Spreadsheet-compatible format
- **PDF Reports**: Formatted reports for printing
- **Date Range Selection**: Custom reporting periods
- **Employee Filtering**: Individual or group reports

## Troubleshooting

### Common Issues

#### "Location Access Denied"
**Solution:**
1. Check browser location permissions
2. Enable location services on device
3. Refresh page and allow when prompted
4. Try different browser if issues persist

#### "Network Error" During Registration
**Solution:**
1. Check internet connection
2. Try different browser
3. Clear browser cache and cookies
4. Disable ad blockers temporarily

#### "Cannot Find Address on Map"
**Solution:**
1. Try more specific address (include street number)
2. Use nearby landmark or intersection
3. Click directly on map to select location
4. Manually enter coordinates if known

#### GPS Shows Wrong Location
**Solution:**
1. Move to area with clear sky view
2. Wait for GPS to acquire better signal
3. Refresh browser page
4. Check device location settings

#### Employee Cannot Clock In
**Possible Causes:**
- Not within job site radius
- GPS accuracy issues
- Location permissions denied
- Already clocked in at another site

**Solutions:**
1. Verify physical location at job site
2. Check "Distance" indicator on job site card
3. Wait for GPS to improve accuracy
4. Contact manager if radius needs adjustment

### Browser Compatibility
**Supported Browsers:**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

**Unsupported:**
- ❌ Internet Explorer
- ❌ Very old mobile browsers

### Performance Tips
- **Close other browser tabs** for better GPS performance
- **Use WiFi when available** for faster map loading
- **Keep app open** while working for continuous tracking
- **Regular browser updates** for best compatibility

## Security and Privacy

### Data Storage
- **Local Storage**: Data stored in browser only
- **No Cloud Sync**: Data doesn't leave your device
- **Company Isolation**: Each company's data is separate
- **Automatic Cleanup**: Old data can be manually cleared

### Location Privacy
- **GPS Usage**: Only when actively using app
- **No Tracking**: Location not stored permanently
- **User Control**: Can deny location access anytime
- **Verification Only**: Location used only for clock in/out verification

### Password Security
- **Strong Passwords**: Minimum 6 characters recommended
- **User Control**: Users can change their own passwords
- **No Recovery**: Passwords cannot be recovered (must be reset by manager)
- **Role Protection**: Only managers can reset employee passwords

## Best Practices

### For Company Owners
1. **Set clear policies** for time tracking usage
2. **Train managers** on employee management features
3. **Regular job site audits** to ensure accuracy
4. **Backup data** regularly using export features
5. **Monitor reports** for attendance patterns

### For Managers
1. **Verify job site locations** before creating
2. **Set appropriate radius** for each job site (consider parking, building size)
3. **Regular employee check-ins** to ensure proper usage
4. **Review time entries** for accuracy
5. **Update employee information** promptly when changes occur

### For Employees
1. **Allow location access** for proper functionality
2. **Clock in immediately** upon arriving at job site
3. **Clock out before leaving** job site
4. **Report issues** to manager promptly
5. **Keep app open** during work hours for best GPS performance

## Support and Feedback

### Getting Help
1. **Check this user guide** for common solutions
2. **Contact your manager** for account issues
3. **Try demo accounts** to test functionality
4. **Clear browser data** if experiencing persistent issues

### Reporting Issues
When reporting problems, include:
- **Browser type and version**
- **Device type** (phone, tablet, computer)
- **Error messages** (exact text)
- **Steps to reproduce** the issue
- **Screenshots** if helpful

### Feature Requests
The TimeTracker system is continuously being improved. Common requested features include:
- Photo verification for clock in/out
- Offline mode for areas with poor connectivity
- Integration with payroll systems
- Advanced reporting and analytics
- Mobile app versions

---

**Need immediate help? Contact your system administrator or company owner.**

