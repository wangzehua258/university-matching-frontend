#!/bin/bash

echo "🚀 Starting frontend tests..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install test dependencies if not already installed
echo "🧪 Installing test dependencies..."
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest

# Run tests
echo "🧪 Running tests..."
npm test

echo "✅ Frontend tests completed!"