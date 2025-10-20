import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Scale, Building2, DollarSign } from "lucide-react";

const domains = [
  {
    domain: "Healthcare",
    icon: Shield,
    standards: "HIPAA, GDPR, EU AI Act",
    enforcement: "De-identification required; audit logs immutable; credentialed clinicians only",
    color: "text-primary",
  },
  {
    domain: "Legal",
    icon: Scale,
    standards: "Attorney-Client Privilege, Data Residency",
    enforcement: "Whitelisted lawyer credentials; encrypted case files; regional constraints",
    color: "text-secondary",
  },
  {
    domain: "Defense",
    icon: Shield,
    standards: "ITAR, EAR, CMMC",
    enforcement: "Identity gating; zero-knowledge access; on-prem mirrors",
    color: "text-accent",
  },
  {
    domain: "Finance",
    icon: DollarSign,
    standards: "AML/KYC, Basel III, MiFID II",
    enforcement: "Onchain identity linking; transaction screening; audit trails",
    color: "text-primary",
  },
];

export default function ComplianceCards() {
  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Compliance-as-Code Framework</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {domains.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-6 bg-gradient-card border-border hover:border-primary/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20`}>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h4 className="text-lg font-bold">{item.domain}</h4>
                </div>

                <div className="space-y-2">
                  <div>
                    <Badge variant="outline" className="mb-2">Standards</Badge>
                    <p className="text-sm font-medium text-muted-foreground">{item.standards}</p>
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">Enforcement</Badge>
                    <p className="text-sm text-muted-foreground">{item.enforcement}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
