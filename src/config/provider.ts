// Ethereum Provider Configuration for H1 Labs
import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import { CONTRACTS } from './contracts';

// Read-only public client (for queries)
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(CONTRACTS.RPC_URL),
});

// Get wallet client (for transactions)
export function getWalletClient() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum),
    });
  }
  throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.');
}

// Helper to get current account
export async function getAccount() {
  if (typeof window !== 'undefined' && window.ethereum) {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    }) as string[];
    return accounts[0] as `0x${string}`;
  }
  throw new Error('No wallet connected');
}

// Helper to switch to Base Sepolia
export async function switchToBaseSepolia() {
  if (!window.ethereum) {
    throw new Error('No wallet found');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x14a34' }], // 84532 in hex
    });
  } catch (error: any) {
    // Chain not added, add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x14a34',
          chainName: 'Base Sepolia',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [CONTRACTS.RPC_URL],
          blockExplorerUrls: [CONTRACTS.BLOCK_EXPLORER],
        }],
      });
    } else {
      throw error;
    }
  }
}

// Add to window type
declare global {
  interface Window {
    ethereum?: any;
  }
}

export { baseSepolia };


