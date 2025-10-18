import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

interface NavigationProps {
  onConnect: () => void;
  isConnected: boolean;
  address?: string;
  labsBalance?: string;
}

export const Navigation = ({ onConnect, isConnected, address, labsBalance }: NavigationProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Staking", path: "/staking" },
    { name: "App Store", path: "/apps" },
    { name: "Whitepaper", path: "/whitepaper" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="H1 Labs" className="h-8 w-auto" />
            <span className="text-xl font-bold glow-green">H1 Labs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center gap-4">
            {isConnected && labsBalance && (
              <div className="px-4 py-2 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">$LABS:</span>
                <span className="ml-2 font-bold text-primary">{labsBalance}</span>
              </div>
            )}
            {isConnected && address ? (
              <Link to="/profile">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Wallet className="mr-2 h-4 w-4" />
                  {address.slice(0, 6)}...{address.slice(-4)}
                </Button>
              </Link>
            ) : (
              <Button onClick={onConnect} className="bg-gradient-primary border-0 hover:opacity-90">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 px-4">
              {isConnected && labsBalance && (
                <div className="mb-3 px-4 py-2 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">$LABS:</span>
                  <span className="ml-2 font-bold text-primary">{labsBalance}</span>
                </div>
              )}
              {isConnected && address ? (
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-primary text-primary">
                    <Wallet className="mr-2 h-4 w-4" />
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </Button>
                </Link>
              ) : (
                <Button onClick={onConnect} className="w-full bg-gradient-primary border-0">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
