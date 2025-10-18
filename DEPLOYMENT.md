# LANChat Fly.io Deployment Guide

This guide walks you through deploying LANChat on fly.io. The application consists of two parts:
1. **Backend Server** - Node.js/Bun server with Socket.IO
2. **Frontend** - React SPA served by nginx

## Prerequisites

- [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/) installed
- Fly.io account (sign up at https://fly.io)
- Docker installed (for local testing)

## Environment Variables Required

The backend requires these environment variables to be set in fly.io:

```bash
# Required for Honcho AI Memory
HONCHO_API_KEY=your-honcho-api-key
HONCHO_BASE_URL=https://api.honcho.dev
HONCHO_WORKSPACE_ID=your-workspace-id

# Required for AI Agents (choose one option)
# Option A: OpenRouter
USE_OPENROUTER=true
MODEL=openai/gpt-4o-mini
OPENROUTER_API_KEY=your-openrouter-api-key

# Option B: Local Ollama (not recommended for fly.io)
# USE_OPENROUTER=false
# MODEL=llama3.1:8b
```

## Deployment Steps

### 1. Deploy Backend Server

```bash
# Navigate to project root
cd /path/to/LANChat

# Login to fly.io
fly auth login

# Create backend app (first time only)
fly apps create lanchat-backend --org personal

# Set environment variables
fly secrets set \
  HONCHO_API_KEY=your-honcho-api-key \
  HONCHO_BASE_URL=https://api.honcho.dev \
  HONCHO_WORKSPACE_ID=your-workspace-id \
  USE_OPENROUTER=true \
  MODEL=openai/gpt-4o-mini \
  OPENROUTER_API_KEY=your-openrouter-api-key \
  --app lanchat-backend

# Deploy backend
fly deploy --app lanchat-backend

# Check backend status
fly status --app lanchat-backend

# View logs
fly logs --app lanchat-backend
```

### 2. Deploy Frontend

```bash
# Navigate to frontend directory
cd frontend

# Create frontend app (first time only)
fly apps create lanchat-frontend --org personal

# Deploy frontend (the Dockerfile already has VITE_BACKEND_URL configured)
fly deploy --app lanchat-frontend

# Check frontend status
fly status --app lanchat-frontend

# View logs
fly logs --app lanchat-frontend
```

### 3. Verify Deployment

After deployment:

1. **Backend health check**: Visit `https://lanchat-backend.fly.dev/api/health`
   - Should return: `{"status":"healthy"}`

2. **Frontend**: Visit `https://lanchat-frontend.fly.dev`
   - Should load the chat interface
   - Check browser console for WebSocket connection

3. **WebSocket connection**: Open browser DevTools → Network → WS tab
   - Should see successful WebSocket connection to backend

## Local Testing Before Deployment

### Test Backend Docker Build

```bash
# From project root
docker build -t lanchat-backend .
docker run -p 3000:3000 --env-file .env lanchat-backend
```

### Test Frontend Docker Build

```bash
# From frontend directory
docker build --build-arg VITE_BACKEND_URL=http://localhost:3000 -t lanchat-frontend .
docker run -p 8080:80 lanchat-frontend
# Visit http://localhost:8080
```

## Configuration Files

### Backend (`fly.toml`)
- App: `lanchat-backend`
- Region: `ewr` (Newark)
- Port: 3000
- Memory: 512MB

### Frontend (`frontend/fly.toml`)
- App: `lanchat-frontend`
- Region: `ewr` (Newark)
- Port: 80
- Memory: 256MB
- Backend URL: `https://lanchat-backend.fly.dev`

## Updating After Changes

### Update Backend
```bash
fly deploy --app lanchat-backend
```

### Update Frontend
```bash
cd frontend
fly deploy --app lanchat-frontend
```

## Monitoring

### View Logs
```bash
# Backend logs
fly logs --app lanchat-backend

# Frontend logs
fly logs --app lanchat-frontend
```

### Check Resource Usage
```bash
fly status --app lanchat-backend
fly status --app lanchat-frontend
```

### Scale Resources (if needed)
```bash
# Scale backend memory
fly scale memory 1024 --app lanchat-backend

# Scale frontend
fly scale memory 512 --app lanchat-frontend
```

## Troubleshooting

### Backend Issues

1. **503 Service Unavailable**: Backend might be starting up (wait 30-60 seconds)
2. **WebSocket connection fails**: Check CORS settings in `src/server/index.ts`
3. **Environment variables not set**: Use `fly secrets list --app lanchat-backend`

### Frontend Issues

1. **Cannot connect to backend**: Verify `VITE_BACKEND_URL` in `frontend/fly.toml`
2. **Build fails**: Check Node version in `frontend/Dockerfile` (currently node:20-alpine)
3. **CORS errors**: Backend needs to allow frontend origin

### Check Environment Variables
```bash
fly secrets list --app lanchat-backend
```

### View Detailed Logs
```bash
fly logs --app lanchat-backend --verbose
```

## Cost Estimation

With the current configuration:
- Backend: ~$1.94/month (512MB RAM, shared CPU)
- Frontend: ~$1.94/month (256MB RAM, shared CPU)
- **Total: ~$3.88/month**

Note: First 3 VMs are free on fly.io, so this deployment should fall within free tier limits.

## Important Notes

1. **App Names**: The app names `lanchat-backend` and `lanchat-frontend` must be unique globally on fly.io. You may need to choose different names if these are taken.

2. **Backend URL**: The frontend is configured to connect to `https://lanchat-backend.fly.dev`. If you use a different backend app name, update `VITE_BACKEND_URL` in `frontend/fly.toml`.

3. **Regions**: Both apps are deployed to `ewr` (Newark) for low latency. Change this in the fly.toml files if needed.

4. **Auto-stop**: Currently set to `auto_stop_machines = "off"` to keep machines running. Set to `"stop"` to save costs but have cold starts.

5. **Secrets**: Never commit `.env` files. Always use `fly secrets set` for sensitive data.

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring/alerting
4. Consider using fly.io's Redis for session storage
5. Set up CI/CD for automated deployments
