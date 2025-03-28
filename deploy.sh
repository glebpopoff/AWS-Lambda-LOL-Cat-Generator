#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment process..."

# Check if AWS profile exists
if ! aws configure list --profile openbook &> /dev/null; then
    echo "❌ Error: AWS profile 'openbook' not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create deployment package
echo "📝 Creating deployment package..."
zip -r function.zip . -x "*.git*" "deploy.sh" "response.json" "*.zip"

# Update Lambda function
echo "🔄 Updating Lambda function..."
aws lambda update-function-code \
    --function-name lolcat-generator \
    --zip-file fileb://function.zip \
    --profile openbook

# Clean up
echo "🧹 Cleaning up..."
rm function.zip

# Test the function
echo "🧪 Testing the function..."
aws lambda invoke \
    --function-name lolcat-generator \
    --payload '{}' \
    --profile openbook \
    test-output.json > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "📄 Test output:"
    cat test-output.json
    rm test-output.json
else
    echo "❌ Test failed!"
    exit 1
fi
