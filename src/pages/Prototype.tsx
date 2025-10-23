import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBaseAccount } from '@/hooks/useBaseAccount';
import { useFaucet } from '@/hooks/useFaucet';
import { useWindowSize } from '@/hooks/use-window-size';
import Confetti from 'react-confetti';
import { Beaker, Rocket, GraduationCap, Building2, Loader2, CheckCircle2, XCircle, Info, ArrowLeft, HelpCircle, CircleHelp, FileStack, PenTool } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/config/contracts';
import { LABSToken_ABI, LABSCoreFacet_ABI, DataValidationFacet_ABI, CredentialFacet_ABI, RevenueFacet_ABI, DiamondLoupeFacet_ABI, TestingFacet_ABI, BondingCurveFacet_ABI, BondingCurveSale_ABI, LabVault_ABI } from '@/contracts/abis';
import protocolFlowGuide from '@/assets/protocol-flow-guide.jpg';

// Available domains for lab creation
const AVAILABLE_DOMAINS = ['healthcare', 'medical', 'biotech', 'finance', 'legal', 'education', 'research', 'robotics', 'art', 'music', 'climate', 'agriculture', 'manufacturing', 'logistics', 'retail', 'other'] as const;
interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'error';
  stage: string;
  message: string;
  txHash?: string;
}
export default function Prototype() {
  const navigate = useNavigate();
  // User's connected Base wallet (NOT the faucet wallet)
  const {
    address,
    isConnected,
    connectWallet,
    sdk
  } = useBaseAccount();
  const {
    claimFromFaucet,
    checkFaucetStatus,
    isClaiming
  } = useFaucet();
  const {
    width,
    height
  } = useWindowSize();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [faucetBalance, setFaucetBalance] = useState<string | null>(null);
  const [userLabsBalance, setUserLabsBalance] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Progress tracking
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    // Stake & Create Lab
    step2: false,
    // Create Dataset
    step3: false,
    // Issue Credential
    step4: false // Purchase Dataset
  });

  // Wallet balances
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [stakedLabs, setStakedLabs] = useState<string>('0');
  const [labsOwned, setLabsOwned] = useState<number>(0);

  // Step 1: Stake LABS
  const [stakeAmount, setStakeAmount] = useState('1000');
  // Step 1: Two-step signing progress (Approve → Stake)
  type StepStatus = 'idle' | 'awaiting_signature' | 'pending' | 'confirmed' | 'error';
  const [stakeSteps, setStakeSteps] = useState<{
    approve: StepStatus;
    stake: StepStatus;
  }>({
    approve: 'idle',
    stake: 'idle'
  });

  // Step 2: Create Lab
  const [labName, setLabName] = useState('');
  const [labSymbol, setLabSymbol] = useState('');
  const [labDomain, setLabDomain] = useState('healthcare');

  // Step 2: Create Data (Devs)
  const [dataLabId, setDataLabId] = useState('1');
  const [dataContent, setDataContent] = useState('');
  const [dataDomain, setDataDomain] = useState('healthcare');

  // Step 3: Credentials (Scholars)
  const [credentialType, setCredentialType] = useState('Medical Degree');
  const [credentialDomain, setCredentialDomain] = useState('healthcare');

  // Step 4: Purchase Dataset (AI Companies)
  const [purchaseDatasetId, setPurchaseDatasetId] = useState('1');
  const [purchaseLabId, setPurchaseLabId] = useState('1');
  const [purchaseAmount, setPurchaseAmount] = useState('0.1');

  // Multi-wallet distribution tracking
  const [revenueDistribution, setRevenueDistribution] = useState<{
    buyback: string;
    developer: string;
    creator: string;
    scholar: string;
    treasury: string;
  } | null>(null);

  // Dataset metadata tracking
  const [datasetMetadata, setDatasetMetadata] = useState<{
    step1?: {
      labId: number;
      timestamp: Date;
      txHash: string;
      walletAddress: string;
    };
    step2?: {
      dataId: number;
      dataHash: string;
      timestamp: Date;
      txHash: string;
      creator: string;
      labId: number;
    };
    step3?: {
      credentialId: number;
      timestamp: Date;
      txHash: string;
      walletAddress: string;
      domain: string;
    };
    step4?: {
      purchaseTimestamp: Date;
      txHash: string;
      buyer: string;
      amount: string;
      dataIds: number[];
    };
  }>({});

  // H1 Marketplace state
  const [allLabsForMarketplace, setAllLabsForMarketplace] = useState<Array<{
    labId: number;
    name: string;
    symbol: string;
    domain: string;
    h1Price: string;
    tvl: string;
    curveAddress: string;
    vaultAddress: string;
    userH1Balance: string; // User's H1 token balance for this lab
  }>>([]);
  const [marketplaceAction, setMarketplaceAction] = useState<'buy' | 'sell'>('buy');
  const [selectedLabForTrade, setSelectedLabForTrade] = useState<number | null>(null);
  const [tradeAmount, setTradeAmount] = useState('1');
  const [loadingMarketplace, setLoadingMarketplace] = useState(false);

  // Step 5: User's Created Labs
  interface CreatedLab {
    labId: number;
    name: string;
    symbol: string;
    domain: string;
    vaultAddress: string;
    createdAt: Date;
    level: number; // ✅ NEW: Store actual level from contract
  }
  const [userCreatedLabs, setUserCreatedLabs] = useState<CreatedLab[]>([]);
  const [loadingLabs, setLoadingLabs] = useState(false);

  // Calculate lab level based on staked amount
  const MIN_STAKE_FOR_LAB = 100_000; // 100k LABS
  const LEVEL1_THRESHOLD = 100_000;
  const LEVEL2_THRESHOLD = 250_000;
  const LEVEL3_THRESHOLD = 500_000;
  const calculateLabLevel = (stakedAmount: number): number => {
    if (stakedAmount >= LEVEL3_THRESHOLD) return 3;
    if (stakedAmount >= LEVEL2_THRESHOLD) return 2;
    if (stakedAmount >= LEVEL1_THRESHOLD) return 1;
    return 0;
  };
  const currentStakedAmount = parseFloat(stakedLabs || '0');
  const projectedLabLevel = calculateLabLevel(currentStakedAmount);
  const canCreateLab = currentStakedAmount >= MIN_STAKE_FOR_LAB;
  const addLog = (type: LogEntry['type'], stage: string, message: string, txHash?: string) => {
    const log: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      stage,
      message,
      txHash
    };
    setLogs(prev => [log, ...prev]);
  };
  
  // Set max stake amount from available balance
  const handleSetMaxStake = async () => {
    if (!isConnected || !sdk || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
      const rpc = new ethers.JsonRpcProvider(CONTRACTS.RPC_URL);
      
      // Get LABS token address
      let labsTokenAddr = CONTRACTS.LABSToken;
      try {
        const testing = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, rpc);
        const params = await testing.getProtocolParams();
        if (params && params[0] && params[0] !== ethers.ZeroAddress) {
          labsTokenAddr = params[0];
        }
      } catch {}
      
      // Get LABS balance
      const labsToken = new ethers.Contract(labsTokenAddr, LABSToken_ABI, rpc);
      const balance = await labsToken.balanceOf(address);
      const balanceFormatted = ethers.formatEther(balance);
      
      // Set the stake amount to the max balance
      setStakeAmount(balanceFormatted);
      toast.success(`Max balance set: ${parseFloat(balanceFormatted).toLocaleString()} LABS`);
    } catch (error: any) {
      console.error('Error getting max balance:', error);
      toast.error('Failed to get balance');
    }
  };
  
  // Helper to reset staking state on error
  const resetStakingState = () => {
    setStakeSteps({ approve: 'idle', stake: 'idle' });
    setLoading(null);
  };

  const handleStakeLabs = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!sdk) {
      toast.error('Wallet SDK not initialized. Please reconnect your wallet.');
      return;
    }

    // Basic input validation before proceeding
    if (!stakeAmount || isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0) {
      toast.error('Enter a positive stake amount');
      return;
    }
    setLoading('stake');
    setStakeSteps({
      approve: 'idle',
      stake: 'idle'
    });
    addLog('info', 'Stage 1: Stake $LABS', `🎯 STARTING: Stake ${stakeAmount} LABS tokens to unlock Lab creation`);
    try {
      // Get provider from Base Account SDK
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
      const rpc = new ethers.JsonRpcProvider(CONTRACTS.RPC_URL);
      let signer = await provider.getSigner(address);
      // Ensure signer corresponds to connected wallet address
      try {
        const signerAddr = await signer.getAddress();
        if (signerAddr.toLowerCase() !== (address as string).toLowerCase()) {
          signer = await provider.getSigner(address);
        }
      } catch {}

      // Ensure wallet is on the expected network (Base Sepolia)
      let net = await provider.getNetwork();
      if (Number(net.chainId) !== CONTRACTS.CHAIN_ID) {
        const chainIdHex = '0x' + Number(CONTRACTS.CHAIN_ID).toString(16);
        addLog('info', 'Diagnostics', '🌐 Attempting to switch wallet to Base Sepolia...');
        try {
          await provider.send('wallet_switchEthereumChain', [{
            chainId: chainIdHex
          }]);
        } catch (switchErr: any) {
          // 4902 = chain not added to MetaMask
          if (switchErr?.code === 4902) {
            try {
              await provider.send('wallet_addEthereumChain', [{
                chainId: chainIdHex,
                chainName: 'Base Sepolia',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [CONTRACTS.RPC_URL],
                blockExplorerUrls: [CONTRACTS.BLOCK_EXPLORER]
              }]);
              await provider.send('wallet_switchEthereumChain', [{
                chainId: chainIdHex
              }]);
            } catch (addErr: any) {
              addLog('error', 'Diagnostics', `❌ Failed to add/switch Base Sepolia: ${addErr?.message || String(addErr)}`);
              toast.error('Could not switch to Base Sepolia in wallet');
              resetStakingState();
              return;
            }
          } else {
            addLog('error', 'Diagnostics', `❌ Failed to switch network: ${switchErr?.message || String(switchErr)}`);
            toast.error('Wrong network. Please switch to Base Sepolia.');
            resetStakingState();
            return;
          }
        }

        // Re-check network after switch
        net = await provider.getNetwork();
        if (Number(net.chainId) !== CONTRACTS.CHAIN_ID) {
          toast.error('Wrong network selected. Please switch to Base Sepolia.');
          resetStakingState();
          return;
        }
        addLog('success', 'Diagnostics', '✅ Wallet switched to Base Sepolia');
      }

      // Preflight diagnostics: verify routing, balances, allowance, and simulate
      const stakeAmountBN = ethers.parseEther(stakeAmount);

      // 1) Verify Diamond routes stakeLABS selector (info only - don't block)
      try {
        const loupe = new ethers.Contract(CONTRACTS.H1Diamond, DiamondLoupeFacet_ABI, rpc);
        const selector = ethers.id('stakeLABS(uint256)').slice(0, 10);
        const routedFacet: string = await loupe.facetAddress(selector);
        addLog('info', 'Diagnostics', `✅ stakeLABS selector routed to: ${routedFacet}`);
        if (routedFacet.toLowerCase() !== (CONTRACTS.LABSCoreFacet as string).toLowerCase()) {
          addLog('info', 'Diagnostics', `ℹ️ Note: Configured LABSCoreFacet=${CONTRACTS.LABSCoreFacet}, but selector routed to ${routedFacet}. Both are valid.`);
        }
      } catch (e: any) {
        addLog('info', 'Diagnostics', `ℹ️ Facet routing check skipped: ${e?.message || String(e)}`);
      }

      // 2) Verify contracts exist on chain (via RPC)
      const codeLABS = await rpc.getCode(CONTRACTS.LABSToken);
      const codeDiamond = await rpc.getCode(CONTRACTS.H1Diamond);
      if (codeLABS === '0x' || codeDiamond === '0x') {
        toast.error('Contract code missing on Base Sepolia (LABS or Diamond)');
        addLog('error', 'Diagnostics', `❌ Code missing. LABS=${codeLABS !== '0x'}, DIAMOND=${codeDiamond !== '0x'}`);
        resetStakingState();
        return;
      }

      // 3) Resolve LABS token address from on-chain params if available
      let labsTokenAddr = CONTRACTS.LABSToken as string;
      try {
        const testing = new ethers.Contract(CONTRACTS.H1Diamond, TestingFacet_ABI, rpc);
        const params = await testing.getProtocolParams();
        if (params && params[0] && params[0] !== ethers.ZeroAddress) {
          labsTokenAddr = params[0];
          addLog('info', 'Diagnostics', `🔧 labsToken from protocol params: ${labsTokenAddr}`);
        }
      } catch {}

      // Verify LABS balance and allowance (use RPC for reads)
      addLog('info', 'Diagnostics', `🧩 Using LABS token: ${labsTokenAddr}`);
      const labsToken = new ethers.Contract(labsTokenAddr, LABSToken_ABI, rpc);
      const [bal, allowance] = await Promise.all([labsToken.balanceOf(address), labsToken.allowance(address, CONTRACTS.H1Diamond)]);
      addLog('info', 'Diagnostics', `💰 LABS balance: ${ethers.formatEther(bal)} | allowance: ${ethers.formatEther(allowance)}`);
      
      // Use <= comparison to handle exact balance staking
      // If user wants to stake more than they have, reject
      if (stakeAmountBN > bal) {
        const actualBalance = ethers.formatEther(bal);
        toast.error(`Insufficient LABS balance. You have ${actualBalance} LABS but tried to stake ${stakeAmount} LABS`);
        addLog('error', 'Stage 1: Stake $LABS', `❌ Insufficient balance: ${actualBalance} LABS available, ${stakeAmount} LABS requested`);
        resetStakingState();
        return;
      }

      // 4) Approve Diamond to spend LABS (before simulation)
      addLog('info', 'Stage 1: Stake $LABS', `🔐 Requesting approval for ${stakeAmount} LABS...`);
      setStakeSteps(prev => ({
        ...prev,
        approve: 'awaiting_signature'
      }));
      const approvalTx = await new ethers.Contract(labsTokenAddr, LABSToken_ABI, signer).approve(CONTRACTS.H1Diamond, stakeAmountBN, {
        gasLimit: 80000
      });
      setStakeSteps(prev => ({
        ...prev,
        approve: 'pending'
      }));
      addLog('info', 'Stage 1: Stake $LABS', '⏳ Waiting for approval confirmation...');
      await approvalTx.wait();
      addLog('success', 'Stage 1: Stake $LABS', `✅ Approval confirmed! ${stakeAmount} LABS authorized`, approvalTx.hash);
      setStakeSteps(prev => ({
        ...prev,
        approve: 'confirmed'
      }));

      // 5) Re-check allowance after approval (with small delay for RPC sync)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s for RPC to sync
      try {
        const newAllowance = await labsToken.allowance(address, CONTRACTS.H1Diamond);
        addLog('info', 'Diagnostics', `✅ New allowance: ${ethers.formatEther(newAllowance)}`);
        if (newAllowance < stakeAmountBN) {
          addLog('info', 'Diagnostics', `⏳ RPC still syncing... Requesting approval confirmation`);
          try {
            // Reset allowance to 0 first (some tokens require this)
            const zeroTx = await new ethers.Contract(labsTokenAddr, LABSToken_ABI, signer).approve(CONTRACTS.H1Diamond, 0n);
            await zeroTx.wait();
            // Then approve the amount again
            const reapproveTx = await new ethers.Contract(labsTokenAddr, LABSToken_ABI, signer).approve(CONTRACTS.H1Diamond, stakeAmountBN);
            await reapproveTx.wait();
            // Wait for RPC sync again
            await new Promise(resolve => setTimeout(resolve, 1000));
            const finalAllowance = await labsToken.allowance(address, CONTRACTS.H1Diamond);
            addLog('success', 'Diagnostics', `✅ Approval confirmed! Final allowance: ${ethers.formatEther(finalAllowance)}`);
            if (finalAllowance < stakeAmountBN) {
              toast.error('Allowance remained insufficient after re-approval');
              resetStakingState();
              return;
            }
          } catch (resetErr: any) {
            addLog('error', 'Diagnostics', `❌ Failed to re-approve: ${resetErr?.message || String(resetErr)}`);
            toast.error('Approval reset failed');
            resetStakingState();
            return;
          }
        }
      } catch {}

      // 6) Small delay to allow RPCs to index the new allowance
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Log balances for reference
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      addLog('info', 'Stage 1: Stake $LABS', `💰 Wallet ETH balance: ${parseFloat(balanceInEth).toFixed(4)} ETH`);

      // Stake LABS via LABSCoreFacet
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, signer);
      addLog('info', 'Stage 1: Stake $LABS', '📡 Broadcasting stake transaction to LABSCoreFacet...');
      setStakeSteps(prev => ({
        ...prev,
        stake: 'awaiting_signature'
      }));
      let stakeTx;
      try {
        stakeTx = await diamond.stakeLABS(stakeAmountBN, {
          gasLimit: 180000
        });
      } catch (sendErr: any) {
        addLog('error', 'Stage 1: Stake $LABS', `❌ Failed to send stake tx: ${sendErr?.shortMessage || sendErr?.message || String(sendErr)}`);
        toast.error('Failed to send stake transaction');
        resetStakingState();
        return;
      }
      setStakeSteps(prev => ({
        ...prev,
        stake: 'pending'
      }));
      addLog('info', 'Stage 1: Stake $LABS', '⏳ Mining stake transaction...');
      await stakeTx.wait();
      addLog('success', 'Stage 1: Stake $LABS', `✅ COMPLETE: ${stakeAmount} LABS staked successfully! To create a lab, you need 100,000 LABS staked.`, stakeTx.hash);
      setShowConfetti(true);
      toast.success('LABS staked successfully!');
      setStakeSteps(prev => ({
        ...prev,
        stake: 'confirmed'
      }));

      // Auto-hide confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);

      // Reload balances
      await loadUserLabsBalance();
      // Optimistically update staked balance in UI
      try {
        const current = parseFloat(stakedLabs || '0');
        const delta = parseFloat(ethers.formatEther(stakeAmountBN));
        setStakedLabs((current + delta).toString());
      } catch {}
      
      // Reset loading state after successful stake
      setLoading(null);
    } catch (error: any) {
      console.error('❌ Stake error:', error);
      addLog('error', 'Stage 1: Stake $LABS', `❌ ${error.message || 'Failed to stake LABS tokens'}`);
      toast.error('Failed to stake LABS');
      resetStakingState();
    }
  };
  const handleCreateLab = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!labName || !labSymbol || !labDomain) {
      toast.error('Please fill in all lab details');
      return;
    }

    // Check staked balance before attempting to create lab
    const stakedAmount = parseFloat(stakedLabs || '0');
    if (stakedAmount < MIN_STAKE_FOR_LAB) {
      const needed = MIN_STAKE_FOR_LAB - stakedAmount;
      toast.error(`Insufficient staked LABS. You need at least ${MIN_STAKE_FOR_LAB.toLocaleString()} LABS to create a lab. Please stake ${needed.toLocaleString()} more LABS.`);
      addLog('error', 'Stage 1: Create Lab', `❌ Cannot create lab - only ${stakedAmount.toLocaleString()} LABS staked. Need at least ${MIN_STAKE_FOR_LAB.toLocaleString()} LABS`);
      return;
    }
    if (!sdk) {
      toast.error('Wallet SDK not initialized. Please reconnect your wallet.');
      return;
    }
    setLoading('createLab');
    const labLevel = calculateLabLevel(stakedAmount);
    addLog('info', 'Stage 1: Create Lab', `🏗️ STARTING: Create "${labName}" (${labSymbol}) lab in ${labDomain} domain - Lab Level ${labLevel}`);
    try {
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
      let signer = await provider.getSigner(address);
      try {
        const signerAddr = await signer.getAddress();
        if (signerAddr.toLowerCase() !== (address as string).toLowerCase()) {
          signer = await provider.getSigner(address);
        }
      } catch {}
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, signer);
      addLog('info', 'Stage 1: Create Lab', '📡 Broadcasting lab creation transaction to LABSCoreFacet...');
      const createTx = await diamond.createLab(labName, labSymbol, labDomain);
      addLog('info', 'Stage 1: Create Lab', '⏳ Mining lab creation & auto-deploying LabVault contract...');
      const receipt = await createTx.wait();

      // Parse events to get lab ID, vault address, and level
      const iface = new ethers.Interface(LABSCoreFacet_ABI);
      let labId: number | string = "unknown";
      let vaultAddress = '';
      let eventLevel = 0;
      
      // Try to find and parse LabCreated event from logs
      for (const log of receipt.logs) {
        try {
          const decoded = iface.parseLog(log);
          if (decoded && decoded.name === "LabCreated") {
            // Successfully decoded the event
            labId = ethers.toNumber(decoded.args[0]); // First arg is labId
            vaultAddress = decoded.args[5]; // 6th arg is vault address
            eventLevel = Number(decoded.args[6]); // 7th arg is level
            console.log('✅ LabCreated event decoded:', { labId, vaultAddress, eventLevel });
            break;
          }
        } catch (e) {
          // This log isn't a LabCreated event, try next one
          continue;
        }
      }

      // Add to user's created labs
      const newLab: CreatedLab = {
        labId: typeof labId === 'number' ? labId : parseInt(labId),
        name: labName,
        symbol: labSymbol,
        domain: labDomain,
        vaultAddress: vaultAddress,
        createdAt: new Date(),
        level: eventLevel // ✅ NEW: Use actual level from contract event
      };
      setUserCreatedLabs(prev => [newLab, ...prev]);
      addLog('success', 'Stage 1: Create Lab', `✅ STEP 1 COMPLETE: Lab "${labName}" created (ID: ${labId}, Level ${eventLevel}) with vault deployed!`, createTx.hash);
      toast.success(`Step 1 Complete! Lab created with ID: ${labId} (Level ${eventLevel})`);
      setCompletedSteps(prev => ({
        ...prev,
        step1: true
      }));
      setDatasetMetadata(prev => ({
        ...prev,
        step1: {
          labId: typeof labId === 'number' ? labId : parseInt(labId as string),
          timestamp: new Date(),
          txHash: createTx.hash,
          walletAddress: address as string
        }
      }));

      // Reset form
      setLabName('');
      setLabSymbol('');
      setLabDomain('healthcare');

      // Refresh lab count and marketplace
      await loadUserLabsFromEvents();
    } catch (error: any) {
      console.error('Create lab error:', error);
      addLog('error', 'Stage 1: Create Lab', `❌ ${error.message || 'Failed to create lab'}`);
      toast.error('Failed to create lab');
    } finally {
      setLoading(null);
    }
  };
  const loadFaucetBalance = async () => {
    if (!address) return;
    try {
      const status = await checkFaucetStatus(address);
      if (status) {
        setFaucetBalance(status.faucetBalance);
      }
    } catch (error) {
      console.error('Failed to load faucet balance:', error);
    }
  };
  const loadUserLabsBalance = async () => {
    if (!address) return;
    console.log('🔍 Loading balances for wallet:', address);
    console.log('🔍 LABS Token contract:', CONTRACTS.LABSToken);
    try {
      // Use RPC provider for read operations (more reliable)
      const provider = new ethers.JsonRpcProvider(CONTRACTS.RPC_URL);

      // Verify contract exists
      const code = await provider.getCode(CONTRACTS.LABSToken);
      if (code === '0x') {
        console.error('❌ LABS Token contract not found at address:', CONTRACTS.LABSToken);
        setUserLabsBalance('0');
        return;
      }

      // Get LABS balance from user's wallet
      const labsToken = new ethers.Contract(CONTRACTS.LABSToken, LABSToken_ABI, provider);
      console.log('🔍 Fetching LABS balance...');
      try {
        const balance = await labsToken.balanceOf(address);
        console.log('🔍 Raw LABS balance:', balance.toString());
        const formattedBalance = ethers.formatEther(balance);
        console.log('🔍 Formatted LABS balance:', formattedBalance);
        setUserLabsBalance(formattedBalance);
      } catch (balanceError) {
        console.error('❌ Failed to fetch LABS balance:', balanceError);
        setUserLabsBalance('0');
      }

      // Get ETH balance from user's wallet
      const ethBalanceRaw = await provider.getBalance(address);
      console.log('🔍 Raw ETH balance:', ethBalanceRaw.toString());
      setEthBalance(ethers.formatEther(ethBalanceRaw));

      // Get staked LABS and labs owned
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, provider);
      const testing = new ethers.Contract(CONTRACTS.H1Diamond, TestingFacet_ABI, provider);
      // Verify selector routing for testing facet helpers (if attached)
      try {
        const loupe = new ethers.Contract(CONTRACTS.H1Diamond, DiamondLoupeFacet_ABI, provider);
        const selParams = ethers.id('getProtocolParams()').slice(0, 10);
        const selStaked = ethers.id('getStakedBalance(address)').slice(0, 10);
        const [routeParams, routeStaked] = await Promise.all([loupe.facetAddress(selParams), loupe.facetAddress(selStaked)]);
        console.log('🔎 Routing: getProtocolParams ->', routeParams);
        console.log('🔎 Routing: getStakedBalance ->', routeStaked);
      } catch (routeErr) {
        console.log('Loupe routing check failed (ok if loupe missing):', routeErr);
      }
      try {
        // Prefer TestingFacet getter if available
        let stakedBalance;
        try {
          stakedBalance = await testing.getStakedBalance(address);
        } catch {
          stakedBalance = await diamond.getStakedBalance(address);
        }
        console.log('🔍 Staked LABS:', stakedBalance.toString());
        setStakedLabs(ethers.formatEther(stakedBalance));
      } catch (error) {
        console.log('getStakedBalance not available on contract:', error);
        setStakedLabs('0');
      }
      try {
        const labCount = await diamond.getUserLabCount(address);
        console.log('🔍 Labs owned:', labCount.toString());
        setLabsOwned(Number(labCount));
      } catch (error) {
        console.log('getUserLabCount not available on contract:', error);
        setLabsOwned(0);
      }
    } catch (error) {
      console.error('❌ Failed to load balances:', error);
    }
  };

  // Load user's lab ownership count and marketplace data from blockchain events
  const loadUserLabsFromEvents = async () => {
    if (!address) return;
    
    setLoadingMarketplace(true);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 DEBUG: Lab Event Query Starting');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // STEP 1: Validate wallet address
      console.log('📍 STEP 1: Address Validation');
      console.log('  Raw address:', address);
      console.log('  Address length:', address.length, '(should be 42)');
      
      if (!address || address.length !== 42) {
        console.error('❌ Invalid wallet address format!', { address, length: address?.length });
        toast.error('Invalid wallet address. Please reconnect your wallet.');
        setLoadingMarketplace(false);
        return;
      }
      
      // Normalize address to lowercase for consistency
      const normalizedAddress = address.toLowerCase();
      console.log('  Normalized address:', normalizedAddress);
      
      // Try primary RPC, fallback to others if it fails
      let provider;
      try {
        provider = new ethers.JsonRpcProvider(CONTRACTS.RPC_URL);
        await provider.getBlockNumber(); // Test connection
        console.log('✅ Connected to primary RPC');
      } catch (rpcError) {
        console.warn('⚠️ Primary RPC failed, trying fallback...');
        provider = new ethers.JsonRpcProvider(CONTRACTS.RPC_FALLBACKS[0]);
        console.log('✅ Connected to fallback RPC');
      }
      
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, [...LABSCoreFacet_ABI, ...BondingCurveFacet_ABI], provider);
      
      // Get current block number
      const currentBlock = await provider.getBlockNumber();
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 Blockchain State');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('  Current block:', currentBlock);
      console.log('  Contract address:', CONTRACTS.H1Diamond);
      console.log('  Deployment block:', CONTRACTS.DEPLOYMENT_BLOCK);
      console.log('  Blocks to scan:', currentBlock - CONTRACTS.DEPLOYMENT_BLOCK);
      
      // STEP 2: First, query ALL LabCreated events (no owner filter) to verify events exist
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 STEP 2: Query ALL LabCreated Events (no filter)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const eventSignature = ethers.id("LabCreated(uint256,address,string,string,string,address,uint8)");
      console.log('  Event signature:', eventSignature);
      
      // Query recent blocks first to see if ANY events exist
      const recentBlockRange = 10000;
      const recentStartBlock = Math.max(CONTRACTS.DEPLOYMENT_BLOCK, currentBlock - recentBlockRange);
      
      console.log(`  Querying recent blocks ${recentStartBlock} to ${currentBlock}...`);
      
      let allRecentLabs = [];
      try {
        const allLabsLogs = await provider.getLogs({
          address: CONTRACTS.H1Diamond,
          topics: [eventSignature], // Only event signature, no owner filter
          fromBlock: recentStartBlock,
          toBlock: currentBlock
        });
        
        console.log(`✅ Found ${allLabsLogs.length} total LabCreated events in recent blocks!`);
        
        if (allLabsLogs.length > 0) {
          const iface = new ethers.Interface(LABSCoreFacet_ABI);
          for (const log of allLabsLogs) {
            try {
              const parsed = iface.parseLog(log);
              if (parsed && parsed.name === 'LabCreated') {
                allRecentLabs.push({
                  labId: parsed.args.labId.toString(),
                  owner: parsed.args.owner.toLowerCase(),
                  name: parsed.args.name,
                  domain: parsed.args.domain,
                  block: log.blockNumber
                });
                console.log('  📝 Lab found:', {
                  labId: parsed.args.labId.toString(),
                  owner: parsed.args.owner.toLowerCase(),
                  name: parsed.args.name,
                  block: log.blockNumber,
                  isYours: parsed.args.owner.toLowerCase() === normalizedAddress
                });
              }
            } catch (parseError) {
              console.warn('⚠️ Failed to parse log:', parseError);
            }
          }
        } else {
          console.log('⚠️ No LabCreated events found in recent blocks. This is unexpected!');
          console.log('  Possible reasons:');
          console.log('  1. No labs have been created recently');
          console.log('  2. Wrong contract address');
          console.log('  3. Wrong event signature');
        }
      } catch (allEventsError) {
        console.error('❌ Failed to query all events:', allEventsError);
      }
      
      // STEP 3: Now query with owner filter
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📍 STEP 3: Query YOUR Labs (with owner filter)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Use lowercase address without checksum for topic encoding
      let addressTopic;
      try {
        addressTopic = ethers.zeroPadValue(normalizedAddress, 32);
        console.log('  Your address (normalized):', normalizedAddress);
        console.log('  Address topic (padded):', addressTopic);
      } catch (padError) {
        console.error('❌ Failed to pad address:', padError);
        toast.error('Address format error. Please reconnect your wallet.');
        setLoadingMarketplace(false);
        return;
      }
      
      const CHUNK_SIZE = 50000;
      let userEvents = [];
      
      // Start from deployment block, not recent blocks
      const startBlock = CONTRACTS.DEPLOYMENT_BLOCK;
      
      console.log(`  Querying from block ${startBlock} to ${currentBlock} in chunks of ${CHUNK_SIZE}...`);
      
      for (let fromBlock = startBlock; fromBlock <= currentBlock; fromBlock += CHUNK_SIZE) {
        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, currentBlock);
        console.log(`  📡 Chunk: blocks ${fromBlock} to ${toBlock}`);
        
        try {
          const logs = await provider.getLogs({
            address: CONTRACTS.H1Diamond,
            topics: [
              eventSignature,
              null, // labId (any)
              addressTopic // owner (your address)
            ],
            fromBlock,
            toBlock
          });
          
          if (logs.length > 0) {
            console.log(`  ✅ Found ${logs.length} event(s) for your address!`);
            
            // Parse the logs
            const iface = new ethers.Interface(LABSCoreFacet_ABI);
            for (const log of logs) {
              try {
                const parsed = iface.parseLog(log);
                if (parsed && parsed.name === 'LabCreated') {
                  userEvents.push({
                    ...log,
                    args: parsed.args,
                    fragment: parsed.fragment
                  });
                  console.log('  📝 Your lab:', {
                    labId: parsed.args.labId.toString(),
                    owner: parsed.args.owner,
                    name: parsed.args.name,
                    block: log.blockNumber
                  });
                }
              } catch (parseError) {
                console.warn('⚠️ Failed to parse log:', parseError);
              }
            }
          }
        } catch (chunkError) {
          console.warn(`⚠️ Failed to query blocks ${fromBlock}-${toBlock}:`, chunkError);
        }
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 Query Results Summary');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`  Total labs in recent blocks: ${allRecentLabs.length}`);
      console.log(`  Your labs found: ${userEvents.length}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // If no events found, show helpful debug info
      if (userEvents.length === 0 && allRecentLabs.length > 0) {
        console.log('⚠️ No labs found for your address, but other labs exist.');
        console.log('  Your address:', normalizedAddress);
        console.log('  Other lab owners found:', Array.from(new Set(allRecentLabs.map(l => l.owner))));
        console.log('  🔗 Check your transactions on BaseScan:', `${CONTRACTS.BLOCK_EXPLORER}/address/${normalizedAddress}`);
      }
      
      console.log(`📊 Final result: ${userEvents.length} labs owned by you`);
      
      const labs = [];
      let activeLabCount = 0;
      
      // Load details for each lab from events
      for (const event of userEvents) {
        try {
          // Type guard for EventLog
          if (!('args' in event)) {
            console.log('⚠️ Event is not an EventLog, skipping');
            continue;
          }
          
          const labId = Number(event.args.labId);
          console.log(`📋 Loading lab #${labId}...`);
          
          // Get current lab details to check if still active
          const details = await diamond.getLabDetails(labId);
          const [owner, h1Token, domain, active, level] = details;
          
          // Check if user still owns this lab
          if (owner.toLowerCase() !== address.toLowerCase()) {
            console.log(`⚠️ Lab #${labId} is no longer owned by user, skipping`);
            continue;
          }
          
          if (!active) {
            console.log(`⚠️ Lab #${labId} is inactive, skipping`);
            continue;
          }
          
          activeLabCount++;
          
          // Get vault details (H1 token is the vault)
          const vault = new ethers.Contract(h1Token, LabVault_ABI, provider);
          const [name, symbol, totalAssets, userBalance] = await Promise.all([
            vault.name(),
            vault.symbol(),
            vault.totalAssets(),
            vault.balanceOf(address)
          ]);
          
          // Get bonding curve address
          const curveAddress = await diamond.getBondingCurve(labId);
          
          // Get H1 price from bonding curve if it exists
          let h1Price = '0';
          if (curveAddress && curveAddress !== ethers.ZeroAddress) {
            try {
              const curve = new ethers.Contract(curveAddress, BondingCurveSale_ABI, provider);
              const priceWei = await curve.price();
              h1Price = ethers.formatEther(priceWei);
              console.log(`💰 Lab #${labId} H1 price: ${h1Price} LABS`);
            } catch (error) {
              console.log(`⚠️ Lab #${labId}: Bonding curve not deployed yet`);
            }
          }
          
          labs.push({
            labId,
            name,
            symbol,
            domain,
            h1Price,
            tvl: ethers.formatEther(totalAssets),
            curveAddress,
            vaultAddress: h1Token,
            userH1Balance: ethers.formatEther(userBalance)
          });
          
          console.log(`✅ Loaded lab #${labId}: ${name} (${symbol}), H1 balance: ${ethers.formatEther(userBalance)}`);
        } catch (error) {
          console.error(`❌ Failed to load lab from event:`, error);
        }
      }
      
      setAllLabsForMarketplace(labs);
      setLabsOwned(activeLabCount);
      console.log(`🏪 Loaded ${labs.length} lab(s) for marketplace. User owns ${activeLabCount} active lab(s).`);
    } catch (error) {
      console.error('❌ Failed to load labs from events:', error);
      setLabsOwned(0);
      setAllLabsForMarketplace([]);
    } finally {
      setLoadingMarketplace(false);
    }
  };

  const handleMintTestLabs = async () => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }
    setLoading('mint');
    addLog('info', 'Testing: Receive LABS', '🚰 Requesting 50,000 test LABS from faucet...');
    try {
      addLog('info', 'Testing: Receive LABS', '⏳ Waiting for faucet to process claim...');
      const result = await claimFromFaucet(address);
      if (result.success) {
        // Format amount from Wei to LABS (divide by 10^18)
        const formattedAmount = ethers.formatEther(result.amount);
        const friendlyAmount = parseFloat(formattedAmount).toLocaleString('en-US', { maximumFractionDigits: 2 });
        addLog('success', 'Testing: Receive LABS', `💰 Faucet claim successful! ${friendlyAmount} LABS transferred to your wallet on TESTNET.`, result.txHash);
        toast.success(`✨ Claimed ${friendlyAmount} LABS tokens!`);
        await loadFaucetBalance(); // Refresh balance
        await loadUserLabsBalance(); // Refresh user balance
      } else {
        addLog('error', 'Testing: Receive LABS', `❌ ${result.error || 'Failed to claim from faucet'}`);
        toast.error(result.error || 'Failed to claim from faucet');
      }
    } catch (error: any) {
      console.error('Faucet error:', error);
      addLog('error', 'Testing: Receive LABS', `❌ ${error.message || 'Unknown error'}`);
      toast.error('Failed to claim from faucet');
    } finally {
      setLoading(null);
    }
  };
  const handleCreateData = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!dataContent || !dataDomain) {
      toast.error('Please fill in all data details');
      return;
    }
    if (!sdk) {
      toast.error('Wallet SDK not initialized. Please reconnect your wallet.');
      return;
    }
    setLoading('createData');
    addLog('info', 'Stage 2: Create Data', `📊 STARTING: Upload de-identified dataset for Lab ID ${dataLabId} in ${dataDomain} domain`);
    try {
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
      let signer = await provider.getSigner(address);
      try {
        const signerAddr = await signer.getAddress();
        if (signerAddr.toLowerCase() !== (address as string).toLowerCase()) {
          signer = await provider.getSigner(address);
        }
      } catch {}

      // Generate data hash from content
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataContent));
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, DataValidationFacet_ABI, signer);
      addLog('info', 'Stage 2: Create Data', '📡 Broadcasting data creation to DataValidationFacet (with PII-removed verification)...');
      const createTx = await diamond.createData(dataLabId, dataHash, dataDomain, ethers.ZeroAddress,
      // baseModel (not required for demo)
      0 // creatorCredentialId (0 = none)
      );
      addLog('info', 'Stage 2: Create Data', '⏳ Mining transaction & recording de-identified record hash to blockchain...');
      const receipt = await createTx.wait();

      // Parse DataCreated event
      const dataCreatedEvent = receipt.logs.find((log: any) => log.topics[0] === ethers.id("DataCreated(uint256,uint256,bytes32,string,address)"));
      const dataId = dataCreatedEvent ? ethers.toNumber(dataCreatedEvent.topics[1]) : "unknown";
      addLog('success', 'Stage 2: Create Data', `✅ STEP 2 COMPLETE: De-identified dataset recorded onchain (ID: ${dataId}). Clinicians can now enrich this data on MedTagger.`, createTx.hash);
      toast.success(`Step 2 Complete! Dataset ID: ${dataId}`);
      setCompletedSteps(prev => ({
        ...prev,
        step2: true
      }));
      setDatasetMetadata(prev => ({
        ...prev,
        step2: {
          dataId: typeof dataId === 'number' ? dataId : parseInt(dataId as string),
          dataHash: dataHash,
          timestamp: new Date(),
          txHash: createTx.hash,
          creator: address as string,
          labId: parseInt(dataLabId)
        }
      }));
      setDataContent('');
    } catch (error: any) {
      console.error('Create data error:', error);
      addLog('error', 'Stage 2: Create Data', `❌ ${error.message || 'Failed to create data'}`);
      toast.error('Failed to create data');
    } finally {
      setLoading(null);
    }
  };
  const handleCreateCredential = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!sdk) {
      toast.error('Wallet SDK not initialized. Please reconnect your wallet.');
      return;
    }
    setLoading('createCredential');
    addLog('info', 'Stage 3: Credentials', `🎓 STARTING: Issue "${credentialType}" credential for enrichment verification in ${credentialDomain} domain`);
    try {
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
      let signer = await provider.getSigner(address);
      try {
        const signerAddr = await signer.getAddress();
        if (signerAddr.toLowerCase() !== (address as string).toLowerCase()) {
          signer = await provider.getSigner(address);
        }
      } catch {}
      const userAddress = await signer.getAddress();
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, CredentialFacet_ABI, signer);

      // Check if user already has an ID
      addLog('info', 'Stage 3: Credentials', '🔍 Checking for existing clinician registration...');
      let userId = await diamond.getUserId(userAddress);
      if (userId === 0n) {
        addLog('info', 'Stage 3: Credentials', '📝 Registering clinician to MedTagger and creating user ID...');
        const createUserTx = await diamond.createUserId(userAddress, credentialDomain);
        await createUserTx.wait();
        userId = await diamond.getUserId(userAddress);
        addLog('success', 'Stage 3: Credentials', `✅ Clinician registered! User ID: ${userId}`, createUserTx.hash);
      } else {
        addLog('info', 'Stage 3: Credentials', `📋 Clinician already registered. User ID: ${userId}`);
      }

      // Generate verification hash
      const verificationHash = ethers.keccak256(ethers.toUtf8Bytes(`${credentialType}-${Date.now()}`));
      addLog('info', 'Stage 3: Credentials', '📡 Broadcasting credential issuance to CredentialFacet...');
      const issueTx = await diamond.issueCredential(userId, credentialType, credentialDomain, verificationHash);
      addLog('info', 'Stage 3: Credentials', '⏳ Mining transaction & recording enrichment verification to blockchain...');
      const receipt = await issueTx.wait();

      // Parse CredentialIssued event
      const credIssuedEvent = receipt.logs.find((log: any) => log.topics[0] === ethers.id("CredentialIssued(uint256,uint256,string,string)"));
      const credentialId = credIssuedEvent ? ethers.toNumber(credIssuedEvent.topics[2]) : "unknown";
      addLog('success', 'Stage 3: Credentials', `✅ STEP 3 COMPLETE: Enrichment verified! Credential issued (ID: ${credentialId}). Scholar reputation recorded onchain + revenue distribution triggered.`, issueTx.hash);
      toast.success(`Step 3 Complete! Credential ID: ${credentialId}`);
      setCompletedSteps(prev => ({
        ...prev,
        step3: true
      }));
      setDatasetMetadata(prev => ({
        ...prev,
        step3: {
          credentialId: typeof credentialId === 'number' ? credentialId : parseInt(credentialId as string),
          timestamp: new Date(),
          txHash: issueTx.hash,
          walletAddress: address as string,
          domain: credentialDomain
        }
      }));
    } catch (error: any) {
      console.error('Credential error:', error);
      addLog('error', 'Stage 3: Credentials', `❌ ${error.message || 'Failed to issue credential'}`);
      toast.error('Failed to issue credential');
    } finally {
      setLoading(null);
    }
  };
  const handlePurchaseDataset = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!sdk) {
      toast.error('Wallet SDK not initialized. Please reconnect your wallet.');
      return;
    }
    setLoading('purchase');
    addLog('info', 'Stage 4: Purchase Dataset', `💰 STARTING: Purchase Dataset ID ${purchaseDatasetId} for ${purchaseAmount} ETH`);
    try {
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
      let signer = await provider.getSigner(address);
      try {
        const signerAddr = await signer.getAddress();
        if (signerAddr.toLowerCase() !== (address as string).toLowerCase()) {
          signer = await provider.getSigner(address);
        }
      } catch {}
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, RevenueFacet_ABI, signer);

      // Get revenue breakdown
      const amountWei = ethers.parseEther(purchaseAmount);
      const breakdown = await diamond.getRevenueBreakdown(amountWei);

      // Store revenue distribution for UI display
      const distribution = {
        buyback: ethers.formatEther(breakdown[0]),
        developer: ethers.formatEther(breakdown[1]),
        creator: ethers.formatEther(breakdown[2]),
        scholar: ethers.formatEther(breakdown[3]),
        treasury: ethers.formatEther(breakdown[4])
      };
      setRevenueDistribution(distribution);
      addLog('info', 'Stage 4: Purchase Dataset', `📊 Revenue split: Buyback=${distribution.buyback} ETH, Dev=${distribution.developer} ETH, Creator=${distribution.creator} ETH, Scholar=${distribution.scholar} ETH, Treasury=${distribution.treasury} ETH`);
      addLog('info', 'Stage 4: Purchase Dataset', '📡 Broadcasting purchase to RevenueFacet with MULTI-WALLET distribution...');
      const purchaseTx = await diamond.batchDistributeRevenue([purchaseDatasetId], [purchaseLabId], [amountWei], {
        value: amountWei
      });
      addLog('info', 'Stage 4: Purchase Dataset', '⏳ Mining transaction & distributing revenue to all stakeholders...');
      await purchaseTx.wait();
      addLog('success', 'Stage 4: Purchase Dataset', `✅ STEP 4 COMPLETE: Dataset purchased! Revenue distributed to all wallets!`, purchaseTx.hash);
      addLog('info', 'Stage 4: Purchase Dataset', `💼 Distribution:
        • Buyback Wallet: ${distribution.buyback} ETH (40%)
        • Developer Wallet: ${distribution.developer} ETH (15%)
        • Creator Pool: ${distribution.creator} ETH (20%)
        • Scholar Pool: ${distribution.scholar} ETH (20%)
        • H1 Treasury: ${distribution.treasury} ETH (5%)`);
      toast.success('Step 4 Complete! Multi-wallet distribution executed!');
      setCompletedSteps(prev => ({
        ...prev,
        step4: true
      }));
      setDatasetMetadata(prev => ({
        ...prev,
        step4: {
          purchaseTimestamp: new Date(),
          txHash: purchaseTx.hash,
          buyer: address as string,
          amount: purchaseAmount,
          dataIds: [parseInt(purchaseDatasetId)]
        }
      }));
    } catch (error: any) {
      console.error('Purchase error:', error);
      addLog('error', 'Stage 4: Purchase Dataset', `❌ ${error.message || 'Failed to purchase dataset'}`);
      toast.error('Failed to purchase dataset');
    } finally {
      setLoading(null);
    }
  };
  // Handle buying/selling H1 tokens with LABS
  const handleTradeH1 = async (labId: number, action: 'buy' | 'sell') => {
    if (!isConnected || !sdk || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!tradeAmount || isNaN(Number(tradeAmount)) || Number(tradeAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    const lab = allLabsForMarketplace.find(l => l.labId === labId);
    if (!lab) {
      toast.error('Lab not found');
      return;
    }

    if (!lab.curveAddress || lab.curveAddress === ethers.ZeroAddress) {
      toast.error('Bonding curve not deployed for this lab yet. Please deploy it first.');
      return;
    }

    setLoading('marketplace');
    
    try {
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
      const signer = await provider.getSigner(address);

      if (action === 'buy') {
        // Buy H1 tokens with LABS
        addLog('info', 'H1 Marketplace', `🎯 STARTING: Buy ${tradeAmount} H1 ${lab.symbol} with LABS`);

        // Get LABS token contract
        const labsToken = new ethers.Contract(CONTRACTS.LABSToken, LABSToken_ABI, signer);
        
        // Amount in wei
        const amountWei = ethers.parseEther(tradeAmount);

        // Step 1: Approve LABS spending
        addLog('info', 'H1 Marketplace', '📝 Step 1/2: Requesting approval to spend LABS tokens...');
        const approveTx = await labsToken.approve(lab.curveAddress, amountWei);
        addLog('info', 'H1 Marketplace', '⏳ Mining approval transaction...');
        await approveTx.wait();
        addLog('success', 'H1 Marketplace', '✅ LABS tokens approved');

        // Step 2: Buy H1 tokens via bonding curve
        addLog('info', 'H1 Marketplace', `📝 Step 2/2: Buying H1 ${lab.symbol} tokens...`);
        const curve = new ethers.Contract(lab.curveAddress, BondingCurveSale_ABI, signer);
        const minSharesOut = 0; // Could add slippage protection here
        const buyTx = await curve.buy(amountWei, address, minSharesOut);
        addLog('info', 'H1 Marketplace', '⏳ Mining buy transaction...');
        const receipt = await buyTx.wait();
        
        addLog('success', 'H1 Marketplace', `✅ COMPLETE: Purchased H1 ${lab.symbol} tokens with ${tradeAmount} LABS!`, buyTx.hash);
        toast.success(`Successfully bought H1 ${lab.symbol}!`);
        
        // Refresh balances and marketplace
        await loadUserLabsBalance();
        await loadUserLabsFromEvents();
        
        setTradeAmount('1');
      } else {
        // Sell functionality could be added here
        // For now, show message that it's the same as redeeming from the vault
        toast.info('To sell H1 tokens, use the vault redemption flow (coming soon in UI)');
      }
    } catch (error: any) {
      console.error('Trade error:', error);
      addLog('error', 'H1 Marketplace', `❌ ${error.message || 'Failed to trade H1 tokens'}`);
      toast.error('Failed to trade H1 tokens');
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    console.log('🔌 Prototype useEffect - isConnected:', isConnected, 'address:', address);
    if (isConnected && address) {
      console.log('✅ Loading blockchain data for:', address);
      loadFaucetBalance();
      loadUserLabsBalance();
      loadUserLabsFromEvents();
    } else {
      console.log('❌ Not loading data - missing connection or address');
    }
  }, [isConnected, address]);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = completedCount / 4 * 100;
  const allStepsComplete = completedCount === 4;
  const handleResetFlow = () => {
    setCompletedSteps({
      step1: false,
      step2: false,
      step3: false,
      step4: false
    });
    setLogs([]);
    toast.success('Flow reset! Ready to start again.');
  };
  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };
  const statusText: Record<StepStatus, string> = {
    idle: 'Idle',
    awaiting_signature: 'Awaiting signature',
    pending: 'Pending',
    confirmed: 'Confirmed',
    error: 'Error'
  };
  const statusIcon = (status: StepStatus) => {
    if (status === 'confirmed') return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    if (status === 'pending') return <Loader2 className="h-3 w-3 animate-spin text-primary" />;
    if (status === 'awaiting_signature') return <Info className="h-3 w-3 text-muted-foreground" />;
    if (status === 'error') return <XCircle className="h-3 w-3 text-destructive" />;
    return <div className="h-3 w-3 rounded-full border border-muted-foreground" />;
  };
  return <TooltipProvider>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/get-started')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Choice
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary font-mono">The H1 Protocol - TESTNET</h1>
          <p className="text-muted-foreground">Interactive testing interface for onchain flows</p>
          <Badge className="mt-2 bg-secondary">{CONTRACTS.H1Diamond}</Badge>
        </div>

        {/* Wallet Info - Shows USER'S Base Wallet (not faucet) */}
        {isConnected && address && <Card className="mb-6 bg-card/50 backdrop-blur border-primary/20">
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Your Base Wallet</p>
                  <p className="font-mono text-sm break-all">{address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Your ETH Balance</p>
                  <p className="font-mono text-sm">{parseFloat(ethBalance).toFixed(4)} ETH</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Your LABS Balance</p>
                  <p className="font-mono text-sm">{userLabsBalance ? parseFloat(userLabsBalance).toFixed(2) : '0.00'} LABS</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">LABS Staked</p>
                  <p className="font-mono text-sm text-primary">{parseFloat(stakedLabs).toFixed(2)} LABS</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Labs Owned</p>
                  <p className="font-mono text-sm text-accent">{labsOwned}</p>
                </div>
              </div>
            </div>
          </Card>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-32">
          {/* Main Testing Interface */}
          <div className="lg:col-span-2 space-y-6">

            {/* Testing Controls */}
            <Card className="p-6 bg-gradient-card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" />
                Testing Utilities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Faucet */}
                <div className="space-y-3 flex flex-col h-full">
                  <h4 className="text-sm font-semibold text-muted-foreground">Faucet</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {userLabsBalance !== null && <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
                        <p className="text-lg font-bold">{parseFloat(userLabsBalance).toLocaleString(undefined, {
                        maximumFractionDigits: 2
                      })} LABS</p>
                      </div>}
                    {faucetBalance && <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Faucet Balance</p>
                        <p className="text-lg font-bold">{parseFloat(faucetBalance).toLocaleString(undefined, {
                        maximumFractionDigits: 0
                      })} LABS</p>
                      </div>}
                  </div>
                  <Button onClick={handleMintTestLabs} disabled={loading === 'mint'} className="w-full" variant="outline">
                    {loading === 'mint' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Receive 50,000 Test LABS
                  </Button>
                </div>

                {/* Right: How it Works */}
                <div className="space-y-3 flex flex-col h-full">
                  <h4 className="text-sm font-semibold text-muted-foreground">How it Works</h4>
                  <div className="p-3 rounded-lg bg-muted/50 space-y-2 flex-1">
                    <p className="text-xs text-muted-foreground">
                      Follow the 4-step protocol flow to test the complete H1 ecosystem
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          View Protocol Guide
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>The H1 Protocol Flow</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-auto">
                          <img src={protocolFlowGuide} alt="H1 Protocol Flow Diagram" className="w-full h-auto rounded-lg" />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              
              {/* Debug Section - Wallet Address Checker */}
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">🔍 Debug Tools</h4>
                <div className="space-y-2">
                <Button 
                  onClick={async () => {
                    if (!sdk || !address) {
                      toast.error("Please connect wallet first");
                      return;
                    }
                    
                    try {
                      console.log("=== WALLET DEBUG INFO ===");
                      console.log("UI Address:", address);
                      
                      const walletProvider = sdk.getProvider();
                      const provider = new ethers.BrowserProvider(walletProvider as any);
                      const signer = await provider.getSigner();
                      const signerAddr = await signer.getAddress();
                      
                      console.log("Signer Address:", signerAddr);
                      console.log("Addresses Match?", address?.toLowerCase() === signerAddr.toLowerCase());
                      
                      if (address?.toLowerCase() === signerAddr.toLowerCase()) {
                        toast.success(`✅ Addresses Match!\n\nUI: ${address}\nSigner: ${signerAddr}`, {
                          duration: 5000
                        });
                      } else {
                        toast.error(`❌ ADDRESS MISMATCH!\n\nUI shows: ${address}\nBut signer is: ${signerAddr}\n\nThis is why labs aren't found!`, {
                          duration: 10000
                        });
                      }
                      
                      // Also query for labs created by the address
                      const rpc = new ethers.JsonRpcProvider(CONTRACTS.RPC_URL);
                      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, rpc);
                      const currentBlock = await rpc.getBlockNumber();
                      
                      console.log("\n=== CHECKING FOR LABS ===");
                      console.log(`Current block: ${currentBlock}`);
                      
                      // Query in chunks of 50k blocks (RPC limit)
                      const CHUNK_SIZE = 50000;
                      const startBlock = Math.max(0, currentBlock - 500000); // Last 500k blocks
                      let allEvents: any[] = [];
                      
                      for (let fromBlock = startBlock; fromBlock <= currentBlock; fromBlock += CHUNK_SIZE) {
                        const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, currentBlock);
                        console.log(`📡 Querying blocks ${fromBlock} to ${toBlock}...`);
                        
                        try {
                          const filter = diamond.filters.LabCreated(null, signerAddr);
                          const events = await diamond.queryFilter(filter, fromBlock, toBlock);
                          allEvents.push(...events);
                          
                          if (events.length > 0) {
                            console.log(`✅ Found ${events.length} lab(s) in this chunk!`);
                          }
                        } catch (chunkError: any) {
                          console.warn(`⚠️ Failed chunk ${fromBlock}-${toBlock}:`, chunkError.message);
                        }
                      }
                      
                      console.log(`\n📊 TOTAL LABS FOUND: ${allEvents.length}`);
                      
                      if (allEvents.length > 0) {
                        console.log("\n✅ Labs created by your address:");
                        allEvents.forEach((event: any) => {
                          if ('args' in event) {
                            console.log(`  Lab #${event.args.labId}: ${event.args.name} (${event.args.domain}) - Block ${event.blockNumber}`);
                          }
                        });
                        toast.success(`Found ${allEvents.length} lab(s)! Check console for details.`, {
                          duration: 5000
                        });
                      } else {
                        toast.warning(`No labs found in last 500k blocks for ${signerAddr}`, {
                          duration: 5000
                        });
                      }
                      
                    } catch (error) {
                      console.error("Debug error:", error);
                      toast.error("Debug check failed - see console");
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Debug: Check Wallet Addresses
                </Button>
                
                <Button 
                  onClick={async () => {
                    if (!address) {
                      toast.error("Please connect wallet first");
                      return;
                    }
                    
                    try {
                      console.log("=== CHECKING LAB OWNERSHIP ===");
                      const rpc = new ethers.JsonRpcProvider(CONTRACTS.RPC_URL);
                      const diamond = new ethers.Contract(
                        CONTRACTS.H1Diamond, 
                        LABSCoreFacet_ABI, 
                        rpc
                      );
                      
                      // Try to check labs 1-20 (expanded range)
                      const ownedLabs: any[] = [];
                      
                      for (let labId = 1; labId <= 20; labId++) {
                        try {
                          const [owner, h1Token, domain, active, level] = await diamond.getLabDetails(labId);
                          console.log(`Lab #${labId}:`, {
                            owner,
                            domain,
                            active,
                            level: level.toString(),
                            h1Token
                          });
                          
                          if (owner.toLowerCase() === address.toLowerCase()) {
                            console.log(`✅ YOU OWN LAB #${labId}!`);
                            ownedLabs.push({ labId, domain, level: level.toString(), h1Token });
                          }
                        } catch (e) {
                          // Lab doesn't exist, stop checking
                          console.log(`Lab #${labId}: doesn't exist (stopping)`);
                          break;
                        }
                      }
                      
                      if (ownedLabs.length > 0) {
                        console.log("\n✅ OWNED LABS:", ownedLabs);
                        toast.success(`You own ${ownedLabs.length} lab(s)! Check console.`, {
                          duration: 5000
                        });
                      } else {
                        toast.warning("You don't own any labs (checked IDs 1-20)", {
                          duration: 5000
                        });
                      }
                    } catch (error) {
                      console.error("Lab ownership check error:", error);
                      toast.error("Failed to check lab ownership");
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Debug: Check Lab Ownership (IDs 1-20)
                </Button>
                </div>
              </div>
            </Card>

            {/* Stage 1: Stake LABS & Create Lab */}
            <Card className="p-6 bg-gradient-card border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold mb-1">Stake $LABS</h2>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button aria-label="Staking info" className="text-muted-foreground hover:text-foreground">
                          <CircleHelp className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-1 text-xs">
                          <p><strong>What happens on-chain:</strong></p>
                          <p>1) Approve LABS: LABSToken.approve(diamond, amount)</p>
                          <p>2) Stake LABS: H1Diamond → LABSCoreFacet.stakeLABS(amount)</p>
                          <p>• Funds move from your wallet to the diamond for eligibility staking.</p>
                          <p>• This does not mint H1; deposits into a LabVault mint H1 shares.</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">LABSToken.sol & LABSCoreFacet.sol</p>
                  <Badge className="mt-2 bg-primary/20 text-primary">Create Data Labs / H1 Tokens</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="stakeAmount">Stake Amount</Label>
                  <div className="flex gap-2">
                    <Input id="stakeAmount" type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} placeholder="1000" className="flex-1" />
                    <Button type="button" variant="outline" onClick={handleSetMaxStake} disabled={loading === 'stake'} className="shrink-0">
                      Max
                    </Button>
                  </div>
                </div>

                {/* Current Staked Balance & Lab Level */}
                <div className="rounded-md bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Staked:</span>
                    <span className="font-semibold">{parseFloat(stakedLabs || '0').toLocaleString()} LABS</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Projected Lab Level:</span>
                    {projectedLabLevel > 0 ? <span className="font-semibold text-primary">Level {projectedLabLevel}</span> : <span className="text-destructive font-semibold">No Level (need 100k+)</span>}
                  </div>
                  
                  {/* Validation Message */}
                  {!canCreateLab && <div className="mt-2 p-2 bg-destructive/10 border border-destructive/30 rounded text-xs text-destructive">
                      ⚠️ You need at least {MIN_STAKE_FOR_LAB.toLocaleString()} LABS staked to create a lab. Currently have {parseFloat(stakedLabs || '0').toLocaleString()}.
                    </div>}
                  
                  {/* Level Thresholds */}
                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                    <div>Level 1: {LEVEL1_THRESHOLD.toLocaleString()} LABS</div>
                    <div>Level 2: {LEVEL2_THRESHOLD.toLocaleString()} LABS</div>
                    <div>Level 3: {LEVEL3_THRESHOLD.toLocaleString()} LABS</div>
                  </div>
                </div>

                <Button onClick={handleStakeLabs} disabled={loading === 'stake'} className="w-full">
                  {loading === 'stake' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Stake LABS Tokens
                </Button>

                {(loading === 'stake' || stakeSteps.approve !== 'idle' || stakeSteps.stake !== 'idle') && <div className="rounded-md bg-muted/50 p-3">
                    <div className="text-xs font-semibold mb-2">Signing Progress</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        {statusIcon(stakeSteps.approve)}
                        <span>Step 1: Approve LABS</span>
                        <span className="ml-auto text-muted-foreground">{statusText[stakeSteps.approve]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusIcon(stakeSteps.stake)}
                        <span>Step 2: Stake LABS</span>
                        <span className="ml-auto text-muted-foreground">{statusText[stakeSteps.stake]}</span>
                      </div>
                    </div>
                  </div>}

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="labName">Lab Name</Label>
                    <Input id="labName" value={labName} onChange={e => setLabName(e.target.value)} placeholder="CardioLab" />
                  </div>
                  <div>
                    <Label htmlFor="labSymbol">Lab Symbol</Label>
                    <Input id="labSymbol" value={labSymbol} onChange={e => setLabSymbol(e.target.value)} placeholder="CARDIO" />
                  </div>
                  <div>
                    <Label htmlFor="labDomain">Domain</Label>
                    <Select value={labDomain} onValueChange={setLabDomain}>
                      <SelectTrigger id="labDomain" className="bg-background">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {AVAILABLE_DOMAINS.map(domain => <SelectItem key={domain} value={domain} className="capitalize">
                            {domain}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateLab} disabled={loading === 'createLab'} className="w-full">
                    {loading === 'createLab' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Lab & Deploy Vault
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stage 2: Devs */}
            <Card className="p-6 bg-gradient-card border-secondary/20">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-secondary">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">Devs</h2>
                    <p className="text-sm text-muted-foreground">DataValidationFacet.sol</p>
                    <Badge className="mt-2 bg-secondary/20 text-secondary">Create Training Data (De-identify & Upload Medical Records)</Badge>
                  </div>
                </div>
                <Link to="/medatlas" className="flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 cursor-pointer hover:shadow-lg">
                    <FileStack className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground hover:text-primary">MedAtlas</span>
                </Link>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="dataLabId">Lab ID</Label>
                  <Input id="dataLabId" type="number" value={dataLabId} onChange={e => setDataLabId(e.target.value)} placeholder="1" />
                </div>
                <div>
                  <Label htmlFor="dataContent">Data Content</Label>
                  <Input id="dataContent" value={dataContent} onChange={e => setDataContent(e.target.value)} placeholder="De-identified patient record (PII removed)" />
                </div>
                <div>
                  <Label htmlFor="dataDomain">Domain</Label>
                  <Select value={dataDomain} onValueChange={setDataDomain}>
                    <SelectTrigger id="dataDomain" className="bg-background">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {AVAILABLE_DOMAINS.map(domain => <SelectItem key={domain} value={domain} className="capitalize">
                          {domain}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg bg-secondary/10 border border-secondary/20 p-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-secondary">💡 MedAtlas Workflow:</span> Upload de-identified medical records (from MedAtlas app). This calls <span className="font-mono text-xs">createData()</span> on DataValidationFacet, storing the record hash with metadata. Clinicians enrich these records on MedTagger, and you receive revenue share when datasets are sold.
                  </p>
                </div>
                <Button onClick={handleCreateData} disabled={loading === 'createData'} className="w-full">
                  {loading === 'createData' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Dataset
                </Button>
              </div>
            </Card>

            {/* Stage 3: Scholars */}
            <Card className="p-6 bg-gradient-card border-accent/20">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-accent">3</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">Scholars</h2>
                    <p className="text-sm text-muted-foreground">CredentialFacet.sol</p>
                    <Badge className="mt-2 bg-accent/20 text-accent">Issue Credentials & Verify Enrichment</Badge>
                  </div>
                </div>
                <Link to="/medtag" className="flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 cursor-pointer hover:shadow-lg">
                    <PenTool className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground hover:text-primary">MedTagger</span>
                </Link>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="credentialType">Credential Type</Label>
                  <Input id="credentialType" value={credentialType} onChange={e => setCredentialType(e.target.value)} placeholder="Validated Credentials (Medical Record Enrichment, Clinical Experience, etc)" />
                </div>
                <div>
                  <Label htmlFor="credentialDomain">Domain</Label>
                  <Select value={credentialDomain} onValueChange={setCredentialDomain}>
                    <SelectTrigger id="credentialDomain" className="bg-background">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {AVAILABLE_DOMAINS.map(domain => <SelectItem key={domain} value={domain} className="capitalize">
                          {domain}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-accent">💡 MedTagger Workflow:</span> Issue credentials to clinicians who complete enrichment work on MedTagger. This calls <span className="font-mono text-xs">issueCredential()</span> on CredentialFacet, verifying their contributions and building onchain reputation. Approved enrichments trigger revenue distribution via RevenueFacet.
                  </p>
                </div>
                <Button onClick={handleCreateCredential} disabled={loading === 'createCredential'} className="w-full">
                  {loading === 'createCredential' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Issue Credential
                </Button>
              </div>
            </Card>

            {/* Stage 4: AI Companies */}
            <Card className="p-6 bg-gradient-card border-primary/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">AI Companies</h2>
                  <p className="text-sm text-muted-foreground">RevenueFacet.sol - Multi-Wallet Distribution</p>
                  <Badge className="mt-2 bg-primary/20 text-primary">🏦 Purchase Datasets (Multi-Wallet Revenue Flow)</Badge>
                </div>
                {/* Enriched Dataset Icon */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity group">
                        <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                          <FileStack className="h-6 w-6 text-secondary" />
                        </div>
                        <span className="text-[10px] text-muted-foreground text-center leading-tight">Enriched<br />Dataset</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Dataset Metadata Report</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="dataset" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="dataset">Dataset Summary</TabsTrigger>
                          <TabsTrigger value="transactions">Transaction Details</TabsTrigger>
                        </TabsList>
                        
                        {/* Dataset Summary Tab - Condensed */}
                        <TabsContent value="dataset" className="space-y-4 mt-4">
                          <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                            <h3 className="font-bold text-lg mb-4">Dataset Overview</h3>
                            <div className="space-y-3 text-sm">
                              {/* Data ID, Timestamp, Hash */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-muted-foreground font-semibold">Data ID:</span>
                                  <p className="font-mono text-primary">
                                    {datasetMetadata.step2 ? `#${datasetMetadata.step2.dataId}` : 'Not created yet'}
                                  </p>
                                  <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real (onchain)' : ''}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground font-semibold">Created:</span>
                                  <p className="font-mono text-xs">
                                    {datasetMetadata.step2 ? datasetMetadata.step2.timestamp.toLocaleString() : 'Not created yet'}
                                  </p>
                                  <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real' : ''}</p>
                                </div>
                              </div>
                              
                              <div>
                                <span className="text-muted-foreground font-semibold">Data Hash:</span>
                                <p className="font-mono text-xs break-all">
                                  {datasetMetadata.step2 ? datasetMetadata.step2.dataHash : 'Not created yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real (onchain)' : ''}</p>
                              </div>

                              <Separator />

                              {/* Author Info */}
                              <div>
                                <span className="text-muted-foreground font-semibold">Author ID & Wallet:</span>
                                <p className="font-mono text-xs break-all">
                                  {datasetMetadata.step2 ? datasetMetadata.step2.creator : 'Not created yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real (onchain)' : ''}</p>
                              </div>

                              {/* Lab */}
                              <div>
                                <span className="text-muted-foreground font-semibold">Lab:</span>
                                <p className="font-mono">
                                  {datasetMetadata.step2 ? `Lab #${datasetMetadata.step2.labId}` : datasetMetadata.step1 ? `Lab #${datasetMetadata.step1.labId}` : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step2 || datasetMetadata.step1 ? '✓ Real (onchain)' : ''}</p>
                              </div>

                              <Separator />

                              {/* App Used */}
                              <div>
                                <span className="text-muted-foreground font-semibold">App Used:</span>
                                <p className="font-mono text-xs">MedTagger</p>
                                <p className="text-xs text-yellow-500">⚠ Placeholder</p>
                              </div>

                              <div>
                                <span className="text-muted-foreground font-semibold">App Developer Wallet:</span>
                                <p className="font-mono text-xs break-all">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</p>
                                <p className="text-xs text-yellow-500">⚠ Placeholder</p>
                              </div>

                              <Separator />

                              {/* Scholar/Enricher */}
                              <div>
                                <span className="text-muted-foreground font-semibold">Enriched by (Scholar):</span>
                                <div className="mt-1">
                                  <p className="font-mono text-xs">
                                    {datasetMetadata.step3 ? `Credential ID: #${datasetMetadata.step3.credentialId}` : 'Not enriched yet'}
                                  </p>
                                  <p className="font-mono text-xs break-all">
                                    {datasetMetadata.step3 ? `Wallet: ${datasetMetadata.step3.walletAddress}` : ''}
                                  </p>
                                  <p className="text-xs text-green-500">{datasetMetadata.step3 ? '✓ Real (onchain)' : ''}</p>
                                </div>
                              </div>

                              <Separator />

                              {/* Purchase Info */}
                              <div>
                                <span className="text-muted-foreground font-semibold">Purchased by:</span>
                                <div className="mt-1">
                                  <p className="font-mono text-xs break-all">
                                    {datasetMetadata.step4 ? datasetMetadata.step4.buyer : 'Not purchased yet'}
                                  </p>
                                  <p className="font-mono text-xs">
                                    {datasetMetadata.step4 ? `Amount: ${datasetMetadata.step4.amount} ETH` : ''}
                                  </p>
                                  <p className="text-xs text-green-500">{datasetMetadata.step4 ? '✓ Real (onchain)' : ''}</p>
                                </div>
                              </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-xs text-muted-foreground mb-2 font-semibold">Data Status:</p>
                              <div className="space-y-1 text-xs">
                                <p className="text-green-500">✓ Real (onchain) - Data from blockchain transactions</p>
                                <p className="text-yellow-500">⚠ Placeholder - Will be populated from contract events</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Transaction Details Tab - Full Details */}
                        <TabsContent value="transactions" className="space-y-6 mt-4">
                        {/* Step 1: Lab Creation */}
                        <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">1</span>
                            </div>
                            Lab Creation
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-muted-foreground">Lab ID:</span>
                                <p className="font-mono font-semibold text-primary">
                                  {datasetMetadata.step1 ? `#${datasetMetadata.step1.labId}` : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step1 ? '✓ Real (onchain)' : ''}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Timestamp:</span>
                                <p className="font-mono text-xs">
                                  {datasetMetadata.step1 ? datasetMetadata.step1.timestamp.toLocaleString() : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step1 ? '✓ Real' : ''}</p>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Owner Wallet:</span>
                              <p className="font-mono text-xs break-all">
                                {datasetMetadata.step1 ? datasetMetadata.step1.walletAddress : 'Not available yet'}
                              </p>
                              <p className="text-xs text-green-500">{datasetMetadata.step1 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Transaction Hash:</span>
                              {datasetMetadata.step1 ? <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${datasetMetadata.step1.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline break-all">
                                  {datasetMetadata.step1.txHash} ↗
                                </a> : <p className="font-mono text-xs">Not available yet</p>}
                              <p className="text-xs text-green-500">{datasetMetadata.step1 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                          </div>
                        </div>

                        {/* Step 2: Dataset Creation */}
                        <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">2</span>
                            </div>
                            Dataset Creation
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-muted-foreground">Data ID:</span>
                                <p className="font-mono font-semibold text-primary">
                                  {datasetMetadata.step2 ? `#${datasetMetadata.step2.dataId}` : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real (onchain)' : ''}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lab ID:</span>
                                <p className="font-mono font-semibold">
                                  {datasetMetadata.step2 ? `#${datasetMetadata.step2.labId}` : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real (onchain)' : ''}</p>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Data Hash:</span>
                              <p className="font-mono text-xs break-all">
                                {datasetMetadata.step2 ? datasetMetadata.step2.dataHash : 'Not available yet'}
                              </p>
                              <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Creator Wallet:</span>
                              <p className="font-mono text-xs break-all">
                                {datasetMetadata.step2 ? datasetMetadata.step2.creator : 'Not available yet'}
                              </p>
                              <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Timestamp:</span>
                              <p className="font-mono text-xs">
                                {datasetMetadata.step2 ? datasetMetadata.step2.timestamp.toLocaleString() : 'Not available yet'}
                              </p>
                              <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real' : ''}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">App Used:</span>
                              <p className="font-mono text-xs">MedTagger (example app)</p>
                              <p className="text-xs text-yellow-500">⚠ Placeholder</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">App Developer:</span>
                              <p className="font-mono text-xs">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb (example)</p>
                              <p className="text-xs text-yellow-500">⚠ Placeholder</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Transaction Hash:</span>
                              {datasetMetadata.step2 ? <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${datasetMetadata.step2.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline break-all">
                                  {datasetMetadata.step2.txHash} ↗
                                </a> : <p className="font-mono text-xs">Not available yet</p>}
                              <p className="text-xs text-green-500">{datasetMetadata.step2 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                          </div>
                        </div>

                        {/* Step 3: Credential Issuance */}
                        <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">3</span>
                            </div>
                            Credential Issuance (Scholar)
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-muted-foreground">Credential ID:</span>
                                <p className="font-mono font-semibold text-primary">
                                  {datasetMetadata.step3 ? `#${datasetMetadata.step3.credentialId}` : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step3 ? '✓ Real (onchain)' : ''}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Domain:</span>
                                <p className="font-mono font-semibold capitalize">
                                  {datasetMetadata.step3 ? datasetMetadata.step3.domain : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step3 ? '✓ Real (onchain)' : ''}</p>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Scholar Wallet:</span>
                              <p className="font-mono text-xs break-all">
                                {datasetMetadata.step3 ? datasetMetadata.step3.walletAddress : 'Not available yet'}
                              </p>
                              <p className="text-xs text-green-500">{datasetMetadata.step3 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Timestamp:</span>
                              <p className="font-mono text-xs">
                                {datasetMetadata.step3 ? datasetMetadata.step3.timestamp.toLocaleString() : 'Not available yet'}
                              </p>
                              <p className="text-xs text-green-500">{datasetMetadata.step3 ? '✓ Real' : ''}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Enriched Data IDs:</span>
                              <p className="font-mono text-xs">
                                {datasetMetadata.step2?.dataId ? `#${datasetMetadata.step2.dataId}` : 'Not available yet'}
                              </p>
                              <p className="text-xs text-yellow-500">⚠ Linked from Step 2</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Transaction Hash:</span>
                              {datasetMetadata.step3 ? <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${datasetMetadata.step3.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline break-all">
                                  {datasetMetadata.step3.txHash} ↗
                                </a> : <p className="font-mono text-xs">Not available yet</p>}
                              <p className="text-xs text-green-500">{datasetMetadata.step3 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                          </div>
                        </div>

                        {/* Step 4: Purchase */}
                        <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">4</span>
                            </div>
                            Dataset Purchase
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-muted-foreground">Purchased Data ID:</span>
                                <p className="font-mono font-semibold text-primary">
                                  {datasetMetadata.step4 ? `#${datasetMetadata.step4.dataIds.join(', #')}` : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step4 ? '✓ Real (onchain)' : ''}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Purchase Amount:</span>
                                <p className="font-mono font-semibold">
                                  {datasetMetadata.step4 ? `${datasetMetadata.step4.amount} ETH` : 'Not available yet'}
                                </p>
                                <p className="text-xs text-green-500">{datasetMetadata.step4 ? '✓ Real (onchain)' : ''}</p>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Buyer Wallet:</span>
                              <p className="font-mono text-xs break-all">
                                {datasetMetadata.step4 ? datasetMetadata.step4.buyer : 'Not available yet'}
                              </p>
                              <p className="text-xs text-green-500">{datasetMetadata.step4 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Timestamp:</span>
                              <p className="font-mono text-xs">
                                {datasetMetadata.step4 ? datasetMetadata.step4.purchaseTimestamp.toLocaleString() : 'Not available yet'}
                              </p>
                              <p className="text-xs text-green-500">{datasetMetadata.step4 ? '✓ Real' : ''}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Transaction Hash:</span>
                              {datasetMetadata.step4 ? <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${datasetMetadata.step4.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline break-all">
                                  {datasetMetadata.step4.txHash} ↗
                                </a> : <p className="font-mono text-xs">Not available yet</p>}
                              <p className="text-xs text-green-500">{datasetMetadata.step4 ? '✓ Real (onchain)' : ''}</p>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="border border-secondary/20 rounded-lg p-4 bg-secondary/5">
                          <h3 className="font-bold text-sm mb-2">Data Status Legend</h3>
                          <div className="space-y-1 text-xs">
                            <p className="text-green-500">✓ Real (onchain) - This data comes directly from blockchain transactions</p>
                            <p className="text-yellow-500">⚠ Placeholder - This field will be populated from contract events in production</p>
                          </div>
                        </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
              </div>

              <div className="grid gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="purchaseDatasetId">Dataset ID</Label>
                    <Input id="purchaseDatasetId" type="number" value={purchaseDatasetId} onChange={e => setPurchaseDatasetId(e.target.value)} placeholder="1" />
                  </div>
                  <div>
                    <Label htmlFor="purchaseLabId">Lab ID</Label>
                    <Input id="purchaseLabId" type="number" value={purchaseLabId} onChange={e => setPurchaseLabId(e.target.value)} placeholder="1" />
                  </div>
                  <div>
                    <Label htmlFor="purchaseAmount">Amount (ETH)</Label>
                    <Input id="purchaseAmount" type="number" step="0.01" value={purchaseAmount} onChange={e => {
                    setPurchaseAmount(e.target.value);
                    // Reset distribution display when amount changes
                    if (e.target.value !== purchaseAmount) {
                      setRevenueDistribution(null);
                    }
                  }} placeholder="0.1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 Tip: This amount will be distributed across 5 different wallets by role
                    </p>
                  </div>
                  <Button onClick={handlePurchaseDataset} disabled={loading === 'purchase'} className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
                    {loading === 'purchase' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {loading === 'purchase' ? 'Processing...' : 'Purchase Dataset & Distribute Revenue'}
                  </Button>
                </div>

                {/* Multi-Wallet Distribution Visualization */}
                {revenueDistribution && <div className="bg-slate-900/50 rounded-lg p-4 border border-primary/20">
                    <p className="text-sm font-semibold text-primary mb-4">📊 Multi-Wallet Distribution Flow</p>
                    
                    <div className="space-y-3">
                      {/* Total */}
                      <div className="text-center mb-4 pb-4 border-b border-slate-700">
                        <p className="text-xs text-muted-foreground">Total Purchase Amount</p>
                        <p className="text-2xl font-bold text-primary">{purchaseAmount} ETH</p>
                      </div>

                      {/* Distribution Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Buyback Wallet */}
                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-3 rounded border border-blue-500/20">
                          <p className="text-xs text-muted-foreground mb-1">Buyback Reserve</p>
                          <p className="font-mono font-bold text-blue-400 text-sm">{revenueDistribution.buyback}</p>
                          <p className="text-xs text-blue-400/70 mt-1">40% • H1 Holders</p>
                          <p className="text-xs text-muted-foreground mt-2 truncate">{CONTRACTS.RevenueDemonstration.buybackWallet}</p>
                        </div>

                        {/* Developer Wallet */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-3 rounded border border-purple-500/20">
                          <p className="text-xs text-muted-foreground mb-1">Developer Incentive</p>
                          <p className="font-mono font-bold text-purple-400 text-sm">{revenueDistribution.developer}</p>
                          <p className="text-xs text-purple-400/70 mt-1">15% • App Builder</p>
                          <p className="text-xs text-muted-foreground mt-2 truncate">{CONTRACTS.RevenueDemonstration.developerWallet}</p>
                        </div>

                        {/* Creator Pool */}
                        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 p-3 rounded border border-green-500/20">
                          <p className="text-xs text-muted-foreground mb-1">Creator Pool</p>
                          <p className="font-mono font-bold text-green-400 text-sm">{revenueDistribution.creator}</p>
                          <p className="text-xs text-green-400/70 mt-1">20% • Data Creator</p>
                          <p className="text-xs text-muted-foreground mt-2 truncate">{CONTRACTS.RevenueDemonstration.creatorPoolWallet}</p>
                        </div>

                        {/* Scholar Pool */}
                        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-3 rounded border border-amber-500/20">
                          <p className="text-xs text-muted-foreground mb-1">Scholar Pool</p>
                          <p className="font-mono font-bold text-amber-400 text-sm">{revenueDistribution.scholar}</p>
                          <p className="text-xs text-amber-400/70 mt-1">20% • Validator</p>
                          <p className="text-xs text-muted-foreground mt-2 truncate">{CONTRACTS.RevenueDemonstration.scholarPoolWallet}</p>
                        </div>

                        {/* Treasury */}
                        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 p-3 rounded border border-red-500/20">
                          <p className="text-xs text-muted-foreground mb-1">H1 Treasury</p>
                          <p className="font-mono font-bold text-red-400 text-sm">{revenueDistribution.treasury}</p>
                          <p className="text-xs text-red-400/70 mt-1">5% • Protocol Ops</p>
                          <p className="text-xs text-muted-foreground mt-2 truncate">{CONTRACTS.RevenueDemonstration.h1TreasuryWallet}</p>
                        </div>
                      </div>

                      {/* Distribution Info */}
                      <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-muted-foreground space-y-2">
                        <p>✅ <strong>Onchain Flow:</strong> Each wallet receives ETH directly on-chain. Track transactions on Base Sepolia!</p>
                        <p>🔗 <strong>Provenance Trail:</strong> All distributions linked to dataset, lab, and role</p>
                      </div>
                    </div>
                  </div>}
              </div>
            </Card>
          </div>

          {/* Activity Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Activity Log</h3>
                {logs.length > 0 && <Button variant="ghost" size="sm" onClick={handleResetFlow} className="text-xs">
                    Reset Flow
                  </Button>}
              </div>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {logs.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">
                    No activity yet. Start testing!
                  </p> : <div className="space-y-4">
                    {logs.map(log => <div key={log.id} className="space-y-1">
                        <div className="flex items-start gap-2">
                          {getLogIcon(log.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{log.stage}</p>
                            <p className={`text-xs break-words ${log.message.includes('COMPLETE') || log.message.includes('STARTING') ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                              {log.message}
                            </p>
                            {log.txHash && <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${log.txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                View tx ↗
                              </a>}
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Separator />
                      </div>)}
                  </div>}
              </ScrollArea>
            </Card>
          </div>
        </div>

        {/* H1 Lab Marketplace Section */}
        <div className="mt-8 mb-8">
          <Card className="p-6 bg-gradient-card border-secondary/20">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="h-6 w-6 text-secondary" />
                <h3 className="text-2xl font-bold">🏪 H1 Lab Marketplace</h3>
              </div>
              <p className="text-sm text-muted-foreground">Buy & Sell H1 tokens from any lab. Powered by Bonding Curves.</p>
            </div>

            <div className="space-y-6">
              {/* Your Labs */}
              <div>
                <p className="text-sm font-semibold text-primary mb-4">
                  {loadingMarketplace ? 'Loading labs...' : allLabsForMarketplace.length > 0 ? 'Your Labs (Available for Trading)' : 'No labs created yet'}
                </p>
                
                {loadingMarketplace ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : allLabsForMarketplace.length === 0 ? (
                  <Card className="p-8 bg-slate-800/50 border-secondary/20">
                    <div className="text-center space-y-3">
                      <Beaker className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Create your first lab to see it here!
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Labs you create will appear here for buying/selling H1 tokens
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {allLabsForMarketplace.map((lab) => (
                      <Card key={lab.labId} className="p-4 bg-slate-800/50 border-secondary/20 hover:border-secondary/40 transition cursor-pointer">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-bold text-lg text-secondary">{lab.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">Domain: {lab.domain}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">H1 Price (LABS)</p>
                              <p className="font-mono font-bold">
                                {parseFloat(lab.h1Price) > 0 ? parseFloat(lab.h1Price).toFixed(6) : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Lab ID</p>
                              <p className="font-mono font-bold">#{lab.labId}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">TVL (LABS)</p>
                              <p className="font-mono font-bold">
                                {parseFloat(lab.tvl).toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Your H1</p>
                              <p className="font-mono font-bold text-primary">
                                {parseFloat(lab.userH1Balance).toFixed(4)}
                              </p>
                            </div>
                          </div>

                          <Separator className="my-2" />

                          {lab.curveAddress && lab.curveAddress !== ethers.ZeroAddress ? (
                            <div className="space-y-2">
                              <Select value={marketplaceAction} onValueChange={v => setMarketplaceAction(v as 'buy' | 'sell')}>
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Buy / Sell" />
                                </SelectTrigger>
                                <SelectContent className="bg-background">
                                  <SelectItem value="buy">🟢 Buy with LABS</SelectItem>
                                  <SelectItem value="sell">🔴 Redeem H1</SelectItem>
                                </SelectContent>
                              </Select>

                              <Input 
                                type="number" 
                                placeholder="Amount in LABS" 
                                step="0.01" 
                                value={selectedLabForTrade === lab.labId ? tradeAmount : ''} 
                                onChange={e => {
                                  setSelectedLabForTrade(lab.labId);
                                  setTradeAmount(e.target.value);
                                }} 
                                className="text-sm" 
                              />

                              <Button 
                                size="sm" 
                                className={`w-full text-sm ${marketplaceAction === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`} 
                                disabled={loading === 'marketplace' || !tradeAmount || selectedLabForTrade !== lab.labId}
                                onClick={() => handleTradeH1(lab.labId, marketplaceAction)}
                              >
                                {loading === 'marketplace' && selectedLabForTrade === lab.labId ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  marketplaceAction === 'buy' ? '🟢 Buy H1 with LABS' : '🔴 Redeem H1'
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-2">
                              <p className="text-xs text-muted-foreground">
                                ⚠️ Bonding curve not deployed yet
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Deploy it to enable H1 trading
                              </p>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground text-center">
                            💡 Stake LABS to get H1 tokens for governance
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Marketplace Info */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground space-y-2">
                  <span className="block"><strong>📊 How It Works:</strong> Stake LABS tokens to get H1 tokens via bonding curves. H1 price increases with TVL.</span>
                  <span className="block"><strong>💰 Revenue Share:</strong> H1 holders earn % of dataset sale revenue via buybacks.</span>
                  <span className="block"><strong>🎯 Early Advantage:</strong> First stakers get lowest prices. Prices increase as more LABS are staked.</span>
                  <span className="block"><strong>🏦 Bonding Curve:</strong> Deploy a bonding curve for your lab to enable H1 trading (requires vault to be deployed first).</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* User's Created Labs Section */}
        {userCreatedLabs.length > 0 && <div className="mt-8 mb-32">
            <Card className="p-6 bg-gradient-card border-primary/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Your Created Labs</h3>
                <p className="text-sm text-muted-foreground">Total: {userCreatedLabs.length} lab{userCreatedLabs.length !== 1 ? 's' : ''} created</p>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {userCreatedLabs.map(lab => {
              const labLevel = calculateLabLevel(currentStakedAmount);
              return <Card key={lab.labId} className="p-4 border-secondary/30 bg-secondary/5 hover:bg-secondary/10 transition">
                      <div className="space-y-3">
                        {/* Lab Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{lab.name}</h4>
                            <p className="text-sm text-muted-foreground">({lab.symbol})</p>
                          </div>
                          <Badge className="bg-primary text-primary-foreground">
                            Level {lab.level}
                          </Badge>
                        </div>

                        {/* Lab Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between py-1 border-t border-border pt-2">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono font-semibold">{lab.labId}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Domain:</span>
                            <Badge variant="outline" className="capitalize">{lab.domain}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span className="text-xs">{lab.createdAt.toLocaleDateString()} {lab.createdAt.toLocaleTimeString()}</span>
                          </div>
                          {lab.vaultAddress && <div className="flex items-start justify-between pt-2 border-t border-border">
                              <span className="text-muted-foreground">Vault:</span>
                              <a href={`${CONTRACTS.BLOCK_EXPLORER}/address/${lab.vaultAddress}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-mono truncate max-w-[150px]">
                                {lab.vaultAddress.slice(0, 6)}...{lab.vaultAddress.slice(-4)} ↗
                              </a>
                            </div>}
                        </div>
                      </div>
                    </Card>;
            })}
              </div>
            </Card>
          </div>}

        {/* Progress Banner */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            {allStepsComplete ? <div className="flex items-center justify-center gap-3 py-2">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-500">🎉 Flow Complete!</h3>
                  <p className="text-sm text-muted-foreground">All 4 steps successfully executed on-chain</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div> : <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Protocol Flow Progress</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{completedCount} / 4 Steps Complete</span>
                    {completedCount > 0 && <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <FileStack className="h-3 w-3 mr-1" />
                            Metadata Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Dataset Metadata Report</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Step 1: Lab Creation */}
                            {datasetMetadata.step1 && <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary">1</span>
                                  </div>
                                  Lab Creation
                                </h3>
                                <div className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-muted-foreground">Lab ID:</span>
                                      <p className="font-mono font-semibold text-primary">#{datasetMetadata.step1.labId}</p>
                                      <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Timestamp:</span>
                                      <p className="font-mono text-xs">{datasetMetadata.step1.timestamp.toLocaleString()}</p>
                                      <p className="text-xs text-green-500">✓ Real</p>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Owner Wallet:</span>
                                    <p className="font-mono text-xs break-all">{datasetMetadata.step1.walletAddress}</p>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Transaction Hash:</span>
                                    <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${datasetMetadata.step1.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline break-all">
                                      {datasetMetadata.step1.txHash} ↗
                                    </a>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                </div>
                              </div>}

                            {/* Step 2: Dataset Creation */}
                            {datasetMetadata.step2 && <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary">2</span>
                                  </div>
                                  Dataset Creation
                                </h3>
                                <div className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-muted-foreground">Data ID:</span>
                                      <p className="font-mono font-semibold text-primary">#{datasetMetadata.step2.dataId}</p>
                                      <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Lab ID:</span>
                                      <p className="font-mono font-semibold">#{datasetMetadata.step2.labId}</p>
                                      <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Data Hash:</span>
                                    <p className="font-mono text-xs break-all">{datasetMetadata.step2.dataHash}</p>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Creator Wallet:</span>
                                    <p className="font-mono text-xs break-all">{datasetMetadata.step2.creator}</p>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Timestamp:</span>
                                    <p className="font-mono text-xs">{datasetMetadata.step2.timestamp.toLocaleString()}</p>
                                    <p className="text-xs text-green-500">✓ Real</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">App Used:</span>
                                    <p className="font-mono text-xs">MedTagger (example app)</p>
                                    <p className="text-xs text-yellow-500">⚠ Placeholder</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">App Developer:</span>
                                    <p className="font-mono text-xs">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb (example)</p>
                                    <p className="text-xs text-yellow-500">⚠ Placeholder</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Transaction Hash:</span>
                                    <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${datasetMetadata.step2.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline break-all">
                                      {datasetMetadata.step2.txHash} ↗
                                    </a>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                </div>
                              </div>}

                            {/* Step 3: Credential Issuance */}
                            {datasetMetadata.step3 && <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary">3</span>
                                  </div>
                                  Credential Issuance (Scholar)
                                </h3>
                                <div className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-muted-foreground">Credential ID:</span>
                                      <p className="font-mono font-semibold text-primary">#{datasetMetadata.step3.credentialId}</p>
                                      <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Domain:</span>
                                      <p className="font-mono font-semibold capitalize">{datasetMetadata.step3.domain}</p>
                                      <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Scholar Wallet:</span>
                                    <p className="font-mono text-xs break-all">{datasetMetadata.step3.walletAddress}</p>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Timestamp:</span>
                                    <p className="font-mono text-xs">{datasetMetadata.step3.timestamp.toLocaleString()}</p>
                                    <p className="text-xs text-green-500">✓ Real</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Enriched Data IDs:</span>
                                    <p className="font-mono text-xs">#{datasetMetadata.step2?.dataId || 'N/A'}</p>
                                    <p className="text-xs text-yellow-500">⚠ Linked from Step 2</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Transaction Hash:</span>
                                    <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${datasetMetadata.step3.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline break-all">
                                      {datasetMetadata.step3.txHash} ↗
                                    </a>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                </div>
                              </div>}

                            {/* Step 4: Purchase */}
                            {datasetMetadata.step4 && <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-sm font-bold text-primary">4</span>
                                  </div>
                                  Dataset Purchase
                                </h3>
                                <div className="space-y-2 text-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-muted-foreground">Purchased Data ID:</span>
                                      <p className="font-mono font-semibold text-primary">#{datasetMetadata.step4.dataIds.join(', #')}</p>
                                      <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Purchase Amount:</span>
                                      <p className="font-mono font-semibold">{datasetMetadata.step4.amount} ETH</p>
                                      <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Buyer Wallet:</span>
                                    <p className="font-mono text-xs break-all">{datasetMetadata.step4.buyer}</p>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Timestamp:</span>
                                    <p className="font-mono text-xs">{datasetMetadata.step4.purchaseTimestamp.toLocaleString()}</p>
                                    <p className="text-xs text-green-500">✓ Real</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Transaction Hash:</span>
                                    <a href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${datasetMetadata.step4.txHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-primary hover:underline break-all">
                                      {datasetMetadata.step4.txHash} ↗
                                    </a>
                                    <p className="text-xs text-green-500">✓ Real (onchain)</p>
                                  </div>
                                </div>
                              </div>}

                            {/* Summary */}
                            <div className="border border-secondary/20 rounded-lg p-4 bg-secondary/5">
                              <h3 className="font-bold text-sm mb-2">Data Status Legend</h3>
                              <div className="space-y-1 text-xs">
                                <p className="text-green-500">✓ Real (onchain) - This data comes directly from blockchain transactions</p>
                                <p className="text-yellow-500">⚠ Placeholder - This field will be populated from contract events in production</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>}
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${completedSteps.step1 ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {completedSteps.step1 ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border-2 border-current" />}
                    <span>Stake & Lab</span>
                  </div>
                  <div className={`flex items-center gap-1 ${completedSteps.step2 ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {completedSteps.step2 ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border-2 border-current" />}
                    <span>Dataset</span>
                  </div>
                  <div className={`flex items-center gap-1 ${completedSteps.step3 ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {completedSteps.step3 ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border-2 border-current" />}
                    <span>Credential</span>
                  </div>
                  <div className={`flex items-center gap-1 ${completedSteps.step4 ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {completedSteps.step4 ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border-2 border-current" />}
                    <span>Purchase</span>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={100} gravity={0.2} wind={0.01} colors={['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']} />}
    </div>
  </TooltipProvider>;
}