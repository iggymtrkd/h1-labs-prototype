// Event Scanner using Blockscout API
import { keccak256, toHex, decodeEventLog } from 'viem';
import { CONTRACTS } from '@/config/contracts';

// Blockscout API endpoint for Base Sepolia
const BLOCKSCOUT_API = 'https://base-sepolia.blockscout.com/api';
const LOGS_PER_REQUEST = 1000;

// LabVaultDeployed event signature: LabVaultDeployed(uint256,address,address,string,string,string)
const LAB_VAULT_DEPLOYED_SIGNATURE = 'LabVaultDeployed(uint256,address,address,string,string,string)';
const LAB_VAULT_DEPLOYED_TOPIC0 = keccak256(toHex(LAB_VAULT_DEPLOYED_SIGNATURE));

// Define the LabVaultDeployed event ABI
const LAB_VAULT_DEPLOYED_ABI = [
  {
    type: 'event',
    name: 'LabVaultDeployed',
    inputs: [
      { name: 'labId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'vault', type: 'address', indexed: false },
      { name: 'name', type: 'string', indexed: false },
      { name: 'symbol', type: 'string', indexed: false },
      { name: 'domain', type: 'string', indexed: false },
    ],
  },
] as const;

export interface ParsedLabEvent {
  labId: string;
  owner: string;
  vault: string;
  name: string;
  symbol: string;
  domain: string;
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
    console.log(`🔍 Fetching ALL LabVaultDeployed events from Blockscout API`);
    console.log(`📍 Contract: ${CONTRACTS.H1Diamond}`);
    console.log(`📍 From block: ${CONTRACTS.DEPLOYMENT_BLOCK}`);
    console.log(`📍 Topic0: ${LAB_VAULT_DEPLOYED_TOPIC0}`);
    
    const params = {
      module: 'logs',
      action: 'getLogs',
      fromBlock: CONTRACTS.DEPLOYMENT_BLOCK.toString(),
      toBlock: 'latest',
      address: CONTRACTS.H1Diamond,
      topic0: LAB_VAULT_DEPLOYED_TOPIC0,
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
          abi: LAB_VAULT_DEPLOYED_ABI,
          data: log.data,
          topics: [log.topics[0], log.topics[1], log.topics[2]],
        }) as any;

        const args = decoded.args as {
          labId: bigint;
          owner: string;
          vault: string;
          name: string;
          symbol: string;
          domain: string;
        };

        return {
          labId: args.labId.toString(),
          owner: args.owner.toLowerCase(),
          vault: args.vault.toLowerCase(),
          name: args.name || `Lab #${args.labId.toString()}`,
          symbol: args.symbol || `H1L${args.labId.toString()}`,
          domain: args.domain || 'unknown',
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
