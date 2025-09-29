#!/bin/bash

# TimeTracker Deployment Script
echo "🚀 TimeTracker Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project directory."
    exit 1
fi

echo "✅ Project files found"

# Option 1: Netlify (Recommended)
echo ""
echo "🌐 Option 1: Deploy to Netlify (Recommended)"
echo "1. Go to https://netlify.com"
echo "2. Sign up/login with GitHub"
echo "3. Drag & drop this folder"
echo "4. Your app will be live instantly!"
echo ""

# Option 2: Vercel
echo "⚡ Option 2: Deploy to Vercel"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Run: vercel"
echo "3. Follow the prompts"
echo ""

# Option 3: GitHub Pages
echo "📚 Option 3: Deploy to GitHub Pages"
echo "1. Create a GitHub repository"
echo "2. Upload this project"
echo "3. Go to Settings → Pages"
echo "4. Select 'Deploy from a branch'"
echo "5. Choose 'main' branch"
echo ""

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🔧 Vercel CLI detected. Would you like to deploy now? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying to Vercel..."
        vercel
    fi
else
    echo "💡 Tip: Install Vercel CLI for one-command deployment:"
    echo "   npm install -g vercel"
fi

echo ""
echo "🎉 Your TimeTracker app is ready for deployment!"
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
