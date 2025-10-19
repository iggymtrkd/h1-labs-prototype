import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { BaseAccountProvider, useBaseAccount } from "@/hooks/useBaseAccount";
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
import LabChat from "./pages/LabChat";
import Settings from "./pages/Settings";
import DeployPool from "./pages/DeployPool";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { isConnected, address, labsBalance, setConnected } = useBaseAccount();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const handleConnectWallet = async () => {
    try {
      const { createBaseAccountSDK } = await import('@base-org/account');
      const sdk = createBaseAccountSDK({
        appName: 'H1 Labs',
        appLogoUrl: 'https://base.org/logo.png',
      });

      const provider = sdk.getProvider();
      await provider.request({ method: 'wallet_connect' });
      
      const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
      
      if (accounts && accounts.length > 0) {
        setConnected(accounts[0]);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
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
        showOnHomePage={isHomePage}
      />

      {/* Platform sidebar (desktop only, when connected and not on home page) */}
      {isConnected && !isHomePage && (
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
        isConnected && !isHomePage
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
          <Route path="/lab/:id/chat" element={<LabChat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/deploy-pool" element={<DeployPool />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Mobile bottom navigation (when connected and not on home page) */}
      {isConnected && !isHomePage && <MobileBottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BaseAccountProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </BaseAccountProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
