import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DatasetCard, Dataset } from "@/components/DatasetCard";
import {
  Search,
  Filter,
  ShoppingCart,
  TrendingUp,
  X,
  Download,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState("popular");
  const [qualityFilter, setQualityFilter] = useState("all");

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
    navigate(`/dataset/${id}`);
  };

  const handleCheckout = () => {
    // Pass selected datasets to checkout
    const selectedItems = Array.from(selectedDatasets).map((id) =>
      MOCK_DATASETS.find((d) => d.id === id)
    );
    navigate("/checkout", { state: { items: selectedItems, total: cartTotal } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Dataset Marketplace
              </h1>
              <p className="text-slate-400 text-sm">
                {sortedDatasets.length} datasets available
              </p>
            </div>

            {/* Cart Badge */}
            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={selectedDatasets.size === 0}
              className={selectedDatasets.size > 0 ? "bg-blue-600" : ""}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart ({selectedDatasets.size})
              {selectedDatasets.size > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500">
                  ${cartTotal.toLocaleString()}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search datasets, domains, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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

        {/* Sticky Cart Footer (Mobile) */}
        {selectedDatasets.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-900/80 border-t border-slate-700 p-4 backdrop-blur lg:hidden">
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
    </div>
  );
}
