# IOT Dashboard Serverless

## Prerequisites

- AWS Account with access to Lambda and EventBridge
- Firebase Project with Realtime Database
- Telegram Bot Token and Chat ID
- Node.js and npm installed locally (for development)

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project (if you don't have one already)
2. Set up the Realtime Database
3. Generate a Firebase Service Account:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

### 2. Telegram Bot Setup

1. Open Telegram and search for "BotFather"
2. Send `/newbot` and follow instructions to create a new bot
3. Save the API token provided by BotFather
4. Start a conversation with your new bot
5. Get your Chat ID:
   - Visit `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Look for the "chat" object and find the "id" value

### 3. Lambda Function Setup

1. Create a new directory for your project
2. Create `index.js` and `package.json` files using the provided code
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a deployment package:
   ```sh
   zip -r function.zip index.js node_modules package.json
   ```
5. Create a new Lambda function:

   - Open AWS Lambda console
   - Click "Create function"
   - Choose "Author from scratch"
   - Give it a name
   - Select Node.js runtime (14.x or later)
   - Click "Create function"
   - Upload the zip file

6. Configure environment variables:

   - `FIREBASE_SERVICE_ACCOUNT`: The entire JSON content of your service account key
   - `FIREBASE_DATABASE_URL`: Your Firebase RTDB URL
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
   - `TELEGRAM_CHAT_ID`: Your Telegram chat ID
   - `DATA_THRESHOLD`: The threshold value for alerts (modify as needed)

7. Adjust Lambda settings:
   - Increase timeout to 30 seconds or more
   - Adjust memory as needed (128MB is usually sufficient)

### 4. EventBridge (CloudWatch Events) Setup

1. Open the AWS EventBridge console
2. Click "Create rule"
3. Enter a name and description
4. Under "Define pattern", select "Schedule"
5. Choose a fixed rate (e.g., 5 minutes) or cron expression
6. Click "Next"
7. Under "Select targets", choose "Lambda function"
8. Select your Lambda function
9. Click "Next", then "Create rule"
