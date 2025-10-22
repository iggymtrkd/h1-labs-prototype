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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBaseAccount } from '@/hooks/useBaseAccount';
import { useFaucet } from '@/hooks/useFaucet';
import { Beaker, Rocket, GraduationCap, Building2, Loader2, CheckCircle2, XCircle, Info, ArrowLeft, HelpCircle, CircleHelp } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/config/contracts';
import { LABSToken_ABI, LABSCoreFacet_ABI, DataValidationFacet_ABI, CredentialFacet_ABI, RevenueFacet_ABI, DiamondLoupeFacet_ABI, TestingFacet_ABI } from '@/contracts/abis';
import protocolFlowGuide from '@/assets/protocol-flow-guide.jpg';

// Available domains for lab creation
const AVAILABLE_DOMAINS = [
  'healthcare',
  'medical',
  'biotech',
  'finance',
  'legal',
  'education',
  'research',
  'robotics',
  'art',
  'music',
  'climate',
  'agriculture',
  'manufacturing',
  'logistics',
  'retail',
  'other'
] as const;

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
  const { address, isConnected, connectWallet, sdk } = useBaseAccount();
  const { claimFromFaucet, checkFaucetStatus, isClaiming } = useFaucet();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [faucetBalance, setFaucetBalance] = useState<string | null>(null);
  const [userLabsBalance, setUserLabsBalance] = useState<string | null>(null);
  
  // Progress tracking
  const [completedSteps, setCompletedSteps] = useState({
    step1: false, // Stake & Create Lab
    step2: false, // Create Dataset
    step3: false, // Issue Credential
    step4: false  // Purchase Dataset
  });

  // Wallet balances
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [stakedLabs, setStakedLabs] = useState<string>('0');
  const [labsOwned, setLabsOwned] = useState<number>(0);

  // Step 1: Stake LABS
  const [stakeAmount, setStakeAmount] = useState('1000');
  // Step 1: Two-step signing progress (Approve → Stake)
  type StepStatus = 'idle' | 'awaiting_signature' | 'pending' | 'confirmed' | 'error';
  const [stakeSteps, setStakeSteps] = useState<{ approve: StepStatus; stake: StepStatus }>({ approve: 'idle', stake: 'idle' });
  
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
  const [purchaseAmount, setPurchaseAmount] = useState('1');

  // Step 5: User's Created Labs
  interface CreatedLab {
    labId: number;
    name: string;
    symbol: string;
    domain: string;
    vaultAddress: string;
    createdAt: Date;
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
      txHash,
    };
    setLogs(prev => [log, ...prev]);
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
    setStakeSteps({ approve: 'idle', stake: 'idle' });
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
          await provider.send('wallet_switchEthereumChain', [{ chainId: chainIdHex }]);
        } catch (switchErr: any) {
          // 4902 = chain not added to MetaMask
          if (switchErr?.code === 4902) {
            try {
              await provider.send('wallet_addEthereumChain', [{
                chainId: chainIdHex,
                chainName: 'Base Sepolia',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: [CONTRACTS.RPC_URL],
                blockExplorerUrls: [CONTRACTS.BLOCK_EXPLORER],
              }]);
              await provider.send('wallet_switchEthereumChain', [{ chainId: chainIdHex }]);
            } catch (addErr: any) {
              addLog('error', 'Diagnostics', `❌ Failed to add/switch Base Sepolia: ${addErr?.message || String(addErr)}`);
              toast.error('Could not switch to Base Sepolia in wallet');
              setLoading(null);
              return;
            }
          } else {
            addLog('error', 'Diagnostics', `❌ Failed to switch network: ${switchErr?.message || String(switchErr)}`);
            toast.error('Wrong network. Please switch to Base Sepolia.');
            setLoading(null);
            return;
          }
        }

        // Re-check network after switch
        net = await provider.getNetwork();
        if (Number(net.chainId) !== CONTRACTS.CHAIN_ID) {
          toast.error('Wrong network selected. Please switch to Base Sepolia.');
          setLoading(null);
          return;
        }
        addLog('success', 'Diagnostics', '✅ Wallet switched to Base Sepolia');
      }

      // Preflight diagnostics: verify routing, balances, allowance, and simulate
      const stakeAmountBN = ethers.parseEther(stakeAmount);

      // 1) Verify Diamond routes stakeLABS selector (warn only if mismatch)
      try {
        const loupe = new ethers.Contract(CONTRACTS.H1Diamond, DiamondLoupeFacet_ABI, rpc);
        const selector = ethers.id('stakeLABS(uint256)').slice(0, 10);
        const routedFacet: string = await loupe.facetAddress(selector);
        addLog('info', 'Diagnostics', `🔎 stakeLABS selector routed to: ${routedFacet}`);
        if (routedFacet.toLowerCase() !== (CONTRACTS.LABSCoreFacet as string).toLowerCase()) {
          addLog('error', 'Diagnostics', '⚠ Selector routed to a different facet than configured. Proceeding anyway.');
        }
      } catch (e: any) {
        addLog('error', 'Diagnostics', `❌ Failed loupe check: ${e?.message || String(e)}`);
      }

      // 2) Verify contracts exist on chain (via RPC)
      const codeLABS = await rpc.getCode(CONTRACTS.LABSToken);
      const codeDiamond = await rpc.getCode(CONTRACTS.H1Diamond);
      if (codeLABS === '0x' || codeDiamond === '0x') {
        toast.error('Contract code missing on Base Sepolia (LABS or Diamond)');
        addLog('error', 'Diagnostics', `❌ Code missing. LABS=${codeLABS !== '0x'}, DIAMOND=${codeDiamond !== '0x'}`);
        setLoading(null);
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
      const [bal, allowance] = await Promise.all([
        labsToken.balanceOf(address),
        labsToken.allowance(address, CONTRACTS.H1Diamond)
      ]);
      addLog('info', 'Diagnostics', `💰 LABS balance: ${ethers.formatEther(bal)} | allowance: ${ethers.formatEther(allowance)}`);
      if (bal < stakeAmountBN) {
        toast.error('Insufficient LABS balance for stake amount');
        setLoading(null);
        return;
      }

      // 4) Approve Diamond to spend LABS (before simulation)
      addLog('info', 'Stage 1: Stake $LABS', `🔐 Requesting approval for ${stakeAmount} LABS...`);
      setStakeSteps(prev => ({ ...prev, approve: 'awaiting_signature' }));
      const approvalTx = await new ethers.Contract(labsTokenAddr, LABSToken_ABI, signer).approve(
        CONTRACTS.H1Diamond,
        stakeAmountBN,
        { gasLimit: 80000 }
      );
      setStakeSteps(prev => ({ ...prev, approve: 'pending' }));
      addLog('info', 'Stage 1: Stake $LABS', '⏳ Waiting for approval confirmation...');
      await approvalTx.wait();
      addLog('success', 'Stage 1: Stake $LABS', `✅ Approval confirmed! ${stakeAmount} LABS authorized`, approvalTx.hash);
      setStakeSteps(prev => ({ ...prev, approve: 'confirmed' }));

      // 5) Re-check allowance after approval
      try {
        const newAllowance = await labsToken.allowance(address, CONTRACTS.H1Diamond);
        addLog('info', 'Diagnostics', `✅ New allowance: ${ethers.formatEther(newAllowance)}`);
        if (newAllowance < stakeAmountBN) {
          addLog('error', 'Diagnostics', '❌ Allowance still insufficient after approval. Attempting reset to 0 then re-approve...');
          try {
            const zeroTx = await new ethers.Contract(labsTokenAddr, LABSToken_ABI, signer).approve(
              CONTRACTS.H1Diamond,
              0n
            );
            await zeroTx.wait();
            const reapproveTx = await new ethers.Contract(labsTokenAddr, LABSToken_ABI, signer).approve(
              CONTRACTS.H1Diamond,
              stakeAmountBN
            );
            await reapproveTx.wait();
            const finalAllowance = await labsToken.allowance(address, CONTRACTS.H1Diamond);
            addLog('info', 'Diagnostics', `✅ Final allowance after reset: ${ethers.formatEther(finalAllowance)}`);
            if (finalAllowance < stakeAmountBN) {
              toast.error('Allowance remained insufficient after reset');
              setLoading(null);
              return;
            }
          } catch (resetErr: any) {
            addLog('error', 'Diagnostics', `❌ Failed allowance reset flow: ${resetErr?.message || String(resetErr)}`);
            toast.error('Approval reset failed');
            setLoading(null);
            return;
          }
        }
      } catch {}

      // 6) Small delay to allow RPCs to index the new allowance
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log balances for reference
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      addLog('info', 'Stage 1: Stake $LABS', `💰 Wallet ETH balance: ${parseFloat(balanceInEth).toFixed(4)} ETH`);

      // Stake LABS via LABSCoreFacet
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, signer);

      addLog('info', 'Stage 1: Stake $LABS', '📡 Broadcasting stake transaction to LABSCoreFacet...');
      setStakeSteps(prev => ({ ...prev, stake: 'awaiting_signature' }));
      let stakeTx;
      try {
        stakeTx = await diamond.stakeLABS(stakeAmountBN, { gasLimit: 180000 });
      } catch (sendErr: any) {
        addLog('error', 'Stage 1: Stake $LABS', `❌ Failed to send stake tx: ${sendErr?.shortMessage || sendErr?.message || String(sendErr)}`);
        toast.error('Failed to send stake transaction');
        setStakeSteps(prev => ({ ...prev, stake: 'error' }));
        setLoading(null);
        return;
      }
      setStakeSteps(prev => ({ ...prev, stake: 'pending' }));
      addLog('info', 'Stage 1: Stake $LABS', '⏳ Mining stake transaction...');
      await stakeTx.wait();

      addLog('success', 'Stage 1: Stake $LABS', `✅ COMPLETE: ${stakeAmount} LABS staked successfully! Now eligible to create Labs`, stakeTx.hash);
      toast.success('LABS staked successfully!');
      setStakeSteps(prev => ({ ...prev, stake: 'confirmed' }));

      // Reload balances
      await loadUserLabsBalance();
      // Optimistically update staked balance in UI
      try {
        const current = parseFloat(stakedLabs || '0');
        const delta = parseFloat(ethers.formatEther(stakeAmountBN));
        setStakedLabs((current + delta).toString());
      } catch {}

    } catch (error: any) {
      console.error('❌ Stake error:', error);
      addLog('error', 'Stage 1: Stake $LABS', `❌ ${error.message || 'Failed to stake LABS tokens'}`);
      toast.error('Failed to stake LABS');
    } finally {
      setLoading(null);
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

      // Parse events to get lab ID and vault address
      const labCreatedEvent = receipt.logs.find((log: any) => log.topics[0] === ethers.id("LabCreated(uint256,address,string,string,string,address)"));
      const labId = labCreatedEvent ? ethers.toNumber(labCreatedEvent.topics[1]) : "unknown";
      
      // Extract vault address from event data (last parameter)
      let vaultAddress = '';
      if (labCreatedEvent) {
        const iface = new ethers.Interface(LABSCoreFacet_ABI);
        const decoded = iface.parseLog(labCreatedEvent);
        if (decoded && decoded.args && decoded.args[5]) {
          vaultAddress = decoded.args[5];
        }
      }

      // Add to user's created labs
      const newLab: CreatedLab = {
        labId: typeof labId === 'number' ? labId : parseInt(labId),
        name: labName,
        symbol: labSymbol,
        domain: labDomain,
        vaultAddress: vaultAddress,
        createdAt: new Date()
      };
      setUserCreatedLabs(prev => [newLab, ...prev]);

      addLog('success', 'Stage 1: Create Lab', `✅ STEP 1 COMPLETE: Lab "${labName}" created (ID: ${labId}, Level ${labLevel}) with vault deployed!`, createTx.hash);
      toast.success(`Step 1 Complete! Lab created with ID: ${labId} (Level ${labLevel})`);
      setCompletedSteps(prev => ({ ...prev, step1: true }));
      
      // Reset form
      setLabName('');
      setLabSymbol('');
      setLabDomain('healthcare');
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
        const [routeParams, routeStaked] = await Promise.all([
          loupe.facetAddress(selParams),
          loupe.facetAddress(selStaked)
        ]);
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
        addLog('success', 'Testing: Receive LABS', `💰 Faucet claim successful! ${result.amount} LABS transferred to your wallet`, result.txHash);
        toast.success(`Claimed ${result.amount} LABS tokens!`);
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
    addLog('info', 'Stage 2: Create Data', `📊 STARTING: Create dataset for Lab ID ${dataLabId} in ${dataDomain}`);

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

      addLog('info', 'Stage 2: Create Data', '📡 Broadcasting data creation to DataValidationFacet...');
      const createTx = await diamond.createData(
        dataLabId,
        dataHash,
        dataDomain,
        ethers.ZeroAddress, // baseModel (not required for demo)
        0 // creatorCredentialId (0 = none)
      );
      
      addLog('info', 'Stage 2: Create Data', '⏳ Mining transaction & recording data provenance onchain...');
      const receipt = await createTx.wait();

      // Parse DataCreated event
      const dataCreatedEvent = receipt.logs.find((log: any) => log.topics[0] === ethers.id("DataCreated(uint256,uint256,bytes32,string,address)"));
      const dataId = dataCreatedEvent ? ethers.toNumber(dataCreatedEvent.topics[1]) : "unknown";

      addLog('success', 'Stage 2: Create Data', `✅ STEP 2 COMPLETE: Dataset created (ID: ${dataId}) and recorded onchain!`, createTx.hash);
      toast.success(`Step 2 Complete! Dataset ID: ${dataId}`);
      setCompletedSteps(prev => ({ ...prev, step2: true }));
      
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
    addLog('info', 'Stage 3: Credentials', `🎓 STARTING: Issue "${credentialType}" credential in ${credentialDomain}`);

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
      addLog('info', 'Stage 3: Credentials', '🔍 Checking for existing user ID...');
      let userId = await diamond.getUserId(userAddress);

      if (userId === 0n) {
        addLog('info', 'Stage 3: Credentials', '📡 Creating new user ID...');
        const createUserTx = await diamond.createUserId(userAddress, credentialDomain);
        await createUserTx.wait();
        userId = await diamond.getUserId(userAddress);
        addLog('success', 'Stage 3: Credentials', `✅ User ID created: ${userId}`, createUserTx.hash);
      } else {
        addLog('info', 'Stage 3: Credentials', `📋 Existing user ID found: ${userId}`);
      }

      // Generate verification hash
      const verificationHash = ethers.keccak256(ethers.toUtf8Bytes(`${credentialType}-${Date.now()}`));

      addLog('info', 'Stage 3: Credentials', '📡 Broadcasting credential issuance to CredentialFacet...');
      const issueTx = await diamond.issueCredential(
        userId,
        credentialType,
        credentialDomain,
        verificationHash
      );

      addLog('info', 'Stage 3: Credentials', '⏳ Mining transaction & recording credential onchain...');
      const receipt = await issueTx.wait();

      // Parse CredentialIssued event
      const credIssuedEvent = receipt.logs.find((log: any) => log.topics[0] === ethers.id("CredentialIssued(uint256,uint256,string,string)"));
      const credentialId = credIssuedEvent ? ethers.toNumber(credIssuedEvent.topics[2]) : "unknown";

      addLog('success', 'Stage 3: Credentials', `✅ STEP 3 COMPLETE: Credential issued (ID: ${credentialId}) - Scholar verified!`, issueTx.hash);
      toast.success(`Step 3 Complete! Credential ID: ${credentialId}`);
      setCompletedSteps(prev => ({ ...prev, step3: true }));
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
      
      addLog('info', 'Stage 4: Purchase Dataset', `📊 Revenue split: Buyback=${ethers.formatEther(breakdown[0])} ETH, Dev=${ethers.formatEther(breakdown[1])} ETH, Creator=${ethers.formatEther(breakdown[2])} ETH, Scholar=${ethers.formatEther(breakdown[3])} ETH, Treasury=${ethers.formatEther(breakdown[4])} ETH`);

      addLog('info', 'Stage 4: Purchase Dataset', '📡 Broadcasting purchase to RevenueFacet...');
      const purchaseTx = await diamond.batchDistributeRevenue(
        [purchaseDatasetId],
        [purchaseLabId],
        [amountWei],
        { value: amountWei }
      );

      addLog('info', 'Stage 4: Purchase Dataset', '⏳ Mining transaction & distributing revenue to all stakeholders...');
      await purchaseTx.wait();

      addLog('success', 'Stage 4: Purchase Dataset', `✅ STEP 4 COMPLETE: Dataset purchased! Revenue distributed + H1 buyback executed!`, purchaseTx.hash);
      toast.success('Step 4 Complete! All stakeholders paid!');
      setCompletedSteps(prev => ({ ...prev, step4: true }));
    } catch (error: any) {
      console.error('Purchase error:', error);
      addLog('error', 'Stage 4: Purchase Dataset', `❌ ${error.message || 'Failed to purchase dataset'}`);
      toast.error('Failed to purchase dataset');
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      loadFaucetBalance();
      loadUserLabsBalance();
    }
  }, [isConnected, address]);

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercentage = (completedCount / 4) * 100;
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
    error: 'Error',
  };

  const statusIcon = (status: StepStatus) => {
    if (status === 'confirmed') return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    if (status === 'pending') return <Loader2 className="h-3 w-3 animate-spin text-primary" />;
    if (status === 'awaiting_signature') return <Info className="h-3 w-3 text-muted-foreground" />;
    if (status === 'error') return <XCircle className="h-3 w-3 text-destructive" />;
    return <div className="h-3 w-3 rounded-full border border-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/get-started')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Choice
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary font-mono">The H1 Protocol</h1>
          <p className="text-muted-foreground">Interactive testing interface for onchain flows</p>
          <Badge className="mt-2 bg-secondary">{CONTRACTS.H1Diamond}</Badge>
        </div>

        {/* Wallet Info - Shows USER'S Base Wallet (not faucet) */}
        {isConnected && address && (
          <Card className="mb-6 bg-card/50 backdrop-blur border-primary/20">
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
          </Card>
        )}

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
                    {userLabsBalance !== null && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
                        <p className="text-lg font-bold">{parseFloat(userLabsBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} LABS</p>
                      </div>
                    )}
                    {faucetBalance && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">Faucet Balance</p>
                        <p className="text-lg font-bold">{parseFloat(faucetBalance).toLocaleString(undefined, { maximumFractionDigits: 0 })} LABS</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleMintTestLabs}
                    disabled={loading === 'mint'}
                    className="w-full"
                    variant="outline"
                  >
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
                          <img 
                            src={protocolFlowGuide} 
                            alt="H1 Protocol Flow Diagram" 
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
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
                    <TooltipProvider>
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
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">LABSToken.sol & LABSCoreFacet.sol</p>
                  <Badge className="mt-2 bg-primary/20 text-primary">Create Data Labs / H1 Tokens</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="stakeAmount">Stake Amount</Label>
                  <Input
                    id="stakeAmount"
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="1000"
                  />
                </div>

                {/* Current Staked Balance & Lab Level */}
                <div className="rounded-md bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Staked:</span>
                    <span className="font-semibold">{parseFloat(stakedLabs || '0').toLocaleString()} LABS</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Projected Lab Level:</span>
                    {projectedLabLevel > 0 ? (
                      <span className="font-semibold text-primary">Level {projectedLabLevel}</span>
                    ) : (
                      <span className="text-destructive font-semibold">No Level (need 100k+)</span>
                    )}
                  </div>
                  
                  {/* Validation Message */}
                  {!canCreateLab && (
                    <div className="mt-2 p-2 bg-destructive/10 border border-destructive/30 rounded text-xs text-destructive">
                      ⚠️ You need at least {MIN_STAKE_FOR_LAB.toLocaleString()} LABS staked to create a lab. Currently have {parseFloat(stakedLabs || '0').toLocaleString()}.
                    </div>
                  )}
                  
                  {/* Level Thresholds */}
                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                    <div>Level 1: {LEVEL1_THRESHOLD.toLocaleString()} LABS</div>
                    <div>Level 2: {LEVEL2_THRESHOLD.toLocaleString()} LABS</div>
                    <div>Level 3: {LEVEL3_THRESHOLD.toLocaleString()} LABS</div>
                  </div>
                </div>

                <Button
                  onClick={handleStakeLabs}
                  disabled={loading === 'stake'}
                  className="w-full"
                >
                  {loading === 'stake' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Stake LABS Tokens
                </Button>

                {(loading === 'stake' || stakeSteps.approve !== 'idle' || stakeSteps.stake !== 'idle') && (
                  <div className="rounded-md bg-muted/50 p-3">
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
                  </div>
                )}

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="labName">Lab Name</Label>
                    <Input
                      id="labName"
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                      placeholder="CardioLab"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labSymbol">Lab Symbol</Label>
                    <Input
                      id="labSymbol"
                      value={labSymbol}
                      onChange={(e) => setLabSymbol(e.target.value)}
                      placeholder="CARDIO"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labDomain">Domain</Label>
                    <Select value={labDomain} onValueChange={setLabDomain}>
                      <SelectTrigger id="labDomain" className="bg-background">
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {AVAILABLE_DOMAINS.map((domain) => (
                          <SelectItem key={domain} value={domain} className="capitalize">
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleCreateLab}
                    disabled={loading === 'createLab'}
                    className="w-full"
                  >
                    {loading === 'createLab' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Lab & Deploy Vault
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stage 2: Devs */}
            <Card className="p-6 bg-gradient-card border-secondary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Devs</h2>
                  <p className="text-sm text-muted-foreground">DataValidationFacet.sol</p>
                  <Badge className="mt-2 bg-secondary/20 text-secondary">Create Training Data</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="dataLabId">Lab ID</Label>
                  <Input
                    id="dataLabId"
                    type="number"
                    value={dataLabId}
                    onChange={(e) => setDataLabId(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="dataContent">Data Content</Label>
                  <Input
                    id="dataContent"
                    value={dataContent}
                    onChange={(e) => setDataContent(e.target.value)}
                    placeholder="Patient X-ray scan data..."
                  />
                </div>
                <div>
                  <Label htmlFor="dataDomain">Domain</Label>
                  <Select value={dataDomain} onValueChange={setDataDomain}>
                    <SelectTrigger id="dataDomain" className="bg-background">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {AVAILABLE_DOMAINS.map((domain) => (
                        <SelectItem key={domain} value={domain} className="capitalize">
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateData}
                  disabled={loading === 'createData'}
                  className="w-full"
                >
                  {loading === 'createData' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Dataset
                </Button>
              </div>
            </Card>

            {/* Stage 3: Scholars */}
            <Card className="p-6 bg-gradient-card border-accent/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Scholars</h2>
                  <p className="text-sm text-muted-foreground">CredentialFacet.sol</p>
                  <Badge className="mt-2 bg-accent/20 text-accent">Issue & Verify Credentials</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="credentialType">Credential Type</Label>
                  <Input
                    id="credentialType"
                    value={credentialType}
                    onChange={(e) => setCredentialType(e.target.value)}
                    placeholder="Medical Degree"
                  />
                </div>
                <div>
                  <Label htmlFor="credentialDomain">Domain</Label>
                  <Select value={credentialDomain} onValueChange={setCredentialDomain}>
                    <SelectTrigger id="credentialDomain" className="bg-background">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {AVAILABLE_DOMAINS.map((domain) => (
                        <SelectItem key={domain} value={domain} className="capitalize">
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateCredential}
                  disabled={loading === 'createCredential'}
                  className="w-full"
                >
                  {loading === 'createCredential' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Issue Credential
                </Button>
              </div>
            </Card>

            {/* Stage 4: AI Companies */}
            <Card className="p-6 bg-gradient-card border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">AI Companies</h2>
                  <p className="text-sm text-muted-foreground">RevenueFacet.sol</p>
                  <Badge className="mt-2 bg-primary/20 text-primary">Purchase Datasets (Buyback H1)</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="purchaseDatasetId">Dataset ID</Label>
                  <Input
                    id="purchaseDatasetId"
                    type="number"
                    value={purchaseDatasetId}
                    onChange={(e) => setPurchaseDatasetId(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="purchaseLabId">Lab ID</Label>
                  <Input
                    id="purchaseLabId"
                    type="number"
                    value={purchaseLabId}
                    onChange={(e) => setPurchaseLabId(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="purchaseAmount">Amount (ETH)</Label>
                  <Input
                    id="purchaseAmount"
                    type="number"
                    step="0.01"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    placeholder="1.0"
                  />
                </div>
                <Button
                  onClick={handlePurchaseDataset}
                  disabled={loading === 'purchase'}
                  className="w-full"
                >
                  {loading === 'purchase' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Purchase Dataset
                </Button>
              </div>
            </Card>
          </div>

          {/* Activity Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Activity Log</h3>
                {logs.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleResetFlow}
                    className="text-xs"
                  >
                    Reset Flow
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {logs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No activity yet. Start testing!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="space-y-1">
                        <div className="flex items-start gap-2">
                          {getLogIcon(log.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{log.stage}</p>
                            <p className={`text-xs break-words ${
                              log.message.includes('COMPLETE') || log.message.includes('STARTING') 
                                ? 'font-bold text-foreground' 
                                : 'text-muted-foreground'
                            }`}>
                              {log.message}
                            </p>
                            {log.txHash && (
                              <a
                                href={`${CONTRACTS.BLOCK_EXPLORER}/tx/${log.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                View tx ↗
                              </a>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>

        {/* User's Created Labs Section */}
        {userCreatedLabs.length > 0 && (
          <div className="mt-8 mb-32">
            <Card className="p-6 bg-gradient-card border-primary/20">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Your Created Labs</h3>
                <p className="text-sm text-muted-foreground">Total: {userCreatedLabs.length} lab{userCreatedLabs.length !== 1 ? 's' : ''} created</p>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {userCreatedLabs.map((lab) => {
                  const labLevel = calculateLabLevel(currentStakedAmount);
                  return (
                    <Card key={lab.labId} className="p-4 border-secondary/30 bg-secondary/5 hover:bg-secondary/10 transition">
                      <div className="space-y-3">
                        {/* Lab Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{lab.name}</h4>
                            <p className="text-sm text-muted-foreground">({lab.symbol})</p>
                          </div>
                          <Badge className="bg-primary text-primary-foreground">
                            Level {labLevel}
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
                          {lab.vaultAddress && (
                            <div className="flex items-start justify-between pt-2 border-t border-border">
                              <span className="text-muted-foreground">Vault:</span>
                              <a
                                href={`${CONTRACTS.BLOCK_EXPLORER}/address/${lab.vaultAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline font-mono truncate max-w-[150px]"
                              >
                                {lab.vaultAddress.slice(0, 6)}...{lab.vaultAddress.slice(-4)} ↗
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Progress Banner */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            {allStepsComplete ? (
              <div className="flex items-center justify-center gap-3 py-2">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-500">🎉 Flow Complete!</h3>
                  <p className="text-sm text-muted-foreground">All 4 steps successfully executed on-chain</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Protocol Flow Progress</h4>
                  <span className="text-sm text-muted-foreground">{completedCount} / 4 Steps Complete</span>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
