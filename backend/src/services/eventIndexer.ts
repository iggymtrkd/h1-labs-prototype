// Event Indexer Service
// Listens to blockchain events and updates database
import { ethers } from 'ethers';
import { provider, CONTRACTS } from '../config/blockchain.js';
import { query } from '../config/database.js';

// Event signatures
const EVENT_SIGNATURES = {
  LabCreated: 'LabCreated(uint256,address,string,string,string,address)',
  VaultDeployed: 'VaultDeployed(uint256,address,uint64,uint16)',
  Deposited: 'Deposited(address,address,uint256,uint256)',
  RedeemRequested: 'RedeemRequested(uint256,address,uint256,uint256,uint64)',
  RedeemClaimed: 'RedeemClaimed(uint256,address,uint256)',
  LevelChanged: 'LevelChanged(uint8,uint256)',
};

export class EventIndexer {
  private isRunning = false;
  private pollInterval = 5000; // 5 seconds

  async start() {
    if (this.isRunning) {
      console.warn('Indexer already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting event indexer...');
    console.log('Watching contract:', CONTRACTS.H1Diamond);

    // Start polling loop
    while (this.isRunning) {
      try {
        await this.processNewBlocks();
        await this.sleep(this.pollInterval);
      } catch (error) {
        console.error('Error in indexer loop:', error);
        await this.sleep(this.pollInterval * 2); // Back off on error
      }
    }
  }

  stop() {
    console.log('⏹️  Stopping event indexer...');
    this.isRunning = false;
  }

  private async processNewBlocks() {
    // Get last processed block
    const lastProcessed = await this.getLastProcessedBlock();
    const currentBlock = await provider.getBlockNumber();

    if (currentBlock <= lastProcessed) {
      return; // No new blocks
    }

    // Process blocks in batches
    const batchSize = 1000;
    const fromBlock = lastProcessed + 1;
    const toBlock = Math.min(currentBlock, fromBlock + batchSize - 1);

    console.log(`Processing blocks ${fromBlock} to ${toBlock}...`);

    // Fetch logs
    const logs = await provider.getLogs({
      address: CONTRACTS.H1Diamond,
      fromBlock,
      toBlock,
    });

    console.log(`Found ${logs.length} logs`);

    // Process each log
    for (const log of logs) {
      await this.processLog(log);
    }

    // Update last processed block
    await this.updateLastProcessedBlock(toBlock);
  }

  private async processLog(log: ethers.Log) {
    try {
      // Determine event type
      const eventName = this.getEventName(log.topics[0]);
      if (!eventName) return;

      console.log(`📝 Processing event: ${eventName} (tx: ${log.transactionHash})`);

      // Store raw event
      await query(
        `INSERT INTO events (
          block_number, transaction_hash, log_index, 
          event_name, contract_address, data, processed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (transaction_hash, log_index) DO NOTHING`,
        [
          parseInt(log.blockNumber.toString()),
          log.transactionHash,
          log.index,
          eventName,
          log.address,
          JSON.stringify({
            topics: log.topics,
            data: log.data,
          }),
          false,
        ]
      );

      // Process specific event types
      await this.handleEvent(eventName, log);
    } catch (error) {
      console.error('Error processing log:', error);
    }
  }

  private getEventName(topic: string): string | null {
    // Map topic hash to event name
    const eventHashes: Record<string, string> = {};
    for (const [name, signature] of Object.entries(EVENT_SIGNATURES)) {
      eventHashes[ethers.id(signature)] = name;
    }
    return eventHashes[topic] || null;
  }

  private async handleEvent(eventName: string, log: ethers.Log) {
    switch (eventName) {
      case 'LabCreated':
        await this.handleLabCreated(log);
        break;
      case 'VaultDeployed':
        await this.handleVaultDeployed(log);
        break;
      case 'Deposited':
        await this.handleDeposited(log);
        break;
      case 'RedeemRequested':
        await this.handleRedeemRequested(log);
        break;
      case 'RedeemClaimed':
        await this.handleRedeemClaimed(log);
        break;
      case 'LevelChanged':
        await this.handleLevelChanged(log);
        break;
    }
  }

  private async handleLabCreated(log: ethers.Log) {
    // LabCreated(uint256 indexed labId, address indexed owner, string name, string symbol, string domain, address h1Token)
    const labId = parseInt(log.topics[1], 16);
    const owner = ethers.getAddress('0x' + log.topics[2].slice(26));

    // Parse data (name, symbol, domain, h1Token)
    // Note: Parsing strings from ABI is complex, might need full ABI decoder
    // For now, just store basics

    await query(
      `INSERT INTO labs (id, owner_address, name, symbol, domain, vault_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id) DO UPDATE SET updated_at = NOW()`,
      [labId, owner, `Lab ${labId}`, `H1L${labId}`, 'Unknown', null]
    );

    await query(
      `INSERT INTO users (address) VALUES ($1) ON CONFLICT DO NOTHING`,
      [owner]
    );
  }

  private async handleVaultDeployed(log: ethers.Log) {
    // VaultDeployed(uint256 indexed labId, address vault, uint64 cooldownSeconds, uint16 exitCapBps)
    const labId = parseInt(log.topics[1], 16);
    const vaultAddress = ethers.getAddress('0x' + log.data.slice(26, 66));

    await query(
      `UPDATE labs SET vault_address = $1, updated_at = NOW() WHERE id = $2`,
      [vaultAddress, labId]
    );
  }

  private async handleDeposited(log: ethers.Log) {
    // Deposited(address indexed caller, address indexed receiver, uint256 assets, uint256 shares)
    const caller = ethers.getAddress('0x' + log.topics[1].slice(26));
    const receiver = ethers.getAddress('0x' + log.topics[2].slice(26));

    // Would need to decode data for assets and shares
    console.log('Deposited event:', { caller, receiver });
  }

  private async handleRedeemRequested(log: ethers.Log) {
    // RedeemRequested(uint256 indexed requestId, address indexed owner, uint256 sharesBurned, uint256 assets, uint64 unlockTime)
    console.log('RedeemRequested event');
  }

  private async handleRedeemClaimed(log: ethers.Log) {
    // RedeemClaimed(uint256 indexed requestId, address indexed owner, uint256 assets)
    console.log('RedeemClaimed event');
  }

  private async handleLevelChanged(log: ethers.Log) {
    // LevelChanged(uint8 newLevel, uint256 totalAssets)
    console.log('LevelChanged event');
  }

  private async getLastProcessedBlock(): Promise<number> {
    const rows = await query<{ last_processed_block: string }>(
      'SELECT last_processed_block FROM indexer_state WHERE id = 1'
    );
    return rows[0] ? parseInt(rows[0].last_processed_block) : 0;
  }

  private async updateLastProcessedBlock(blockNumber: number) {
    await query(
      'UPDATE indexer_state SET last_processed_block = $1, updated_at = NOW() WHERE id = 1',
      [blockNumber]
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default EventIndexer;


