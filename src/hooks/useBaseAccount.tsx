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
  // Check for editor admin mode
  const isEditorAdmin = localStorage.getItem('editor_admin_mode') === 'true';
  
  const [isConnected, setIsConnected] = useState(() => {
    if (isEditorAdmin) return true;
    return localStorage.getItem("wallet_connected") === "true";
  });
  const [address, setAddress] = useState<string | undefined>(() => {
    if (isEditorAdmin) return '0xADMIN1234567890ABCDEF1234567890ABCDEF12';
    return localStorage.getItem("wallet_address") || undefined;
  });
  const [labsBalance, setLabsBalance] = useState(() => {
    if (isEditorAdmin) return '10,000';
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
        
        console.log('🔍 Raw address from wallet:', rawAddress, `(${rawAddress.length} chars)`);
        console.log('🔍 Normalized address:', userAddress, `(${userAddress.length} chars)`);
        
        // Check current network and switch to Base Sepolia if needed
        try {
          const chainIdHex = await provider.request({ method: 'eth_chainId' }) as string;
          const currentChainId = parseInt(chainIdHex, 16);
          console.log('🌐 Current network chainId:', currentChainId);
          
          // Base Sepolia chainId is 84532
          if (currentChainId !== 84532) {
            console.log('🔄 Wrong network detected, switching to Base Sepolia...');
            toast.info("Switching to Base Sepolia...", {
              description: "Please approve the network switch in your wallet",
            });
            
            try {
              // Try to switch to Base Sepolia
              await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x14a34' }], // 84532 in hex
              });
              console.log('✅ Switched to Base Sepolia');
            } catch (switchError: any) {
              // Chain not added yet (error code 4902)
              if (switchError.code === 4902) {
                console.log('📝 Base Sepolia not added, adding now...');
                await provider.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x14a34',
                    chainName: 'Base Sepolia',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://sepolia.base.org'],
                    blockExplorerUrls: ['https://sepolia.basescan.org'],
                  }],
                });
                console.log('✅ Base Sepolia added and switched');
              } else {
                throw switchError;
              }
            }
          } else {
            console.log('✅ Already on Base Sepolia');
          }
        } catch (networkError) {
          console.error('⚠️ Network check/switch error:', networkError);
          toast.error("Failed to switch network", {
            description: "Please manually switch to Base Sepolia in your wallet",
          });
          return;
        }
        
        const balance = "8,320";
        
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

  // Check for existing connection on mount and monitor network changes
  useEffect(() => {
    // Skip provider access in iframe (Lovable preview)
    if (isInIframe()) {
      console.log("⚠️ Running in iframe, skipping wallet provider initialization");
      return;
    }

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
          } else {
            // Check if still on Base Sepolia
            const chainIdHex = await provider.request({ method: 'eth_chainId' }) as string;
            const currentChainId = parseInt(chainIdHex, 16);
            if (currentChainId !== 84532) {
              console.warn('⚠️ Wallet is not on Base Sepolia');
              toast.error("Wrong Network", {
                description: "Please switch to Base Sepolia testnet to use this app",
              });
            }
          }
        } catch (error) {
          console.log("Connection check error:", error);
        }
      }
    };

    checkConnection();
    
    // Listen for network changes
    try {
      const provider = sdk.getProvider();
      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        console.log('🌐 Network changed to chainId:', newChainId);
        
        if (newChainId !== 84532) {
          toast.error("Wrong Network Detected", {
            description: "Please switch back to Base Sepolia (chainId 84532)",
            duration: 5000,
          });
        } else {
          toast.success("Network Switched", {
            description: "Connected to Base Sepolia",
          });
          // Reload the page to refresh provider connections
          window.location.reload();
        }
      };
      
      const handleAccountsChanged = (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          console.log('🔌 Wallet disconnected');
          disconnectWallet();
        } else if (accounts[0].toLowerCase() !== address?.toLowerCase()) {
          console.log('👤 Account changed');
          toast.info("Account Changed", {
            description: "Please reconnect your wallet",
          });
          disconnectWallet();
        }
      };
      
      // Add event listeners if provider supports them
      if (provider.on) {
        provider.on('chainChanged', handleChainChanged);
        provider.on('accountsChanged', handleAccountsChanged);
      }
      
      // Cleanup listeners on unmount
      return () => {
        if (provider.removeListener) {
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    } catch (error) {
      console.log("⚠️ Provider access blocked (likely in iframe):", error);
    }
  }, [sdk, address]);

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
