import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export function EditorAdminLogin() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const isAdminMode = localStorage.getItem('editor_admin_mode') === 'true';

  // Only show in development/editor environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('lovable.app') ||
                       window.location.hostname.includes('lovable.dev');

  if (!isDevelopment) return null;

  const handleLogin = () => {
    // Simple password check for editor access
    if (password === 'admin123') {
      localStorage.setItem('editor_admin_mode', 'true');
      toast.success('Admin mode enabled');
      setOpen(false);
      window.location.reload();
    } else {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('editor_admin_mode');
    toast.success('Admin mode disabled');
    window.location.reload();
  };

  if (isAdminMode) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="gap-2"
        >
          <Shield className="h-4 w-4" />
          Exit Admin Mode
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 gap-2"
        >
          <Shield className="h-4 w-4" />
          Editor Admin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editor Admin Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Login as Admin
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Development only. Password: admin123
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
