import { Link } from "react-router-dom";
import { Users, Database, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useBaseAccount } from "@/hooks/useBaseAccount";
import { ethers } from "ethers";
import { CONTRACTS } from "@/config/contracts";
import { LABSToken_ABI, BondingCurveSale_ABI, LabDistributionFacet_ABI, LabVault_ABI } from "@/contracts/abis";
import { toast } from "sonner";
import { Lab } from "./LabCard";

interface LabTableProps {
  labs: Lab[];
  variant?: "market" | "owned";
}

export const LabTable = ({ labs, variant = "market" }: LabTableProps) => {
  const { address, isConnected, sdk } = useBaseAccount();
  const [expandedLab, setExpandedLab] = useState<string | null>(null);
  const [tradeAction, setTradeAction] = useState<Record<string, 'buy' | 'sell'>>({});
  const [tradeAmount, setTradeAmount] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [userH1Balances, setUserH1Balances] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAllBalances = async () => {
      if (!address || !isConnected || !sdk) return;
      
      const balances: Record<string, string> = {};
      
      for (const lab of labs) {
        const hasBondingCurve = lab.bondingCurveAddress && lab.bondingCurveAddress !== ethers.ZeroAddress;
        if (!hasBondingCurve || !lab.bondingCurveAddress) continue;
        
        try {
          const walletProvider = sdk.getProvider();
          const provider = new ethers.BrowserProvider(walletProvider as any);
          const curve = new ethers.Contract(lab.bondingCurveAddress, BondingCurveSale_ABI, provider);
          const vaultAddress = await curve.vault();
          const vault = new ethers.Contract(vaultAddress, LabVault_ABI, provider);
          const balance = await vault.balanceOf(address);
          balances[lab.id] = ethers.formatEther(balance);
        } catch (error) {
          console.error(`Error fetching balance for lab ${lab.id}:`, error);
        }
      }
      
      setUserH1Balances(balances);
    };
    
    fetchAllBalances();
  }, [address, isConnected, sdk, labs]);

  const handleTrade = async (lab: Lab) => {
    if (!isConnected || !sdk || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    const hasBondingCurve = lab.bondingCurveAddress && lab.bondingCurveAddress !== ethers.ZeroAddress;
    if (!hasBondingCurve) {
      toast.error('Bonding curve not deployed for this lab yet');
      return;
    }

    const amount = tradeAmount[lab.id];
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setLoading(prev => ({ ...prev, [lab.id]: true }));

    try {
      const walletProvider = sdk.getProvider();
      const amountWei = ethers.parseEther(amount);
      const chainIdHex = '0x' + CONTRACTS.CHAIN_ID.toString(16);

      const action = tradeAction[lab.id] || 'buy';

      if (action === 'buy') {
        toast.info('Preparing to buy H1 tokens...');
        
        const labsTokenInterface = new ethers.Interface(LABSToken_ABI);
        const approvalData = labsTokenInterface.encodeFunctionData('approve', [lab.bondingCurveAddress, amountWei]);
        
        const curveInterface = new ethers.Interface(BondingCurveSale_ABI);
        const buyData = curveInterface.encodeFunctionData('buy', [amountWei, address, 0]);

        const bundleId = await walletProvider.request({
          method: 'wallet_sendCalls',
          params: [{
            version: '1.0',
            from: address,
            chainId: chainIdHex,
            calls: [
              { to: CONTRACTS.LABSToken, data: approvalData, value: '0x0' },
              { to: lab.bondingCurveAddress, data: buyData, value: '0x0' }
            ]
          }]
        }) as string;

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
        
        // Refresh balance
        const provider = new ethers.BrowserProvider(walletProvider as any);
        const curve = new ethers.Contract(lab.bondingCurveAddress, BondingCurveSale_ABI, provider);
        const vaultAddress = await curve.vault();
        const vault = new ethers.Contract(vaultAddress, LabVault_ABI, provider);
        const balance = await vault.balanceOf(address);
        setUserH1Balances(prev => ({ ...prev, [lab.id]: ethers.formatEther(balance) }));

      } else {
        toast.info('Preparing to sell H1 tokens...');
        
        const provider = new ethers.BrowserProvider(walletProvider as any);
        const curve = new ethers.Contract(lab.bondingCurveAddress!, BondingCurveSale_ABI, provider);
        const vaultAddress = await curve.vault();
        const vault = new ethers.Contract(vaultAddress, LabVault_ABI, provider);
        const h1Balance = await vault.balanceOf(address);
        
        if (h1Balance < amountWei) {
          const shortfall = ethers.formatEther(amountWei - h1Balance);
          toast.error(`Insufficient H1 balance. Need ${shortfall} more ${lab.symbol}`);
          throw new Error(`Insufficient H1 balance`);
        }
        
        const vaultInterface = new ethers.Interface(['function approve(address,uint256) returns (bool)']);
        const approvalData = vaultInterface.encodeFunctionData('approve', [lab.bondingCurveAddress!, amountWei]);
        
        const curveInterface = new ethers.Interface(BondingCurveSale_ABI);
        const sellData = curveInterface.encodeFunctionData('sell', [amountWei, address, 0]);

        const bundleId = await walletProvider.request({
          method: 'wallet_sendCalls',
          params: [{
            version: '1.0',
            from: address,
            chainId: chainIdHex,
            calls: [
              { to: vaultAddress, data: approvalData, value: '0x0' },
              { to: lab.bondingCurveAddress, data: sellData, value: '0x0' }
            ]
          }]
        }) as string;

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
        
        const balance = await vault.balanceOf(address);
        setUserH1Balances(prev => ({ ...prev, [lab.id]: ethers.formatEther(balance) }));
      }
    } catch (error: any) {
      console.error('Trade error:', error);
      toast.error(error?.message || 'Failed to trade H1 tokens');
    } finally {
      setLoading(prev => ({ ...prev, [lab.id]: false }));
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">#</TableHead>
            <TableHead>Lab</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">H1 Price</TableHead>
            <TableHead className="text-right">TVL</TableHead>
            <TableHead className="text-center">Validators</TableHead>
            <TableHead className="text-center">Datasets</TableHead>
            <TableHead className="text-right">Your H1</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labs.map((lab, index) => {
            const hasBondingCurve = lab.bondingCurveAddress && lab.bondingCurveAddress !== ethers.ZeroAddress;
            const isOwner = address && lab.owner && address.toLowerCase() === lab.owner.toLowerCase();
            const isExpanded = expandedLab === lab.id;
            const userBalance = userH1Balances[lab.id] || '0';

            return (
              <>
                <TableRow key={lab.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {lab.logo ? (
                        <img src={lab.logo} alt={lab.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-secondary flex items-center justify-center">
                          <span className="text-sm font-bold">{lab.symbol[0]}</span>
                        </div>
                      )}
                      <div>
                        <div className="font-bold">{lab.name}</div>
                        <div className="text-sm text-muted-foreground">{lab.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lab.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {hasBondingCurve && lab.h1Price && lab.h1Price !== '0' 
                      ? `${parseFloat(lab.h1Price).toFixed(4)} LABS`
                      : 'Not Set'}
                  </TableCell>
                  <TableCell className="text-right font-bold text-secondary">
                    {hasBondingCurve && lab.tvl 
                      ? `${parseFloat(lab.tvl).toFixed(2)} LABS`
                      : '0 LABS'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{lab.validators}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Database className="h-3 w-3" />
                      <span>{lab.datasets}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {parseFloat(userBalance) > 0 ? (
                      <span className="font-bold text-primary">
                        {parseFloat(userBalance).toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setExpandedLab(isExpanded ? null : lab.id)}
                      >
                        Trade
                      </Button>
                      <Link to={`/lab/${lab.id}`}>
                        <Button size="sm" variant="default">
                          View
                        </Button>
                      </Link>
                      {variant === "market" && (
                        <Link to={`/lab/${lab.id}/chat`}>
                          <Button size="sm" variant="ghost">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={9} className="bg-muted/30">
                      <div className="py-4 px-6">
                        <p className="text-sm text-muted-foreground mb-4">{lab.description}</p>
                        {hasBondingCurve ? (
                          <div className="flex items-center gap-4 max-w-2xl">
                            <Select 
                              value={tradeAction[lab.id] || 'buy'} 
                              onValueChange={(v) => setTradeAction(prev => ({ ...prev, [lab.id]: v as 'buy' | 'sell' }))}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="buy">🟢 Buy H1</SelectItem>
                                <SelectItem value="sell">🔴 Sell H1</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              placeholder={tradeAction[lab.id] === 'sell' ? 'Amount in H1' : 'Amount in LABS'}
                              value={tradeAmount[lab.id] || ''}
                              onChange={(e) => setTradeAmount(prev => ({ ...prev, [lab.id]: e.target.value }))}
                              className="max-w-xs"
                            />
                            <Button 
                              onClick={() => handleTrade(lab)}
                              disabled={loading[lab.id] || !isConnected}
                            >
                              {loading[lab.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : '💎 Execute Trade'}
                            </Button>
                          </div>
                        ) : isOwner ? (
                          <Button 
                            onClick={async () => {
                              // Deploy bonding curve logic here
                              toast.info('Deploy bonding curve from lab details page');
                            }}
                            disabled={!isConnected}
                            className="bg-secondary"
                          >
                            🚀 Deploy Bonding Curve (Step 2)
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground">Bonding curve not yet deployed</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
