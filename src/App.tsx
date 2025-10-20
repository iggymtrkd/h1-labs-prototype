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
import Mission from "./pages/Mission";
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
import UpcomingFeatures from "./pages/UpcomingFeatures";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { isConnected, address, labsBalance, connectWallet } = useBaseAccount();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleConnectWallet = async () => {
    await connectWallet();
    // Small delay to ensure state updates before navigation
    setTimeout(() => {
      navigate("/dashboard");
    }, 100);
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
        onHowItWorksClick={() => {
          setShowHowItWorks(true);
          if (!isHomePage) {
            navigate('/');
          }
        }}
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
          <Route path="/" element={<Home onConnect={handleConnectWallet} showHowItWorksDialog={showHowItWorks} onDialogClose={() => setShowHowItWorks(false)} />} />
          <Route 
            path="/dashboard" 
            element={isConnected ? <Dashboard /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route 
            path="/staking" 
            element={isConnected ? <Staking labsBalance={labsBalance} /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route 
            path="/apps" 
            element={isConnected ? <AppStore /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route
            path="/profile"
            element={isConnected ? <Profile address={address} labsBalance={labsBalance} /> : <Home onConnect={handleConnectWallet} />}
          />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/about" element={<About />} />
          <Route path="/mission" element={<Mission />} />
          <Route 
            path="/lab/:id" 
            element={isConnected ? <LabDetail /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route 
            path="/lab/:id/chat" 
            element={isConnected ? <LabChat /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route 
            path="/settings" 
            element={isConnected ? <Settings /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route 
            path="/deploy-pool" 
            element={isConnected ? <DeployPool /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/upcoming-features" element={<UpcomingFeatures />} />
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
