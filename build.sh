#!/bin/bash

echo "=== Building Material Management System ==="
echo "Disabling Turbopack and using Webpack..."

# Clear everything
echo "1. Cleaning up..."
rm -rf .next .turbo node_modules/.cache

# Set environment variables
export TURBOPACK=0
export NEXT_DISABLE_TURBOPACK=1
export NEXT_PRIVATE_TURBOPACK=0
export NODE_ENV=production

# Build
echo "2. Building with Webpack..."
npx next build --no-turbopack

# Check if build succeeded
if [ -f ".next/BUILD_ID" ]; then
  echo "✅ Build successful!"
  echo "📦 Output in: .next/"
  echo "🚀 Start with: npm start"
  echo ""
  echo "Build info:"
  echo "- Pages:"
  ls -la .next/server/pages/ 2>/dev/null || echo "No pages directory"
  echo "- Static:"
  du -sh .next/static/ 2>/dev/null || echo "No static directory"
else
  echo "❌ Build failed!"
  echo "Check the error messages above."
fi
