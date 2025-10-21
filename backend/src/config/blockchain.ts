// Blockchain Configuration
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// RPC Provider
export const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || 'https://sepolia.base.org'
);

// Contract Addresses
export const CONTRACTS = {
  H1Diamond: process.env.H1_DIAMOND_ADDRESS || '',
  LABSToken: process.env.LABS_TOKEN_ADDRESS || '',
};

// Faucet Wallet (for testnet only)
let faucetWallet: ethers.Wallet | null = null;
if (process.env.FAUCET_PRIVATE_KEY) {
  faucetWallet = new ethers.Wallet(
    process.env.FAUCET_PRIVATE_KEY,
    provider
  );
  console.log('✅ Faucet wallet initialized:', faucetWallet.address);
}

export { faucetWallet };

// Constants
export const FAUCET_AMOUNT = process.env.FAUCET_AMOUNT || '50000000000000000000000'; // 50000 LABS
export const FAUCET_COOLDOWN = parseInt(process.env.FAUCET_COOLDOWN || '86400'); // 24 hours

// Validate configuration
if (!CONTRACTS.H1Diamond) {
  console.warn('⚠️  H1_DIAMOND_ADDRESS not set in environment');
}
if (!CONTRACTS.LABSToken) {
  console.warn('⚠️  LABS_TOKEN_ADDRESS not set in environment');
}

export default { provider, CONTRACTS, faucetWallet };




