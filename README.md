# LOL Cat Generator Lambda Function

This AWS Lambda function generates LOL cat memes by combining random cat images with classic LOLcat phrases.

## Features

- Fetches random cat images from The Cat API
- Adds classic LOLcat phrases
- Stores generated images in S3
- Returns both image URL and the text used

## Prerequisites

1. AWS CLI installed and configured
2. Node.js 18.x or later
3. AWS account with appropriate permissions
4. AWS CLI profile named 'your-aws-profile' configured

## Setup

1. Install dependencies:
```bash
npm install
```

2. Environment Variables:
- `S3_BUCKET`: Name of the S3 bucket (default: your-aws-profile-lolcat-generator)

## Infrastructure

The function uses the following AWS resources:

- **Lambda Function**: `lolcat-generator`
  - Runtime: Node.js 18.x
  - Memory: 256MB
  - Timeout: 30 seconds
  
- **IAM Role**: `lolcat-generator-role`
  - Permissions:
    - Lambda Basic Execution
    - S3 (PutObject, GetObject, ListBucket)
    
- **S3 Bucket**: `your-aws-profile-lolcat-generator`
  - Stores generated meme images
  - Public read access for image URLs

## Deployment

Use the provided deployment script:
```bash
./deploy.sh
```

Or manually:
```bash
# Create deployment package
zip -r function.zip .

# Update Lambda function
aws lambda update-function-code \
    --function-name lolcat-generator \
    --zip-file fileb://function.zip \
    --profile your-aws-profile
```

## Usage

### AWS CLI
```bash
# Invoke function
aws lambda invoke \
    --function-name lolcat-generator \
    --payload '{}' \
    --profile your-aws-profile \
    output.json

# View result
cat output.json
```

### Response Format
```json
{
    "statusCode": 200,
    "body": {
        "message": "LOLcat generated successfully!",
        "url": "https://your-aws-profile-lolcat-generator.s3.amazonaws.com/lolcat-[timestamp].jpg",
        "text": "[Random LOLcat phrase]"
    }
}
```

## Available LOLcat Phrases

- "I CAN HAS CHEEZBURGER?"
- "OH HAI!"
- "KTHXBYE"
- "IM IN UR AWS, MAKING UR MEMES"
- "CEILING CAT IS WATCHING U"

## Error Handling

The function includes error handling for:
- S3 operations
- External API calls
- Invalid responses

Error responses will include:
```json
{
    "statusCode": 500,
    "body": {
        "message": "Error generating LOLcat",
        "error": "[Error details]"
    }
}
```

## Development

To add new features or modify the function:

1. Update the code in `index.js`
2. Test locally if possible
3. Run the deployment script
4. Test the deployed function

## Monitoring

- CloudWatch Logs: `/aws/lambda/lolcat-generator`
- S3 bucket contents: `aws s3 ls s3://your-aws-profile-lolcat-generator --profile your-aws-profile`
