import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Users, Database, MessageCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useBaseAccount } from "@/hooks/useBaseAccount";
import { ethers } from "ethers";
import { CONTRACTS } from "@/config/contracts";
import { LABSToken_ABI, BondingCurveSale_ABI, LabDistributionFacet_ABI, LabVault_ABI } from "@/contracts/abis";
import { toast } from "sonner";

export interface Lab {
  id: string;
  name: string;
  symbol: string;
  category: string;
  description: string;
  price: string;
  change24h: number;
  volume24h: string;
  marketCap: string;
  validators: number;
  datasets: number;
  logo?: string;
  bondingCurveAddress?: string;
  h1Price?: string;
  tvl?: string;
  owner?: string;
}

interface LabCardProps {
  lab: Lab;
  variant?: "market" | "owned";
}

export const LabCard = ({ lab, variant = "market" }: LabCardProps) => {
  const isPositive = lab.change24h >= 0;
  const { address, isConnected, sdk } = useBaseAccount();
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [userH1Balance, setUserH1Balance] = useState<string>('0');

  const hasBondingCurve = lab.bondingCurveAddress && lab.bondingCurveAddress !== ethers.ZeroAddress;
  const isOwner = address && lab.owner && address.toLowerCase() === lab.owner.toLowerCase();

  // Fetch user's H1 balance for this lab
  useEffect(() => {
    const fetchH1Balance = async () => {
      if (!address || !isConnected || !sdk) return;
      
      try {
        const walletProvider = sdk.getProvider();
        const provider = new ethers.BrowserProvider(walletProvider as any);
        
        // Get vault address from bonding curve
        if (hasBondingCurve && lab.bondingCurveAddress) {
          const curve = new ethers.Contract(lab.bondingCurveAddress, BondingCurveSale_ABI, provider);
          const vaultAddress = await curve.vault();
          
          // Get user's vault share balance
          const vault = new ethers.Contract(vaultAddress, LabVault_ABI, provider);
          const balance = await vault.balanceOf(address);
          setUserH1Balance(ethers.formatEther(balance));
        }
      } catch (error) {
        console.error('Error fetching H1 balance:', error);
      }
    };
    
    fetchH1Balance();
  }, [address, isConnected, sdk, hasBondingCurve, lab.bondingCurveAddress]);

  const handleDeployBondingCurve = async () => {
    if (!isConnected || !sdk || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!isOwner) {
      toast.error('Only the lab owner can deploy the bonding curve');
      return;
    }

    setLoading(true);
    try {
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
      const signer = await provider.getSigner(address);

      const distributionFacet = new ethers.Contract(
        CONTRACTS.LabDistributionFacet,
        LabDistributionFacet_ABI,
        signer
      );

      toast.info('Deploying bonding curve and distributing H1 tokens...');
      const tx = await distributionFacet.createLabStep2(lab.id);
      await tx.wait();

      toast.success('Bonding curve deployed successfully! Refresh to see updates.');
    } catch (error: any) {
      console.error('Deploy bonding curve error:', error);
      toast.error(error?.message || 'Failed to deploy bonding curve');
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    if (!isConnected || !sdk || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!hasBondingCurve) {
      toast.error('Bonding curve not deployed for this lab yet');
      return;
    }

    if (!tradeAmount || isNaN(Number(tradeAmount)) || Number(tradeAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const walletProvider = sdk.getProvider();
      const amountWei = ethers.parseEther(tradeAmount);
      const chainIdHex = '0x' + CONTRACTS.CHAIN_ID.toString(16);

      if (!walletProvider) {
        throw new Error('Wallet provider not available');
      }

      if (tradeAction === 'buy') {
        // Batch: approve + buy in single transaction
        toast.info('Preparing to buy H1 tokens (1 confirmation)...');
        
        // Encode approval call
        const labsTokenInterface = new ethers.Interface(LABSToken_ABI);
        const approvalData = labsTokenInterface.encodeFunctionData('approve', [lab.bondingCurveAddress, amountWei]);
        
        // Encode buy call
        const curveInterface = new ethers.Interface(BondingCurveSale_ABI);
        const buyData = curveInterface.encodeFunctionData('buy', [amountWei, address, 0]);

        // Send batched transaction
        const bundleId = await walletProvider.request({
          method: 'wallet_sendCalls',
          params: [{
            version: '1.0',
            from: address,
            chainId: chainIdHex,
            calls: [
              {
                to: CONTRACTS.LABSToken,
                data: approvalData,
                value: '0x0'
              },
              {
                to: lab.bondingCurveAddress,
                data: buyData,
                value: '0x0'
              }
            ]
          }]
        }) as string;

        // Poll for confirmation
        let confirmed = false;
        for (let i = 0; i < 120 && !confirmed; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
            const callsStatus = await walletProvider.request({
              method: 'wallet_getCallsStatus',
              params: [bundleId],
            }) as any;
            
            if (callsStatus?.status === 'CONFIRMED') {
              confirmed = true;
              break;
            } else if (callsStatus?.status === 'FAILED') {
              throw new Error('Transaction failed');
            }
          } catch {}
        }

        if (!confirmed) throw new Error('Transaction timeout');
        toast.success(`Successfully bought ${lab.symbol} H1 tokens!`);
        
        // Refresh H1 balance
        if (hasBondingCurve && lab.bondingCurveAddress) {
          const provider = new ethers.BrowserProvider(walletProvider as any);
          const curve = new ethers.Contract(lab.bondingCurveAddress, BondingCurveSale_ABI, provider);
          const vaultAddress = await curve.vault();
          const vault = new ethers.Contract(vaultAddress, LabVault_ABI, provider);
          const balance = await vault.balanceOf(address);
          setUserH1Balance(ethers.formatEther(balance));
        }

      } else {
        // Sell: get vault + check balance + approve + sell in single transaction
        toast.info('Preparing to sell H1 tokens (1 confirmation)...');
        
        // Get vault address and check balance
        const provider = new ethers.BrowserProvider(walletProvider as any);
        const curve = new ethers.Contract(lab.bondingCurveAddress!, BondingCurveSale_ABI, provider);
        const vaultAddress = await curve.vault();
        
        // Check if user has enough vault shares
        const vault = new ethers.Contract(vaultAddress, LabVault_ABI, provider);
        const userBalance = await vault.balanceOf(address);
        
        if (userBalance < amountWei) {
          throw new Error(`Insufficient H1 balance. You have ${ethers.formatEther(userBalance)} H1`);
        }

        // Encode approval call for vault shares (H1 tokens)
        const vaultInterface = new ethers.Interface(LabVault_ABI);
        const approvalData = vaultInterface.encodeFunctionData('approve', [lab.bondingCurveAddress, amountWei]);
        
        // Encode sell call
        const curveInterface = new ethers.Interface(BondingCurveSale_ABI);
        const sellData = curveInterface.encodeFunctionData('sell', [amountWei, address, 0]);

        // Send batched transaction
        const bundleId = await walletProvider.request({
          method: 'wallet_sendCalls',
          params: [{
            version: '1.0',
            from: address,
            chainId: chainIdHex,
            calls: [
              {
                to: vaultAddress,
                data: approvalData,
                value: '0x0'
              },
              {
                to: lab.bondingCurveAddress,
                data: sellData,
                value: '0x0'
              }
            ]
          }]
        }) as string;

        // Poll for confirmation
        let confirmed = false;
        for (let i = 0; i < 120 && !confirmed; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
            const callsStatus = await walletProvider.request({
              method: 'wallet_getCallsStatus',
              params: [bundleId],
            }) as any;
            
            if (callsStatus?.status === 'CONFIRMED') {
              confirmed = true;
              break;
            } else if (callsStatus?.status === 'FAILED') {
              throw new Error('Transaction failed');
            }
          } catch {}
        }

        if (!confirmed) throw new Error('Transaction timeout');
        toast.success(`Successfully sold ${lab.symbol} H1 tokens!`);
        
        // Refresh H1 balance
        const balance = await vault.balanceOf(address);
        setUserH1Balance(ethers.formatEther(balance));
      }
    } catch (error: any) {
      console.error('Trade error:', error);
      toast.error(error?.message || 'Failed to trade H1 tokens');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 card-hover group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {lab.logo ? (
            <img src={lab.logo} alt={lab.name} className="h-12 w-12 rounded-full" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-secondary flex items-center justify-center">
              <span className="text-xl font-bold">{lab.symbol[0]}</span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{lab.name}</h3>
            <p className="text-sm text-muted-foreground">{lab.symbol}</p>
          </div>
        </div>
        <Badge className={isPositive ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}>
          {lab.category}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{lab.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">H1 Price</p>
          <p className="text-xl font-bold text-primary">
            {hasBondingCurve && lab.h1Price && lab.h1Price !== '0' 
              ? `${parseFloat(lab.h1Price).toFixed(4)} LABS`
              : 'Not Set'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">TVL</p>
          <p className="text-xl font-bold text-secondary">
            {hasBondingCurve && lab.tvl 
              ? `${parseFloat(lab.tvl).toFixed(2)} LABS`
              : '0 LABS'}
          </p>
        </div>
      </div>

      {!hasBondingCurve && isOwner && (
        <div className="mb-4">
          <Button 
            onClick={handleDeployBondingCurve}
            disabled={loading || !isConnected}
            className="w-full bg-secondary text-secondary-foreground hover:opacity-90"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deploying...</>
            ) : (
              '🚀 Deploy Bonding Curve (Step 2)'
            )}
          </Button>
        </div>
      )}

      {hasBondingCurve && (
        <div className="mb-4 p-3 bg-muted/30 rounded-lg space-y-2">
          <Select value={tradeAction} onValueChange={(v) => setTradeAction(v as 'buy' | 'sell')}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">🟢 Buy H1</SelectItem>
              <SelectItem value="sell">🔴 Sell H1</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={tradeAction === 'buy' ? 'Amount in LABS' : 'Amount in H1'}
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              className="h-8 text-sm"
            />
            <Button 
              size="sm" 
              onClick={handleTrade}
              disabled={loading || !isConnected}
              className="whitespace-nowrap"
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : '💎 Trade'}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{lab.validators} validators</span>
        </div>
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          <span>{lab.datasets} datasets</span>
        </div>
      </div>
      
      {parseFloat(userH1Balance) > 0 && (
        <div className="mb-4 p-2 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">You own:</span>
            <span className="text-sm font-bold text-primary">
              {parseFloat(userH1Balance).toFixed(4)} {lab.symbol} H1
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Link to={`/lab/${lab.id}`} className="flex-1">
          <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">
            {variant === "owned" ? "Manage Lab" : "View Details"}
          </Button>
        </Link>
        {variant === "market" && (
          <Link to={`/lab/${lab.id}/chat`}>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};
