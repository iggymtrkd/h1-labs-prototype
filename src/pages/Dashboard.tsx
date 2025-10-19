import { useState } from "react";
import { LabCard, Lab } from "@/components/LabCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, TrendingUp, Flame, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data - in real app this would come from blockchain
const mockLabs: Lab[] = [
  {
    id: "1",
    name: "CardioLab",
    symbol: "CARDIO",
    category: "Healthcare",
    description: "Cardiovascular disease diagnosis and treatment datasets validated by cardiologists",
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
    description: "Art authentication and provenance verification datasets",
    price: "0.028",
    change24h: -3.2,
    volume24h: "840K",
    marketCap: "28M",
    validators: 156,
    datasets: 892,
  },
  {
    id: "3",
    name: "RoboTrace",
    symbol: "ROBO",
    category: "Robotics",
    description: "Computer vision and robotics training datasets for autonomous systems",
    price: "0.056",
    change24h: 8.7,
    volume24h: "2.1M",
    marketCap: "67M",
    validators: 312,
    datasets: 2156,
  },
  {
    id: "4",
    name: "MedicalMind",
    symbol: "MEDM",
    category: "Healthcare",
    description: "Clinical reasoning and diagnostic datasets enriched through RLHF",
    price: "0.073",
    change24h: 15.3,
    volume24h: "3.4M",
    marketCap: "92M",
    validators: 445,
    datasets: 3241,
  },
  {
    id: "5",
    name: "LegalLogic",
    symbol: "LEGAL",
    category: "Legal",
    description: "Legal document analysis and case law datasets for AI-powered legal research",
    price: "0.034",
    change24h: 5.1,
    volume24h: "670K",
    marketCap: "31M",
    validators: 189,
    datasets: 1234,
  },
  {
    id: "6",
    name: "GenomeData",
    symbol: "GENE",
    category: "Healthcare",
    description: "Genomic sequencing and personalized medicine datasets",
    price: "0.089",
    change24h: 22.4,
    volume24h: "4.2M",
    marketCap: "112M",
    validators: 567,
    datasets: 4123,
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Healthcare", "Art", "Robotics", "Legal"];

  const filteredLabs = mockLabs.filter((lab) => {
    const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || lab.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 glow-green">H1 Labs Marketplace</h1>
          <p className="text-xl text-muted-foreground">
            Discover and invest in AI training data labs across multiple domains
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-card p-4 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Market Cap</p>
            <p className="text-2xl font-bold text-primary">$375M</p>
          </div>
          <div className="bg-gradient-card p-4 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
            <p className="text-2xl font-bold text-secondary">$12.4M</p>
          </div>
          <div className="bg-gradient-card p-4 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Active Labs</p>
            <p className="text-2xl font-bold text-primary">{mockLabs.length}</p>
          </div>
          <div className="bg-gradient-card p-4 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Validators</p>
            <p className="text-2xl font-bold text-secondary">1,903</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search labs by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border focus:border-primary"
            />
          </div>

          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <TabsList className="bg-muted/50">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Trending Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Trending Labs</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs
              .filter((lab) => lab.change24h > 10)
              .slice(0, 3)
              .map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
          </div>
        </div>

        {/* All Labs */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">All Labs</h2>
            <Badge variant="secondary" className="ml-2">
              {filteredLabs.length} labs
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </div>

        {filteredLabs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No labs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
