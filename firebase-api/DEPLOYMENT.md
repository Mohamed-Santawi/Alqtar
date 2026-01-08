# Firebase API Deployment Guide

## 🐳 Docker Networking Configuration

### Current Setup

The n8n workflow is configured to call:

- `http://localhost:3001/api/user/{userId}/balance`
- `http://localhost:3001/api/user/{userId}/deduct-balance`

### Deployment Scenarios

#### ✅ Scenario 1: Local Development (Both on Host)

```yaml
# n8n: Running locally or with host network
# Firebase API: npm start on host

Workflow URL: http://localhost:3001
Status: ✅ Works as configured
```

#### 🐳 Scenario 2: Docker Compose (Recommended for Production)

```yaml
# n8n: Docker container
# Firebase API: Docker container

Workflow URL: http://firebase-api:3001

# docker-compose.yml
version: "3.8"
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    networks:
      - app-network

  firebase-api:
    build: ./firebase-api
    container_name: firebase-api
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
    volumes:
      - ./firebase-api/serviceAccountKey.json:/app/serviceAccountKey.json:ro
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**Update workflow URLs to:** `http://firebase-api:3001`

#### 🔧 Scenario 3: n8n in Docker, API on Host

```yaml
# n8n: Docker container
# Firebase API: npm start on host

# Windows/Mac
Workflow URL: http://host.docker.internal:3001

# Linux
Workflow URL: http://172.17.0.1:3001
# (Or use --add-host flag in docker run)
```

---

## 🔄 How to Update Workflow URLs

### Option A: Manual Update (Recommended)

1. Open `My workflow.json` in text editor
2. Find and replace:
   - `http://localhost:3001` → `http://firebase-api:3001` (for Docker)
   - OR `http://localhost:3001` → `http://host.docker.internal:3001` (for mixed)

### Option B: Use n8n Environment Variables

In n8n workflow, you can create a "Set" node at the beginning:

```javascript
{
  FIREBASE_API_URL: "http://firebase-api:3001";
}
```

Then use: `{{ $node["Set"].json.FIREBASE_API_URL }}/api/user/...`

---

## 📋 Checklist for Your Setup

**Before deploying, answer these questions:**

- [ ] Is n8n running in Docker?

  - **Yes** → Continue below
  - **No** → Use `localhost:3001` ✅

- [ ] Is Firebase API running in Docker?

  - **Yes** → Use `http://firebase-api:3001`
  - **No** → Use `http://host.docker.internal:3001`

- [ ] Are both in the same Docker network?
  - **Yes** → Use service name `firebase-api:3001` ✅
  - **No** → Create shared network in docker-compose

---

## 🚀 Production Deployment Recommendations

### Best Practice: Docker Compose

Create `docker-compose.yml` in your project root:

```yaml
version: "3.8"

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
    volumes:
      - n8n_data:/home/node/.n8n
      - ./My workflow.json:/home/node/.n8n/workflows/research-workflow.json
    networks:
      - app-network

  firebase-api:
    build:
      context: ./firebase-api
      dockerfile: Dockerfile
    container_name: firebase-api
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    volumes:
      - ./firebase-api/serviceAccountKey.json:/app/serviceAccountKey.json:ro
    networks:
      - app-network

volumes:
  n8n_data:

networks:
  app-network:
    driver: bridge
```

**Workflow URLs:** `http://firebase-api:3001`

---

## 📦 Firebase API Dockerfile

Create `firebase-api/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY server.js ./

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.js"]
```

---

## ✅ Testing Docker Setup

```bash
# Start services
docker-compose up -d

# Check if containers are running
docker ps

# Test Firebase API from n8n container
docker exec -it n8n curl http://firebase-api:3001/health

# Expected output: {"status":"ok","message":"Firebase Balance API is running"}

# Check logs
docker-compose logs -f firebase-api
docker-compose logs -f n8n
```

---

## 🔍 Current Configuration

Your workflow currently uses: **`localhost:3001`**

**Action required:**

1. Determine your deployment scenario (see above)
2. Update workflow URLs accordingly
3. If using Docker, ensure both containers are on same network

Let me know your deployment setup and I can update the workflow URLs for you! 🚀
