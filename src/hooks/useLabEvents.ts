// React Hook for Lab Events with Pagination Support
import { useState, useEffect } from 'react';
import { fetchLabEvents, fetchUserLabEvents, ParsedLabEvent } from '@/lib/eventScanner';

export function useLabEvents(ownerAddress?: string, autoFetch: boolean = true) {
  const [labs, setLabs] = useState<ParsedLabEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');

  const fetchLabs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = ownerAddress 
        ? await fetchUserLabEvents(ownerAddress)
        : await fetchLabEvents();
      
      setLabs(result.logs);
      setSource(result.source || '');
      
      console.log(`✅ Loaded ${result.logs.length} labs from ${result.source}`);
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
    source,
    refetch: fetchLabs,
  };
}
