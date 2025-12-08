#!/bin/bash

# Setup script for bill-demo monorepo
echo "🚀 Setting up bill-demo monorepo..."

# Check if .env exists for backend
if [ ! -f backend/.env ]; then
  echo "📝 Creating backend/.env file..."
  cat > backend/.env << EOF
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bill-demo

# JWT Secret (use a strong random string in production)
JWT_SECRET=dev-secret-key-change-in-production-12345

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
EOF
  echo "✅ Created backend/.env"
else
  echo "✅ backend/.env already exists"
fi

# Check if .env exists for frontend
if [ ! -f frontend/.env ]; then
  echo "📝 Creating frontend/.env file..."
  cat > frontend/.env << EOF
# API Base URL
VITE_API_URL=http://localhost:5000
EOF
  echo "✅ Created frontend/.env"
else
  echo "✅ frontend/.env already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running (mongod or Docker)"
echo "2. Run 'npm run dev' to start both backend and frontend"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 See README.md for more details"
