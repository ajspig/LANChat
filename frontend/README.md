# LANChat Frontend

Minimal React frontend for Honcho LANChat with ASCII/monospace aesthetic.

## Development

```bash
# Install dependencies
npm install

# Start dev server (requires Node 20+)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Features

- **Auto-detect server**: Automatically connects to backend at port 3000
- **Dark/Light theme**: Toggle with button in header
- **User switching**: Select which user to send messages as
- **Insights panel**: Collapsible panel for future Honcho insights
- **Monospace aesthetic**: Terminal-like interface with minimal colors

## Deployment

### Fly.io

```bash
# Login to fly.io
fly auth login

# Launch app (first time)
fly launch

# Deploy updates
fly deploy
```

The frontend will be available at https://lanchat-frontend.fly.dev

## Environment

The frontend auto-detects the backend server by replacing port 5173 with 3000 in the current URL.

For production, update the server detection logic in `src/hooks/useSocket.ts` if needed.
