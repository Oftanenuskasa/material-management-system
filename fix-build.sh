#!/bin/bash

echo "=== Fixing Next.js Build Issues ==="

# 1. Clear caches
echo "1. Clearing caches..."
rm -rf .next node_modules/.cache

# 2. Update Next.js config
echo "2. Updating Next.js config..."
cat > next.config.js << 'CONFIG'
/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
})

module.exports = nextConfig
CONFIG

# 3. Install dependencies if missing
echo "3. Checking dependencies..."
if [ ! -d "node_modules/next" ]; then
  echo "Installing Next.js..."
  npm install next@14.1.4 react@18.2.0 react-dom@18.2.0
fi

# 4. Build with webpack
echo "4. Building with webpack..."
NEXT_DISABLE_TURBOPACK=1 npx next build

# 5. Check if build succeeded
if [ -f ".next/BUILD_ID" ]; then
  echo "✅ Build successful!"
  echo "You can now run: npm start"
else
  echo "❌ Build failed. Trying alternative approach..."
  # Try without PWA first
  echo "Trying build without PWA..."
  rm -rf .next
  npx next build
fi
