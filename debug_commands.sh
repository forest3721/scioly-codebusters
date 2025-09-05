#!/bin/bash

echo "🔍 Scioly Debug Commands"
echo "======================="
echo ""

echo "1. Open standalone test (no server needed):"
echo "   open standalone_test.html"
echo ""

echo "2. Test with Python's simple HTTP server:"
echo "   python3 -m http.server 9000"
echo "   Then visit: http://localhost:9000"
echo ""

echo "3. Check if any processes are blocking ports:"
echo "   lsof -i :3000"
echo "   lsof -i :5000"
echo "   lsof -i :8080"
echo ""

echo "4. View browser console for errors:"
echo "   - Open browser Developer Tools (F12)"
echo "   - Go to Console tab"
echo "   - Look for JavaScript errors"
echo ""

echo "5. Test network connectivity:"
echo "   curl -I http://127.0.0.1:4000 (if server running)"
echo ""

echo "6. Alternative: Use file:// protocol"
echo "   file:///Users/senhua/Refresher/scioly/standalone_test.html"
echo ""

# Run a quick test
echo "🧪 Quick Test Results:"
echo "===================="

if [ -f "standalone_test.html" ]; then
    echo "✅ Standalone test file exists"
else
    echo "❌ Standalone test file missing"
fi

if [ -f "templates/index.html" ]; then
    echo "✅ Main template exists"
else
    echo "❌ Main template missing"
fi

if [ -f "static/js/script.js" ]; then
    echo "✅ JavaScript file exists"
else
    echo "❌ JavaScript file missing"
fi

if [ -f "static/css/styles.css" ]; then
    echo "✅ CSS file exists"
else
    echo "❌ CSS file missing"
fi

echo ""
echo "💡 Try opening the standalone test file first - it should work without any server!"