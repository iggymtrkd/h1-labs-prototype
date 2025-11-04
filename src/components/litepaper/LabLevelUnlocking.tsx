import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Lock, Unlock, Coins, Zap } from "lucide-react";

const levels = [
  {
    level: "L1",
    labsStaked: "100K–250K",
    appSlots: 1,
    h1Minted: "100K–250K H1",
    color: "hsl(var(--primary))",
    implications: "Can run 1 backend/frontend app pair",
  },
  {
    level: "L2",
    labsStaked: "250K–500K",
    appSlots: 2,
    h1Minted: "250K–500K H1",
    color: "hsl(var(--secondary))",
    implications: "Can run 2 app slots in parallel",
  },
  {
    level: "L3",
    labsStaked: "500K+",
    appSlots: 3,
    h1Minted: "500K H1 (capped)",
    color: "hsl(var(--accent))",
    implications: "Can run 3 app slots in parallel",
  },
];

export default function LabLevelUnlocking() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Level Unlocking (Based on Staked LABS at Creation)
          </h3>
          <p className="text-sm text-muted-foreground">
            Higher LABS stakes unlock more app slots and mint more H1 tokens
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {levels.map((levelData, idx) => (
            <Card
              key={idx}
              className="p-5 border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{ borderColor: levelData.color }}
            >
              <div className="space-y-4">
                {/* Level Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    className="text-lg font-bold px-3 py-1"
                    style={{ backgroundColor: levelData.color }}
                  >
                    {levelData.level}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: levelData.appSlots }).map((_, i) => (
                      <Unlock key={i} className="h-4 w-4" style={{ color: levelData.color }} />
                    ))}
                    {Array.from({ length: 3 - levelData.appSlots }).map((_, i) => (
                      <Lock key={i} className="h-4 w-4 text-muted-foreground opacity-30" />
                    ))}
                  </div>
                </div>

                {/* LABS Staked */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Coins className="h-4 w-4" />
                    <span className="font-semibold">LABS Staked</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: levelData.color }}>
                    {levelData.labsStaked}
                  </p>
                </div>

                {/* App Slots */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    <span className="font-semibold">App Slots</span>
                  </div>
                  <p className="text-xl font-bold">
                    {levelData.appSlots} {levelData.appSlots === 1 ? "Slot" : "Slots"}
                  </p>
                </div>

                {/* H1 Minted */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Coins className="h-4 w-4" />
                    <span className="font-semibold">H1 Minted</span>
                  </div>
                  <p className="text-lg font-bold">{levelData.h1Minted}</p>
                </div>

                {/* Implications */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">{levelData.implications}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold mb-2 text-primary">Staking Benefits</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Higher stakes = more H1 tokens minted</li>
                <li>• H1 tokens unlock at 1:1 ratio with LABS</li>
                <li>• Lab owner receives 30% vested over 6 months</li>
                <li>• Maximum cap: 500K H1 per lab</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2 text-secondary">App Slot Scaling</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Each slot = 1 backend/frontend pair</li>
                <li>• Parallel app execution enabled</li>
                <li>• Scale from prototype to production</li>
                <li>• L3 labs support 3 simultaneous apps</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
