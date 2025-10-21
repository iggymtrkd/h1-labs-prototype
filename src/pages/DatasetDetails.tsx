import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dataset } from "@/components/DatasetCard";
import {
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  Download,
  AlertCircle,
  Shield,
} from "lucide-react";

// Mock datasets
const MOCK_DATASETS: Record<string, Dataset> = {
  ds_001: {
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
    complianceStandards: ["HIPAA", "GDPR", "FDA 21 CFR Part 11"],
    labId: 1,
  },
};

export default function DatasetDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const dataset = id ? MOCK_DATASETS[id] : null;

  if (!dataset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <h2 className="text-white font-semibold mb-2">Dataset Not Found</h2>
          <p className="text-slate-400 mb-4">The dataset you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/marketplace")}>
            Back to Marketplace
          </Button>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    navigate("/checkout", {
      state: { items: [dataset], total: dataset.price },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-slate-300 hover:text-white"
          onClick={() => navigate("/marketplace")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>

        {/* Main Dataset Info */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className="mb-3 bg-blue-600">{dataset.domain}</Badge>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {dataset.name}
                </h1>
                <p className="text-slate-400 text-lg">
                  {dataset.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-sm mb-1">Price per Unit</div>
                <div className="text-4xl font-bold text-white">
                  ${dataset.price.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4 pb-8 border-b border-slate-700">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-2">Quality Score</div>
                <div className="text-white text-2xl font-bold">
                  {dataset.qualityScore}%
                </div>
                <div className="text-green-400 text-xs mt-2">
                  ✓ HIPAA Verified
                </div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-2">Delta-Gain</div>
                <div className="text-white text-2xl font-bold">
                  +{dataset.deltaGain.toFixed(2)}%
                </div>
                <div className="text-blue-400 text-xs mt-2">
                  vs GPT-4 baseline
                </div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-2">Data Points</div>
                <div className="text-white text-2xl font-bold">
                  {(dataset.dataCount / 1000).toFixed(0)}K
                </div>
                <div className="text-slate-400 text-xs mt-2">
                  Patient records
                </div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm mb-2">Available</div>
                <div className="text-white text-2xl font-bold">
                  {dataset.availability}
                </div>
                <div className="text-slate-400 text-xs mt-2">Units in stock</div>
              </div>
            </div>

            {/* Attribution & Provenance */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Provenance & Attribution
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Creator */}
                <div className="bg-gradient-to-br from-blue-900/30 to-slate-700/50 p-6 rounded-lg border border-blue-700/50">
                  <div className="text-slate-400 text-sm mb-2">Creator</div>
                  <div className="text-white font-semibold mb-1">
                    {dataset.creator}
                  </div>
                  <p className="text-slate-400 text-xs mb-4">
                    Created on {dataset.createdAt}
                  </p>
                  <div className="space-y-2 mb-4 pb-4 border-b border-slate-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Revenue Share:</span>
                      <span className="text-white font-semibold">40%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Base ($2,500 sale):</span>
                      <span className="text-green-400 font-semibold">
                        $1,000
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-blue-600">
                    Credential #{dataset.credentialId}
                  </Badge>
                </div>

                {/* Supervisor */}
                <div className="bg-gradient-to-br from-green-900/30 to-slate-700/50 p-6 rounded-lg border border-green-700/50">
                  <div className="text-slate-400 text-sm mb-2">Supervisor</div>
                  <div className="text-white font-semibold mb-1">
                    {dataset.supervisor}
                  </div>
                  <p className="text-slate-400 text-xs mb-4">
                    {dataset.reviewerCount} reviewers in network
                  </p>
                  <div className="space-y-2 mb-4 pb-4 border-b border-slate-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Revenue Share:</span>
                      <span className="text-white font-semibold">10%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Base ($2,500 sale):</span>
                      <span className="text-green-400 font-semibold">$250</span>
                    </div>
                  </div>
                  <Badge className="bg-green-600">
                    Credential #{dataset.supervisorCredentialId}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Details Tabs */}
        <Tabs defaultValue="compliance" className="mb-6">
          <TabsList className="bg-slate-800 border-b border-slate-700 w-full justify-start rounded-none">
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="provenance">Provenance</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="bg-slate-800 p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-500" />
              Regulatory Compliance
            </h3>
            <div className="space-y-3">
              {dataset.complianceStandards.map((standard) => (
                <div
                  key={standard}
                  className="flex items-center p-3 bg-green-900/20 border border-green-700/50 rounded"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-white">{standard}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-300 font-semibold mb-1">
                    Verified Compliance
                  </h4>
                  <p className="text-blue-200 text-sm">
                    This dataset has been audited by independent compliance
                    experts and is approved for use in regulated environments.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Provenance Tab */}
          <TabsContent value="provenance" className="bg-slate-800 p-6">
            <h3 className="text-white font-semibold mb-4">On-Chain Provenance</h3>

            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded border-l-4 border-blue-500">
                <div className="text-slate-400 text-sm mb-1">Data Hash (IPFS)</div>
                <div className="text-white font-mono text-sm break-all">
                  QmXx7aBv7D8J9k3N4mP5q6r7sT8u9vW0xY1z2aBc3DeF4
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded border-l-4 border-green-500">
                <div className="text-slate-400 text-sm mb-1">Creator Address</div>
                <div className="text-white font-mono text-sm">
                  0x{dataset.credentialId.toString().padStart(40, "0")}
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded border-l-4 border-purple-500">
                <div className="text-slate-400 text-sm mb-1">
                  Supervisor Address
                </div>
                <div className="text-white font-mono text-sm">
                  0x{dataset.supervisorCredentialId.toString().padStart(40, "0")}
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded border-l-4 border-yellow-500">
                <div className="text-slate-400 text-sm mb-1">
                  Transaction History
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    /* Link to etherscan */
                  }}
                >
                  View on Etherscan
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="bg-slate-800 p-6">
            <h3 className="text-white font-semibold mb-4">Performance Metrics</h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-700/50 p-4 rounded">
                <div className="text-slate-400 text-sm mb-2">Accuracy</div>
                <div className="text-white text-2xl font-bold mb-2">94%</div>
                <div className="w-full bg-slate-600 rounded h-2">
                  <div className="bg-green-500 h-2 rounded w-[94%]" />
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded">
                <div className="text-slate-400 text-sm mb-2">Precision</div>
                <div className="text-white text-2xl font-bold mb-2">92%</div>
                <div className="w-full bg-slate-600 rounded h-2">
                  <div className="bg-blue-500 h-2 rounded w-[92%]" />
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded">
                <div className="text-slate-400 text-sm mb-2">Recall</div>
                <div className="text-white text-2xl font-bold mb-2">88%</div>
                <div className="w-full bg-slate-600 rounded h-2">
                  <div className="bg-purple-500 h-2 rounded w-[88%]" />
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded">
                <div className="text-slate-400 text-sm mb-2">F1 Score</div>
                <div className="text-white text-2xl font-bold mb-2">90%</div>
                <div className="w-full bg-slate-600 rounded h-2">
                  <div className="bg-yellow-500 h-2 rounded w-[90%]" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleAddToCart}
          >
            <Zap className="mr-2 h-5 w-5" />
            Add to Cart - ${dataset.price.toLocaleString()}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={() => {
              /* Download preview */
            }}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
