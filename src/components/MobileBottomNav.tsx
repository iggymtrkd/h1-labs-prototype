import { Link, useLocation } from "react-router-dom";
import { Home, Rocket, Store, Info, BookOpen, User } from "lucide-react";

export const MobileBottomNav = () => {
  const location = useLocation();

  const links = [
    { name: "Marketplace", path: "/dashboard", icon: Home },
    { name: "Create Labs", path: "/staking", icon: Rocket },
    { name: "dApp Store", path: "/apps", icon: Store },
    { name: "About", path: "/about", icon: Info },
    { name: "Whitepaper", path: "/whitepaper", icon: BookOpen },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="grid grid-cols-6 gap-1 px-2 py-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all ${
                isActive(link.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium truncate w-full text-center">
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
