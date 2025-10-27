// Polyfills for Node.js modules used by XMTP
import { Buffer } from 'buffer';

window.Buffer = Buffer;
window.global = window;
window.process = window.process || { env: {} };
