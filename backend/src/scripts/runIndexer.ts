// Event Indexer Runner Script
import dotenv from 'dotenv';
import { EventIndexer } from '../services/eventIndexer.js';

dotenv.config();

console.log('');
console.log('╔═══════════════════════════════════════╗');
console.log('║   📡 H1 Labs Event Indexer          ║');
console.log('╚═══════════════════════════════════════╝');
console.log('');

const indexer = new EventIndexer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, stopping indexer...');
  indexer.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, stopping indexer...');
  indexer.stop();
  process.exit(0);
});

// Start indexer
indexer.start().catch((error) => {
  console.error('Fatal error in indexer:', error);
  process.exit(1);
});


