# Uniswap V3 Setup Guide for LABS Token

## Overview

This guide walks you through setting up a Uniswap V3 pool for LABS/WETH on Base Sepolia testnet, enabling real market-driven price discovery for the LABS token.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  H1 Labs Token Economy                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LABS Token (Platform Currency)                             │
│  ├─> Uniswap V3 Pool (LABS/WETH)                           │
│  │   └─> Market determines LABS price                      │
│  │                                                          │
│  └─> Used to buy H1 vault shares                           │
│                                                             │
│  H1 Token (Lab Vault Shares - per lab)                     │
│  └─> Bonding Curve                                         │
│      └─> Price = Vault NAV × 1.005 (0.5% premium)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Why Uniswap V3?

**LABS Token** needs a real market for price discovery:
- ✅ Real supply/demand dynamics
- ✅ Users can trade freely
- ✅ Price reflects actual market value
- ✅ Integration with DeFi ecosystem
- ✅ Built-in TWAP oracle for other contracts

**H1 Tokens** use bonding curves:
- Price based on vault performance (NAV)
- Not freely tradeable (vaults have lock periods)
- Each lab has its own H1 token

## Base Sepolia Addresses

```javascript
// Uniswap V3 Core
FACTORY: "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24"
POSITION_MANAGER: "0x27F971cb582BF9E50F397e4d29a5C7A34f11faA2"

// Tokens
WETH: "0x4200000000000000000000000000000000000006"
LABS: "0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd"
```

## Setup Steps

### 1. Create Pool

```bash
# Set your private key
export PRIVATE_KEY="your_private_key"

# Run pool creation script
node scripts/deploy-uniswap-pool.js
```

This will:
1. Check if LABS/WETH pool exists
2. Create pool if needed
3. Initialize with starting price (1 ETH = 1000 LABS)
4. Output pool address

### 2. Add Initial Liquidity

```bash
# Add liquidity to the pool
node scripts/add-liquidity.js
```

This will:
1. Approve LABS tokens
2. Add liquidity (1 ETH + 1000 LABS by default)
3. Mint NFT position token
4. Enable trading

### 3. Verify on Uniswap

Visit: `https://app.uniswap.org/#/pool/[POOL_ADDRESS]`

You should see:
- Pool details
- Current price
- Your liquidity position
- Trading interface

## Manual Setup (Alternative)

### Create Pool via Uniswap UI

1. Go to https://app.uniswap.org/
2. Connect wallet (Base Sepolia)
3. Click "Pool" → "New Position"
4. Select LABS and ETH
5. Choose 0.3% fee tier
6. Set price range
7. Enter amounts and add liquidity

### Using Etherscan

1. Go to Factory contract on Basescan
2. Call `createPool(LABS, WETH, 3000)`
3. Call `initialize(sqrtPriceX96)` on pool
4. Use Position Manager to add liquidity

## Price Calculation

### Understanding sqrtPriceX96

Uniswap V3 uses `sqrtPriceX96` format:
```
sqrtPriceX96 = sqrt(price) × 2^96
```

Where `price = token1 / token0`

### Examples

**1 ETH = 1000 LABS**

If LABS < WETH (LABS is token0):
```
price = WETH/LABS = 0.001 ETH per LABS
sqrtPriceX96 = sqrt(0.001) × 2^96
             ≈ 2.5 × 10^27
```

If WETH < LABS (WETH is token0):
```
price = LABS/WETH = 1000 LABS per ETH
sqrtPriceX96 = sqrt(1000) × 2^96
             ≈ 2.5 × 10^30
```

### Helper Function

```javascript
function calculateSqrtPriceX96(price) {
  const sqrt = Math.sqrt(price);
  const Q96 = 2 ** 96;
  return Math.floor(sqrt * Q96);
}

// For 1 ETH = 1000 LABS (LABS is token0)
const price = 0.001; // ETH per LABS
const sqrtPriceX96 = calculateSqrtPriceX96(price);
```

## Fee Tiers

