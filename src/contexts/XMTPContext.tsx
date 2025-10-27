import React, { createContext, useContext, useEffect } from 'react';
import { Client } from '@xmtp/browser-sdk';
import { useXMTP } from '@/hooks/useXMTP';
import { useAccount } from 'wagmi';
import { useBaseAccount } from '@/hooks/useBaseAccount';

interface XMTPContextValue {
  client: Client | null;
  isInitializing: boolean;
  isReady: boolean;
  error: string | null;
}

const XMTPContext = createContext<XMTPContextValue | undefined>(undefined);

export function XMTPProvider({ children }: { children: React.ReactNode }) {
  const { address: baseAddress } = useBaseAccount();
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { client, isInitializing, isReady, error, initializeClient } = useXMTP();

  // Use wagmi wallet for XMTP if connected, otherwise show connect prompt
  useEffect(() => {
    if (wagmiConnected && wagmiAddress && !client && !isInitializing && !error) {
      const initXMTP = async () => {
        try {
          console.log('[XMTPProvider] Initializing XMTP with wagmi wallet:', wagmiAddress);
          await initializeClient();
        } catch (err) {
          console.error('[XMTPProvider] Failed to initialize XMTP:', err);
        }
      };

      // Delay initialization slightly to ensure wallet is fully ready
      const timer = setTimeout(initXMTP, 500);
      return () => clearTimeout(timer);
    }
  }, [wagmiConnected, wagmiAddress, client, isInitializing, error, initializeClient]);

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
