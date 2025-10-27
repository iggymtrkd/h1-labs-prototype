import { useState, useEffect, useCallback } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';

export interface UseXMTPReturn {
  client: Client | null;
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
  initializeClient: (signer: ethers.Signer) => Promise<void>;
}

export function useXMTP(): UseXMTPReturn {
  const [client, setClient] = useState<Client | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = useCallback(async (signer: ethers.Signer) => {
    if (isInitializing || client) return;
    
    setIsInitializing(true);
    setError(null);
    
    try {
      console.log('[XMTP] Initializing client...');
      
      // Create XMTP client with the wallet signer
      const xmtpClient = await Client.create(signer, {
        env: 'dev' // Use dev for Base testnet compatibility
      });
      
      console.log('[XMTP] Client initialized successfully');
      setClient(xmtpClient);
      setIsReady(true);
    } catch (err: any) {
      console.error('[XMTP] Failed to initialize client:', err);
      
      // Handle specific signature errors from incompatible wallets
      if (err.message?.includes('CURVE.n') || err.message?.includes('signature')) {
        setError('Your wallet is not compatible with XMTP messaging. Please try using MetaMask or another standard Ethereum wallet.');
      } else {
        setError(err.message || 'Failed to initialize XMTP messaging');
      }
    } finally {
      setIsInitializing(false);
    }
  }, [client, isInitializing]);

  return {
    client,
    isInitializing,
    isReady,
    error,
    initializeClient,
  };
}
