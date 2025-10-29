import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DatasetCard, Dataset } from "@/components/DatasetCard";
import {
  Search,
  Filter,
  ShoppingCart,
  TrendingUp,
  X,
  Download,
  ArrowLeft,
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

export default function DatasetMarketplace() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromChat = location.state?.from;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState("popular");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [selectedDatasetForModal, setSelectedDatasetForModal] = useState<Dataset | null>(null);

  const domains = ["Healthcare", "Finance", "Legal", "Robotics", "Art"];

  // Filter logic
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

  // Sort logic
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
    const dataset = MOCK_DATASETS.find((d) => d.id === id);
    if (dataset) {
      setSelectedDatasetForModal(dataset);
    }
  };

  const handleCheckout = () => {
    // Pass selected datasets to checkout
    const selectedItems = Array.from(selectedDatasets).map((id) =>
      MOCK_DATASETS.find((d) => d.id === id)
    );
    navigate("/checkout", { state: { items: selectedItems, total: cartTotal } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button - Top Right (Fixed Position) */}
      {fromChat && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            onClick={() => navigate(fromChat)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
        </div>
      )}
      
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                Dataset Marketplace
              </h1>
              <p className="text-muted-foreground text-sm">
                {sortedDatasets.length} datasets available
              </p>
            </div>

            {/* Cart Badge */}
            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={selectedDatasets.size === 0}
              className={selectedDatasets.size > 0 ? "bg-primary" : ""}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart ({selectedDatasets.size})
              {selectedDatasets.size > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-destructive">
                  ${cartTotal.toLocaleString()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search datasets, domains, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6 space-y-6">
                {/* Domain Filter */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
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
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Quality Score</h3>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Qualities" },
                      { value: "90", label: "90+ Score" },
                      { value: "95", label: "95+ Score" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center cursor-pointer"
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
              <h2 className="text-lg font-semibold">
                Datasets ({sortedDatasets.length})
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background border rounded px-3 py-2 text-sm"
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
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No datasets found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Cart Footer (Mobile) */}
        {selectedDatasets.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/80 border-t p-4 backdrop-blur lg:hidden">
            <Button
              size="lg"
              className="w-full"
              onClick={handleCheckout}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Review Cart ({selectedDatasets.size}) - $
              {cartTotal.toLocaleString()}
            </Button>
          </div>
        )}
      </div>

      {/* Dataset Metadata Modal */}
      <Dialog open={!!selectedDatasetForModal} onOpenChange={(open) => !open && setSelectedDatasetForModal(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dataset Metadata Report</DialogTitle>
          </DialogHeader>
          {selectedDatasetForModal && (
            <Tabs defaultValue="dataset" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dataset">Dataset Summary</TabsTrigger>
                <TabsTrigger value="details">Full Details</TabsTrigger>
              </TabsList>
              
              {/* Dataset Summary Tab */}
              <TabsContent value="dataset" className="space-y-4 mt-4">
                <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                  <h3 className="font-bold text-lg mb-4">Dataset Overview</h3>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground font-semibold">Dataset ID:</span>
                        <p className="font-mono text-primary">{selectedDatasetForModal.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Created:</span>
                        <p className="font-mono text-xs">{selectedDatasetForModal.createdAt}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground font-semibold">Name:</span>
                      <p className="font-semibold">{selectedDatasetForModal.name}</p>
                    </div>

                    <div>
                      <span className="text-muted-foreground font-semibold">Description:</span>
                      <p className="text-xs">{selectedDatasetForModal.description}</p>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-muted-foreground font-semibold">Creator:</span>
                      <p className="font-mono text-xs">{selectedDatasetForModal.creator}</p>
                    </div>

                    <div>
                      <span className="text-muted-foreground font-semibold">Domain:</span>
                      <p className="font-mono">{selectedDatasetForModal.domain}</p>
                    </div>

                    <div>
                      <span className="text-muted-foreground font-semibold">Lab ID:</span>
                      <p className="font-mono">#{selectedDatasetForModal.labId}</p>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-muted-foreground font-semibold">Supervised by:</span>
                      <p className="font-mono text-xs">{selectedDatasetForModal.supervisor}</p>
                      <p className="text-xs text-muted-foreground">Credential ID: #{selectedDatasetForModal.supervisorCredentialId}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground font-semibold">Quality Score:</span>
                        <p className="font-bold text-primary text-xl">{selectedDatasetForModal.qualityScore}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Delta Gain:</span>
                        <p className="font-bold text-secondary text-xl">{selectedDatasetForModal.deltaGain}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground font-semibold">Data Points:</span>
                        <p className="font-mono">{selectedDatasetForModal.dataCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Reviewers:</span>
                        <p className="font-mono">{selectedDatasetForModal.reviewerCount}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-muted-foreground font-semibold">Compliance Standards:</span>
                      <div className="flex gap-2 mt-1">
                        {selectedDatasetForModal.complianceStandards.map((standard) => (
                          <Badge key={standard} variant="secondary">{standard}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground font-semibold">Tags:</span>
                      <div className="flex gap-2 mt-1">
                        {selectedDatasetForModal.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <span className="text-muted-foreground font-semibold">Price:</span>
                      <p className="font-bold text-2xl">${selectedDatasetForModal.price.toLocaleString()}</p>
                    </div>

                    <div>
                      <span className="text-muted-foreground font-semibold">Available Licenses:</span>
                      <p className="font-mono">{selectedDatasetForModal.availability.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Full Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Dataset Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dataset ID:</span>
                        <span className="font-mono">{selectedDatasetForModal.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lab ID:</span>
                        <span className="font-mono">#{selectedDatasetForModal.labId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-mono">{selectedDatasetForModal.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Approved:</span>
                        <Badge variant={selectedDatasetForModal.approved ? "default" : "destructive"}>
                          {selectedDatasetForModal.approved ? "✓ Approved" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Creator Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Creator:</span>
                        <span className="font-mono text-xs">{selectedDatasetForModal.creator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credential ID:</span>
                        <span className="font-mono">#{selectedDatasetForModal.credentialId}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Supervisor Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Supervisor:</span>
                        <span className="font-mono text-xs">{selectedDatasetForModal.supervisor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credential ID:</span>
                        <span className="font-mono">#{selectedDatasetForModal.supervisorCredentialId}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Quality Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quality Score:</span>
                        <span className="font-bold">{selectedDatasetForModal.qualityScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delta Gain:</span>
                        <span className="font-bold">{selectedDatasetForModal.deltaGain}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reviewers:</span>
                        <span className="font-mono">{selectedDatasetForModal.reviewerCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Points:</span>
                        <span className="font-mono">{selectedDatasetForModal.dataCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
