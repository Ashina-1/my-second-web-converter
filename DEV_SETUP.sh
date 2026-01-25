#!/bin/bash
# Local development server setup for API routes

# Install dependencies
npm install

# Start Vercel dev server (requires Vercel CLI)
# vercel dev

# OR use a simple HTTP server for static files and proxy API calls
# npx http-server

# For Node.js based local testing:
# npx vercel dev

echo "To run locally:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Create .env.local with API keys"
echo "3. Run: vercel dev"
echo ""
echo "Or use http-server with a proxy:"
echo "npx http-server --proxy=http://localhost:3000"
