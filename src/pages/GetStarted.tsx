import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Beaker, LayoutDashboard } from 'lucide-react';

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary font-mono">Welcome to H1 Labs</h1>
          <p className="text-muted-foreground text-lg">Choose your path to explore the protocol</p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Prototype Option */}
          <Card className="p-8 bg-gradient-card border-primary/20 hover:border-primary/40 transition-all cursor-pointer group" onClick={() => navigate('/prototype')}>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Beaker className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Prototype</h2>
                <p className="text-muted-foreground">
                  Simple test of onchain flow
                </p>
              </div>
              <Button className="w-full" variant="outline">
                Go to Prototype
              </Button>
            </div>
          </Card>

          {/* Dashboard Option */}
          <Card className="p-8 bg-gradient-card border-secondary/20 hover:border-secondary/40 transition-all cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">H1 Dashboard</h2>
                <p className="text-muted-foreground">
                  Incomplete version of future H1 platform, great to understand the H1 vision will come true
                </p>
              </div>
              <Button className="w-full" variant="outline">
                Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
