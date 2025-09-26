from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from oauthlib.oauth2 import WebApplicationClient
import requests
import json
import os
from datetime import datetime
import secrets
from urllib.parse import quote_plus
from werkzeug.utils import secure_filename
from google.cloud import storage

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# Database configuration
# Use Cloud SQL PostgreSQL in production, SQLite for local development
if os.environ.get('GAE_ENV', '').startswith('standard'):
    # Production: Cloud SQL
    db_user = os.environ.get('DB_USER', 'scioly-app-user')
    db_pass = os.environ.get('DB_PASS', 'ZKF/yqdV7e4sahJRoLRyfeVQPnp6p5NNEaAshuO+gu4=')
    db_name = os.environ.get('DB_NAME', 'scioly_app_db')
    db_host = os.environ.get('DB_HOST', '/cloudsql/snr0-154605:us-central1:scioly-db')
    
    encoded_pass = quote_plus(db_pass)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + db_user + ':' + encoded_pass + '@/' + db_name + '?host=' + db_host
else:
    # Local development: SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///scioly_users.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Google OAuth configuration
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "your-google-client-id")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "your-google-client-secret")
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

client = WebApplicationClient(GOOGLE_CLIENT_ID)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(32), unique=True, nullable=False, default=lambda: secrets.token_hex(16))
    google_id = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    picture = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    
    # User statistics
    total_attempts = db.Column(db.Integer, default=0)
    correct_answers = db.Column(db.Integer, default=0)
    favorite_cipher = db.Column(db.String(50))
    difficulty_preference = db.Column(db.String(20), default='medium')
    
    # User preferences
    show_hints = db.Column(db.Boolean, default=True)
    auto_advance = db.Column(db.Boolean, default=True)
    theme = db.Column(db.String(20), default='default')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    show_local_login = not os.environ.get('GAE_ENV', '').startswith('standard')
    user_email = current_user.email if hasattr(current_user, 'email') else None
    return render_template('index.html', show_local_login=show_local_login, user_email=user_email)

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'database': 'connected' if db.engine.pool.checkedin() > 0 else 'disconnected',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/login')
def login():
    try:
        # Get Google's OAuth 2.0 provider configuration
        response = requests.get(GOOGLE_DISCOVERY_URL, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        google_provider_cfg = response.json()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]
        
        # Create authorization request
        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=request.base_url + "/callback",
            scope=["openid", "email", "profile"],
        )
        return redirect(request_uri)
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error fetching Google OAuth configuration: {e}")
        return "Error connecting to Google OAuth service. Please try again later.", 500
    except (KeyError, ValueError) as e:
        app.logger.error(f"Error parsing Google OAuth configuration: {e}")
        return "Error with OAuth configuration. Please check your Google OAuth setup.", 500

@app.route('/login/callback')
def callback():
    try:
        # Get authorization code from Google
        code = request.args.get("code")
        if not code:
            return "Authorization code not received from Google.", 400
        
        # Get Google's OAuth 2.0 provider configuration
        response = requests.get(GOOGLE_DISCOVERY_URL, timeout=10)
        response.raise_for_status()
        google_provider_cfg = response.json()
        token_endpoint = google_provider_cfg["token_endpoint"]
        
        # Prepare and send request to get tokens
        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=request.url,
            redirect_url=request.base_url,
            code=code
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )
        
        # Parse the tokens
        client.parse_request_body_response(json.dumps(token_response.json()))
        
        # Get user info from Google
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)
        
        if userinfo_response.json().get("email_verified"):
            unique_id = userinfo_response.json()["sub"]
            users_email = userinfo_response.json()["email"]
            users_name = userinfo_response.json()["given_name"]
            users_picture = userinfo_response.json().get("picture", "")
            
            # Check if user exists in database
            user = User.query.filter_by(google_id=unique_id).first()
            
            if not user:
                # Create new user
                user = User(
                    public_id=secrets.token_hex(16),
                    google_id=unique_id,
                    email=users_email,
                    name=users_name,
                    picture=users_picture
                )
                db.session.add(user)
                db.session.commit()
            
            # Update last login
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            # Log in the user
            login_user(user)
            
            return redirect(url_for('dashboard'))
        else:
            return "User email not available or not verified by Google.", 400
            
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error in OAuth callback: {e}")
        return "Error connecting to Google OAuth service. Please try again later.", 500
    except (KeyError, ValueError, json.JSONDecodeError) as e:
        app.logger.error(f"Error parsing OAuth response: {e}")
        return "Error processing OAuth response. Please try again.", 500
    except Exception as e:
        app.logger.error(f"Unexpected error in OAuth callback: {e}")
        return "An unexpected error occurred. Please try again.", 500

