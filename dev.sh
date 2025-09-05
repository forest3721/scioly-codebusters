#!/bin/bash

# Scioly Code Breaker - Local Development Script
echo "🚀 Starting Scioly Code Breaker in development mode..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing requirements..."
pip install -r requirements.txt

# Set development environment variables
export FLASK_ENV=development
export FLASK_DEBUG=1
export PYTHON_ENV=local

echo "✅ Development environment ready!"
echo "🌐 Starting server at http://localhost:8080"
echo "👉 Press Ctrl+C to stop the server"
echo ""

# Start the Flask development server
python main.py