# H1 Labs Backend

Backend API and Event Indexer for H1 Labs platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb h1labs

# Run migrations
psql h1labs < migrations/001_init.sql
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `RPC_URL` - Base Sepolia RPC URL
- `H1_DIAMOND_ADDRESS` - Deployed H1Diamond contract address
- `LABS_TOKEN_ADDRESS` - Deployed LABS token address
- `FAUCET_PRIVATE_KEY` - Private key for faucet wallet (testnet only)

### 4. Start Services

```bash
# Start API server
npm run dev

# In another terminal, start event indexer
npm run indexer
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # PostgreSQL connection
│   │   └── blockchain.ts     # Ethers.js provider
│   ├── routes/
│   │   ├── labs.ts           # Lab endpoints
│   │   ├── faucet.ts         # Faucet endpoints
│   │   └── analytics.ts      # Analytics endpoints
│   ├── services/
│   │   └── eventIndexer.ts   # Blockchain event indexer
│   ├── scripts/
│   │   └── runIndexer.ts     # Indexer runner
│   └── server.ts             # Main API server
├── migrations/
│   └── 001_init.sql          # Database schema
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔌 API Endpoints

### Labs
- `GET /api/labs` - List all labs
- `GET /api/labs/:id` - Get lab by ID
- `GET /api/labs/:id/deposits` - Get lab deposits
- `GET /api/labs/:id/redemptions` - Get lab redemptions

### Faucet (Testnet Only)
- `POST /api/faucet/claim` - Claim LABS tokens
- `GET /api/faucet/status/:address` - Check faucet status

### Analytics
- `GET /api/analytics/platform` - Platform statistics
- `GET /api/analytics/user/:address` - User statistics
- `GET /api/analytics/lab/:id` - Lab statistics

### Health
- `GET /health` - Server health check

## 🗃️ Database Schema

The database includes the following tables:
- `users` - User accounts and balances
- `labs` - Lab registry
- `events` - Blockchain events log
- `deposits` - Deposit history
- `redemptions` - Redemption history
- `apps` - App registry
- `lab_apps` - Lab-App relationships
- `faucet_claims` - Faucet claim history
- `analytics_cache` - Cached analytics data

## 📡 Event Indexer

The event indexer listens to blockchain events and updates the database in real-time.

Supported events:
- `LabCreated` - New lab created
- `VaultDeployed` - Vault deployed for lab
- `Deposited` - LABS deposited into vault
- `RedeemRequested` - Redemption requested
- `RedeemClaimed` - Redemption claimed
- `LevelChanged` - Lab level changed

## 🔧 Development

```bash
# Build TypeScript
npm run build

# Run in production
npm start

# Watch mode (development)
npm run dev
```

## 📊 Monitoring

- API logs: stdout (use PM2 or similar for production logging)
- Database queries: Slow queries logged (>1s)
- Health check: `GET /health`

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Use process manager (PM2, systemd, etc.)
4. Setup reverse proxy (nginx, caddy, etc.)
5. Configure SSL/TLS
6. Setup monitoring and alerts

## 📝 Notes

- The faucet is for testnet only and should be disabled in production
- Rate limiting is configured per IP address
- Database queries are cached for 5 minutes
- Event indexer polls every 5 seconds

## 🛠️ Troubleshooting

### Database connection fails
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database exists: `psql -l`

### Event indexer not catching events
- Check `H1_DIAMOND_ADDRESS` is correct
- Verify RPC_URL is accessible
- Check last processed block: `SELECT * FROM indexer_state`

### Faucet not working
- Verify `FAUCET_PRIVATE_KEY` is set
- Check faucet wallet has LABS tokens
- Verify LABS token address is correct

## 📚 Related Documentation

- [QUICK_START.md](../docs/QUICK_START.md) - Full integration guide
- [BACKEND_INTEGRATION_GUIDE.md](../docs/BACKEND_INTEGRATION_GUIDE.md) - Detailed backend guide


