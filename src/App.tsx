import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PlatformSidebar } from "@/components/PlatformSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Staking from "./pages/Staking";
import AppStore from "./pages/AppStore";
import Profile from "./pages/Profile";
import Whitepaper from "./pages/Whitepaper";
import About from "./pages/About";
import LabDetail from "./pages/LabDetail";
import Settings from "./pages/Settings";
import DeployPool from "./pages/DeployPool";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem("wallet_connected") === "true";
  });
  const [address, setAddress] = useState<string>(() => {
    return localStorage.getItem("wallet_address") || undefined;
  });
  const [labsBalance, setLabsBalance] = useState(() => {
    return localStorage.getItem("labs_balance") || "8,320";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const handleConnectWallet = async () => {
    try {
      // In production, this would use Coinbase SDK for Base wallet connection
      // For now, we'll simulate the connection
      const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
      const balance = "8,320";
      
      setAddress(mockAddress);
      setIsConnected(true);
      setLabsBalance(balance);
      
      // Persist to localStorage
      localStorage.setItem("wallet_connected", "true");
      localStorage.setItem("wallet_address", mockAddress);
      localStorage.setItem("labs_balance", balance);
      
      toast.success("Wallet Connected!", {
        description: `Connected to Base Sepolia testnet`,
      });

      // Use navigate instead of window.location
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet", {
        description: "Please try again",
      });
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Pre-login top navigation */}
      <Navigation
        onConnect={handleConnectWallet}
        isConnected={isConnected}
        address={address}
        labsBalance={labsBalance}
      />

      {/* Platform sidebar (desktop only, when connected) */}
      {isConnected && (
        <PlatformSidebar 
          address={address} 
          labsBalance={labsBalance}
          collapsed={sidebarCollapsed}
          onCollapsedChange={(collapsed) => {
            setSidebarCollapsed(collapsed);
            localStorage.setItem("sidebar_collapsed", collapsed.toString());
          }}
        />
      )}

      {/* Main content area */}
      <main className={`flex-1 transition-all duration-300 ${
        isConnected 
          ? `mb-20 md:mb-0 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}` 
          : ""
      }`}>
        <Routes>
          <Route path="/" element={<Home onConnect={handleConnectWallet} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staking" element={<Staking labsBalance={labsBalance} />} />
          <Route path="/apps" element={<AppStore />} />
          <Route
            path="/profile"
            element={<Profile address={address} labsBalance={labsBalance} />}
          />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/about" element={<About />} />
          <Route path="/lab/:id" element={<LabDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/deploy-pool" element={<DeployPool />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Mobile bottom navigation (when connected) */}
      {isConnected && <MobileBottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
