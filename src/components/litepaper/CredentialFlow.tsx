import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Search, Award, CheckCircle, DollarSign, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: FileCheck,
    title: "Apply",
    description: "Upload ID + Professional License",
    color: "text-primary",
  },
  {
    icon: Search,
    title: "Verify",
    description: "KYC-lite + Domain Validation",
    color: "text-secondary",
  },
  {
    icon: Award,
    title: "Mint Credential NFT",
    description: "Onchain Proof of Expertise",
    color: "text-accent",
  },
  {
    icon: CheckCircle,
    title: "Validate/Enrich Data",
    description: "Credentialed Access Only",
    color: "text-primary",
  },
  {
    icon: DollarSign,
    title: "Earn Rewards",
    description: "Build Reputation",
    color: "text-secondary",
  },
  {
    icon: RefreshCw,
    title: "Renew/Upgrade",
    description: "Periodic Refresh for Compliance",
    color: "text-accent",
  },
];

export default function CredentialFlow() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Credential Lifecycle</h3>
          <p className="text-sm text-muted-foreground">
            Verify professionals before they contribute to sensitive datasets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-border h-full hover:border-primary/50 transition-all">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <div className="absolute -top-2 -right-2">
                        <Badge variant="secondary" className="text-xs">
                          {idx + 1}
                        </Badge>
                      </div>
                      <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                        <Icon className={`h-8 w-8 ${step.color}`} />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold mb-1">{step.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
                
                {/* Arrow indicator for flow */}
                {idx < steps.length - 1 && idx % 3 !== 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="h-0.5 w-6 bg-primary/50"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Renewal Loop Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 text-accent">
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Credentials loop back to validation cycle</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
