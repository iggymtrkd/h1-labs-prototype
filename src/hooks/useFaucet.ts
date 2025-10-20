// Faucet Hook for H1 Labs (Testnet only)
import { useState } from 'react';
import { API_CONFIG } from '../config/contracts';

export interface FaucetStatus {
  canClaim: boolean;
  lastClaimTime?: number;
  nextClaimTime?: number;
  faucetBalance: string;
}

export interface ClaimResult {
  success: boolean;
  amount?: string;
  txHash?: string;
  error?: string;
}

export function useFaucet() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  /**
   * Check faucet status for an address
   */
  const checkFaucetStatus = async (address: string): Promise<FaucetStatus | null> => {
    setIsChecking(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/faucet/status/${address}`
      );

      if (!response.ok) {
        throw new Error('Failed to check faucet status');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error checking faucet status:', error);
      return null;
    } finally {
      setIsChecking(false);
    }
  };

  /**
   * Claim LABS tokens from faucet
   */
  const claimFromFaucet = async (address: string): Promise<ClaimResult> => {
    setIsClaiming(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/faucet/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim from faucet');
      }

      return {
        success: true,
        amount: data.amount,
        txHash: data.txHash,
      };
    } catch (error: any) {
      console.error('Error claiming from faucet:', error);
      return {
        success: false,
        error: error.message || 'Unknown error claiming from faucet',
      };
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    checkFaucetStatus,
    claimFromFaucet,
    isClaiming,
    isChecking,
  };
}


