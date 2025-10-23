// Event Scanner using Blockscout API
import { keccak256, toHex, decodeEventLog } from 'viem';
import { CONTRACTS } from '@/config/contracts';

// Blockscout API endpoint for Base Sepolia
const BLOCKSCOUT_API = 'https://base-sepolia.blockscout.com/api';
const LOGS_PER_REQUEST = 1000;

// LabCreated event signature: LabCreated(uint256,address,string,string,string,address)
const LAB_CREATED_SIGNATURE = 'LabCreated(uint256,address,string,string,string,address)';
const LAB_CREATED_TOPIC0 = keccak256(toHex(LAB_CREATED_SIGNATURE));

// Define the LabCreated event ABI
const LAB_CREATED_ABI = [
  {
    type: 'event',
    name: 'LabCreated',
    inputs: [
      { name: 'labId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'symbol', type: 'string', indexed: false },
      { name: 'domain', type: 'string', indexed: false },
      { name: 'h1Token', type: 'address', indexed: false },
    ],
  },
] as const;

export interface ParsedLabEvent {
  labId: string;
  owner: string;
  name: string;
  symbol: string;
  domain: string;
  h1Token: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: number;
}

export interface EventScanResult {
  logs: ParsedLabEvent[];
  success: boolean;
  source: string;
}

/**
 * Fetch events using Blockscout API (all events, no filtering)
 */
export async function fetchLabEvents(
  targetCount: number = 100,
  ownerFilter?: string
): Promise<EventScanResult> {
  try {
    console.log(`🔍 Fetching ALL LabCreated events from Blockscout API`);
    console.log(`📍 Contract: ${CONTRACTS.H1Diamond}`);
    console.log(`📍 From block: ${CONTRACTS.DEPLOYMENT_BLOCK}`);
    console.log(`📍 Topic0: ${LAB_CREATED_TOPIC0}`);
    
    const params = {
      module: 'logs',
      action: 'getLogs',
      fromBlock: CONTRACTS.DEPLOYMENT_BLOCK.toString(),
      toBlock: 'latest',
      address: CONTRACTS.H1Diamond,
      topic0: LAB_CREATED_TOPIC0,
      page: '1',
      offset: LOGS_PER_REQUEST.toString()
    };

    const url = new URL(BLOCKSCOUT_API);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key as keyof typeof params]));

    console.log(`🌐 Requesting: ${url.toString()}`);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === '0' && data.message === 'No records found') {
      console.log('📭 No events found');
      return { logs: [], success: true, source: 'Blockscout API' };
    }

    if (data.status === '0') {
      throw new Error(data.message || 'Blockscout API error');
    }

    const results = data.result || [];
    console.log(`✅ Found ${results.length} raw events`);

    // Parse and decode events
    const parsedLogs: ParsedLabEvent[] = results.map((log: any) => {
      try {
        const decoded = decodeEventLog({
          abi: LAB_CREATED_ABI,
          data: log.data,
          topics: [log.topics[0], log.topics[1], log.topics[2]],
        }) as any;

        const args = decoded.args as {
          labId: bigint;
          owner: string;
          name: string;
          symbol: string;
          domain: string;
          h1Token: string;
        };

        return {
          labId: args.labId.toString(),
          owner: args.owner.toLowerCase(),
          name: args.name,
          symbol: args.symbol,
          domain: args.domain,
          h1Token: args.h1Token.toLowerCase(),
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          logIndex: parseInt(log.logIndex, 16),
        };
      } catch (error) {
        console.warn('Failed to decode log:', log, error);
        return null;
      }
    }).filter((log): log is ParsedLabEvent => log !== null);

    console.log(`✅ Parsed ${parsedLogs.length} events successfully`);

    // Apply owner filter in JavaScript if provided
    let filteredLogs = parsedLogs;
    if (ownerFilter) {
      const normalizedOwner = ownerFilter.toLowerCase();
      filteredLogs = parsedLogs.filter(log => log.owner === normalizedOwner);
      console.log(`🔍 Filtered to ${filteredLogs.length} events for owner ${ownerFilter}`);
    }

    return {
      logs: filteredLogs.slice(0, targetCount),
      success: true,
      source: 'Blockscout API'
    };

  } catch (error) {
    console.error('❌ Blockscout API failed:', error);
    throw new Error(`Failed to fetch events from Blockscout: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch all labs without pagination (for dashboard overview)
 */
export async function fetchAllLabEvents(): Promise<EventScanResult> {
  return fetchLabEvents(10000); // High limit for all labs
}

/**
 * Fetch user-specific labs
 */
export async function fetchUserLabEvents(ownerAddress: string): Promise<EventScanResult> {
  return fetchLabEvents(1000, ownerAddress.toLowerCase());
}
