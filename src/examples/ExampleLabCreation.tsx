/**
 * Example Component: Lab Creation Flow
 * 
 * This example demonstrates how to use the H1 Labs hooks to:
 * 1. Connect a wallet
 * 2. Claim testnet LABS tokens
 * 3. Create a new lab
 * 4. Deposit LABS into the vault
 * 5. Request a redemption
 * 
 * Copy this pattern into your own components!
 */

import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useFaucet } from '../hooks/useFaucet';
import { useLabCreation } from '../hooks/useLabCreation';
import { useVault } from '../hooks/useVault';
import { useRedemption } from '../hooks/useRedemption';

export function ExampleLabCreation() {
  // Step 1: Wallet connection
  const { 
    address, 
    isConnected, 
    connectWallet, 
    chainId 
  } = useWallet();

  // Step 2: Faucet for testnet LABS
  const { 
    claimFromFaucet, 
    isClaiming 
  } = useFaucet();

  // Step 3: Lab creation
  const { 
    createLab, 
    isCreating, 
    checkDomainAvailability 
  } = useLabCreation();

  // Step 4: Vault operations
  const [vaultAddress, setVaultAddress] = useState<string | null>(null);
  const { 
    vaultData, 
    depositLABS, 
    isDepositing 
  } = useVault(vaultAddress);

  // Step 5: Redemption
  const { 
    requestRedeem, 
    isRedeeming 
  } = useRedemption(vaultAddress);

  // Form state
  const [labName, setLabName] = useState('');
  const [labSymbol, setLabSymbol] = useState('');
  const [labDomain, setLabDomain] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [redeemAmount, setRedeemAmount] = useState('');

  // Status messages
  const [status, setStatus] = useState('');

  // STEP 1: Connect Wallet
  const handleConnect = async () => {
    await connectWallet();
  };

  // STEP 2: Claim Testnet LABS
  const handleClaimFaucet = async () => {
    if (!address) return;
    
    setStatus('Claiming LABS from faucet...');
    const result = await claimFromFaucet(address);
    
    if (result.success) {
      setStatus(`✅ Claimed ${result.amount} LABS! Tx: ${result.txHash}`);
    } else {
      setStatus(`❌ Faucet claim failed: ${result.error}`);
    }
  };

  // STEP 3: Create Lab
  const handleCreateLab = async () => {
    if (!labName || !labSymbol || !labDomain) {
      setStatus('❌ Please fill in all lab details');
      return;
    }

    // Check domain availability first
    setStatus('Checking domain availability...');
    const isAvailable = await checkDomainAvailability(labDomain);
    
    if (!isAvailable) {
      setStatus('❌ Domain already taken. Try another.');
      return;
    }

    setStatus('Creating lab...');
    const result = await createLab(labName, labSymbol, labDomain);

    if (result.success) {
      setStatus(`✅ Lab created! ID: ${result.labId}, Vault: ${result.vaultAddress}`);
      setVaultAddress(result.vaultAddress || null);
    } else {
      setStatus(`❌ Lab creation failed: ${result.error}`);
    }
  };

  // STEP 4: Deposit LABS
  const handleDeposit = async () => {
    if (!depositAmount || !vaultAddress || !address) return;

    setStatus('Depositing LABS...');
    const result = await depositLABS(depositAmount, address);

    if (result.success) {
      setStatus(`✅ Deposited ${depositAmount} LABS! Tx: ${result.txHash}`);
      setDepositAmount('');
    } else {
      setStatus(`❌ Deposit failed: ${result.error}`);
    }
  };

  // STEP 5: Request Redemption
  const handleRedeem = async () => {
    if (!redeemAmount || !vaultAddress) return;

    setStatus('Requesting redemption...');
    const result = await requestRedeem(redeemAmount);

    if (result.success) {
      const unlockDate = new Date(result.unlockTime! * 1000);
      setStatus(`✅ Redemption requested! Request ID: ${result.requestId}. Unlocks: ${unlockDate.toLocaleString()}`);
      setRedeemAmount('');
    } else {
      setStatus(`❌ Redemption failed: ${result.error}`);
    }
  };

  // UI
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>H1 Labs Example: Lab Creation Flow</h1>

      {/* Status Message */}
      {status && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          background: status.includes('✅') ? '#d4edda' : '#f8d7da',
          borderRadius: '4px'
        }}>
          {status}
        </div>
      )}

      {/* Step 1: Wallet Connection */}
      <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Step 1: Connect Wallet</h2>
        {!isConnected ? (
          <button onClick={handleConnect} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Connect Wallet
          </button>
        ) : (
          <div>
            <p>✅ Connected: {address}</p>
            <p>Chain ID: {chainId} {chainId !== 84532 && '⚠️ (Please switch to Base Sepolia)'}</p>
          </div>
        )}
      </section>

      {isConnected && (
        <>
          {/* Step 2: Claim Testnet LABS */}
          <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Step 2: Get Testnet LABS</h2>
            <p>Claim 1000 LABS tokens from faucet (testnet only)</p>
            <button 
              onClick={handleClaimFaucet} 
              disabled={isClaiming}
              style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
              {isClaiming ? 'Claiming...' : 'Claim 1000 LABS'}
            </button>
          </section>

          {/* Step 3: Create Lab */}
          <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Step 3: Create a Lab</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Lab Name (e.g., My Research Lab)"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                style={{ padding: '8px' }}
              />
              <input
                type="text"
                placeholder="Symbol (e.g., H1MRL)"
                value={labSymbol}
                onChange={(e) => setLabSymbol(e.target.value)}
                style={{ padding: '8px' }}
              />
              <input
                type="text"
                placeholder="Domain (e.g., Healthcare/Research)"
                value={labDomain}
                onChange={(e) => setLabDomain(e.target.value)}
                style={{ padding: '8px' }}
              />
              <button 
                onClick={handleCreateLab} 
                disabled={isCreating}
                style={{ padding: '10px 20px', cursor: 'pointer' }}
              >
                {isCreating ? 'Creating Lab...' : 'Create Lab'}
              </button>
            </div>
          </section>

          {/* Step 4: Deposit LABS (only if lab created) */}
          {vaultAddress && (
            <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h2>Step 4: Deposit LABS</h2>
              <p>Vault Address: {vaultAddress}</p>
              {vaultData && (
                <div>
                  <p>Total Assets: {parseFloat(vaultData.totalAssets).toFixed(2)} LABS</p>
                  <p>Your Shares: {parseFloat(vaultData.userShares).toFixed(2)} H1</p>
                  <p>Level: {vaultData.level} | Slots: {vaultData.appSlots}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  type="number"
                  placeholder="Amount (e.g., 10000)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  style={{ padding: '8px', flex: 1 }}
                />
                <button 
                  onClick={handleDeposit} 
                  disabled={isDepositing}
                  style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                  {isDepositing ? 'Depositing...' : 'Deposit'}
                </button>
              </div>
            </section>
          )}

          {/* Step 5: Redemption (only if lab created) */}
          {vaultAddress && vaultData && parseFloat(vaultData.userShares) > 0 && (
            <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h2>Step 5: Request Redemption</h2>
              <p>You have {parseFloat(vaultData.userShares).toFixed(2)} H1 shares</p>
              <p>⚠️ Redemption has a 7-day cooldown period</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input
                  type="number"
                  placeholder="Shares to redeem (e.g., 100)"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                  style={{ padding: '8px', flex: 1 }}
                />
                <button 
                  onClick={handleRedeem} 
                  disabled={isRedeeming}
                  style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                  {isRedeeming ? 'Requesting...' : 'Request Redeem'}
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {/* Instructions */}
      <section style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>📖 How to Use This Example</h3>
        <ol>
          <li>Click "Connect Wallet" and approve in MetaMask</li>
          <li>Switch to Base Sepolia if prompted</li>
          <li>Click "Claim 1000 LABS" to get testnet tokens (24h cooldown)</li>
          <li>Fill in lab details and click "Create Lab"</li>
          <li>Wait for transaction to confirm (~2 seconds)</li>
          <li>Deposit LABS tokens to earn H1 shares</li>
          <li>Request redemption when ready (7-day cooldown)</li>
        </ol>
        <p><strong>Note:</strong> This is a complete end-to-end example. Use this pattern in your own components!</p>
      </section>
    </div>
  );
}

export default ExampleLabCreation;


