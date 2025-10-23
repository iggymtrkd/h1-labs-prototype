import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createBaseAccountSDK } from '@base-org/account';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
    appLogoUrl: window.location.origin + '/favicon.png',
  }));

  const connectWallet = async () => {
    try {
      // Real wallet connection
      const provider = sdk.getProvider();
      
      // Request wallet connection
      await provider.request({ method: 'wallet_connect' });
      
      // Get accounts
      const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
      
      if (accounts && accounts.length > 0) {
        // Ensure address is properly checksummed and valid
        const rawAddress = accounts[0];
        const userAddress = rawAddress.toLowerCase(); // Use lowercase for consistency
        const balance = "8,320";
        
        console.log('🔍 Raw address from wallet:', rawAddress, `(${rawAddress.length} chars)`);
        console.log('🔍 Normalized address:', userAddress, `(${userAddress.length} chars)`);
        
        setAddress(userAddress);
        setIsConnected(true);
        setLabsBalance(balance);
        
        // Persist to localStorage
        localStorage.setItem("wallet_connected", "true");
        localStorage.setItem("wallet_address", userAddress);
        localStorage.setItem("labs_balance", balance);

        // Create or fetch user profile
        await createOrFetchUserProfile(userAddress);
        
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

  const createOrFetchUserProfile = async (walletAddress: string) => {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        return;
      }

      if (existingProfile) {
        console.log('Profile already exists:', existingProfile);
        return;
      }

      // Fetch Base/Farcaster profile data
      const profileData = await fetchBaseProfile(walletAddress);

      // Create new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          username: profileData.username,
          avatar_url: profileData.avatar_url,
          basename: profileData.basename,
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
      } else {
        console.log('Profile created successfully');
      }
    } catch (error) {
      console.error('Error in createOrFetchUserProfile:', error);
    }
  };

  const fetchBaseProfile = async (walletAddress: string) => {
    try {
      // Try to fetch Basename from Base
      const basenameResponse = await fetch(
        `https://api.basename.app/v1/name/${walletAddress}`
      );
      
      if (basenameResponse.ok) {
        const data = await basenameResponse.json();
        return {
          username: data.name || null,
          basename: data.name || null,
          avatar_url: data.avatar || null,
        };
      }

      // Fallback: Try Farcaster
      const farcasterResponse = await fetch(
        `https://fnames.farcaster.xyz/transfers/current?fid=${walletAddress}`
      );
      
      if (farcasterResponse.ok) {
        const data = await farcasterResponse.json();
        return {
          username: data.username || null,
          basename: null,
          avatar_url: data.pfp?.url || null,
        };
      }

      // Default fallback
      return {
        username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        basename: null,
        avatar_url: null,
      };
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return {
        username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        basename: null,
        avatar_url: null,
      };
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
          console.log("Connection check error:", error);
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
