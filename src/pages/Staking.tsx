import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock, Unlock, TrendingUp, Info } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/hooks/use-window-size";
import { toast } from "sonner";

interface StakingProps {
  labsBalance?: string;
}

export default function Staking({ labsBalance = "10,000" }: StakingProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const userBalance = "10,000";
  const stakedBalance = "5,000";
  const availableRewards = "234.56";
  const apr = "18.5";

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setShowConfetti(true);
    toast.success(`Successfully staked ${stakeAmount} $LABS!`, {
      description: "You can now participate in data validation",
    });
    
    setTimeout(() => {
      setShowConfetti(false);
      setStakeAmount("");
    }, 5000);
  };

  const handleUnstake = () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    toast.success(`Successfully unstaked ${unstakeAmount} $LABS!`);
    setUnstakeAmount("");
  };

  const handleClaimRewards = () => {
    setShowConfetti(true);
    toast.success(`Claimed ${availableRewards} $LABS rewards!`);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-12 overflow-x-hidden">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      <div className="container mx-auto px-4 max-w-6xl overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 glow-green">Create Labs</h1>
          <p className="text-xl text-muted-foreground">
            Stake $LABS to unlock lab ownership and earn rewards
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
            <p className="text-2xl font-bold text-primary">{userBalance} $LABS</p>
          </Card>
          <Card className="p-6 bg-gradient-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Staked Balance</p>
            <p className="text-2xl font-bold text-secondary">{stakedBalance} $LABS</p>
          </Card>
          <Card className="p-6 bg-gradient-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Claimable Rewards</p>
            <p className="text-2xl font-bold text-primary">{availableRewards} $LABS</p>
          </Card>
          <Card className="p-6 bg-gradient-card border-border">
            <p className="text-sm text-muted-foreground mb-2">Current APR</p>
            <p className="text-2xl font-bold text-secondary">{apr}%</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Staking Interface */}
          <Card className="p-8 bg-gradient-card border-border">
            <Tabs defaultValue="stake" className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="stake" className="flex-1">
                  <Lock className="mr-2 h-4 w-4" />
                  Stake
                </TabsTrigger>
                <TabsTrigger value="unstake" className="flex-1">
                  <Unlock className="mr-2 h-4 w-4" />
                  Unstake
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stake" className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Amount to Stake
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="h-14 text-lg pr-20"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                      onClick={() => setStakeAmount(userBalance.replace(",", ""))}
                    >
                      MAX
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: {userBalance} $LABS
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You will receive</span>
                    <span className="font-semibold">{stakeAmount || "0"} H1 Tokens</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span className="font-semibold">1:1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated APR</span>
                    <span className="font-semibold text-primary">{apr}%</span>
                  </div>
                </div>

                <Button
                  onClick={handleStake}
                  className="w-full h-12 bg-gradient-primary text-lg"
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                >
                  Stake $LABS
                </Button>
              </TabsContent>

              <TabsContent value="unstake" className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Amount to Unstake
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="h-14 text-lg pr-20"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                      onClick={() => setUnstakeAmount(stakedBalance.replace(",", ""))}
                    >
                      MAX
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Staked: {stakedBalance} $LABS
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You will receive</span>
                    <span className="font-semibold">{unstakeAmount || "0"} $LABS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unstaking Period</span>
                    <span className="font-semibold">7 days</span>
                  </div>
                </div>

                <Button
                  onClick={handleUnstake}
                  variant="outline"
                  className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg"
                  disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0}
                >
                  Unstake $LABS
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Rewards & Info */}
          <div className="space-y-6">
            {/* Claim Rewards */}
            <Card className="p-8 bg-gradient-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Claimable Rewards</h3>
                  <p className="text-sm text-muted-foreground">Earned from staking</p>
                </div>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg mb-4">
                <p className="text-3xl font-bold text-primary mb-1">{availableRewards} $LABS</p>
                <p className="text-sm text-muted-foreground">≈ $1,234.56 USD</p>
              </div>

              <Button
                onClick={handleClaimRewards}
                className="w-full h-12 bg-gradient-secondary text-lg"
                disabled={parseFloat(availableRewards) <= 0}
              >
                Claim Rewards
              </Button>
            </Card>

            {/* Info Card */}
            <Card className="p-6 bg-gradient-card border-border">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Staking Benefits</h3>
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">
                    Earn {apr}% APR on your staked tokens
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">
                    Gain ownership rights to DataLabs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">
                    Participate in governance decisions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">
                    Access exclusive validator opportunities
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">
                    7-day unstaking period for security
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
