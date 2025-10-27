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
  Loader2,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { toast } from "sonner";
import { ethers } from "ethers";
import { CONTRACTS } from "@/config/contracts";
import { LABSCoreFacet_ABI } from "@/contracts/abis";
import { useLabEvents } from "@/hooks/useLabEvents";

// Mock price data with extreme volatility
const priceData = [
  { time: "00:00", price: 0.025 },
  { time: "04:00", price: 0.089 },
  { time: "08:00", price: 0.031 },
  { time: "12:00", price: 0.105 },
  { time: "16:00", price: 0.042 },
  { time: "20:00", price: 0.132 },
  { time: "24:00", price: 0.058 },
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
  "2": {
    name: "ArtProof",
    symbol: "ART",
    category: "Art",
    description: "Art authentication and provenance verification datasets",
    longDescription: "ArtProof builds comprehensive datasets for art authentication and provenance verification through collaboration with art historians, conservators, and gallery experts. Our platform enables AI models to detect forgeries and trace artwork history with unprecedented accuracy.",
    price: "0.028",
    change24h: -3.2,
    volume24h: "840K",
    marketCap: "28M",
    validators: 156,
    datasets: 892,
    totalSupply: "750,000",
    circulatingSupply: "520,000",
    holders: 634,
  },
  "3": {
    name: "RoboTrace",
    symbol: "ROBO",
    category: "Robotics",
    description: "Computer vision and robotics training datasets for autonomous systems",
    longDescription: "RoboTrace provides cutting-edge computer vision and sensor fusion datasets for autonomous systems. Our validator network includes robotics engineers and AI researchers who ensure datasets meet the highest standards for safety-critical applications.",
    price: "0.056",
    change24h: 8.7,
    volume24h: "2.1M",
    marketCap: "67M",
    validators: 312,
    datasets: 2156,
    totalSupply: "1,200,000",
    circulatingSupply: "890,000",
    holders: 1245,
  },
  "4": {
    name: "MedicalMind",
    symbol: "MEDM",
    category: "Healthcare",
    description: "Clinical reasoning and diagnostic datasets enriched through RLHF",
    longDescription: "MedicalMind leverages reinforcement learning from human feedback to create clinical reasoning datasets. Our network of medical professionals provides high-quality feedback that helps train AI systems for accurate diagnosis and treatment recommendations.",
    price: "0.073",
    change24h: 15.3,
    volume24h: "3.4M",
    marketCap: "92M",
    validators: 445,
    datasets: 3241,
    totalSupply: "1,500,000",
    circulatingSupply: "1,100,000",
    holders: 1876,
  },
  "5": {
    name: "LegalLogic",
    symbol: "LEGAL",
    category: "Legal",
    description: "Legal document analysis and case law datasets for AI-powered legal research",
    longDescription: "LegalLogic curates comprehensive legal datasets spanning multiple jurisdictions and practice areas. Our validators include practicing attorneys and legal scholars who ensure accuracy and relevance for AI-powered legal research applications.",
    price: "0.034",
    change24h: 5.1,
    volume24h: "670K",
    marketCap: "31M",
    validators: 189,
    datasets: 1234,
    totalSupply: "900,000",
    circulatingSupply: "680,000",
    holders: 723,
  },
  "6": {
    name: "GenomeData",
    symbol: "GENE",
    category: "Healthcare",
    description: "Genomic sequencing and personalized medicine datasets",
    longDescription: "GenomeData specializes in genomic sequencing data for personalized medicine applications. Our validator network includes geneticists and bioinformaticians who ensure data quality, privacy compliance, and ethical standards in genomic AI training.",
    price: "0.089",
    change24h: 22.4,
    volume24h: "4.2M",
    marketCap: "112M",
    validators: 567,
    datasets: 4123,
    totalSupply: "1,800,000",
    circulatingSupply: "1,250,000",
    holders: 2134,
  },
  "7": {
    name: "GameSense",
    symbol: "GAME",
    category: "Gaming",
    description: "NPC dialogue, procedural generation, and game AI training datasets",
    longDescription: "GameSense creates comprehensive game AI datasets including NPC behavior, procedural generation, and player interaction patterns. Our validators include game developers and AI researchers who ensure datasets meet industry standards for immersive gaming experiences.",
    price: "0.051",
    change24h: 18.9,
    volume24h: "1.8M",
    marketCap: "54M",
    validators: 278,
    datasets: 1876,
    totalSupply: "1,100,000",
    circulatingSupply: "820,000",
    holders: 1089,
  },
  "8": {
    name: "FinTrack",
    symbol: "FIN",
    category: "Finance",
    description: "AML/KYC compliance and financial fraud detection datasets",
    longDescription: "FinTrack provides specialized datasets for financial compliance and fraud detection. Our network of compliance officers and financial analysts validates data for accuracy and regulatory compliance with SEC, AML, and KYC requirements.",
    price: "0.067",
    change24h: 7.3,
    volume24h: "2.3M",
    marketCap: "78M",
    validators: 401,
    datasets: 2534,
    totalSupply: "1,300,000",
    circulatingSupply: "950,000",
    holders: 1567,
  },
  "9": {
    name: "StratAI",
    symbol: "STRAT",
    category: "Defense",
    description: "Defense AI datasets compliant with DoD AI Ethics Framework and ITAR",
    longDescription: "StratAI develops secure, compliant datasets for defense and national security applications. Our validators include defense analysts and ethics officers who ensure all data meets DoD AI Ethics Framework and ITAR requirements.",
    price: "0.094",
    change24h: 4.2,
    volume24h: "1.5M",
    marketCap: "98M",
    validators: 156,
    datasets: 892,
    totalSupply: "1,000,000",
    circulatingSupply: "720,000",
    holders: 678,
  },
  "10": {
    name: "EduLab",
    symbol: "EDU",
    category: "Education",
    description: "Educational content and assessment datasets with FERPA compliance",
    longDescription: "EduLab creates adaptive learning and assessment datasets with strict FERPA compliance. Our educator network validates content quality and pedagogical effectiveness for AI-powered personalized learning systems.",
    price: "0.039",
    change24h: 11.7,
    volume24h: "980K",
    marketCap: "42M",
    validators: 234,
    datasets: 1654,
    totalSupply: "950,000",
    circulatingSupply: "710,000",
    holders: 891,
  },
  "11": {
    name: "GreenLens",
    symbol: "GREEN",
    category: "Climate",
    description: "Climate modeling and environmental monitoring datasets for sustainability AI",
    longDescription: "GreenLens produces environmental and climate datasets for sustainability applications. Our validators include climate scientists and environmental researchers who ensure data accuracy for climate modeling and conservation AI.",
    price: "0.045",
    change24h: 14.8,
    volume24h: "1.1M",
    marketCap: "48M",
    validators: 198,
    datasets: 1432,
    totalSupply: "1,000,000",
    circulatingSupply: "760,000",
    holders: 945,
  },
  "12": {
    name: "GovData",
    symbol: "GOV",
    category: "Government",
    description: "Public sector AI datasets for policy analysis and citizen services with FedRAMP compliance",
    longDescription: "GovData specializes in public sector datasets for policy analysis, citizen services, and government modernization. Our validators include policy analysts and government innovation officers who ensure FedRAMP compliance and transparency standards.",
    price: "0.058",
    change24h: 9.6,
    volume24h: "1.7M",
    marketCap: "62M",
    validators: 298,
    datasets: 1876,
    totalSupply: "1,150,000",
    circulatingSupply: "850,000",
    holders: 1123,
  },
};

