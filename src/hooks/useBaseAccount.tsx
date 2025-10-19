import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createBaseAccountSDK } from '@base-org/account';
import { toast } from 'sonner';

// Check if we're in an iframe (like Lovable preview)
const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

interface BaseAccountContextType {
  isConnected: boolean;
  address: string | undefined;
  labsBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sdk: ReturnType<typeof createBaseAccountSDK> | null;
}

const BaseAccountContext = createContext<BaseAccountContextType | undefined>(undefined);

export const BaseAccountProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem("wallet_connected") === "true";
  });
  const [address, setAddress] = useState<string | undefined>(() => {
    return localStorage.getItem("wallet_address") || undefined;
  });
  const [labsBalance, setLabsBalance] = useState(() => {
    return localStorage.getItem("labs_balance") || "8,320";
  });

  // Initialize Base Account SDK
  const [sdk] = useState(() => createBaseAccountSDK({
    appName: 'H1 Labs',
    appLogoUrl: 'https://base.org/logo.png',
  }));

  const connectWallet = async () => {
    try {
      // Check if we're in an iframe environment
      if (isInIframe()) {
        // Use mock connection for iframe/preview environments
        const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
        const balance = "8,320";
        
        setAddress(mockAddress);
        setIsConnected(true);
        setLabsBalance(balance);
        
        localStorage.setItem("wallet_connected", "true");
        localStorage.setItem("wallet_address", mockAddress);
        localStorage.setItem("labs_balance", balance);
        
        toast.success("Wallet Connected! (Demo Mode)", {
          description: "Connected to Base Sepolia testnet",
        });
        return;
      }

      // Real wallet connection for production
      const provider = sdk.getProvider();
      
      // Request wallet connection
      await provider.request({ method: 'wallet_connect' });
      
      // Get accounts
      const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
      
      if (accounts && accounts.length > 0) {
        const userAddress = accounts[0];
        const balance = "8,320";
        
        setAddress(userAddress);
        setIsConnected(true);
        setLabsBalance(balance);
        
        // Persist to localStorage
        localStorage.setItem("wallet_connected", "true");
        localStorage.setItem("wallet_address", userAddress);
        localStorage.setItem("labs_balance", balance);
        
        toast.success("Wallet Connected!", {
          description: "Connected to Base Sepolia testnet",
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet", {
        description: "Please try again or deploy your app",
      });
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(undefined);
    localStorage.removeItem("wallet_connected");
    localStorage.removeItem("wallet_address");
    toast.info("Wallet Disconnected");
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const storedConnected = localStorage.getItem("wallet_connected") === "true";
      const storedAddress = localStorage.getItem("wallet_address");
      
      if (storedConnected && storedAddress) {
        // Skip provider check in iframe environments
        if (isInIframe()) {
          return;
        }

        try {
          const provider = sdk.getProvider();
          const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
          
          if (!accounts || accounts.length === 0) {
            // Connection lost, reset state
            disconnectWallet();
          }
        } catch (error) {
          // Silently handle errors in development/preview
          console.log("Connection check skipped in iframe environment");
        }
      }
    };

    checkConnection();
  }, [sdk]);

  return (
    <BaseAccountContext.Provider
      value={{
        isConnected,
        address,
        labsBalance,
        connectWallet,
        disconnectWallet,
        sdk,
      }}
    >
      {children}
    </BaseAccountContext.Provider>
  );
};

export const useBaseAccount = () => {
  const context = useContext(BaseAccountContext);
  if (context === undefined) {
    throw new Error('useBaseAccount must be used within a BaseAccountProvider');
  }
  return context;
};
