import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function DeployPool() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setError(null);
    setResult(null);

    try {
      console.log("Calling deploy-uniswap-pool function...");
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deploy-uniswap-pool`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Deployment failed");
      }

      console.log("Deployment successful:", data);
      setResult(data);
      
      toast({
        title: "✅ Pool Deployed Successfully!",
        description: "The Uniswap V3 pool has been created and liquidity added.",
      });
    } catch (err: any) {
      console.error("Deployment error:", err);
      setError(err.message || "An error occurred during deployment");
      
      toast({
        title: "❌ Deployment Failed",
        description: err.message || "Please check the console for details",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 glow-green">Deploy Uniswap Pool</h1>
          <p className="text-lg text-muted-foreground">
            Deploy the LABS/WETH Uniswap V3 pool on Base Sepolia testnet and add initial liquidity.
          </p>
        </div>

        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>Deployment Configuration</CardTitle>
            <CardDescription>
              This will create a Uniswap V3 pool with the following parameters:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Token Pair</p>
                <p className="font-semibold">LABS / WETH</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Fee Tier</p>
                <p className="font-semibold">0.3%</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Initial Price</p>
                <p className="font-semibold">1 ETH = 1000 LABS</p>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Initial Liquidity</p>
                <p className="font-semibold">1 ETH + 1000 LABS</p>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Requirements:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your wallet must have at least 1 ETH on Base Sepolia</li>
                  <li>Your wallet must have at least 1000 LABS tokens</li>
                  <li>The deployment uses your securely stored wallet private key</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full bg-gradient-primary text-lg py-6"
              size="lg"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Deploying Pool...
                </>
              ) : (
                "Deploy Pool & Add Liquidity"
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="bg-primary/10 border-primary">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-semibold text-primary">✅ Deployment Successful!</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pool Address:</span>
                        <span className="font-mono">{result.poolAddress.slice(0, 10)}...{result.poolAddress.slice(-8)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deployer:</span>
                        <span className="font-mono">{result.deployer.slice(0, 10)}...{result.deployer.slice(-8)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction:</span>
                        <a 
                          href={`https://sepolia.basescan.org/tx/${result.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-primary hover:underline flex items-center gap-1"
                        >
                          View on BaseScan
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Used:</span>
                        <span>{result.gasUsed}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => window.open(result.uniswapUrl, "_blank")}
                    >
                      View on Uniswap
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-muted">
          <CardHeader>
            <CardTitle className="text-lg">What happens during deployment?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li>Check if the LABS/WETH pool already exists on Uniswap V3</li>
              <li>If not, create a new pool with 0.3% fee tier</li>
              <li>Initialize the pool with the initial price (1 ETH = 1000 LABS)</li>
              <li>Approve LABS token for the Uniswap Position Manager</li>
              <li>Add initial liquidity (1 ETH + 1000 LABS) to the pool</li>
              <li>Receive an NFT position token representing your liquidity</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
