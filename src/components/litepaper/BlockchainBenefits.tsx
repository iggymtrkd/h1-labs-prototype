import { Card } from "@/components/ui/card";
import { FileCheck, Shield, Lock, DollarSign, AlertTriangle } from "lucide-react";

const benefits = [
  {
    challenge: "Data Provenance",
    icon: FileCheck,
    benefit: "Immutable audit trail",
    implementation: "ProvenanceFacet logs enrichment, validators, timestamps",
    result: "Regulators can verify dataset lineage",
    color: "text-primary",
  },
  {
    challenge: "Validator Integrity",
    icon: Shield,
    benefit: "Cryptographic proof of contribution",
    implementation: "Credentials NFT + onchain records",
    result: "Enterprise clients trust who validated data",
    color: "text-secondary",
  },
  {
    challenge: "Compliance Enforcement",
    icon: Lock,
    benefit: "Programmable legal constraints",
    implementation: "ComplianceFacet binds HIPAA/GDPR/C2PA rules",
    result: "AI firms know data is legally compliant",
    color: "text-accent",
  },
  {
    challenge: "Transparent Economics",
    icon: DollarSign,
    benefit: "All payments recorded & verifiable",
    implementation: "RevenueFacet splits logged per dataset sale",
    result: "No opacity in revenue distribution",
    color: "text-primary",
  },
  {
    challenge: "Security & Trust",
    icon: AlertTriangle,
    benefit: "Prevents tampering & fraud",
    implementation: "Reentrancy guards, access control, audit logs",
    result: "Protected against data theft & spoofing",
    color: "text-destructive",
  },
];

export default function BlockchainBenefits() {
  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Why Blockchain Matters for H1</h3>
      <div className="grid grid-cols-1 gap-4">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-6 bg-gradient-card border-border hover:border-primary/50 transition-all">
              <div className="grid md:grid-cols-5 gap-4 items-center">
                <div className="flex items-center gap-3 md:col-span-1">
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h4 className="font-bold text-sm">{item.challenge}</h4>
                </div>

                <div className="md:col-span-1">
                  <p className="text-xs text-muted-foreground mb-1">Blockchain Benefit</p>
                  <p className="text-sm font-medium">{item.benefit}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">H1 Implementation</p>
                  <p className="text-sm">{item.implementation}</p>
                </div>

                <div className="md:col-span-1">
                  <p className="text-xs text-muted-foreground mb-1">Result</p>
                  <p className="text-sm font-medium text-primary">{item.result}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
