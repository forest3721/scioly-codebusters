# Science Olympiad CodeBusters 2025 Cipher Practice

A comprehensive web application designed to help middle school students practice different types of ciphers for Science Olympiad competitions. This interactive tool provides hands-on experience with various encryption methods commonly used in code breaker events.

## 🚀 Features

### 🎯 Multiple Cipher Types
- **Caesar Cipher**: Shift cipher - perfect for beginners
- **Atbash Cipher**: Reverse alphabet substitution
- **Keyword Cipher**: Substitution with keyword alphabet
- **Vigenère Cipher**: Polyalphabetic keyword encryption
- **Morse Code**: Dots and dashes communication
- **Binary Code**: 8-bit ASCII computer encoding
- **Aristocrats**: Monoalphabetic substitution puzzles
- **Affine Cipher**: Mathematical linear transformation
- **Baconian Cipher**: Binary steganographic encoding
- **Polybius Square**: Grid-based coordinate cipher

### 📊 Progressive Difficulty Levels
- **Easy**: 3-5 letter words (perfect for beginners)
- **Medium**: 6-10 letter words (standard practice)
- **Hard**: 11-15 letter words (advanced challenge)

### 🎮 Interactive Features
- **Real-time Feedback**: Instant validation with visual feedback
- **Statistics Tracking**: Monitor progress with accuracy metrics
- **User Profiles**: Google OAuth authentication with personalized dashboard
- **Leaderboard**: Competition with other users
- **Tutorial System**: Comprehensive guides for each cipher type
- **Mobile Responsive**: Works perfectly on all devices

### 📚 Educational Content
- **Cipher 101**: Detailed tutorials and explanations
- **Engineering Articles**: Advanced cryptography concepts
- **FAQ Section**: Common questions and answers
- **Interactive Examples**: Step-by-step cipher demonstrations

## 🛠️ Technology Stack

- **Backend**: Python Flask with SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Google OAuth 2.0
- **Deployment**: Google App Engine
- **Storage**: Google Cloud Storage (for user profiles)

## 🔧 Installation & Setup

### Prerequisites
- Python 3.11 or higher
- Google Cloud SDK (for deployment)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scioly-codebusters
   ```

2. **Set up environment variables**
   ```bash
   cp .env.template .env
   # Edit .env with your actual credentials
   ```

3. **Install dependencies and run**
   ```bash
   ./dev.sh
   ```
   This will:
   - Create a virtual environment
   - Install all dependencies
   - Start the Flask development server on port 5000

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Update `.env` with your client ID and secret

See `GOOGLE_OAUTH_SETUP.md` for detailed instructions.

### Production Deployment

⚠️ **SECURITY NOTICE**: Never commit `app.yaml` with real credentials to version control!

1. **Set up Google Cloud credentials**
   ```bash
   cp app.yaml.template app.yaml
   # Edit app.yaml with your production credentials
   ```

2. **Deploy to Google App Engine**
   ```bash
   ./deploy.sh
   ```

## 🗃️ Project Structure

```
scioly-codebusters/
├── main.py                 # Main Flask application
├── static/
│   ├── css/styles.css      # Main stylesheet with warm color theme
│   └── js/script.js        # Client-side cipher implementations
├── templates/
│   ├── index.html          # Main application interface
│   └── dashboard.html      # User profile dashboard
├── articles/               # Engineering articles content
├── requirements.txt        # Python dependencies
├── app.yaml.template       # Deployment configuration template
├── .env.template          # Environment variables template
├── dev.sh                 # Development setup script
├── deploy.sh              # Deployment script
└── README.md              # This file
```

## 🎨 Recent Updates

- ✨ Consistent width and styling across all tabs
- 🎨 Warm color theme with improved accessibility
- 🏷️ Descriptive taglines for all cipher types
- 📱 Enhanced mobile responsiveness
- 🔐 Improved tab navigation with better border visibility
- 🎯 Unified visual design language

## 🔒 Security

This application implements several security best practices:

- Environment variables for sensitive configuration
- Secure session management with Flask-Login
- Google OAuth 2.0 for authentication
- SQL injection prevention with SQLAlchemy ORM
- Secure file upload handling
- HTTPS enforcement in production

**Important**: Never commit files containing credentials to version control. Use the provided template files.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is designed for educational use in Science Olympiad competitions.

## 🏆 Perfect For

- Science Olympiad Code Busters teams
- Middle school cryptography education
- STEM clubs and activities
- Individual cipher practice
- Classroom demonstrations

---

**Good luck with your Science Olympiad competitions!** 🎯