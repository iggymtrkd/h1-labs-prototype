// Faucet Hook for H1 Labs (Testnet only)
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase.functions.invoke(`faucet/status/${address}`, {
        method: 'GET',
      });

      if (error) {
        throw error;
      }

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
      const { data, error } = await supabase.functions.invoke('faucet/claim', {
        method: 'POST',
        body: { walletAddress: address },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
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


