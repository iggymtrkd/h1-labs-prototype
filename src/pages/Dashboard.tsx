import { useState } from "react";
import { LabCard, Lab } from "@/components/LabCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, TrendingUp, Flame, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLabEvents } from "@/hooks/useLabEvents";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Fetch real labs from blockchain
export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { labs: labEvents, loading, error } = useLabEvents();

  // Transform lab events into Lab format for LabCard
  const labs: Lab[] = labEvents.map((event, index) => ({
    id: event.labId,
    name: event.name,
    symbol: event.symbol,
    category: event.domain || "Uncategorized",
    description: `Lab ${event.name} - H1 Token: ${event.h1Token.slice(0, 6)}...${event.h1Token.slice(-4)}`,
    price: "0.000", // Will be populated from bonding curve
    change24h: 0,
    volume24h: "0",
    marketCap: "0",
    validators: 0,
    datasets: 0,
  }));

  const categories = ["all", ...Array.from(new Set(labs.map(lab => lab.category)))];

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || lab.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-8 md:pt-12 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading labs from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-8 md:pt-12 pb-12">
        <div className="container mx-auto px-4 max-w-full">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-12 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 glow-green">Home</h1>
          <p className="text-xl text-muted-foreground">
            Discover and invest in AI training data labs created on-chain
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-card p-4 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Labs</p>
            <p className="text-2xl font-bold text-primary">{labs.length}</p>
          </div>
          <div className="bg-gradient-card p-4 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Categories</p>
            <p className="text-2xl font-bold text-secondary">{categories.length - 1}</p>
          </div>
          <div className="bg-gradient-card p-4 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">On-Chain Data</p>
            <p className="text-2xl font-bold text-primary">Base Sepolia</p>
          </div>
          <div className="bg-gradient-card p-4 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Data Source</p>
            <p className="text-2xl font-bold text-secondary">Blockscout API</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
