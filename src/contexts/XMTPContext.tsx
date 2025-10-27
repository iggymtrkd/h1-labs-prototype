import React, { createContext, useContext, useEffect } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { useXMTP } from '@/hooks/useXMTP';
import { useBaseAccount } from '@/hooks/useBaseAccount';

interface XMTPContextValue {
  client: Client | null;
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
}

const XMTPContext = createContext<XMTPContextValue | undefined>(undefined);

export function XMTPProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, sdk } = useBaseAccount();
  const { client, isInitializing, isReady, error, initializeClient } = useXMTP();

  useEffect(() => {
    if (isConnected && address && sdk && !client && !isInitializing && !error) {
      const initXMTP = async () => {
        try {
          console.log('[XMTPProvider] Initializing XMTP for address:', address);
          
          // Use the Base SDK provider to create a signer
          const baseProvider = sdk.getProvider();
          const ethersProvider = new ethers.BrowserProvider(baseProvider);
          const signer = await ethersProvider.getSigner();
          
          await initializeClient(signer);
        } catch (err) {
          console.error('[XMTPProvider] Failed to initialize XMTP:', err);
        }
      };

      // Delay initialization slightly to ensure wallet is fully ready
      const timer = setTimeout(initXMTP, 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, sdk, client, isInitializing, error, initializeClient]);

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
