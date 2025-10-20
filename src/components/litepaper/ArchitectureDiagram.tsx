import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Box, Database, Package } from "lucide-react";

export default function ArchitectureDiagram() {
  return (
    <div className="my-8 space-y-4">
      {/* Diamond Proxy Layer */}
      <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="h-6 w-6 text-primary" />
          <h3 className="font-bold text-lg">Diamond Proxy Layer</h3>
        </div>
        <div className="pl-9">
          <p className="text-sm font-mono bg-background/50 p-3 rounded">
            H1Diamond.sol (EIP-2535)
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Singleton proxy routing to modular facets
          </p>
        </div>
      </Card>

      {/* Facets Layer */}
      <Card className="p-6 bg-gradient-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <Box className="h-6 w-6 text-secondary" />
          <h3 className="font-bold text-lg">Platform Facets</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            "DiamondCutFacet",
            "DiamondLoupeFacet",
            "OwnershipFacet",
            "SecurityFacet",
            "LABSCoreFacet",
            "VaultFacet",
            "BondingCurveFacet",
            "LabPassFacet",
            "RevenueFacet",
            "TreasuryFacet",
          ].map((facet, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="justify-center py-2 text-xs"
            >
              {facet}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Storage Layer */}
      <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/20 border-accent">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-6 w-6 text-accent" />
          <h3 className="font-bold text-lg">Diamond Storage</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold">LibDiamond.sol</p>
            <p className="text-xs text-muted-foreground">Core diamond storage</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">LibH1Storage.sol</p>
            <p className="text-xs text-muted-foreground">
              Labs mapping • nextLabId • labsToken • vault mappings
            </p>
          </div>
        </div>
      </Card>

      {/* Per-Lab Contracts */}
      <Card className="p-6 bg-gradient-to-br from-secondary/20 to-accent/20 border-secondary">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-6 w-6 text-secondary" />
          <h3 className="font-bold text-lg">Per-Lab Deployed Contracts</h3>
          <Badge variant="secondary">N Labs Isolated</Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-background/50">
            <p className="text-sm font-bold mb-1">LabVault.sol</p>
            <p className="text-xs text-muted-foreground">
              H1 Token (ERC20 + ERC4626)
            </p>
          </Card>
          <Card className="p-4 bg-background/50">
            <p className="text-sm font-bold mb-1">BondingCurveSale.sol</p>
            <p className="text-xs text-muted-foreground">
              Bootstrap capital raise
            </p>
          </Card>
          <Card className="p-4 bg-background/50">
            <p className="text-sm font-bold mb-1">LabPass.sol</p>
            <p className="text-xs text-muted-foreground">
              ERC721 Identity NFT
            </p>
          </Card>
        </div>
      </Card>
    </div>
  );
}
