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
import {
  ArrowLeft,
  Key,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useXMTPContext } from "@/contexts/XMTPContext";
import { useLabChat } from "@/hooks/useLabChat";
import { useBaseAccount } from "@/hooks/useBaseAccount";
import { toast } from "sonner";
import { useENS, formatAddress as formatAddr } from "@/hooks/useENS";

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
  const { client, isInitializing, isReady, error: xmtpError } = useXMTPContext();
  const { address } = useBaseAccount();
  const [messageInput, setMessageInput] = useState("");
  const [isHoldersOnly, setIsHoldersOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const labInfo = labInfoData[id || ""];

  const {
    messages,
    isLoading,
    isSending,
    canSendMessages,
    userRole,
    tokenBalance,
    sendMessage,
    error: chatError,
  } = useLabChat(
    client,
    id || "",
    address || null,
    labInfo?.vaultAddress || null,
    isHoldersOnly
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSending) return;

    if (isHoldersOnly && !canSendMessages) {
      toast.error("You need to hold lab tokens to send messages in holders chat");
      return;
    }

    try {
      await sendMessage(messageInput);
      setMessageInput("");
      toast.success("Message sent!");
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

  if (!labInfo) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Lab Chat Not Found</h1>
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
            {isReady && (
              <Badge variant="outline" className="text-xs">
                {userRole === "holder" ? "✓ Token Holder" : "Guest"}
              </Badge>
            )}
            <Button
              variant={isHoldersOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setIsHoldersOnly(!isHoldersOnly)}
              className="gap-2"
            >
              <Key className="h-4 w-4" />
              {isHoldersOnly ? "Holders Chat" : "Open Chat"}
            </Button>
          </div>
        </div>

        {isInitializing && (
          <Alert className="m-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Setting up secure messaging with XMTP... Please approve the signature request in your wallet to create your messaging identity.
            </AlertDescription>
          </Alert>
        )}

        {xmtpError && (
          <Alert variant="destructive" className="m-4">
            <AlertDescription>
              <div className="font-semibold mb-1">Lab Chat Unavailable</div>
              <div className="text-sm mb-2">{xmtpError}</div>
              {xmtpError.includes('coming soon') && (
                <div className="text-xs mt-2 p-2 bg-background/50 rounded">
                  <strong>Why?</strong> XMTP's decentralized chat protocol is still adding full support for smart contract wallets like Base Smart Wallet.
                  In the meantime, you can use a standard wallet (MetaMask, Rainbow, Rabby) to access lab chats.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {chatError && (
          <Alert variant="destructive" className="m-4">
            <AlertDescription>{chatError}</AlertDescription>
          </Alert>
        )}

        {isHoldersOnly && !canSendMessages && isReady && (
          <Alert className="m-4">
            <AlertDescription>
              You need to hold {labInfo.symbol} tokens to access holders chat. Token Balance: {tokenBalance}
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className={`flex-1 p-4 ${isHoldersOnly ? "bg-primary/5" : ""}`}>
          {isHoldersOnly && (
            <div className="max-w-4xl mb-4 px-4 py-3 bg-primary/20 border border-primary/30 rounded-lg flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                🔒 Holders-Only Chat - Only token holders can participate
              </span>
            </div>
          )}

          <div className="space-y-4 max-w-4xl">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.isOwn ? "justify-end" : ""}`}>
                  {!msg.isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {msg.senderAddress.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${msg.isOwn ? "items-end max-w-[75%]" : "items-start max-w-[75%]"}`}>
                    {!msg.isOwn && (
                      <div className="flex items-baseline gap-2 mb-1 px-1">
                        <UserDisplay address={msg.senderAddress} />
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    <div
                      className={`${
                        msg.isOwn
                          ? "bg-primary text-primary-foreground px-4 py-2.5 rounded-[18px] rounded-tr-sm shadow-sm"
                          : "bg-muted px-4 py-2.5 rounded-[18px] rounded-tl-sm shadow-sm"
                      }`}
                    >
                      <p className="text-[15px] leading-[1.4] whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.isOwn && (
                      <div className="text-[10px] text-muted-foreground text-right mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                  {msg.isOwn && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {msg.senderAddress.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className={`p-4 border-t border-border ${isHoldersOnly ? "bg-primary/5" : ""}`}>
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2 ${isHoldersOnly ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                !isReady
                  ? "Initializing chat..."
                  : isHoldersOnly && !canSendMessages
                  ? "Hold tokens to send messages in holders chat"
                  : "Type your message"
              }
              disabled={!isReady || (isHoldersOnly && !canSendMessages) || isSending}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleSendMessage}
              disabled={!isReady || (isHoldersOnly && !canSendMessages) || isSending || !messageInput.trim()}
            >
              {isSending ? (
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
              {isReady && (
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

            <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
              <p className="font-semibold text-foreground mb-2">Chat Info</p>
              <p>🔐 End-to-end encrypted via XMTP</p>
              <p>📊 Balance: {parseFloat(tokenBalance).toFixed(2)} tokens</p>
              <p>👤 Role: {userRole}</p>
              <p>💬 Mode: {isHoldersOnly ? "Holders Only" : "Open Chat"}</p>
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
