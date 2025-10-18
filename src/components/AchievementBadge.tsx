import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedDate?: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

const rarityColors = {
  common: "bg-muted",
  rare: "bg-secondary/20 border-secondary",
  epic: "bg-primary/20 border-primary",
  legendary: "bg-gradient-hero border-primary",
};

const rarityLabels = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  const Icon = achievement.icon;
  const progress = achievement.progress || 0;
  const maxProgress = achievement.maxProgress || 100;
  const progressPercent = (progress / maxProgress) * 100;

  return (
    <Card
      className={`p-4 border-2 transition-all duration-300 ${
        achievement.earned
          ? `${rarityColors[achievement.rarity]} hover:scale-105 card-hover cursor-pointer`
          : "bg-muted/20 opacity-50 hover:opacity-70"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-3 rounded-lg ${
            achievement.earned
              ? "bg-gradient-primary"
              : "bg-muted"
          }`}
        >
          <Icon className={`h-6 w-6 ${achievement.earned ? "text-primary-foreground" : "text-muted-foreground"}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-sm ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}>
              {achievement.name}
            </h3>
            {achievement.earned && (
              <Badge variant="secondary" className="text-xs">
                {rarityLabels[achievement.rarity]}
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {achievement.description}
          </p>

          {!achievement.earned && achievement.maxProgress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}/{maxProgress}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {achievement.earned && achievement.earnedDate && (
            <p className="text-xs text-primary mt-2">
              Earned on {achievement.earnedDate}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
