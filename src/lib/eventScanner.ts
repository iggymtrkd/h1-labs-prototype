// Event Scanner with Chunked Fetching and RPC Fallback
import { createPublicClient, http, parseAbiItem, Log } from 'viem';
import { baseSepolia } from 'viem/chains';
import { CONTRACTS } from '@/config/contracts';

const CHUNK_SIZE = 1000n; // Blocks per chunk
const MAX_RETRIES = 3;

export interface EventScanResult {
  logs: Log[];
  success: boolean;
  rpcUsed?: string;
}

/**
 * Fetch events with chunked backward scanning and RPC fallback
 */
export async function fetchLabEvents(
  targetCount: number = 100,
  ownerFilter?: string
): Promise<EventScanResult> {
  const rpcEndpoints = [CONTRACTS.RPC_URL, ...CONTRACTS.RPC_FALLBACKS];
  
  for (const rpcUrl of rpcEndpoints) {
    try {
      console.log(`🔍 Attempting to fetch events from ${rpcUrl}`);
      
      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(rpcUrl),
      });
      
      const currentBlock = await client.getBlockNumber();
      const deploymentBlock = BigInt(CONTRACTS.DEPLOYMENT_BLOCK);
      
      let toBlock = currentBlock;
      let allLogs: Log[] = [];
      
      // Scan backwards in chunks until we have enough events or reach deployment block
      while (allLogs.length < targetCount && toBlock > deploymentBlock) {
        const fromBlock = toBlock - CHUNK_SIZE > deploymentBlock 
          ? toBlock - CHUNK_SIZE 
          : deploymentBlock;
        
        console.log(`📦 Scanning blocks ${fromBlock} to ${toBlock}`);
        
        const logs = await client.getLogs({
          address: CONTRACTS.H1Diamond as `0x${string}`,
          event: parseAbiItem('event LabCreated(uint256 indexed labId, address indexed owner, string domain, uint256 stakedAmount, uint256 level)'),
          args: ownerFilter ? { owner: ownerFilter as `0x${string}` } : undefined,
          fromBlock,
          toBlock,
        });
        
        // Add new logs to the beginning (maintain chronological order)
        allLogs = [...logs.reverse(), ...allLogs];
        
        console.log(`✅ Found ${logs.length} events in chunk (total: ${allLogs.length})`);
        
        if (fromBlock === deploymentBlock) break;
        toBlock = fromBlock - 1n;
      }
      
      return { 
        logs: allLogs.slice(0, targetCount), 
        success: true, 
        rpcUsed: rpcUrl 
      };
      
    } catch (error) {
      console.warn(`⚠️ RPC ${rpcUrl} failed:`, error);
      continue; // Try next RPC
    }
  }
  
  throw new Error('All RPC endpoints failed to fetch events');
}

/**
 * Fetch all labs without pagination (for dashboard overview)
 */
export async function fetchAllLabEvents(): Promise<EventScanResult> {
  return fetchLabEvents(1000); // Reasonable limit for all labs
}

/**
 * Fetch user-specific labs
 */
export async function fetchUserLabEvents(ownerAddress: string): Promise<EventScanResult> {
  return fetchLabEvents(100, ownerAddress.toLowerCase());
}
