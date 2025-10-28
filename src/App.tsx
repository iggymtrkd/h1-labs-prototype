import { useState, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { BaseAccountProvider, useBaseAccount } from "@/hooks/useBaseAccount";
import { XMTPProvider } from "@/contexts/XMTPContext";
import { Navigation } from "@/components/Navigation";
import { PlatformSidebar } from "@/components/PlatformSidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { EditorAdminLogin } from "@/components/EditorAdminLogin";
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
import FAQ from "./pages/FAQ";
import DatasetMarketplace from "./pages/DatasetMarketplace";
import DatasetDetails from "./pages/DatasetDetails";
import CheckoutCart from "./pages/CheckoutCart";
import Prototype from "./pages/Prototype";
import GetStarted from "./pages/GetStarted";
import MedAtlas from "./pages/MedAtlas";
import MedTagger from "./pages/MedTagger";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isGetStartedPage = location.pathname === "/get-started";
  const isPrototypePage = location.pathname === "/prototype";
  const { isConnected, address, labsBalance, connectWallet } = useBaseAccount();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  // Navigate to choice page when wallet successfully connects from home page
  useEffect(() => {
    const wasConnecting = sessionStorage.getItem('wallet_connecting');
    console.log('[App] useEffect triggered', { 
      isConnected, 
      wasConnecting,
      pathname: location.pathname 
    });
    
    if (isConnected && wasConnecting === 'true' && location.pathname === '/') {
      console.log('[App] ✅ Wallet connected successfully, navigating to /get-started');
      sessionStorage.removeItem('wallet_connecting');
      navigate("/get-started");
    } else if (!isConnected && wasConnecting === 'true') {
      console.log('[App] ❌ Wallet connection failed, staying on home page');
      sessionStorage.removeItem('wallet_connecting');
    }
  }, [isConnected, location.pathname, navigate]);

  const handleConnectWallet = async () => {
    console.log('[App] handleConnectWallet called');
    sessionStorage.setItem('wallet_connecting', 'true');
    try {
      await connectWallet();
      console.log('[App] connectWallet completed');
    } catch (error) {
      console.error('[App] ❌ connectWallet failed:', error);
      sessionStorage.removeItem('wallet_connecting');
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
        onHowItWorksClick={() => {
          setShowHowItWorks(true);
          if (!isHomePage) {
            navigate('/');
          }
        }}
      />

      {/* Platform sidebar (desktop only, when connected and not on home/choice/prototype page) */}
      {isConnected && !isHomePage && !isGetStartedPage && !isPrototypePage && (
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
        isConnected && !isHomePage && !isGetStartedPage && !isPrototypePage
          ? `mb-20 md:mb-0 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}` 
          : ""
      }`}>
        <Routes>
          <Route path="/" element={<Home onConnect={handleConnectWallet} showHowItWorksDialog={showHowItWorks} onDialogClose={() => setShowHowItWorks(false)} />} />
          <Route 
            path="/get-started" 
            element={isConnected ? <GetStarted /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route path="/dashboard" element={<Dashboard />} />
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
          <Route path="/faq" element={<FAQ onConnect={handleConnectWallet} />} />
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
          {/* Dataset Marketplace Routes */}
          <Route
            path="/marketplace"
            element={isConnected ? <DatasetMarketplace /> : <Home onConnect={handleConnectWallet} />}
          />
          <Route
            path="/dataset/:id"
            element={isConnected ? <DatasetDetails /> : <Home onConnect={handleConnectWallet} />}
          />
          <Route
            path="/checkout"
            element={isConnected ? <CheckoutCart /> : <Home onConnect={handleConnectWallet} />}
          />
          <Route 
            path="/prototype" 
            element={isConnected ? <Prototype /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route 
            path="/medatlas" 
            element={isConnected ? <MedAtlas /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route 
            path="/medtag" 
            element={isConnected ? <MedTagger /> : <Home onConnect={handleConnectWallet} />} 
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/upcoming-features" element={<UpcomingFeatures />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Mobile bottom navigation (when connected and not on home/choice/prototype page) */}
      {isConnected && !isHomePage && !isGetStartedPage && !isPrototypePage && <MobileBottomNav />}
      
      {/* Editor admin login (development only) */}
      <EditorAdminLogin />
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BaseAccountProvider>
          <XMTPProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </XMTPProvider>
        </BaseAccountProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
