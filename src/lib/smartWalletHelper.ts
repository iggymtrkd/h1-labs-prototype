// Smart Wallet Transaction Helper
// Converts ethers.js contract calls to Base Account SDK format

import { ethers } from 'ethers';

/**
 * Prepares a contract call for Base Account SDK smart wallets
 * @param contract - ethers.js contract instance
 * @param functionName - name of the function to call
 * @param args - function arguments
 * @returns Call object for wallet_sendCalls
 */
export async function prepareSmartWalletCall(
  contract: ethers.Contract,
  functionName: string,
  args: any[]
) {
  // Encode the function call
  const data = contract.interface.encodeFunctionData(functionName, args);
  
  return {
    to: await contract.getAddress(),
    data: data,
    value: '0x0', // Most calls don't send ETH
  };
}

/**
 * Execute a contract call using Base Account SDK smart wallet
 * @param provider - Base Account SDK provider
 * @param calls - Array of call objects
 * @returns Transaction hash
 */
export async function executeSmartWalletCalls(
  provider: any,
  calls: Array<{ to: string; data: string; value?: string }>
): Promise<string> {
  // Use wallet_sendCalls for smart wallets (EIP-5792)
  const callsId = await provider.request({
    method: 'wallet_sendCalls',
    params: [{
      version: '1.0',
      chainId: `0x${(84532).toString(16)}`, // Base Sepolia
      from: (await provider.request({ method: 'eth_accounts' }))[0],
      calls: calls.map(call => ({
        to: call.to,
        data: call.data,
        value: call.value || '0x0',
      })),
    }],
  });
  
  // Wait for the calls to complete
  let status = 'PENDING';
  let attempts = 0;
  const maxAttempts = 60; // 60 seconds timeout
  
  while (status === 'PENDING' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const callsStatus = await provider.request({
      method: 'wallet_getCallsStatus',
      params: [callsId],
    });
    
    status = callsStatus.status;
    
    if (status === 'CONFIRMED') {
      // Get the transaction hash from the receipt
      const txHash = callsStatus.receipts?.[0]?.transactionHash;
      if (!txHash) {
        throw new Error('Transaction confirmed but no hash returned');
      }
      return txHash;
    }
    
    attempts++;
  }
  
  if (status === 'PENDING') {
    throw new Error('Transaction timeout - still pending after 60 seconds');
  }
  
  throw new Error(`Transaction failed with status: ${status}`);
}

/**
 * Check if wallet supports smart wallet features (EIP-5792)
 */
export async function supportsSmartWallet(provider: any): Promise<boolean> {
  try {
    const capabilities = await provider.request({
      method: 'wallet_getCapabilities',
    });
    return !!capabilities;
  } catch {
    return false;
  }
}
