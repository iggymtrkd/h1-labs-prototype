import { Link, useLocation } from "react-router-dom";
import { Home, Rocket, Store, BookOpen, Settings, User, ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

interface PlatformSidebarProps {
  address?: string;
  labsBalance?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const PlatformSidebar = ({ 
  address, 
  labsBalance, 
  collapsed = false, 
  onCollapsedChange 
}: PlatformSidebarProps) => {
  const location = useLocation();

  const mainLinks = [
    { name: "Marketplace", path: "/dashboard", icon: Home },
    { name: "Launchpad", path: "/staking", icon: Rocket },
    { name: "Deploy Pool", path: "/deploy-pool", icon: Droplets },
    { name: "dApp Store", path: "/apps", icon: Store },
    { name: "Whitepaper", path: "/whitepaper", icon: BookOpen },
  ];

  const bottomLinks = [
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 h-screen fixed left-0 top-0 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="H1 Labs" className="h-8 w-auto" />
            <span className="text-lg font-bold glow-green animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>H1 Labs</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="mx-auto">
            <img src={logo} alt="H1 Labs" className="h-8 w-auto" />
          </Link>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => onCollapsedChange?.(!collapsed)}
        className="flex items-center justify-center p-2 m-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      {/* Balance Display */}
      {!collapsed && labsBalance && (
        <div className="mx-4 mb-4 px-4 py-3 bg-gradient-card border border-border rounded-lg flex-shrink-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <p className="text-xs text-muted-foreground mb-1">Your Balance</p>
          <p className="text-lg font-bold text-primary">{labsBalance} $LABS</p>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(link.path)
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? link.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Fixed */}
      <div className="flex-shrink-0">
        {/* Bottom Navigation */}
        <div className="px-2 py-4 border-t border-border space-y-1">
          {bottomLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? link.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>{link.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* User Info at Bottom */}
        {!collapsed && address && (
          <div className="p-4 border-t border-border animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="truncate">{address.slice(0, 6)}...{address.slice(-4)}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
