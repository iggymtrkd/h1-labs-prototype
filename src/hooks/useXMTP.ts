import { useState, useCallback } from 'react';
import { Client, type Signer } from '@xmtp/browser-sdk';
import { useWalletClient } from 'wagmi';

export interface UseXMTPReturn {
  client: Client | null;
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
  initializeClient: () => Promise<void>;
}

export function useXMTP(): UseXMTPReturn {
  const [client, setClient] = useState<Client | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();

  const initializeClient = useCallback(async () => {
    if (!walletClient) {
      setError('Please connect a wallet first');
      return;
    }
    if (isInitializing || client) return;
    
    setIsInitializing(true);
    setError(null);
    
    try {
      console.log('[XMTP] Initializing client with wagmi wallet...');
      
      // Create XMTP signer using wagmi wallet client
      const signer: Signer = {
        type: 'EOA', // Use EOA type for standard wallets
        getIdentifier: () => ({
          identifier: walletClient.account.address.toLowerCase(),
          identifierKind: 'Ethereum',
        }),
        signMessage: async (message: string): Promise<Uint8Array> => {
          console.log('[XMTP] Requesting signature from wallet...');
          const signature = await walletClient.signMessage({
            account: walletClient.account,
            message,
          });
          
          // Convert hex string to Uint8Array
          const hexString = signature.startsWith('0x') ? signature.slice(2) : signature;
          const bytes = new Uint8Array(
            hexString.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
          );
          return bytes;
        },
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
  }, [walletClient, client, isInitializing]);

  return {
    client,
    isInitializing,
    isReady,
    error,
    initializeClient,
  };
}
