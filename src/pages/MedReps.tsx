import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import medRepsIcon from "@/assets/medreps-icon.png";

const MedReps = () => {
  const handleLaunchApp = () => {
    window.open("https://medreps.example.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <img 
              src={medRepsIcon} 
              alt="MedReps" 
              className="w-16 h-16 rounded-xl shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MedReps
              </h1>
              <p className="text-muted-foreground mt-1">
                Medical Sales Representative Platform
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-card rounded-xl shadow-lg p-8 border">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Connect with Healthcare Professionals</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  MedReps bridges the gap between medical sales representatives and healthcare providers,
                  facilitating efficient product demonstrations and relationship building.
                </p>
              </div>

              <Button 
                onClick={handleLaunchApp}
                size="lg"
                className="gap-2"
              >
                Launch MedReps <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {/* Features */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold">Network Building</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with key healthcare decision makers
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track engagement and sales performance
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-semibold">Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Manage appointments and follow-ups
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedReps;
