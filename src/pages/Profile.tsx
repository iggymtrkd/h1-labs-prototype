import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AchievementBadge, Achievement } from "@/components/AchievementBadge";
import { LabCard, Lab } from "@/components/LabCard";
import { 
  Sprout, Brain, Beaker, Microscope, Lightbulb, 
  Sparkles, Link as LinkIcon, Compass, Award, Clock, TrendingUp,
  ExternalLink, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";

const userAchievements: Achievement[] = [
  {
    id: "1",
    name: "Genesis Holder",
    description: "Early staker in the H1 Labs protocol",
    icon: Sprout,
    earned: true,
    rarity: "legendary",
    earnedDate: "March 2025",
  },
  {
    id: "2",
    name: "Data Enricher Lv3",
    description: "Validated over 500 datasets",
    icon: Brain,
    earned: true,
    rarity: "epic",
    progress: 534,
    maxProgress: 1000,
    earnedDate: "April 2025",
  },
  {
    id: "3",
    name: "Lab Alchemist",
    description: "Created your first DataLab",
    icon: Beaker,
    earned: true,
    rarity: "rare",
    earnedDate: "March 2025",
  },
  {
    id: "4",
    name: "Science Guardian",
    description: "Validated 100+ healthcare datasets",
    icon: Microscope,
    earned: true,
    rarity: "rare",
    earnedDate: "April 2025",
  },
  {
    id: "5",
    name: "Innovator",
    description: "Deploy your first SDK app",
    icon: Lightbulb,
    earned: false,
    progress: 0,
    maxProgress: 1,
    rarity: "epic",
  },
  {
    id: "6",
    name: "Memetic Trader",
    description: "Trade 1000+ H1 tokens",
    icon: Sparkles,
    earned: false,
    progress: 472,
    maxProgress: 1000,
    rarity: "common",
  },
  {
    id: "7",
    name: "Provenance Pioneer",
    description: "Log your first dataset on-chain",
    icon: LinkIcon,
    earned: true,
    rarity: "common",
    earnedDate: "March 2025",
  },
  {
    id: "8",
    name: "Atlas Explorer",
    description: "Participate in 3+ different lab domains",
    icon: Compass,
    earned: true,
    rarity: "rare",
    earnedDate: "April 2025",
  },
];

const userLabs: Lab[] = [
  {
    id: "1",
    name: "CardioLab",
    symbol: "CARDIO",
    category: "Healthcare",
    description: "Cardiovascular disease diagnosis datasets",
    price: "0.042",
    change24h: 12.5,
    volume24h: "1.2M",
    marketCap: "45M",
    validators: 234,
    datasets: 1543,
  },
  {
    id: "2",
    name: "ArtProof",
    symbol: "ART",
    category: "Art",
    description: "Art authentication datasets",
    price: "0.028",
    change24h: -3.2,
    volume24h: "840K",
    marketCap: "28M",
    validators: 156,
    datasets: 892,
  },
];

interface ProfileProps {
  address?: string;
  labsBalance?: string;
}

export default function Profile({ address: walletAddress, labsBalance: userLabsBalance }: ProfileProps) {
  const userAddress = walletAddress || "0x92A...2c9b";
  const ensName = "drsilva.h1labs";
  const joinDate = "March 2025";
  const level = 7;
  const labsBalance = userLabsBalance || "8,320";
  const labsStaked = "6,000";
  const h1TokensTotal = "12,400";
  const portfolioValue = "$1,450";
  const stakingAge = 187;
  const dailyStreak = 24;

  const earnedAchievements = userAchievements.filter(a => a.earned);
  const nextReward = "Lab Alchemist II";

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Profile Header */}
        <Card className="p-8 mb-8 bg-gradient-card border-border">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-hero flex items-center justify-center text-4xl font-bold mb-4">
                🧬
              </div>
              <div className="text-center">
                <Badge className="bg-primary/20 text-primary">Level {level}</Badge>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{ensName}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">{userAddress}</span>
                    <a 
                      href={`https://basescan.org/address/${userAddress}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-glow"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Joined: {joinDate}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">$LABS Balance</p>
                  <p className="text-xl font-bold text-primary">{labsBalance}</p>
                  <p className="text-xs text-muted-foreground">Staked: {labsStaked}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">H1 Tokens</p>
                  <p className="text-xl font-bold text-secondary">{h1TokensTotal}</p>
                  <p className="text-xs text-muted-foreground">Across {userLabs.length} Labs</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Portfolio Value</p>
                  <p className="text-xl font-bold text-primary">{portfolioValue}</p>
                  <div className="flex items-center gap-1 text-xs text-primary mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Achievements</p>
                  <p className="text-xl font-bold text-secondary">{earnedAchievements.length}/{userAchievements.length}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Award className="h-3 w-3" />
                    <span>{Math.round(earnedAchievements.length / userAchievements.length * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Participation & Activity */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Labs Participation */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card border-border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Labs Participation
            </h2>
            <div className="space-y-4">
              {userLabs.map((lab) => (
                <div key={lab.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-secondary flex items-center justify-center">
                      <span className="font-bold">{lab.symbol[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{lab.name}</p>
                      <p className="text-xs text-muted-foreground">{lab.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-primary/20 text-primary">Owner</Badge>
                    <p className="text-xs text-muted-foreground mt-1">6,200 H1</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Stats */}
          <Card className="p-6 bg-gradient-card border-border">
            <h2 className="text-xl font-bold mb-4">Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Staking Age</p>
                  <p className="font-bold">{stakingAge} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Daily Streak</p>
                  <p className="font-bold">{dailyStreak} days active</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Next Reward Tier</p>
                  <p className="font-bold text-sm">{nextReward}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6 bg-gradient-card border-border mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Achievements
            <Badge variant="secondary" className="ml-2">
              {earnedAchievements.length}/{userAchievements.length}
            </Badge>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userAchievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </Card>

        {/* Credentials */}
        <Card className="p-6 bg-gradient-card border-border">
          <h2 className="text-2xl font-bold mb-4">Credentials & Certifications</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-semibold">AEH Certified Clinician</p>
                <p className="text-sm text-muted-foreground">ID #213 • Verified</p>
              </div>
              <Badge className="bg-primary/20 text-primary">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-semibold">Verified Validator NFT</p>
                <p className="text-sm text-muted-foreground">H1 NFT #0012</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
