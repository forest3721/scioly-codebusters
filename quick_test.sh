#!/bin/bash

echo "🚀 Quick Test Server Options"
echo "=========================="
echo ""
echo "Option 1: Simple Flask server (recommended)"
echo "Command: python3 simple_server.py"
echo "URL: http://localhost:3000"
echo ""
echo "Option 2: Basic HTTP server (fallback)"
echo "Command: python3 -m http.server 8080"
echo "URL: http://localhost:8080"
echo ""
echo "Option 3: Test HTML file directly"
echo "Command: open test_buttons.html"
echo ""

echo "Which option would you like to try?"
echo "1) Simple Flask server"
echo "2) Basic HTTP server" 
echo "3) Open test HTML file"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "Starting Simple Flask server..."
        python3 simple_server.py
        ;;
    2)
        echo "Starting Basic HTTP server..."
        python3 -m http.server 8080
        ;;
    3)
        echo "Opening test HTML file..."
        open test_buttons.html
        ;;
    *)
        echo "Invalid choice. Starting Simple Flask server by default..."
        python3 simple_server.py
        ;;
esac