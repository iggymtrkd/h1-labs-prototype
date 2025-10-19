import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, Bell, LogOut, Shield, Moon, Sun, 
  Mail, MessageSquare, TrendingUp, ExternalLink 
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [tradeAlerts, setTradeAlerts] = useState(false);
  const [validationAlerts, setValidationAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const connectedAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  const network = "Base Sepolia Testnet";

  const handleDisconnect = () => {
    toast.success("Wallet disconnected", {
      description: "You have been logged out",
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleSaveNotifications = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen pt-8 md:pt-12 pb-12 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 glow-green">Settings</h1>
          <p className="text-xl text-muted-foreground">
            Manage your account preferences and connection
          </p>
        </div>

        {/* Wallet Connection */}
        <Card className="p-6 mb-6 bg-gradient-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Wallet Connection</h2>
              <p className="text-sm text-muted-foreground">Manage your connected wallet</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Connected Address</p>
                <Badge className="bg-primary/20 text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg">{connectedAddress}</p>
                <a 
                  href={`https://sepolia.basescan.org/address/${connectedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-glow"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Network</p>
              <p className="font-semibold">{network}</p>
            </div>

            <Button
              onClick={handleDisconnect}
              variant="destructive"
              className="w-full h-12"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Disconnect Wallet & Log Out
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 mb-6 bg-gradient-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Bell className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Choose what alerts you want to receive</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* General Notifications */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                General Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>
            </div>

            {/* Activity Alerts */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-secondary" />
                Activity Alerts
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Trade Confirmations</p>
                    <p className="text-sm text-muted-foreground">Get notified when trades execute</p>
                  </div>
                  <Switch
                    checked={tradeAlerts}
                    onCheckedChange={setTradeAlerts}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Validation Updates</p>
                    <p className="text-sm text-muted-foreground">Dataset validation status changes</p>
                  </div>
                  <Switch
                    checked={validationAlerts}
                    onCheckedChange={setValidationAlerts}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Lab token price movements</p>
                  </div>
                  <Switch
                    checked={priceAlerts}
                    onCheckedChange={setPriceAlerts}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveNotifications}
              className="w-full h-12 bg-gradient-primary"
            >
              Save Notification Settings
            </Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize your interface</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-secondary" />
              )}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Currently: {darkMode ? "Dark" : "Light"}</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
