import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Key,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useBaseAccount } from "@/hooks/useBaseAccount";
import { useLabChat } from "@/hooks/useLabChat";
import { toast } from "sonner";
import { useENS, formatAddress as formatAddr } from "@/hooks/useENS";
import { ethers } from "ethers";
import { CONTRACTS } from "@/config/contracts";
import { LABSToken_ABI, BondingCurveSale_ABI, LabVault_ABI } from "@/contracts/abis";

// Mock data for lab display info only
const labInfoData: Record<string, {
  name: string;
  symbol: string;
  price: string;
  color: string;
  vaultAddress: string;
  apps: Array<{ name: string; icon: string }>;
  channels: string[];
  priceData: Array<{ value: number }>;
}> = {
  "1": {
    name: "CardioLab",
    symbol: "CARDIO",
    price: "300,000",
    color: "hsl(263 97% 58%)",
    vaultAddress: "0x0000000000000000000000000000000000000001", // Replace with actual vault
    apps: [
      { name: "HeartMonitor", icon: "H" },
      { name: "ECG Analyzer", icon: "E" },
      { name: "CardioScan", icon: "C" },
    ],
    channels: ["General", "Announcements", "Support"],
    priceData: [
      { value: 0.025 },
      { value: 0.089 },
      { value: 0.031 },
      { value: 0.105 },
    ],
  },
  "2": {
    name: "ArtProof",
    symbol: "ART",
    price: "175,000",
    color: "hsl(280 75% 58%)",
    vaultAddress: "0x0000000000000000000000000000000000000002",
    apps: [
      { name: "Verify AI", icon: "V" },
      { name: "ArtScan Pro", icon: "A" },
    ],
    channels: ["General", "Authenticity", "Market"],
    priceData: [
      { value: 0.018 },
      { value: 0.072 },
      { value: 0.024 },
    ],
  },
};

