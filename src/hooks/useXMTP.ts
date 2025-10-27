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
        env: 'production' // Use 'dev' for testing
      });
      
      console.log('[XMTP] Client initialized successfully');
      setClient(xmtpClient);
      setIsReady(true);
    } catch (err: any) {
      console.error('[XMTP] Failed to initialize client:', err);
      setError(err.message || 'Failed to initialize XMTP client');
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
