# 🔐 Google OAuth Setup Guide

This guide will help you set up Google OAuth credentials for the Scioly Code Breaker application.

## Step 1: Create Google Cloud Project (if not already done)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable the Google+ API (if not already enabled)

## Step 2: Create OAuth 2.0 Credentials

1. **Navigate to APIs & Services**:
   - Go to Google Cloud Console
   - Click on "APIs & Services" → "Credentials"

2. **Create OAuth 2.0 Client ID**:
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type

3. **Configure OAuth Consent Screen** (if prompted):
   - App name: "Scioly Code Breaker"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue

4. **Set up OAuth 2.0 Client ID**:
   - Name: "Scioly Code Breaker Web Client"
   - Authorized JavaScript origins:
     ```
     https://snr0-154605.uc.r.appspot.com
     http://localhost:8080
     ```
   - Authorized redirect URIs:
     ```
     https://snr0-154605.uc.r.appspot.com/login/callback
     http://localhost:8080/login/callback
     ```
   - Click "Create"

## Step 3: Get Your Credentials

After creating the OAuth 2.0 client, you'll get:
- **Client ID**: A long string ending with `.apps.googleusercontent.com`
- **Client Secret**: A secret string (keep this secure!)

## Step 4: Set Environment Variables

### For Local Development:
Create a `.env` file in your project root:
```bash
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### For Google App Engine:
Set environment variables in your `app.yaml`:
```yaml
env_variables:
  GOOGLE_CLIENT_ID: "your-client-id-here"
  GOOGLE_CLIENT_SECRET: "your-client-secret-here"
```

## Step 5: Update the Application

1. **Replace placeholder values** in `main.py`:
   ```python
   GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "your-actual-client-id")
   GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "your-actual-client-secret")
   ```

2. **Deploy to App Engine**:
   ```bash
   gcloud app deploy
   ```

## Step 6: Test the Authentication

1. **Visit your application**: https://snr0-154605.uc.r.appspot.com
2. **Click "Sign in with Google"**
3. **Complete the OAuth flow**
4. **Verify user creation** in the dashboard

## Security Considerations

- ✅ **Never commit credentials** to version control
- ✅ **Use environment variables** for sensitive data
- ✅ **Restrict redirect URIs** to your domain only
- ✅ **Monitor OAuth usage** in Google Cloud Console

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**:
   - Check that your redirect URI exactly matches what's configured
   - Include both HTTP and HTTPS versions for testing

2. **"Client ID not found"**:
   - Verify your Client ID is correct
   - Check that the OAuth consent screen is configured

3. **"Access blocked"**:
   - Ensure the Google+ API is enabled
   - Check that your app is not in testing mode (or add test users)

### Useful Commands:

```bash
# Check environment variables
echo $GOOGLE_CLIENT_ID

# Test locally
python main.py

# Deploy to App Engine
gcloud app deploy

# View logs
gcloud app logs tail
```

## Next Steps

After setting up OAuth:

1. **Test user registration** and login
2. **Verify profile creation** in the database
3. **Check statistics tracking** functionality
4. **Test dashboard features**

Your Scioly Code Breaker application now has full user authentication and profile management! 🎉 