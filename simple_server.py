#!/usr/bin/env python3
"""
Simple development server for Scioly Code Breaker
This bypasses potential permission issues with the main app
"""

from flask import Flask, render_template, send_from_directory
import os

# Create a simple Flask app for development testing
app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key-for-testing-only'

@app.route('/')
def index():
    """Serve the main page"""
    # Mock user data for simple server
    class MockUser:
        is_authenticated = False
        email = None
    
    return render_template('index.html', 
                         current_user=MockUser(), 
                         show_local_login=True)

@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files"""
    return send_from_directory('static', filename)

@app.route('/health')
def health_check():
    """Simple health check endpoint"""
    return {'status': 'ok', 'message': 'Development server is running'}

if __name__ == '__main__':
    print("🚀 Starting simple development server...")
    print("📍 URL: http://127.0.0.1:4000")
    print("🔧 This is a simplified server for testing the frontend only")
    print("👉 Press Ctrl+C to stop")
    
    try:
        app.run(
            debug=True,
            host='127.0.0.1',
            port=4000,
            use_reloader=False  # Disable reloader to avoid permission issues
        )
    except PermissionError as e:
        print(f"❌ Permission error: {e}")
        print("🔄 Trying alternative port...")
        app.run(
            debug=True,
            host='127.0.0.1',
            port=4001,
            use_reloader=False
        )
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Try running with: python3 simple_server.py")