@app.route('/local-login')
def local_login():
    """Simple local login for testing without OAuth"""
    # Create a test user or use existing one
    test_user = User.query.filter_by(email='test@example.com').first()
    if not test_user:
        test_user = User(
            public_id=secrets.token_hex(16),
            google_id='test123',
            email='test@example.com',
            name='Test User',
            picture='https://via.placeholder.com/150'
        )
        db.session.add(test_user)
        db.session.commit()
    
    login_user(test_user)
    return redirect(url_for('dashboard'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    accuracy = 0.0
    if current_user.total_attempts > 0:
        accuracy = round((current_user.correct_answers / current_user.total_attempts) * 100, 1)
    picture_url = current_user.picture
    return render_template('dashboard.html', accuracy=accuracy, picture_url=picture_url)

@app.route('/api/profile')
@login_required
def get_profile():
    return jsonify({
        'id': current_user.id,
        'name': current_user.name,
        'email': current_user.email,
        'picture': current_user.picture,
        'total_attempts': current_user.total_attempts,
        'correct_answers': current_user.correct_answers,
        'accuracy': round((current_user.correct_answers / max(current_user.total_attempts, 1)) * 100, 1),
        'favorite_cipher': current_user.favorite_cipher,
        'difficulty_preference': current_user.difficulty_preference,
        'show_hints': current_user.show_hints,
        'auto_advance': current_user.auto_advance,
        'theme': current_user.theme,
        'created_at': current_user.created_at.isoformat(),
        'last_login': current_user.last_login.isoformat()
    })

@app.route('/api/profile', methods=['PUT'])
@login_required
def update_profile():
    data = request.get_json()
    
    if 'name' in data:
        current_user.name = data['name']
    if 'picture' in data:
        current_user.picture = data['picture']
    if 'difficulty_preference' in data:
        current_user.difficulty_preference = data['difficulty_preference']
    if 'show_hints' in data:
        current_user.show_hints = data['show_hints']
    if 'auto_advance' in data:
        current_user.auto_advance = data['auto_advance']
    if 'theme' in data:
        current_user.theme = data['theme']
    
    db.session.commit()
    return jsonify({'success': True, 'name': current_user.name, 'picture': current_user.picture})

GCS_BUCKET = 'scioly-profile-images-b9f0776c'
GCS_SIGNED_URL_EXPIRATION = 60 * 60 * 24  # 24 hours

def get_gcs_signed_url(blob_name):
    client = storage.Client()
    bucket = client.bucket(GCS_BUCKET)
    blob = bucket.blob(blob_name)
    url = blob.generate_signed_url(expiration=GCS_SIGNED_URL_EXPIRATION, version='v2')
    return url

@app.route('/api/profile/upload_image', methods=['POST'])
@login_required
def upload_profile_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded.'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected.'}), 400
    if file and file.mimetype in ['image/jpeg', 'image/png']:
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > 2 * 1024 * 1024:
            return jsonify({'success': False, 'error': 'Image must be less than 2MB.'}), 400
        ext = '.jpg' if file.mimetype == 'image/jpeg' else '.png'
        filename = secure_filename(f"user_{current_user.id}_{secrets.token_hex(8)}{ext}")
        # Upload to GCS
        client = storage.Client()
        bucket = client.bucket(GCS_BUCKET)
        blob = bucket.blob(filename)
        blob.upload_from_file(file, content_type=file.mimetype)
        blob.make_public()
        # Store public URL in DB
        current_user.picture = blob.public_url
        db.session.commit()
        url = blob.public_url
        return jsonify({'success': True, 'url': url})
    else:
        return jsonify({'success': False, 'error': 'Invalid file type.'}), 400

@app.route('/api/stats', methods=['POST'])
@login_required
def update_stats():
    data = request.get_json()
    
    current_user.total_attempts += data.get('attempts', 0)
    current_user.correct_answers += data.get('correct', 0)
    
    if 'favorite_cipher' in data:
        current_user.favorite_cipher = data['favorite_cipher']
    
    db.session.commit()
    
    return jsonify({
        'total_attempts': current_user.total_attempts,
        'correct_answers': current_user.correct_answers,
        'accuracy': round((current_user.correct_answers / max(current_user.total_attempts, 1)) * 100, 1)
    })

@app.route('/api/leaderboard')
def get_leaderboard():
    users = User.query.order_by(User.correct_answers.desc()).limit(10).all()
    return jsonify([{
        'name': user.name,
        'correct_answers': user.correct_answers,
        'total_attempts': user.total_attempts,
        'accuracy': round((user.correct_answers / max(user.total_attempts, 1)) * 100, 1)
    } for user in users])

@app.route('/robots.txt')
def robots_txt():
    return app.send_static_file('robots.txt')

@app.route('/articles/')
def articles_index():
    return send_from_directory('articles', 'index.html')

@app.route('/articles/<path:filename>')
def serve_article(filename):
    return send_from_directory('articles', filename)

@app.route('/tutorials/<path:filename>')
def serve_tutorial(filename):
    return send_from_directory('tutorials', filename)

@app.route('/sitemap.xml')
def sitemap_xml():
    from flask import Response
    from datetime import datetime
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    sitemap_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://snr0-154605.uc.r.appspot.com/</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://snr0-154605.uc.r.appspot.com/#tutorials</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://snr0-154605.uc.r.appspot.com/#caesar-tutorial</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://snr0-154605.uc.r.appspot.com/#baconian-tutorial</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://snr0-154605.uc.r.appspot.com/#vigenere-tutorial</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://snr0-154605.uc.r.appspot.com/#practice</loc>
        <lastmod>{current_date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>'''
    return Response(sitemap_xml, mimetype='application/xml')

with app.app_context():
    db.create_all()
    # Migration: assign public_id to users missing it
    try:
        for user in User.query.filter((User.public_id == None) | (User.public_id == '')).all():
            user.public_id = secrets.token_hex(16)
        db.session.commit()
    except Exception as e:
        print(f"Migration skipped or failed: {e}")
        # If migration fails, it's likely because this is a fresh database
        # or the column already exists and is populated
        db.session.rollback()

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8080) 