import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const competitors = [
  {
    name: "H1 Labs",
    focus: "Human-validated datasets",
    compliance: true,
    credentialing: true,
    provenance: true,
    revenueModel: "Onchain splits + buybacks",
    targetMarket: "Healthcare, Legal, Defense, Finance",
    valueDriver: "Real dataset sales",
    highlight: true,
  },
  {
    name: "Bittensor",
    focus: "Model training",
    compliance: false,
    credentialing: false,
    provenance: false,
    revenueModel: "Inflationary",
    targetMarket: "General AI",
    valueDriver: "Token inflation",
  },
  {
    name: "Scale AI",
    focus: "Centralized data",
    compliance: "Corporate",
    credentialing: "Manual",
    provenance: "Internal",
    revenueModel: "Fiat only",
    targetMarket: "Enterprise labeling",
    valueDriver: "Labor cost",
  },
  {
    name: "Ocean",
    focus: "Data liquidity",
    compliance: "Optional",
    credentialing: false,
    provenance: "Metadata only",
    revenueModel: "Stake-reward",
    targetMarket: "General data",
    valueDriver: "Access licensing",
  },
  {
    name: "Gensyn",
    focus: "Compute network",
    compliance: false,
    credentialing: false,
    provenance: false,
    revenueModel: "Stake-reward",
    targetMarket: "ML infrastructure",
    valueDriver: "Compute capacity",
  },
];

export default function CompetitiveComparison() {
  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Competitive Positioning</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.map((comp, idx) => (
          <Card
            key={idx}
            className={`p-6 ${
              comp.highlight
                ? "border-primary bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg"
                : "border-border bg-gradient-card"
            }`}
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold mb-1">{comp.name}</h4>
                {comp.highlight && (
                  <Badge className="bg-primary text-primary-foreground">Our Solution</Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Focus:</span>
                  <p className="font-medium">{comp.focus}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Compliance:</span>
                  {typeof comp.compliance === "boolean" ? (
                    comp.compliance ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )
                  ) : (
                    <span className="font-medium">{comp.compliance}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Credentialing:</span>
                  {typeof comp.credentialing === "boolean" ? (
                    comp.credentialing ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )
                  ) : (
                    <span className="font-medium">{comp.credentialing}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Provenance:</span>
                  {typeof comp.provenance === "boolean" ? (
                    comp.provenance ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )
                  ) : (
                    <span className="font-medium">{comp.provenance}</span>
                  )}
                </div>

                <div>
                  <span className="text-muted-foreground">Revenue:</span>
                  <p className="font-medium">{comp.revenueModel}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Market:</span>
                  <p className="font-medium text-xs">{comp.targetMarket}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Value:</span>
                  <p className="font-medium text-xs">{comp.valueDriver}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
