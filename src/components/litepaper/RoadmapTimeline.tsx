import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const roadmapPhases = [
  {
    phase: "Prototype",
    status: "completed",
    milestones: [
      "Testnet diamond deployment",
      "UI demo with wallet connection",
      "LABS token set",
      "createLab function",
      "Auto-vault deployment",
      "Deposits & redemptions"
    ],
  },
  {
    phase: "MVP",
    status: "in-progress",
    milestones: [
      "Provenance tracking system",
      "Revenue flow implementation",
      "Credential gating",
      "RevenueFacet splits",
      "Initial SDK hooks",
      "Dataset bundle creation"
    ],
  },
  {
    phase: "Post-MVP",
    status: "planned",
    milestones: [
      "DAO governance launch",
      "Compliance facet upgrades",
      "Credit mode implementation",
      "Explorer & analytics dashboard",
      "Advanced SDK features",
      "Multi-chain expansion"
    ],
  },
];

export default function RoadmapTimeline() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/20 text-green-500";
      case "in-progress":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Development Roadmap</h3>
      <Card className="p-6 bg-gradient-card border-border">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-8">
            {roadmapPhases.map((phase, index) => (
              <div key={phase.phase} className="relative">
                {/* Status indicator */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 relative z-10 bg-background">
                    {getStatusIcon(phase.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-bold">{phase.phase}</h4>
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status.replace("-", " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.milestones.map((milestone, mIndex) => (
                        <div 
                          key={mIndex}
                          className="flex items-start gap-2 p-3 rounded-lg border border-border bg-background/50"
                        >
                          <div className="mt-0.5">
                            {phase.status === "completed" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm">{milestone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
