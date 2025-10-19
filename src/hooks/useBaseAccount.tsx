import { useState, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

interface BaseAccountContextType {
  isConnected: boolean;
  address: string | undefined;
  labsBalance: string;
  setConnected: (address: string) => void;
  disconnectWallet: () => void;
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

  const setConnected = (userAddress: string) => {
    const balance = "8,320";
    
    setAddress(userAddress);
    setIsConnected(true);
    setLabsBalance(balance);
    
    localStorage.setItem("wallet_connected", "true");
    localStorage.setItem("wallet_address", userAddress);
    localStorage.setItem("labs_balance", balance);
    
    toast.success("Wallet Connected!", {
      description: "Connected to Base Sepolia testnet",
    });
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(undefined);
    localStorage.removeItem("wallet_connected");
    localStorage.removeItem("wallet_address");
    toast.info("Wallet Disconnected");
  };

  return (
    <BaseAccountContext.Provider
      value={{
        isConnected,
        address,
        labsBalance,
        setConnected,
        disconnectWallet,
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
