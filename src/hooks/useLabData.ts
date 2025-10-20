// Lab Data Hook for H1 Labs
import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/contracts';

export interface Lab {
  id: number;
  owner_address: string;
  name: string;
  symbol: string;
  domain: string;
  vault_address: string;
  level: number;
  slots: number;
  total_assets: string;
  h1_price: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformStats {
  totalLabs: number;
  totalLabsStaked: string;
  totalRevenue: string;
  totalUsers: number;
  topLabsByTVL: Lab[];
}

export function useLabData() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all labs from backend
   */
  const fetchLabs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/labs`);
      if (!response.ok) {
        throw new Error('Failed to fetch labs');
      }

      const data = await response.json();
      setLabs(data.labs || []);
    } catch (err: any) {
      console.error('Error fetching labs:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch single lab by ID
   */
  const fetchLab = async (labId: number): Promise<Lab | null> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/labs/${labId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lab');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error fetching lab:', err);
      return null;
    }
  };

  /**
   * Fetch labs owned by a specific address
   */
  const fetchUserLabs = async (address: string): Promise<Lab[]> => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/labs?owner=${address}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch user labs');
      }

      const data = await response.json();
      return data.labs || [];
    } catch (err: any) {
      console.error('Error fetching user labs:', err);
      return [];
    }
  };

  /**
   * Fetch platform statistics
   */
  const fetchPlatformStats = async (): Promise<PlatformStats | null> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/analytics/platform`);
      if (!response.ok) {
        throw new Error('Failed to fetch platform stats');
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error fetching platform stats:', err);
      return null;
    }
  };

  // Auto-fetch labs on mount
  useEffect(() => {
    fetchLabs();
  }, []);

  return {
    labs,
    isLoading,
    error,
    fetchLabs,
    fetchLab,
    fetchUserLabs,
    fetchPlatformStats,
  };
}


