# Firebase Balance API

Backend API server for handling Firebase user balance operations in the n8n workflow.

## Why This API?

n8n blocks the `firebase-admin` module in Code nodes for security reasons. This separate API server handles all Firebase operations and is called by the n8n workflow via HTTP requests.

## Features

- ✅ Get user balance (auto-creates users with 500 SAR default)
- ✅ Deduct balance with validation
- ✅ Add balance (for testing/admin)
- ✅ Automatic user creation with default balance
- ✅ CORS enabled for n8n integration

## Setup

### 1. Install Dependencies

```bash
cd firebase-api
npm install
```

### 2. Firebase Configuration

**Option A: Service Account File (Recommended)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `serviceAccountKey.json` in this directory

**Option B: Environment Variables**

Create a `.env` file:

```bash
cp .env.example .env
```

Then add your Firebase credentials to `.env`.

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

```http
GET /health
```

### Get User Balance

```http
GET /api/user/:userId/balance
```

**Response:**

```json
{
  "success": true,
  "userId": "user123",
  "balance": 500,
  "currency": "SAR",
  "isNew": false
}
```

### Deduct Balance

```http
POST /api/user/:userId/deduct-balance
Content-Type: application/json

{
  "amount": 5.50
}
```

**Response:**

```json
{
  "success": true,
  "userId": "user123",
  "balanceBefore": 500,
  "balanceAfter": 494.5,
  "amountDeducted": 5.5,
  "currency": "SAR"
}
```

### Add Balance (Testing/Admin)

```http
POST /api/user/:userId/add-balance
Content-Type: application/json

{
  "amount": 100
}
```

## Testing

Test the API using curl:

```bash
# Health check
curl http://localhost:3001/health

# Get balance
curl http://localhost:3001/api/user/testUser123/balance

# Deduct balance
curl -X POST http://localhost:3001/api/user/testUser123/deduct-balance \
  -H "Content-Type: application/json" \
  -d '{"amount": 5.50}'

# Add balance
curl -X POST http://localhost:3001/api/user/testUser123/add-balance \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

## Firebase Firestore Structure

```
users (collection)
  └── {userId} (document)
      ├── balance: 500 (number)
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

## Deployment

For production deployment:

1. Ensure environment variables are set on your hosting platform
2. Set `PORT` environment variable if needed
3. Deploy the `firebase-api` directory
4. Update n8n workflow HTTP Request URLs to production URL

## Security

- ⚠️ Add authentication/API keys before deploying to production
- ⚠️ Never commit `serviceAccountKey.json` to Git
- ⚠️ Add `.env` to `.gitignore`

## Troubleshooting

**Error: "No Firebase credentials found"**

- Ensure `serviceAccountKey.json` exists OR environment variables are set

**Error: "EADDRINUSE"**

- Port 3001 is already in use. Change PORT in `.env`

**Error: "Permission denied"**

- Check Firebase service account has Firestore permissions
