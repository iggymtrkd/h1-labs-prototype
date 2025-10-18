import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Staking from "./pages/Staking";
import AppStore from "./pages/AppStore";
import Profile from "./pages/Profile";
import Whitepaper from "./pages/Whitepaper";
import About from "./pages/About";
import LabDetail from "./pages/LabDetail";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>();
  const [labsBalance, setLabsBalance] = useState("8,320");

  const handleConnectWallet = async () => {
    try {
      // In production, this would use Coinbase SDK for Base wallet connection
      // For now, we'll simulate the connection
      const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
      setAddress(mockAddress);
      setIsConnected(true);
      setLabsBalance("8,320");
      
      toast.success("Wallet Connected!", {
        description: `Connected to Base Sepolia testnet`,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet", {
        description: "Please try again",
      });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation
              onConnect={handleConnectWallet}
              isConnected={isConnected}
              address={address}
              labsBalance={labsBalance}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/staking" element={<Staking />} />
              <Route path="/apps" element={<AppStore />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/about" element={<About />} />
              <Route path="/lab/:id" element={<LabDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
