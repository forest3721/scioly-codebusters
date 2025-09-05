# 🚀 Google Cloud Deployment Guide

This guide will help you deploy the Scioly Code Breaker application to Google Cloud Platform using App Engine.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google Cloud SDK**: Install the Google Cloud CLI tools
3. **Project ID**: A Google Cloud project ID

## Step 1: Install Google Cloud SDK

### macOS (using Homebrew):
```bash
brew install google-cloud-sdk
```

### Windows:
Download from: https://cloud.google.com/sdk/docs/install#windows

### Linux:
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

## Step 2: Initialize Google Cloud

1. **Login to Google Cloud**:
   ```bash
   gcloud auth login
   ```

2. **Create a new project** (if you don't have one):
   ```bash
   gcloud projects create YOUR_PROJECT_ID
   ```

3. **Set your project**:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

## Step 3: Deploy the Application

### Option A: Using the Automated Script (Recommended)

1. **Run the deployment script**:
   ```bash
   ./deploy.sh
   ```

2. **Follow the prompts** to enter your project ID

### Option B: Manual Deployment

1. **Enable App Engine API**:
   ```bash
   gcloud services enable appengine.googleapis.com
   ```

2. **Deploy the application**:
   ```bash
   gcloud app deploy
   ```

3. **Open the application**:
   ```bash
   gcloud app browse
   ```

## Step 4: Verify Deployment

After deployment, you should see output similar to:
```
✅ Deployment completed!
🌐 Your application is available at:
https://YOUR_PROJECT_ID.appspot.com
```

## Configuration Files

### `app.yaml`
- Configures App Engine to serve static files
- Routes all requests to the appropriate files
- Sets up the Python runtime environment

### `requirements.txt`
- Required for App Engine (even though we have no Python dependencies)
- Tells App Engine this is a Python application

## Custom Domain (Optional)

To use a custom domain:

1. **Add your domain** in Google Cloud Console
2. **Update DNS records** as instructed
3. **Configure SSL certificate** (automatic with App Engine)

## Monitoring and Logs

- **View logs**: `gcloud app logs tail`
- **Monitor performance**: Google Cloud Console → App Engine
- **Set up alerts**: Google Cloud Console → Monitoring

## Cost Considerations

- **App Engine Standard**: Free tier includes 28 instance hours/day
- **Static file hosting**: Very low cost for this type of application
- **Bandwidth**: Minimal for this application

## Troubleshooting

### Common Issues:

1. **"Project not found"**:
   - Verify your project ID is correct
   - Ensure you have access to the project

2. **"API not enabled"**:
   - Run: `gcloud services enable appengine.googleapis.com`

3. **"Authentication required"**:
   - Run: `gcloud auth login`

4. **"Permission denied"**:
   - Ensure you have App Engine Admin role
   - Check project permissions

### Useful Commands:

```bash
# Check current configuration
gcloud config list

# List all projects
gcloud projects list

# Check App Engine status
gcloud app describe

# View deployment logs
gcloud app logs tail

# Update deployed application
gcloud app deploy
```

## Security Considerations

- App Engine automatically handles SSL/TLS
- Static file serving is secure by default
- No server-side code execution (pure frontend)

## Performance Optimization

- Files are automatically compressed
- CDN distribution is handled by Google
- Static files are cached efficiently

## Support

- **Google Cloud Documentation**: https://cloud.google.com/appengine/docs
- **App Engine Status**: https://status.cloud.google.com/
- **Community Support**: https://stackoverflow.com/questions/tagged/google-app-engine

---

🎉 **Your Scioly Code Breaker is now live on Google Cloud!** 