export default function LabChat() {
  const { id } = useParams();
  const { address, isConnected, sdk } = useBaseAccount();
  const [messageInput, setMessageInput] = useState("");
  const [channelType, setChannelType] = useState<'open' | 'holders'>('open');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('100');
  const [trading, setTrading] = useState(false);
  const [bondingCurveAddress, setBondingCurveAddress] = useState<string | null>(null);
  const [userH1Balance, setUserH1Balance] = useState<string>('0');

  // Use mock data if available, otherwise create a default lab info
  const labInfo = labInfoData[id || ""] || {
    name: `Lab #${id}`,
    symbol: `LAB${id}`,
    price: "0",
    color: "hsl(263 97% 58%)",
    vaultAddress: "0x0000000000000000000000000000000000000000",
    apps: [],
    channels: ["General"],
    priceData: [{ value: 0.01 }],
  };

  const {
    messages,
    isLoadingMessages,
    isSendingMessage,
    userRole,
    tokenBalance,
    sendMessage,
    error: chatError,
  } = useLabChat(
    id || "",
    channelType,
    address || null,
    labInfo.vaultAddress
  );

  const canSendMessages = channelType === 'open' || userRole === 'holder';

  // Fetch bonding curve address for this lab
  useEffect(() => {
    const fetchBondingCurve = async () => {
      if (!id) return;
      
      try {
        console.log(`[LabChat] Fetching bonding curve for lab ${id}...`);
        const rpc = new ethers.JsonRpcProvider(CONTRACTS.RPC_URL);
        const diamond = new ethers.Contract(
          CONTRACTS.H1Diamond,
          ['function getLabBondingCurve(uint256) view returns (address)'],
          rpc
        );
        
        const curveAddr = await diamond.getLabBondingCurve(parseInt(id));
        console.log(`[LabChat] Bonding curve address for lab ${id}:`, curveAddr);
        console.log(`[LabChat] Is zero address?`, curveAddr === ethers.ZeroAddress);
        setBondingCurveAddress(curveAddr);
      } catch (err) {
        console.error('[LabChat] Error fetching bonding curve:', err);
      }
    };

    fetchBondingCurve();
  }, [id]);

  const hasBondingCurve = bondingCurveAddress && bondingCurveAddress !== ethers.ZeroAddress;

  // Fetch user's H1 balance for this lab
  useEffect(() => {
    const fetchH1Balance = async () => {
      if (!address || !isConnected || !sdk) return;
      
      try {
        const walletProvider = sdk.getProvider();
        const provider = new ethers.BrowserProvider(walletProvider as any);
        
        // Get vault address from bonding curve
        if (hasBondingCurve && bondingCurveAddress) {
          const curve = new ethers.Contract(bondingCurveAddress, BondingCurveSale_ABI, provider);
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
  }, [address, isConnected, sdk, hasBondingCurve, bondingCurveAddress]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTrade = async () => {
    if (!isConnected || !sdk || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!bondingCurveAddress || bondingCurveAddress === ethers.ZeroAddress) {
      toast.error('Bonding curve not deployed for this lab yet');
      return;
    }

    if (!tradeAmount || isNaN(Number(tradeAmount)) || Number(tradeAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setTrading(true);

    try {
      const walletProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(walletProvider as any);
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
        const approvalData = labsTokenInterface.encodeFunctionData('approve', [bondingCurveAddress, amountWei]);
        
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
                to: bondingCurveAddress,
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
        toast.success(`Successfully bought ${labInfo.symbol} H1 tokens!`);
        
        // Refresh H1 balance
        if (hasBondingCurve && bondingCurveAddress) {
          const provider = new ethers.BrowserProvider(walletProvider as any);
          const curve = new ethers.Contract(bondingCurveAddress, BondingCurveSale_ABI, provider);
          const vaultAddress = await curve.vault();
          const vault = new ethers.Contract(vaultAddress, LabVault_ABI, provider);
          const balance = await vault.balanceOf(address);
          setUserH1Balance(ethers.formatEther(balance));
        }
        
        // Reset
        setTradeAmount('100');
        
      } else {
        // Sell: approve + sell in single transaction (mirrors buy flow)
        toast.info('Preparing to sell H1 tokens (1 confirmation)...');
        
        // Get vault address (needed for batch transaction)
        const provider = new ethers.BrowserProvider(walletProvider as any);
        const curve = new ethers.Contract(bondingCurveAddress!, BondingCurveSale_ABI, provider);
        const vaultAddress = await curve.vault();
        
        // Encode approval call for vault shares (H1 tokens)
        const vaultInterface = new ethers.Interface(LabVault_ABI);
        const approvalData = vaultInterface.encodeFunctionData('approve', [bondingCurveAddress, amountWei]);
        
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
                to: bondingCurveAddress,
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
        toast.success(`Successfully sold ${labInfo.symbol} H1 tokens!`);
        
        // Refresh H1 balance
        if (hasBondingCurve && bondingCurveAddress) {
          const provider = new ethers.BrowserProvider(walletProvider as any);
          const curve = new ethers.Contract(bondingCurveAddress, BondingCurveSale_ABI, provider);
          const vaultAddress = await curve.vault();
          const vault = new ethers.Contract(vaultAddress, LabVault_ABI, provider);
          const balance = await vault.balanceOf(address);
          setUserH1Balance(ethers.formatEther(balance));
        }
        
        // Reset
        setTradeAmount('100');
      }
    } catch (error: any) {
      console.error('Trade error:', error);
      toast.error(error?.message || 'Failed to trade H1 tokens');
    } finally {
      setTrading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSendingMessage) return;

    if (channelType === 'holders' && !canSendMessages) {
      toast.error("You need to hold lab tokens to send messages in holders chat");
      return;
    }

    try {
      await sendMessage(messageInput);
      setMessageInput("");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Component for displaying user with ENS
  const UserDisplay = ({ address: userAddr }: { address: string }) => {
    const { ensName } = useENS(userAddr);
    return (
      <span className="font-semibold text-xs text-primary">
        {formatAddr(userAddr, ensName)}
      </span>
    );
  };

  if (!id) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Invalid Lab ID</h1>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Tabs defaultValue={labInfo.channels[0]} className="w-full">
              <TabsList className="bg-transparent">
                {labInfo.channels.map((channel) => (
                  <TabsTrigger
                    key={channel}
                    value={channel}
                    className="data-[state=active]:bg-transparent data-[state=active]:text-primary"
                  >
                    {channel}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            {address && (
              <Badge variant="outline" className="text-xs">
                {userRole === "holder" ? "✓ Token Holder" : "Guest"}
              </Badge>
            )}
            <Button
              variant={channelType === 'holders' ? "default" : "outline"}
              size="sm"
              onClick={() => setChannelType(channelType === 'holders' ? 'open' : 'holders')}
              className="gap-2"
            >
              <Key className="h-4 w-4" />
              {channelType === 'holders' ? "Holders Chat" : "Open Chat"}
            </Button>
          </div>
        </div>

        {!address && (
          <Alert className="m-4">
            <AlertDescription>
              Connect your Base wallet to access lab chat
            </AlertDescription>
          </Alert>
        )}

        {chatError && (
          <Alert variant="destructive" className="m-4">
            <AlertDescription>{chatError}</AlertDescription>
          </Alert>
        )}

        {channelType === 'holders' && !canSendMessages && address && (
          <Alert className="m-4">
            <AlertDescription>
              You need to hold {labInfo.symbol} tokens to access holders chat. Token Balance: {tokenBalance}
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className={`flex-1 p-4 ${channelType === 'holders' ? "bg-primary/5" : ""}`} ref={scrollRef}>
          {channelType === 'holders' && (
            <div className="max-w-4xl mb-4 px-4 py-3 bg-primary/20 border border-primary/30 rounded-lg flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                🔒 Holders-Only Chat - Only token holders can participate
              </span>
            </div>
          )}

          <div className="space-y-4 max-w-4xl">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_address.toLowerCase() === address?.toLowerCase()
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender_address.toLowerCase() === address?.toLowerCase()
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs opacity-70">
                        {msg.sender_address.slice(0, 6)}...{msg.sender_address.slice(-4)}
                      </span>
                      <span className="text-xs opacity-50">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className={`p-4 border-t border-border ${channelType === 'holders' ? "bg-primary/5" : ""}`}>
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2 ${channelType === 'holders' ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !address
                  ? "Connect wallet to chat..."
                  : channelType === 'holders' && !canSendMessages
                  ? "Hold tokens to send messages in holders chat"
                  : "Type your message"
              }
              disabled={!address || (channelType === 'holders' && !canSendMessages) || isSendingMessage}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleSendMessage}
              disabled={!address || (channelType === 'holders' && !canSendMessages) || isSendingMessage || !messageInput.trim()}
            >
              {isSendingMessage ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-80 border-l border-border bg-card/50 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div className="text-center space-y-3">
              <div
                className="mx-auto w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-bold"
                style={{ background: labInfo.color }}
              >
                {labInfo.symbol[0]}
              </div>
              <h2 className="text-2xl font-bold">{labInfo.name}</h2>
              <div className="text-3xl font-bold text-primary">
                {labInfo.price} ${labInfo.symbol}
              </div>
              {address && (
                <Badge variant="outline" className="text-xs">
                  Balance: {parseFloat(tokenBalance).toFixed(2)} tokens
                </Badge>
              )}
            </div>

            <Card className="p-4 bg-muted/20 border-border">
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={labInfo.priceData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={labInfo.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Link to={`/lab/${id}`}>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Lab Details
              </Button>
            </Link>

            <div className="mb-4 p-3 bg-muted/30 rounded-lg space-y-2">
              {hasBondingCurve ? (
                <>
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
                      disabled={trading || !isConnected}
                      className="whitespace-nowrap"
                    >
                      {trading ? <Loader2 className="h-3 w-3 animate-spin" /> : '💎 Trade'}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Bonding curve not deployed yet
                  </p>
                </div>
              )}
            </div>

            {parseFloat(userH1Balance) > 0 && (
              <div className="mb-4 p-2 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">You own:</span>
                  <span className="text-sm font-bold text-primary">
                    {parseFloat(userH1Balance).toFixed(4)} {labInfo.symbol} H1
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
              <p className="font-semibold text-foreground mb-2">Chat Info</p>
              <p>💬 Server-side messaging</p>
              <p>📊 Balance: {parseFloat(tokenBalance).toFixed(2)} tokens</p>
              <p>👤 Role: {userRole}</p>
              <p>💬 Mode: {channelType === 'holders' ? "Holders Only" : "Open Chat"}</p>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-card p-6">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Training Apps
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {labInfo.apps.map((app, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-xl font-bold mb-2 mx-auto">
                  {app.icon}
                </div>
                <p className="text-xs font-medium">{app.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
