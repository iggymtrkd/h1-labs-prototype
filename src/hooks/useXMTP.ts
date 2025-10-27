import { useState, useEffect, useCallback } from 'react';
import { Client, type Signer } from '@xmtp/browser-sdk';

export interface UseXMTPReturn {
  client: Client | null;
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
  initializeClient: (address: string, provider: any) => Promise<void>;
}

export function useXMTP(): UseXMTPReturn {
  const [client, setClient] = useState<Client | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeClient = useCallback(async (address: string, provider: any) => {
    if (isInitializing || client) return;
    
    setIsInitializing(true);
    setError(null);
    
    try {
      console.log('[XMTP] Initializing client with Browser SDK...');
      
      // Create XMTP Browser SDK signer for Smart Contract Wallet
      const signer: Signer = {
        type: 'SCW',
        getIdentifier: () => ({
          identifier: address.toLowerCase(),
          identifierKind: 'Ethereum',
        }),
        signMessage: async (message: string): Promise<Uint8Array> => {
          console.log('[XMTP] Requesting signature from wallet...');
          const signature = await provider.request({
            method: 'personal_sign',
            params: [message, address],
          });
          
          // Convert hex string to Uint8Array
          const bytes = new Uint8Array(
            signature.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
          );
          return bytes;
        },
        getChainId: () => BigInt(84532), // Base Sepolia chain ID
      };
      
      // Create XMTP client with Browser SDK
      const xmtpClient = await Client.create(signer, {
        env: 'dev' // Use dev for testnet
      });
      
      console.log('[XMTP] Client initialized successfully');
      setClient(xmtpClient);
      setIsReady(true);
    } catch (err: any) {
      console.error('[XMTP] Failed to initialize client:', err);
      setError(err.message || 'Failed to initialize XMTP messaging');
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
