#!/bin/bash

# Scioly Code Breaker - Google Cloud Deployment Script
echo "🚀 Deploying Scioly Code Breaker to Google Cloud..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with Google Cloud:"
    gcloud auth login
fi

# Set project (you'll need to replace with your project ID)
echo "📋 Setting up Google Cloud project..."
echo "Please enter your Google Cloud Project ID:"
read -p "Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID is required. Exiting."
    exit 1
fi

# Set the project
gcloud config set project $PROJECT_ID

# Enable App Engine API if not already enabled
echo "🔧 Enabling App Engine API..."
gcloud services enable appengine.googleapis.com

# Deploy the application
echo "📤 Deploying to App Engine..."
gcloud app deploy --quiet

# Get the deployed URL
echo "✅ Deployment completed!"
echo "🌐 Your application is available at:"
gcloud app browse --no-launch-browser

echo ""
echo "🎉 Scioly Code Breaker is now live on Google Cloud!"
echo "📊 You can monitor your app at: https://console.cloud.google.com/appengine" 