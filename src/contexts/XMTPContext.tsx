import React, { createContext, useContext, useEffect } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { useXMTP } from '@/hooks/useXMTP';
import { useWallet } from '@/hooks/useWallet';

interface XMTPContextValue {
  client: Client | null;
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
}

const XMTPContext = createContext<XMTPContextValue | undefined>(undefined);

export function XMTPProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useWallet();
  const { client, isInitializing, isReady, error, initializeClient } = useXMTP();

  useEffect(() => {
    if (isConnected && address && !client && !isInitializing) {
      const initXMTP = async () => {
        if (!window.ethereum) {
          console.warn('[XMTPProvider] No ethereum provider available');
          return;
        }

        try {
          console.log('[XMTPProvider] Initializing XMTP for address:', address);
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          await initializeClient(signer);
        } catch (err) {
          console.error('[XMTPProvider] Failed to initialize XMTP:', err);
        }
      };

      initXMTP();
    }
  }, [isConnected, address, client, isInitializing, initializeClient]);

  const value: XMTPContextValue = {
    client,
    isInitializing,
    isReady,
    error,
  };

  return <XMTPContext.Provider value={value}>{children}</XMTPContext.Provider>;
}

export function useXMTPContext(): XMTPContextValue {
  const context = useContext(XMTPContext);
  if (context === undefined) {
    throw new Error('useXMTPContext must be used within XMTPProvider');
  }
  return context;
}
