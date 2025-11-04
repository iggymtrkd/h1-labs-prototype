import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Check if we're in an iframe (like Lovable preview)
const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};
import { BaseAccountProvider, useBaseAccount } from "@/hooks/useBaseAccount";
import { XMTPProvider } from "@/contexts/XMTPContext";
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
import FAQ from "./pages/FAQ";
import DatasetMarketplace from "./pages/DatasetMarketplace";
import DatasetDetails from "./pages/DatasetDetails";
import CheckoutCart from "./pages/CheckoutCart";
import Prototype from "./pages/Prototype";
import GetStarted from "./pages/GetStarted";
import MedVault from "./pages/MedVault";
import MedScribe from "./pages/MedScribe";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isGetStartedPage = location.pathname === "/get-started";
  const isPrototypePage = location.pathname === "/prototype";
  const isTrainingAppPage = ["/medvault", "/medscribe", "/marketplace"].includes(location.pathname);
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

  // Redirect to home if trying to access protected routes without connection
  // Skip this check if in iframe (Lovable preview) to allow navigation
  useEffect(() => {
    if (isInIframe()) {
      console.log('[App] Running in iframe, skipping route protection');
      return;
    }
    
    const protectedRoutes = ['/dashboard', '/staking', '/apps', '/profile', '/settings', '/lab'];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
    
    if (!isConnected && isProtectedRoute && !isHomePage && !isGetStartedPage) {
      console.log('[App] Redirecting to home - not connected on protected route');
      navigate('/');
    }
  }, [isConnected, location.pathname, navigate, isHomePage, isGetStartedPage]);

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
      {/* Top navigation */}
      {!isTrainingAppPage && (
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
      )}

      {/* Platform sidebar (desktop only, when connected and not on home/choice/prototype page) */}
      {isConnected && !isHomePage && !isGetStartedPage && !isPrototypePage && !isTrainingAppPage && (
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
        isConnected && !isHomePage && !isGetStartedPage && !isPrototypePage && !isTrainingAppPage
          ? `mb-20 md:mb-0 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}` 
          : ""
      }`}>
        <Routes>
          <Route path="/" element={<Home onConnect={handleConnectWallet} showHowItWorksDialog={showHowItWorks} onDialogClose={() => setShowHowItWorks(false)} />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staking" element={<Staking labsBalance={labsBalance} />} />
          <Route path="/apps" element={<AppStore />} />
          <Route path="/profile" element={<Profile address={address} labsBalance={labsBalance} />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/about" element={<About />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/faq" element={<FAQ onConnect={handleConnectWallet} />} />
          <Route path="/lab/:id" element={<LabDetail />} />
          <Route path="/lab/:id/chat" element={<LabChat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/deploy-pool" element={<DeployPool />} />
          <Route path="/marketplace" element={<DatasetMarketplace />} />
          <Route path="/dataset/:id" element={<DatasetDetails />} />
          <Route path="/checkout" element={<CheckoutCart />} />
          <Route path="/prototype" element={<Prototype />} />
          <Route path="/medvault" element={<MedVault />} />
          <Route path="/medscribe" element={<MedScribe />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/upcoming-features" element={<UpcomingFeatures />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Mobile bottom navigation (when connected and not on home/choice/prototype page) */}
      {isConnected && !isHomePage && !isGetStartedPage && !isPrototypePage && !isTrainingAppPage && <MobileBottomNav />}
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
