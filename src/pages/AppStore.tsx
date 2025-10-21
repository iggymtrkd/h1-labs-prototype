import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DatasetCard, Dataset } from "@/components/DatasetCard";
import { 
  Heart, Stethoscope, Palette, Bot, Scale, DollarSign, 
  Users, TrendingUp, ExternalLink, Search, Filter, ShoppingCart
} from "lucide-react";

// Mock dataset inventory
const MOCK_DATASETS: Dataset[] = [
  {
    id: "ds_001",
    name: "Cardiovascular Patient Records",
    description:
      "De-identified patient data with ECG readings and diagnoses from major medical centers",
    domain: "Healthcare",
    creator: "Dr. Sarah Chen",
    supervisor: "Mayo Clinic Cardiology",
    dataCount: 10000,
    qualityScore: 94,
    deltaGain: 8.24,
    price: 2500,
    availability: 1543,
    approved: true,
    createdAt: "2025-10-15",
    credentialId: 42,
    supervisorCredentialId: 43,
    tags: ["HIPAA", "Medical", "Validated"],
    reviewerCount: 12,
    complianceStandards: ["HIPAA", "GDPR"],
    labId: 1,
  },
  {
    id: "ds_002",
    name: "Financial Transaction Patterns",
    description: "Anonymized transaction records for fraud detection and AML/KYC",
    domain: "Finance",
    creator: "Morgan Stanley Analytics",
    supervisor: "SEC Compliance",
    dataCount: 50000,
    qualityScore: 89,
    deltaGain: 6.15,
    price: 5000,
    availability: 2341,
    approved: true,
    createdAt: "2025-10-14",
    credentialId: 44,
    supervisorCredentialId: 45,
    tags: ["AML/KYC", "Finance", "High-Volume"],
    reviewerCount: 18,
    complianceStandards: ["AML/KYC", "SOC 2"],
    labId: 2,
  },
  {
    id: "ds_003",
    name: "Legal Document Classification",
    description:
      "Classified legal documents for AI-powered legal research and due diligence",
    domain: "Legal",
    creator: "LexisNexis AI",
    supervisor: "Bar Association Review",
    dataCount: 15000,
    qualityScore: 92,
    deltaGain: 7.85,
    price: 3500,
    availability: 876,
    approved: true,
    createdAt: "2025-10-13",
    credentialId: 46,
    supervisorCredentialId: 47,
    tags: ["Legal", "NLP", "Document"],
    reviewerCount: 8,
    complianceStandards: ["Legal Privilege", "Confidentiality"],
    labId: 3,
  },
  {
    id: "ds_004",
    name: "Medical Imaging Annotations",
    description: "X-ray and CT scan annotations by board-certified radiologists",
    domain: "Healthcare",
    creator: "Cleveland Clinic",
    supervisor: "ACR Standards Board",
    dataCount: 25000,
    qualityScore: 96,
    deltaGain: 9.42,
    price: 4500,
    availability: 3234,
    approved: true,
    createdAt: "2025-10-12",
    credentialId: 48,
    supervisorCredentialId: 49,
    tags: ["Medical", "Imaging", "Verified"],
    reviewerCount: 25,
    complianceStandards: ["HIPAA", "FDA 21 CFR"],
    labId: 1,
  },
  {
    id: "ds_005",
    name: "Robotics Motion Trajectories",
    description: "Industrial robot motion data with safety validation",
    domain: "Robotics",
    creator: "Tesla Robotics",
    supervisor: "ISO 26262 Expert",
    dataCount: 8000,
    qualityScore: 88,
    deltaGain: 5.73,
    price: 2000,
    availability: 567,
    approved: true,
    createdAt: "2025-10-11",
    credentialId: 50,
    supervisorCredentialId: 51,
    tags: ["Robotics", "Safety", "Industrial"],
    reviewerCount: 6,
    complianceStandards: ["ISO 26262", "ISO 13849"],
    labId: 4,
  },
  {
    id: "ds_006",
    name: "Game Asset Collections",
    description: "Creative assets with provenance tracking via C2PA",
    domain: "Art",
    creator: "Artstation Collective",
    supervisor: "C2PA Verifier",
    dataCount: 5000,
    qualityScore: 91,
    deltaGain: 7.12,
    price: 1500,
    availability: 2100,
    approved: true,
    createdAt: "2025-10-10",
    credentialId: 52,
    supervisorCredentialId: 53,
    tags: ["Art", "Gaming", "Creative"],
    reviewerCount: 14,
    complianceStandards: ["C2PA", "Copyright"],
    labId: 5,
  },
];

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState("popular");
  const [qualityFilter, setQualityFilter] = useState("all");

  const domains = ["Healthcare", "Finance", "Legal", "Robotics", "Art"];

  // Filter logic for datasets
  const filteredDatasets = useMemo(() => {
    return MOCK_DATASETS.filter((ds) => {
      const matchesSearch =
        ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ds.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ds.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesDomain = !selectedDomain || ds.domain === selectedDomain;

      let matchesQuality = true;
      if (qualityFilter !== "all") {
        const minScore = parseInt(qualityFilter);
        matchesQuality = ds.qualityScore >= minScore;
      }

      return matchesSearch && matchesDomain && matchesQuality;
    });
  }, [searchQuery, selectedDomain, qualityFilter]);

  // Sort logic for datasets
  const sortedDatasets = useMemo(() => {
    const sorted = [...filteredDatasets];
    switch (sortBy) {
      case "quality":
        return sorted.sort((a, b) => b.qualityScore - a.qualityScore);
      case "delta-gain":
        return sorted.sort((a, b) => b.deltaGain - a.deltaGain);
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      default: // popular
        return sorted.sort((a, b) => b.availability - a.availability);
    }
  }, [filteredDatasets, sortBy]);

  const cartTotal = Array.from(selectedDatasets).reduce((sum, id) => {
    const ds = MOCK_DATASETS.find((d) => d.id === id);
    return sum + (ds?.price || 0);
  }, 0);

  const toggleDataset = (id: string) => {
    const newSelected = new Set(selectedDatasets);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDatasets(newSelected);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/dataset/${id}`);
  };

  const handleCheckout = () => {
    const selectedItems = Array.from(selectedDatasets).map((id) =>
      MOCK_DATASETS.find((d) => d.id === id)
    );
    navigate("/checkout", { state: { items: selectedItems, total: cartTotal } });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Marketplace
          </h1>
          <p className="text-slate-400">
            Explore datasets and decentralized applications
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="datasets" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="datasets">Dataset Marketplace</TabsTrigger>
            <TabsTrigger value="dapps">dApp Marketplace</TabsTrigger>
          </TabsList>

          {/* Dataset Marketplace Tab */}
          <TabsContent value="datasets">
            <div className="space-y-6">
              {/* Search & Cart Header */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-xl relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search datasets, domains, creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={handleCheckout}
                  disabled={selectedDatasets.size === 0}
                  className={selectedDatasets.size > 0 ? "bg-blue-600" : ""}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Cart ({selectedDatasets.size})
                  {selectedDatasets.size > 0 && (
                    <Badge className="ml-2 bg-red-500">
                      ${cartTotal.toLocaleString()}
                    </Badge>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                  <Card className="bg-slate-800 border-slate-700 sticky top-24">
                    <div className="p-6 space-y-6">
                      {/* Domain Filter */}
                      <div>
                        <h3 className="font-semibold text-white mb-3 flex items-center">
                          <Filter className="mr-2 h-4 w-4" />
                          Domain
                        </h3>
                        <div className="space-y-2">
                          {domains.map((domain) => (
                            <button
                              key={domain}
                              onClick={() =>
                                setSelectedDomain(
                                  selectedDomain === domain ? null : domain
                                )
                              }
                              className={`w-full text-left px-3 py-2 rounded transition ${
                                selectedDomain === domain
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                              }`}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quality Filter */}
                      <div>
                        <h3 className="font-semibold text-white mb-3">Quality Score</h3>
                        <div className="space-y-2">
                          {[
                            { value: "all", label: "All Qualities" },
                            { value: "90", label: "90+ Score" },
                            { value: "95", label: "95+ Score" },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center text-slate-300 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="quality"
                                value={option.value}
                                checked={qualityFilter === option.value}
                                onChange={(e) => setQualityFilter(e.target.value)}
                                className="rounded mr-2"
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Reset Button */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedDomain(null);
                          setSearchQuery("");
                          setQualityFilter("all");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  {/* Sort Options */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">
                      Datasets ({sortedDatasets.length})
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 text-sm"
                      >
                        <option value="popular">Most Popular</option>
                        <option value="quality">Highest Quality</option>
                        <option value="delta-gain">Best Delta-Gain</option>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Dataset Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedDatasets.map((dataset) => (
                      <DatasetCard
                        key={dataset.id}
                        dataset={dataset}
                        isSelected={selectedDatasets.has(dataset.id)}
                        onToggle={toggleDataset}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>

                  {/* Empty State */}
                  {sortedDatasets.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-300 mb-2">
                        No datasets found
                      </h3>
                      <p className="text-slate-400">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* dApp Marketplace Tab */}
          <TabsContent value="dapps">
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Heart className="h-8 w-8 text-primary" />
                  Healthcare Applications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                        <h3 className="text-xl font-bold mb-2 text-white">{app.name}</h3>
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
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Palette className="h-8 w-8 text-secondary" />
                  Other Domains
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                        <h3 className="text-xl font-bold mb-2 text-white">{app.name}</h3>
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
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
                <div className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">Build on H1 Labs</h2>
                  <p className="text-blue-100 mb-6">
                    Create the next generation of AI-powered dApps with our protocol
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      Developer Docs
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/10"
                    >
                      View SDK
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
