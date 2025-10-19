import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createBaseAccountSDK } from '@base-org/account';
import { toast } from 'sonner';

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
        description: "Please try again",
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
        try {
          const provider = sdk.getProvider();
          const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
          
          if (!accounts || accounts.length === 0) {
            // Connection lost, reset state
            disconnectWallet();
          }
        } catch (error) {
          console.error("Error checking connection:", error);
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
