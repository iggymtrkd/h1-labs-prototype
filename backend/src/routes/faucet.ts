// Faucet API Routes (Testnet Only)
import { Router, Request, Response } from 'express';
import { ethers } from 'ethers';
import { faucetWallet, FAUCET_AMOUNT, FAUCET_COOLDOWN } from '../config/blockchain.js';
import { query } from '../config/database.js';

const router = Router();

// Simple in-memory cooldown tracker (would use Redis in production)
const cooldowns = new Map<string, number>();

/**
 * POST /api/faucet/claim
 * Claim LABS tokens from faucet
 */
router.post('/claim', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    if (!faucetWallet) {
      return res.status(503).json({ error: 'Faucet not configured' });
    }

    // Check cooldown
    const lastClaim = cooldowns.get(walletAddress.toLowerCase());
    const now = Date.now();
    if (lastClaim && now - lastClaim < FAUCET_COOLDOWN * 1000) {
      const remainingSeconds = Math.ceil(
        (FAUCET_COOLDOWN * 1000 - (now - lastClaim)) / 1000
      );
      return res.status(429).json({
        error: 'Cooldown active',
        remainingSeconds,
        nextClaimTime: lastClaim + FAUCET_COOLDOWN * 1000,
      });
    }

    // Check faucet balance
    const labsTokenAbi = [
      'function transfer(address to, uint256 amount) returns (bool)',
      'function balanceOf(address account) view returns (uint256)',
    ];

    const labsToken = new ethers.Contract(
      process.env.LABS_TOKEN_ADDRESS!,
      labsTokenAbi,
      faucetWallet
    );

    const faucetBalance = await labsToken.balanceOf(faucetWallet.address);
    if (faucetBalance < BigInt(FAUCET_AMOUNT)) {
      return res.status(503).json({ error: 'Faucet empty, please try again later' });
    }

    // Send tokens
    const tx = await labsToken.transfer(walletAddress, FAUCET_AMOUNT);
    await tx.wait();

    // Update cooldown
    cooldowns.set(walletAddress.toLowerCase(), now);

    // Log claim
    await query(
      'INSERT INTO faucet_claims (address, amount, transaction_hash) VALUES ($1, $2, $3)',
      [walletAddress, FAUCET_AMOUNT, tx.hash]
    );

    console.log(`✅ Faucet claim: ${walletAddress} (${tx.hash})`);

    res.json({
      success: true,
      amount: FAUCET_AMOUNT,
      txHash: tx.hash,
      nextClaimTime: now + FAUCET_COOLDOWN * 1000,
    });
  } catch (error: any) {
    console.error('Faucet claim error:', error);
    res.status(500).json({ error: 'Failed to process faucet claim' });
  }
});

/**
 * GET /api/faucet/status/:address
 * Check faucet status for an address
 */
router.get('/status/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    if (!faucetWallet) {
      return res.status(503).json({ error: 'Faucet not configured' });
    }

    const lastClaim = cooldowns.get(address.toLowerCase());
    const now = Date.now();
    const canClaim = !lastClaim || now - lastClaim >= FAUCET_COOLDOWN * 1000;

    // Get faucet balance
    const labsTokenAbi = ['function balanceOf(address account) view returns (uint256)'];
    const labsToken = new ethers.Contract(
      process.env.LABS_TOKEN_ADDRESS!,
      labsTokenAbi,
      faucetWallet
    );
    const faucetBalance = await labsToken.balanceOf(faucetWallet.address);

    res.json({
      canClaim,
      lastClaimTime: lastClaim || null,
      nextClaimTime: lastClaim ? lastClaim + FAUCET_COOLDOWN * 1000 : now,
      faucetBalance: faucetBalance.toString(),
      faucetAmount: FAUCET_AMOUNT,
    });
  } catch (error: any) {
    console.error('Faucet status error:', error);
    res.status(500).json({ error: 'Failed to fetch faucet status' });
  }
});

export default router;


