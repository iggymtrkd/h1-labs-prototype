import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ethers } from "npm:ethers@6.15.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Faucet configuration
const FAUCET_AMOUNT = '50000000000000000000000'; // 50000 LABS
const FAUCET_COOLDOWN = 86400; // 24 hours in seconds
const LABS_TOKEN_ADDRESS = '0xcbdc032c9525b307d3c2b4b8e099feedbd9024fd';
const RPC_URL = 'https://sepolia.base.org';

// Simple in-memory cooldown tracker
const cooldowns = new Map<string, number>();

const labsTokenAbi = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // POST /faucet/claim - Claim LABS tokens
    if (req.method === 'POST' && path.includes('/claim')) {
      const { walletAddress } = await req.json();

      if (!walletAddress || !ethers.isAddress(walletAddress)) {
        return new Response(
          JSON.stringify({ error: 'Invalid wallet address' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check cooldown
      const lastClaim = cooldowns.get(walletAddress.toLowerCase());
      const now = Date.now();
      if (lastClaim && now - lastClaim < FAUCET_COOLDOWN * 1000) {
        const remainingSeconds = Math.ceil(
          (FAUCET_COOLDOWN * 1000 - (now - lastClaim)) / 1000
        );
        return new Response(
          JSON.stringify({
            error: 'Cooldown active',
            remainingSeconds,
            nextClaimTime: lastClaim + FAUCET_COOLDOWN * 1000,
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Setup provider and wallet
      const privateKey = Deno.env.get('FAUCET_PRIVATE_KEY');
      if (!privateKey) {
        console.error('FAUCET_PRIVATE_KEY not configured');
        return new Response(
          JSON.stringify({ error: 'Faucet not configured' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const faucetWallet = new ethers.Wallet(privateKey, provider);
      const labsToken = new ethers.Contract(LABS_TOKEN_ADDRESS, labsTokenAbi, faucetWallet);

      // Check faucet balance
      const faucetBalance = await labsToken.balanceOf(faucetWallet.address);
      if (faucetBalance < BigInt(FAUCET_AMOUNT)) {
        return new Response(
          JSON.stringify({ error: 'Faucet empty, please try again later' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Send tokens
      console.log(`Sending ${FAUCET_AMOUNT} LABS to ${walletAddress}`);
      let tx;
      try {
        tx = await labsToken.transfer(walletAddress, FAUCET_AMOUNT);
        await tx.wait();
      } catch (txError: any) {
        // Check if it's a gas/funds error
        if (txError.code === 'INSUFFICIENT_FUNDS') {
          console.error('Faucet wallet needs ETH for gas fees');
          return new Response(
            JSON.stringify({ 
              error: 'Faucet wallet needs ETH for gas fees. Please contact support or try again later.' 
            }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw txError;
      }

      // Update cooldown
      cooldowns.set(walletAddress.toLowerCase(), now);

      console.log(`✅ Faucet claim successful: ${walletAddress} (${tx.hash})`);

      return new Response(
        JSON.stringify({
          success: true,
          amount: FAUCET_AMOUNT,
          txHash: tx.hash,
          nextClaimTime: now + FAUCET_COOLDOWN * 1000,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /faucet/status/:address - Check faucet status
    if (req.method === 'GET' && path.includes('/status/')) {
      const address = path.split('/status/')[1];

      if (!ethers.isAddress(address)) {
        return new Response(
          JSON.stringify({ error: 'Invalid address' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const privateKey = Deno.env.get('FAUCET_PRIVATE_KEY');
      if (!privateKey) {
        return new Response(
          JSON.stringify({ error: 'Faucet not configured' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const faucetWallet = new ethers.Wallet(privateKey, provider);
      const labsToken = new ethers.Contract(LABS_TOKEN_ADDRESS, labsTokenAbi, faucetWallet);

      const lastClaim = cooldowns.get(address.toLowerCase());
      const now = Date.now();
      const canClaim = !lastClaim || now - lastClaim >= FAUCET_COOLDOWN * 1000;

      // Get faucet balance
      const faucetBalance = await labsToken.balanceOf(faucetWallet.address);

      return new Response(
        JSON.stringify({
          canClaim,
          lastClaimTime: lastClaim || null,
          nextClaimTime: lastClaim ? lastClaim + FAUCET_COOLDOWN * 1000 : now,
          faucetBalance: ethers.formatEther(faucetBalance),
          faucetAmount: FAUCET_AMOUNT,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Faucet error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
