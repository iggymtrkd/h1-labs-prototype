import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useBaseAccount } from '@/hooks/useBaseAccount';
import { Beaker, Rocket, GraduationCap, Building2, Loader2, CheckCircle2, XCircle, Info, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/config/contracts';
import { LABSToken_ABI, LABSCoreFacet_ABI } from '@/contracts/abis';

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
  const { address, isConnected, connectWallet } = useBaseAccount();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  // Step 1: Stake LABS
  const [stakeAmount, setStakeAmount] = useState('1000');
  
  // Step 2: Create Lab
  const [labName, setLabName] = useState('');
  const [labSymbol, setLabSymbol] = useState('');
  const [labDomain, setLabDomain] = useState('healthcare');

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

    setLoading('stake');
    addLog('info', 'Stage 1: Stake $LABS', `Attempting to stake ${stakeAmount} LABS tokens...`);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Load LABS Token
      const labsToken = new ethers.Contract(CONTRACTS.LABSToken, LABSToken_ABI, signer);

      // Approve Diamond to spend LABS
      addLog('info', 'Stage 1: Stake $LABS', 'Approving LABS tokens...');
      const approvalTx = await labsToken.approve(
        CONTRACTS.H1Diamond,
        ethers.parseEther(stakeAmount)
      );
      await approvalTx.wait();
      addLog('success', 'Stage 1: Stake $LABS', 'LABS tokens approved', approvalTx.hash);

      // Stake LABS via LABSCoreFacet
      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, signer);

      addLog('info', 'Stage 1: Stake $LABS', 'Staking LABS tokens...');
      const stakeTx = await diamond.stakeLABS(ethers.parseEther(stakeAmount));
      await stakeTx.wait();

      addLog('success', 'Stage 1: Stake $LABS', `Successfully staked ${stakeAmount} LABS tokens`, stakeTx.hash);
      toast.success('LABS staked successfully!');
    } catch (error: any) {
      console.error('Stake error:', error);
      addLog('error', 'Stage 1: Stake $LABS', error.message || 'Failed to stake LABS tokens');
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

    setLoading('createLab');
    addLog('info', 'Stage 1: Create Lab', `Creating lab: ${labName} (${labSymbol})...`);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const diamond = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, signer);

      const createTx = await diamond.createLab(labName, labSymbol, labDomain);
      const receipt = await createTx.wait();

      addLog('success', 'Stage 1: Create Lab', `Lab "${labName}" created successfully! Vault deployed.`, createTx.hash);
      toast.success('Lab created successfully!');
      
      // Reset form
      setLabName('');
      setLabSymbol('');
      setLabDomain('healthcare');
    } catch (error: any) {
      console.error('Create lab error:', error);
      addLog('error', 'Stage 1: Create Lab', error.message || 'Failed to create lab');
      toast.error('Failed to create lab');
    } finally {
      setLoading(null);
    }
  };

  const handleMintTestLabs = async () => {
    toast.info('Test LABS minting coming soon - please use faucet endpoint');
    addLog('info', 'Testing: Mint LABS', 'Test minting endpoint not yet implemented. Use faucet for test tokens.');
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Testing Interface */}
          <div className="lg:col-span-2 space-y-6">

            {/* Testing Controls */}
            <Card className="p-6 bg-gradient-card">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Beaker className="h-5 w-5 text-primary" />
                Testing Utilities
              </h3>
              <Button
                onClick={handleMintTestLabs}
                disabled={loading === 'mint'}
                className="w-full"
                variant="outline"
              >
                {loading === 'mint' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Mint 10,000 Test LABS
              </Button>
            </Card>

            {/* Stage 1: Stake LABS & Create Lab */}
            <Card className="p-6 bg-gradient-card border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Stake $LABS</h2>
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
                <Button
                  onClick={handleStakeLabs}
                  disabled={loading === 'stake'}
                  className="w-full"
                >
                  {loading === 'stake' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Stake LABS Tokens
                </Button>

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
                    <Input
                      id="labDomain"
                      value={labDomain}
                      onChange={(e) => setLabDomain(e.target.value)}
                      placeholder="healthcare"
                    />
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

            {/* Stage 2: Devs (Coming Soon) */}
            <Card className="p-6 bg-gradient-card border-secondary/20 opacity-60">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Devs</h2>
                  <p className="text-sm text-muted-foreground">DualIntelligenceSDK (soon) & DataValidationFacet.sol</p>
                  <Badge className="mt-2 bg-secondary/20 text-secondary">Create Training Apps</Badge>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </div>
            </Card>

            {/* Stage 3: Scholars (Coming Soon) */}
            <Card className="p-6 bg-gradient-card border-accent/20 opacity-60">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Scholars</h2>
                  <p className="text-sm text-muted-foreground">CredentialFacet.sol</p>
                  <Badge className="mt-2 bg-accent/20 text-accent">Create, Enrich, Annotate and Supervise</Badge>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </div>
            </Card>

            {/* Stage 4: AI Companies (Coming Soon) */}
            <Card className="p-6 bg-gradient-card border-primary/20 opacity-60">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">AI Companies</h2>
                  <p className="text-sm text-muted-foreground">RevenueFacet.sol</p>
                  <Badge className="mt-2 bg-primary/20 text-primary">Purchase Datasets (Buyback of H1 tokens)</Badge>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card sticky top-6">
              <h3 className="font-bold mb-4">Activity Log</h3>
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
                            <p className="text-xs text-muted-foreground break-words">{log.message}</p>
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
      </div>
    </div>
  );
}