| Fee Tier | Percentage | Best For |
|----------|-----------|----------|
| 500      | 0.05%     | Stable pairs (USDC/DAI) |
| 3000     | 0.3%      | **Standard pairs (recommended)** |
| 10000    | 1%        | Exotic/volatile pairs |

**Recommendation:** Use **3000 (0.3%)** for LABS/WETH

## Liquidity Strategy

### Full Range
```javascript
tickLower = -887220
tickUpper = 887220
```
- ✅ Covers all possible prices
- ✅ Always in range
- ❌ Less capital efficient

### Concentrated Range
```javascript
// Example: ±50% price range
tickLower = -6932  // ~50% below
tickUpper = 6931   // ~50% above
```
- ✅ More capital efficient
- ✅ Higher fee earnings
- ❌ Can go out of range
- ❌ Requires active management

**For testnet:** Use full range for simplicity

## Integration with Frontend

### Reading Pool Price

```typescript
// Pool ABI
const poolABI = [
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, ...)"
];

const pool = new ethers.Contract(poolAddress, poolABI, provider);
const slot0 = await pool.slot0();

// Convert sqrtPriceX96 to human-readable price
function sqrtPriceX96ToPrice(sqrtPriceX96, token0Decimals, token1Decimals) {
  const sqrtPrice = sqrtPriceX96 / (2 ** 96);
  const price = sqrtPrice ** 2;
  return price * (10 ** (token0Decimals - token1Decimals));
}

const price = sqrtPriceX96ToPrice(slot0.sqrtPriceX96, 18, 18);
console.log(`1 LABS = ${price} ETH`);
```

### Swap Interface

Users can trade on Uniswap UI, or integrate into your frontend:

```typescript
import { SwapWidget } from '@uniswap/widgets';

<SwapWidget
  tokenList={[LABS_TOKEN, WETH]}
  defaultInputToken={WETH}
  defaultOutputToken={LABS_TOKEN}
  provider={provider}
/>
```

## TWAP Oracle

Uniswap V3 pools have built-in time-weighted average price (TWAP) oracles:

```solidity
// Read TWAP from pool
function getTwap(address pool, uint32 secondsAgo) public view returns (uint256) {
  uint32[] memory secondsAgos = new uint32[](2);
  secondsAgos[0] = secondsAgo;
  secondsAgos[1] = 0;
  
  (int56[] memory tickCumulatives, ) = IUniswapV3Pool(pool).observe(secondsAgos);
  int56 tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];
  int24 arithmeticMeanTick = int24(tickCumulativesDelta / int56(uint56(secondsAgo)));
  
  // Convert tick to price
  return getQuoteAtTick(arithmeticMeanTick, 1e18, LABS_TOKEN, WETH);
}
```

## Maintenance

### Monitoring
- Check pool liquidity regularly
- Monitor price vs expected range
- Watch for impermanent loss

### Adjusting Liquidity
- Remove old positions
- Add new positions in updated ranges
- Rebalance as price moves

### Emergency
- Pool has no pause mechanism
- Can remove all liquidity if needed
- Migration requires new pool creation

## Next Steps

1. ✅ Deploy pool with scripts
2. ✅ Add initial liquidity
3. ✅ Test swaps on Uniswap UI
4. ✅ Integrate price feed into frontend
5. ✅ Update testnet addresses file
6. ⬜ Add swap widget to H1 Labs UI
7. ⬜ Monitor pool health

## Resources

- [Uniswap V3 Docs](https://docs.uniswap.org/protocol/concepts/V3-overview/concentrated-liquidity)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [Uniswap Interface](https://app.uniswap.org/)
- [TWAP Oracle Guide](https://docs.uniswap.org/protocol/concepts/V3-overview/oracle)

## Troubleshooting

### "Pool already exists"
- Good! Use existing pool address
- Just add liquidity

### "Insufficient LABS balance"
- Mint more LABS tokens
- Or reduce liquidity amount

### "Price initialized incorrectly"
- Cannot change after initialization
- Must create new pool with different fee tier

### "Transaction failed"
- Check token approvals
- Verify WETH balance
- Ensure correct token order (token0 < token1)

## Support

For issues or questions:
- Check Uniswap Discord
- Review Base docs
- Test on Basescan directly

