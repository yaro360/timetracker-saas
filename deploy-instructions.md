# TimeTracker Deployment Instructions

## Quick External Access Options

### Option 1: Local Network Access
If testing from devices on the same WiFi network:
- **URL**: http://192.168.1.114:3000
- **Requirements**: All devices must be on the same WiFi network

### Option 2: ngrok (Recommended for external testing)
1. Install ngrok if not already installed:
   ```bash
   # On Mac with Homebrew
   brew install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. Run ngrok in a separate terminal:
   ```bash
   ngrok http 3000
   ```

3. Copy the public URL (e.g., https://abc123.ngrok.io) and share it

### Option 3: Deploy to Netlify (Free)
1. Go to https://netlify.com
2. Sign up for free account
3. Drag and drop the entire project folder to deploy
4. Get instant public URL

### Option 4: Deploy to Vercel (Free)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Option 5: Deploy to GitHub Pages
1. Create a GitHub repository
2. Upload your project files
3. Enable GitHub Pages in repository settings
4. Access via: https://yourusername.github.io/repository-name

## Testing GPS Features

### For GPS Testing:
1. **Use HTTPS**: GPS requires secure connection
2. **Allow Location**: Browser will prompt for location permission
3. **Test on Mobile**: GPS works best on actual mobile devices
4. **Test Different Locations**: Walk to different areas to test distance calculations

### Demo Accounts:
- **Owner**: demo-owner / password
- **Manager**: demo-manager / password  
- **Employee**: demo-employee / password

## Current Features Working:
✅ Multi-company registration
✅ GPS-based clock in/out
✅ Interactive job site creation with maps
✅ Employee hours tracking
✅ Role-based dashboards
✅ Mobile responsive design
✅ Real-time location verification

## Troubleshooting GPS Issues:
1. Ensure HTTPS connection
2. Allow location permissions in browser
3. Use actual mobile device for best GPS accuracy
4. Check browser console for error messages
5. Try "Refresh Location" button if location seems wrong

