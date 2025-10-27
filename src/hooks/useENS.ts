import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ENS_CACHE = new Map<string, string | null>();

export function useENS(address: string | null): {
  ensName: string | null;
  isLoading: boolean;
} {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setEnsName(null);
      return;
    }

    const fetchENS = async () => {
      // Check cache first
      if (ENS_CACHE.has(address)) {
        setEnsName(ENS_CACHE.get(address) || null);
        return;
      }

      setIsLoading(true);
      try {
        // Use mainnet for ENS resolution
        const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
        const name = await provider.lookupAddress(address);
        
        ENS_CACHE.set(address, name);
        setEnsName(name);
      } catch (err) {
        console.error('[ENS] Failed to resolve ENS name:', err);
        ENS_CACHE.set(address, null);
        setEnsName(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchENS();
  }, [address]);

  return { ensName, isLoading };
}

export function formatAddress(address: string, ensName?: string | null): string {
  if (ensName) return ensName;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
