import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Users, Database, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
}

interface LabCardProps {
  lab: Lab;
  variant?: "market" | "owned";
}

export const LabCard = ({ lab, variant = "market" }: LabCardProps) => {
  const isPositive = lab.change24h >= 0;
  
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
          <p className="text-xs text-muted-foreground mb-1">Price</p>
          <p className="text-xl font-bold text-primary">${lab.price}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">24h Change</p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-primary" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className={`text-sm font-semibold ${isPositive ? "text-primary" : "text-destructive"}`}>
              {isPositive ? "+" : ""}{lab.change24h.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

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
