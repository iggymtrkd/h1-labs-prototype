import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function EditorAdminLogin() {
  const isEditorMode = localStorage.getItem('editor_admin_mode') === 'true';

  // Only show in development/editor environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname.includes('lovable.app') ||
                       window.location.hostname.includes('lovable.dev');

  if (!isDevelopment) return null;

  const handleSignIn = () => {
    localStorage.setItem('editor_admin_mode', 'true');
    toast.success('Signed in for editor access');
    window.location.reload();
  };

  const handleSignOut = () => {
    localStorage.removeItem('editor_admin_mode');
    toast.success('Signed out');
    window.location.reload();
  };

  if (isEditorMode) {
    return (
      <Button
        onClick={handleSignOut}
        variant="ghost"
        size="sm"
        className="fixed bottom-4 right-4 z-50 gap-2 bg-background/80 backdrop-blur-sm border"
      >
        <LogOut className="h-4 w-4" />
        Sign Out (Editor)
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      variant="default"
      size="sm"
      className="fixed bottom-4 right-4 z-50 gap-2"
    >
      <LogIn className="h-4 w-4" />
      Sign In (Editor)
    </Button>
  );
}
