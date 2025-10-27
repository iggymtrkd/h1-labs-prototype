import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Users, Database, MessageCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useBaseAccount } from "@/hooks/useBaseAccount";
import { ethers } from "ethers";
import { CONTRACTS } from "@/config/contracts";
import { LABSToken_ABI, BondingCurveSale_ABI, LabDistributionFacet_ABI } from "@/contracts/abis";
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

  const hasBondingCurve = lab.bondingCurveAddress && lab.bondingCurveAddress !== ethers.ZeroAddress;
  const isOwner = address && lab.owner && address.toLowerCase() === lab.owner.toLowerCase();

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
      const provider = new ethers.BrowserProvider(walletProvider as any);
      const signer = await provider.getSigner(address);
      const amountWei = ethers.parseEther(tradeAmount);

      if (tradeAction === 'buy') {
        // Approve LABS tokens
        const labsToken = new ethers.Contract(CONTRACTS.LABSToken, LABSToken_ABI, signer);
        const approveTx = await labsToken.approve(lab.bondingCurveAddress, amountWei);
        await approveTx.wait();

        // Buy H1 tokens
        const curve = new ethers.Contract(lab.bondingCurveAddress!, BondingCurveSale_ABI, signer);
        const minSharesOut = 0;
        const buyTx = await curve.buy(amountWei, address, minSharesOut);
        await buyTx.wait();

        toast.success(`Successfully bought ${lab.symbol} H1 tokens!`);
      } else {
        toast.info('Sell functionality coming soon');
      }
    } catch (error: any) {
      console.error('Trade error:', error);
      toast.error('Failed to trade H1 tokens');
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
              placeholder="Amount in LABS"
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
