// Lab Creation Hook for H1 Labs
import { useState } from 'react';
import { getLABSCoreFacet } from '../lib/contracts';
import { publicClient } from '../config/provider';

export interface CreateLabResult {
  success: boolean;
  labId?: number;
  vaultAddress?: string;
  txHash?: string;
  error?: string;
}

export function useLabCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);

  /**
   * Check if a domain is available
   */
  const checkDomainAvailability = async (domain: string): Promise<boolean> => {
    setIsCheckingDomain(true);
    try {
      const coreFacet = getLABSCoreFacet(false);
      const isAvailable = await coreFacet.read.isDomainAvailable([domain]) as boolean;
      return isAvailable;
    } catch (error) {
      console.error('Error checking domain:', error);
      return false;
    } finally {
      setIsCheckingDomain(false);
    }
  };

  /**
   * Create a new lab
   * @param name - Lab name (e.g., "My Research Lab")
   * @param symbol - H1 token symbol (e.g., "H1MRL")
   * @param domain - Lab domain/category (e.g., "Healthcare/Research")
   */
  const createLab = async (
    name: string,
    symbol: string,
    domain: string
  ): Promise<CreateLabResult> => {
    setIsCreating(true);

    try {
      // Validation
      if (!name || name.length === 0 || name.length > 50) {
        throw new Error('Lab name must be between 1 and 50 characters');
      }
      if (!symbol || symbol.length === 0 || symbol.length > 10) {
        throw new Error('Symbol must be between 1 and 10 characters');
      }
      if (!domain || domain.length === 0 || domain.length > 100) {
        throw new Error('Domain must be between 1 and 100 characters');
      }

      // Check domain availability
      const isAvailable = await checkDomainAvailability(domain);
      if (!isAvailable) {
        throw new Error('Domain already taken');
      }

      // Get contract with signer
      const coreFacet = getLABSCoreFacet(true);

      // Call createLab
      const hash = await coreFacet.write.createLab([name, symbol, domain]);

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Parse events to get labId and vaultAddress
      let labId: number | undefined;
      let vaultAddress: string | undefined;

      // Find LabCreated event
      for (const log of receipt.logs) {
        try {
          // LabCreated event has labId as first indexed parameter
          const topics = log.topics;
          if (topics.length >= 2) {
            labId = parseInt(topics[1], 16);
          }
        } catch (e) {
          // Continue searching
        }
      }

      // Find VaultDeployed event
      for (const log of receipt.logs) {
        try {
          // VaultDeployed event has vault address in data
          if (log.data.length > 2) {
            const addressHex = '0x' + log.data.slice(-40);
            if (addressHex.startsWith('0x') && addressHex.length === 42) {
              vaultAddress = addressHex;
              break;
            }
          }
        } catch (e) {
          // Continue searching
        }
      }

      console.log('Lab created successfully:', { labId, vaultAddress, hash });

      return {
        success: true,
        labId,
        vaultAddress,
        txHash: hash,
      };
    } catch (error: any) {
      console.error('Error creating lab:', error);
      return {
        success: false,
        error: error.message || 'Unknown error creating lab',
      };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createLab,
    checkDomainAvailability,
    isCreating,
    isCheckingDomain,
  };
}


