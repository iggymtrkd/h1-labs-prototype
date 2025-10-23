// React Hook for Lab Events with Pagination Support
import { useState, useEffect } from 'react';
import { Log } from 'viem';
import { fetchLabEvents, fetchUserLabEvents } from '@/lib/eventScanner';

interface LabEventData {
  labId: bigint;
  owner: string;
  domain: string;
  stakedAmount: bigint;
  level: bigint;
}

export interface ParsedLabEvent {
  labId: string;
  owner: string;
  domain: string;
  stakedAmount: string;
  level: number;
  blockNumber: bigint;
  transactionHash: string;
}

export function useLabEvents(ownerAddress?: string, autoFetch: boolean = true) {
  const [labs, setLabs] = useState<ParsedLabEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rpcUsed, setRpcUsed] = useState<string>('');

  const parseLogs = (logs: Log[]): ParsedLabEvent[] => {
    return logs.map(log => {
      const args = (log as any).args as LabEventData;
      return {
        labId: args.labId.toString(),
        owner: args.owner,
        domain: args.domain,
        stakedAmount: args.stakedAmount.toString(),
        level: Number(args.level),
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      };
    });
  };

  const fetchLabs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = ownerAddress 
        ? await fetchUserLabEvents(ownerAddress)
        : await fetchLabEvents();
      
      const parsed = parseLogs(result.logs);
      setLabs(parsed);
      setRpcUsed(result.rpcUsed || '');
      
      console.log(`✅ Loaded ${parsed.length} labs from ${result.rpcUsed}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch labs';
      setError(errorMsg);
      console.error('❌ Failed to fetch lab events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchLabs();
    }
  }, [ownerAddress, autoFetch]);

  return {
    labs,
    loading,
    error,
    rpcUsed,
    refetch: fetchLabs,
  };
}
