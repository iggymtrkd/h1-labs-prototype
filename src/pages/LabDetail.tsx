import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Database,
  DollarSign,
  Clock,
  ArrowLeft,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { toast } from "sonner";

// Mock price data
const priceData = [
  { time: "00:00", price: 0.035 },
  { time: "04:00", price: 0.037 },
  { time: "08:00", price: 0.036 },
  { time: "12:00", price: 0.039 },
  { time: "16:00", price: 0.042 },
  { time: "20:00", price: 0.041 },
  { time: "24:00", price: 0.042 },
];

const volumeData = [
  { time: "Mon", volume: 850 },
  { time: "Tue", volume: 920 },
  { time: "Wed", volume: 1100 },
  { time: "Thu", volume: 1050 },
  { time: "Fri", volume: 1200 },
  { time: "Sat", volume: 980 },
  { time: "Sun", volume: 1150 },
];

// Mock lab data - in real app would fetch from blockchain
const labData = {
  "1": {
    name: "CardioLab",
    symbol: "CARDIO",
    category: "Healthcare",
    description: "Cardiovascular disease diagnosis and treatment datasets validated by cardiologists",
    longDescription: "CardioLab specializes in creating high-quality cardiovascular disease datasets through collaboration with certified cardiologists worldwide. Our validators ensure each dataset meets clinical standards and regulatory compliance for AI training in medical diagnostics.",
    price: "0.042",
    change24h: 12.5,
    volume24h: "1.2M",
    marketCap: "45M",
    validators: 234,
    datasets: 1543,
    totalSupply: "1,000,000",
    circulatingSupply: "650,000",
    holders: 892,
  },
};

export default function LabDetail() {
  const { id } = useParams();
  const lab = labData[id as keyof typeof labData];
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  if (!lab) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Lab Not Found</h1>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = lab.change24h >= 0;

  const handleBuy = () => {
    setShowConfetti(true);
    toast.success(`Successfully purchased ${lab.symbol} tokens!`);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleJoinChat = () => {
    toast.info("Chat feature coming soon!", {
      description: "Connect with validators and contributors",
    });
  };

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-12 overflow-x-hidden">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      
      <div className="container mx-auto px-4 max-w-7xl overflow-x-hidden">
        {/* Back Button */}
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-8 bg-gradient-card border-border">
            <div className="flex items-start gap-6 mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-secondary flex items-center justify-center text-3xl font-bold">
                {lab.symbol[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{lab.name}</h1>
                  <Badge className="bg-primary/20 text-primary">{lab.category}</Badge>
                </div>
                <p className="text-xl text-muted-foreground mb-4">{lab.symbol}</p>
                <p className="text-muted-foreground">{lab.longDescription}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p className="text-2xl font-bold text-primary">${lab.price}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">24h Change</p>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-primary" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={`text-lg font-bold ${isPositive ? "text-primary" : "text-destructive"}`}>
                    {isPositive ? "+" : ""}{lab.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                <p className="text-2xl font-bold">${lab.marketCap}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
                <p className="text-2xl font-bold">${lab.volume24h}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-gradient-card border-border">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button onClick={handleBuy} className="w-full h-12 bg-gradient-primary text-lg">
                <DollarSign className="mr-2 h-5 w-5" />
                Buy {lab.symbol}
              </Button>
              <Button onClick={handleJoinChat} variant="outline" className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Lab Chat
              </Button>
              <Link to="/staking" className="block">
                <Button variant="secondary" className="w-full h-12">
                  Stake & Validate
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Supply</span>
                <span className="font-semibold">{lab.totalSupply}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Circulating</span>
                <span className="font-semibold">{lab.circulatingSupply}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Holders</span>
                <span className="font-semibold">{lab.holders}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts and Stats */}
        <Tabs defaultValue="price" className="mb-8">
          <TabsList>
            <TabsTrigger value="price">
              <TrendingUp className="mr-2 h-4 w-4" />
              Price Chart
            </TabsTrigger>
            <TabsTrigger value="volume">
              <BarChart3 className="mr-2 h-4 w-4" />
              Volume
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Clock className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="price">
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-xl font-bold mb-4">Price History (24h)</h3>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(80 95% 49%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(80 95% 49%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 18%)" />
                  <XAxis dataKey="time" stroke="hsl(240 5% 64.9%)" />
                  <YAxis stroke="hsl(240 5% 64.9%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(240 10% 8%)",
                      border: "1px solid hsl(240 10% 18%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(80 95% 49%)"
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="volume">
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-xl font-bold mb-4">Trading Volume (7 days)</h3>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 18%)" />
                  <XAxis dataKey="time" stroke="hsl(240 5% 64.9%)" />
                  <YAxis stroke="hsl(240 5% 64.9%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(240 10% 8%)",
                      border: "1px solid hsl(240 10% 18%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(263 97% 58%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(263 97% 58%)", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="p-6 bg-gradient-card border-border">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: "Dataset validated", user: "0x742...bEb", time: "2 minutes ago", color: "primary" },
                  { action: "New validator joined", user: "0x8A3...9C2", time: "15 minutes ago", color: "secondary" },
                  { action: "Token purchase", user: "0x1F4...3D7", time: "1 hour ago", color: "primary" },
                  { action: "Dataset submitted", user: "0x9E2...5A1", time: "3 hours ago", color: "secondary" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-${activity.color}`} />
                      <div>
                        <p className="font-semibold">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Validators</p>
                <p className="text-2xl font-bold">{lab.validators}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Expert validators ensuring data quality and compliance
            </p>
          </Card>

          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-secondary/20 rounded-lg">
                <Database className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Datasets</p>
                <p className="text-2xl font-bold">{lab.datasets}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Validated, compliant datasets ready for AI training
            </p>
          </Card>

          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Validation Time</p>
                <p className="text-2xl font-bold">2.3h</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Fast turnaround with maintained quality standards
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