interface LabData {
  id: string;
  name: string;
  symbol: string;
  category: string;
  description: string;
  owner: string;
  h1Token: string;
  domain: string;
  active: boolean;
  level: number;
  bondingCurveAddress?: string;
  h1Price?: string;
  tvl?: string;
  validators: number;
  datasets: number;
}

export default function LabDetail() {
  const { id } = useParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const { labs: labEvents, loading: labEventsLoading } = useLabEvents();
  const [lab, setLab] = useState<LabData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabDetails = async () => {
      if (!id || labEvents.length === 0) return;
      
      setLoading(true);
      try {
        const labEvent = labEvents.find(l => l.labId === id);
        if (!labEvent) {
          setLoading(false);
          return;
        }

        const rpc = new ethers.JsonRpcProvider(CONTRACTS.RPC_URL);
        const diamond = new ethers.Contract(CONTRACTS.H1Diamond, LABSCoreFacet_ABI, rpc);

        const labId = parseInt(id);
        const [owner, h1Token, domain, active, level] = await diamond.getLabDetails(labId);
        
        // Get bonding curve address
        let bondingCurveAddress = ethers.ZeroAddress;
        try {
          bondingCurveAddress = await diamond.getLabBondingCurve(labId);
        } catch {}

        // Get H1 price if bonding curve exists
        let h1Price = '0';
        let tvl = '0';
        if (bondingCurveAddress && bondingCurveAddress !== ethers.ZeroAddress) {
          try {
            const curveContract = new ethers.Contract(
              bondingCurveAddress,
              ['function price() view returns (uint256)'],
              rpc
            );
            const priceWei = await curveContract.price();
            h1Price = ethers.formatEther(priceWei);
            
            // Get TVL from vault
            const vaultContract = new ethers.Contract(
              h1Token,
              ['function totalSupply() view returns (uint256)'],
              rpc
            );
            const totalSupply = await vaultContract.totalSupply();
            tvl = ethers.formatEther(totalSupply);
          } catch {}
        }

        setLab({
          id,
          name: `Lab #${id}`,
          symbol: `H1L${id}`,
          category: domain || "Uncategorized",
          description: `Lab #${id} - Level ${level} Lab on H1 Protocol`,
          owner,
          h1Token,
          domain,
          active,
          level: Number(level),
          bondingCurveAddress,
          h1Price,
          tvl,
          validators: 0,
          datasets: 0,
        });
      } catch (err) {
        console.error('Error fetching lab details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLabDetails();
  }, [id, labEvents]);

  const handleBuy = () => {
    setShowConfetti(true);
    toast.success(`Successfully purchased ${lab?.symbol} tokens!`);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  if (loading || labEventsLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading lab details...</p>
        </div>
      </div>
    );
  }

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

  const hasBondingCurve = lab.bondingCurveAddress && lab.bondingCurveAddress !== ethers.ZeroAddress;
  const isPositive = parseFloat(lab.h1Price || '0') > 0;


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
                  <Badge variant="outline">Level {lab.level}</Badge>
                </div>
                <p className="text-xl text-muted-foreground mb-4">{lab.symbol}</p>
                <p className="text-muted-foreground">{lab.description}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Owner: {lab.owner.slice(0, 6)}...{lab.owner.slice(-4)}
                  </p>
                  {hasBondingCurve && (
                    <p className="text-xs text-muted-foreground">
                      Bonding Curve: {lab.bondingCurveAddress!.slice(0, 6)}...{lab.bondingCurveAddress!.slice(-4)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">H1 Price</p>
                <p className="text-2xl font-bold text-primary">
                  {hasBondingCurve && lab.h1Price && lab.h1Price !== '0' 
                    ? `${parseFloat(lab.h1Price).toFixed(4)} LABS`
                    : 'Not Set'}
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">TVL</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  <span className="text-lg font-bold text-secondary">
                    {hasBondingCurve && lab.tvl 
                      ? `${parseFloat(lab.tvl).toFixed(2)} LABS`
                      : '0 LABS'}
                  </span>
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Lab Level</p>
                <p className="text-2xl font-bold">{lab.level}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="text-2xl font-bold">{lab.active ? '✅ Active' : '⏸️ Inactive'}</p>
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
              <Link to={`/lab/${id}/chat`} className="block">
                <Button variant="outline" className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Join Lab Chat
                </Button>
              </Link>
              <Link to="/staking" className="block">
                <Button variant="secondary" className="w-full h-12">
                  Stake & Validate
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">H1 Token</span>
                <span className="font-mono text-xs">{lab.h1Token.slice(0, 10)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Domain</span>
                <span className="font-semibold">{lab.domain}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bonding Curve</span>
                <span className="font-semibold">{hasBondingCurve ? '✅ Deployed' : '❌ Not Deployed'}</span>
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
