import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Settings, 
  Calendar,
  Target
} from "lucide-react";

const Layout = () => {
  const { integration, isConnected, connectFacebook } = useFacebookIntegration();
  const { toast } = useToast();

  const handleConnectFacebook = async () => {
    try {
      await connectFacebook();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Facebook. Please try again.",
        variant: "destructive",
      });
    }
  };
  const navItems = [
    { to: "/", icon: BarChart3, label: "Dashboard" },
    { to: "/create", icon: Plus, label: "Create Campaign" },
    { to: "/optimizer", icon: BarChart3, label: "Optimizer" },
    { to: "/spy", icon: Search, label: "Competitor Spy" },
    { to: "/mvp", icon: Target, label: "MVP Checklist" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-custom-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Adsify
            </h1>
            <span className="text-sm text-muted-foreground">
              AI-powered Facebook Ads Platform
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
            </Button>
            <Button 
              className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300"
              onClick={handleConnectFacebook}
              disabled={isConnected}
            >
              {isConnected ? `Connected: ${integration?.account_name}` : 'Connect Facebook'}
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="flex space-x-1 px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-primary-muted text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
              end={item.to === "/"}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;