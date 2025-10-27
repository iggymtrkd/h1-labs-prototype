import React, { createContext, useContext, useEffect } from 'react';
import { Client } from '@xmtp/browser-sdk';
import { useXMTP } from '@/hooks/useXMTP';
import { useAccount } from 'wagmi';

interface XMTPContextValue {
  client: Client | null;
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
}

const XMTPContext = createContext<XMTPContextValue | undefined>(undefined);

export function XMTPProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { client, isInitializing, isReady, error, initializeClient } = useXMTP();

  useEffect(() => {
    if (isConnected && address && !client && !isInitializing && !error) {
      const initXMTP = async () => {
        try {
          console.log('[XMTPProvider] Initializing XMTP for address:', address);
          await initializeClient();
        } catch (err) {
          console.error('[XMTPProvider] Failed to initialize XMTP:', err);
        }
      };

      // Delay initialization slightly to ensure wallet is fully ready
      const timer = setTimeout(initXMTP, 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, client, isInitializing, error, initializeClient]);

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
