import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  FileStack,
  ShoppingCart,
} from "lucide-react";

export interface Dataset {
  id: string;
  name: string;
  description: string;
  domain: string;
  creator: string;
  supervisor: string;
  dataCount: number;
  qualityScore: number;
  deltaGain: number;
  price: number;
  availability: number;
  approved: boolean;
  createdAt: string;
  credentialId: number;
  supervisorCredentialId: number;
  tags: string[];
  reviewerCount: number;
  complianceStandards: string[];
  labId: number;
}

interface DatasetCardProps {
  dataset: Dataset;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function DatasetCard({
  dataset,
  isSelected,
  onToggle,
  onViewDetails,
}: DatasetCardProps) {
  return (
    <Card
      className={`bg-slate-800 border-slate-700 hover:border-blue-500 transition cursor-pointer overflow-hidden group ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onViewDetails(dataset.id)}
    >
      <div className="p-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white text-lg mb-1 group-hover:text-blue-400 transition">
              {dataset.name}
            </h3>
            <Badge variant="secondary" className="mb-2">
              {dataset.domain}
            </Badge>
          </div>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggle(dataset.id);
            }}
            className="w-5 h-5 rounded cursor-pointer"
          />
        </div>

        {/* File Stack Icon */}
        <FileStack className="absolute top-4 right-16 h-12 w-12 text-primary/20" />

        {/* Description */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {dataset.description}
        </p>

        {/* Compliance Tags */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {dataset.complianceStandards.slice(0, 2).map((std) => (
            <Badge
              key={std}
              variant="outline"
              className="text-xs bg-green-900/30 text-green-300 border-green-600"
            >
              {std}
            </Badge>
          ))}
          {dataset.complianceStandards.length > 2 && (
            <Badge variant="outline" className="text-xs text-slate-400">
              +{dataset.complianceStandards.length - 2}
            </Badge>
          )}
        </div>

        {/* Stats Row 1 */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-700">
          <div>
            <div className="text-slate-400 text-xs mb-1">Quality</div>
            <div className="flex items-center text-white font-semibold">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              {dataset.qualityScore}%
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Delta-Gain</div>
            <div className="flex items-center text-white font-semibold">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
              {dataset.deltaGain.toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Data Points</div>
            <div className="text-white font-semibold">
              {(dataset.dataCount / 1000).toFixed(0)}K
            </div>
          </div>
        </div>

        {/* Stats Row 2 */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-700">
          <div>
            <div className="text-slate-400 text-xs mb-1">Creator</div>
            <div className="text-white text-sm font-medium truncate">
              {dataset.creator.split(" ")[0]}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Reviewers</div>
            <div className="flex items-center text-white font-semibold">
              <Users className="h-4 w-4 mr-1" />
              {dataset.reviewerCount}
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-xs mb-1">Availability</div>
            <div className="text-white font-semibold">
              {dataset.availability}
            </div>
          </div>
        </div>

        {/* Footer: Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs mb-1">Price</div>
            <div className="text-white font-bold text-lg">
              ${dataset.price.toLocaleString()}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic here
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Buy now logic here
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && <div className="h-1 bg-blue-500" />}
    </Card>
  );
}
