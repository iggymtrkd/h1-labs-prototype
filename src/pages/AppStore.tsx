import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, Stethoscope, Palette, Bot, Scale, DollarSign, 
  Users, TrendingUp, ExternalLink 
} from "lucide-react";

interface App {
  id: string;
  name: string;
  developer: string;
  category: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "live" | "beta" | "prototype";
  revenue: string;
  users: string;
  color: string;
}

const apps: App[] = [
  {
    id: "1",
    name: "Scrubber App",
    developer: "H1 Labs Core",
    category: "Healthcare",
    description: "De-identify and pre-tag patient records with AI-powered privacy protection",
    longDescription: "Enables physicians to upload and de-identify patient records using H1's Privacy Facet. Automatically redacts PHI and tokenizes identifiers while maintaining data utility.",
    icon: Stethoscope,
    status: "live",
    revenue: "$124K/mo",
    users: "1.2K",
    color: "primary",
  },
  {
    id: "2",
    name: "Second Opinion+",
    developer: "MedAI Labs",
    category: "Healthcare",
    description: "AI-human hybrid consultation platform for diagnostic validation",
    longDescription: "An AI model provides diagnostic insights and a verified clinician validates the response. Each interaction enriches reasoning datasets through RLHF.",
    icon: Heart,
    status: "live",
    revenue: "$98K/mo",
    users: "847",
    color: "secondary",
  },
  {
    id: "3",
    name: "Pre-Chart Pro",
    developer: "ClinicalFlow",
    category: "Healthcare",
    description: "Automated documentation compliance and HCC classification tool",
    longDescription: "Auto-sorts problems by HCC, provides guideline compliance alerts, and generates smart note templates to reduce physician documentation time.",
    icon: Stethoscope,
    status: "beta",
    revenue: "$45K/mo",
    users: "456",
    color: "primary",
  },
  {
    id: "4",
    name: "ArtSense",
    developer: "Provenance Labs",
    category: "Art",
    description: "Art dataset verifier with blockchain-based authenticity tracking",
    longDescription: "Verifies art authenticity through collaborative validation by art experts and historians, creating immutable provenance records.",
    icon: Palette,
    status: "live",
    revenue: "$67K/mo",
    users: "312",
    color: "secondary",
  },
  {
    id: "5",
    name: "RoboTrace",
    developer: "Autonomous Systems Inc",
    category: "Robotics",
    description: "Computer vision dataset trainer for autonomous robotics systems",
    longDescription: "Provides validated computer vision training data for autonomous vehicles, drones, and industrial robots through expert human annotation.",
    icon: Bot,
    status: "live",
    revenue: "$156K/mo",
    users: "2.1K",
    color: "primary",
  },
  {
    id: "6",
    name: "LegalMind",
    developer: "JusticeAI",
    category: "Legal",
    description: "Legal document analysis and case law research assistant",
    longDescription: "AI-powered legal research tool validated by licensed attorneys, creating comprehensive legal reasoning datasets.",
    icon: Scale,
    status: "prototype",
    revenue: "Coming Soon",
    users: "Beta",
    color: "secondary",
  },
];

export default function AppStore() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-primary/20 text-primary";
      case "beta":
        return "bg-secondary/20 text-secondary";
      case "prototype":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 glow-green">H1 Labs dApp Store</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Discover dApps built on the H1 Labs protocol across healthcare, art, robotics, and more
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <ExternalLink className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Total Apps</p>
            </div>
            <p className="text-3xl font-bold text-primary">{apps.length}</p>
          </Card>
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <p className="text-3xl font-bold text-secondary">5.2K+</p>
          </Card>
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
            </div>
            <p className="text-3xl font-bold text-primary">$490K+</p>
          </Card>
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
            </div>
            <p className="text-3xl font-bold text-secondary">+42%</p>
          </Card>
        </div>

        {/* Healthcare Apps Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Healthcare Applications
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps
              .filter((app) => app.category === "Healthcare")
              .map((app) => (
                <Card
                  key={app.id}
                  className="p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 card-hover"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${app.color}/20`}>
                      <app.icon className={`h-8 w-8 text-${app.color}`} />
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{app.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    by {app.developer}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {app.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{app.revenue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{app.users} users</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">
                    Launch App
                  </Button>
                </Card>
              ))}
          </div>
        </div>

        {/* Other Domains */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Palette className="h-8 w-8 text-secondary" />
            Other Domains
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps
              .filter((app) => app.category !== "Healthcare")
              .map((app) => (
                <Card
                  key={app.id}
                  className="p-6 bg-gradient-card border-border hover:border-primary transition-all duration-300 card-hover"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${app.color}/20`}>
                      <app.icon className={`h-8 w-8 text-${app.color}`} />
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{app.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    by {app.developer}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {app.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{app.revenue}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{app.users} users</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:opacity-90"
                    disabled={app.status === "prototype"}
                  >
                    {app.status === "prototype" ? "Coming Soon" : "Launch App"}
                  </Button>
                </Card>
              ))}
          </div>
        </div>

        {/* Developer CTA */}
        <Card className="mt-12 p-12 bg-gradient-hero/10 border-primary/30 text-center">
          <h2 className="text-3xl font-bold mb-4">Build on H1 Labs</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create your own data enrichment application and earn revenue from the growing H1 ecosystem
          </p>
          <Button size="lg" className="bg-gradient-primary border-0 hover:opacity-90">
            Developer Documentation
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
