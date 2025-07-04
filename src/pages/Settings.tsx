import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, User, Link, Bell, Shield, CreditCard } from "lucide-react";

const Settings = () => {
  const integrations = [
    {
      name: "Facebook Ads",
      status: "connected",
      description: "Access your ad accounts and campaign data",
      icon: "🔵"
    },
    {
      name: "Google Analytics",
      status: "disconnected", 
      description: "Track website conversions and user behavior",
      icon: "📊"
    },
    {
      name: "Slack",
      status: "disconnected",
      description: "Get notifications about campaign performance",
      icon: "💬"
    },
    {
      name: "Zapier",
      status: "disconnected",
      description: "Automate workflows with 3000+ apps",
      icon: "⚡"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Acme Inc." />
              </div>
              
              <Button className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Campaign Performance Alerts</h4>
                  <p className="text-sm text-muted-foreground">Get notified when ROAS drops below threshold</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Daily Performance Reports</h4>
                  <p className="text-sm text-muted-foreground">Receive daily campaign summaries via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Optimization Suggestions</h4>
                  <p className="text-sm text-muted-foreground">AI recommendations for improving campaigns</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Competitor Activity</h4>
                  <p className="text-sm text-muted-foreground">Alerts when competitors launch new ads</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Connected Integrations */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link className="mr-2 h-5 w-5 text-primary" />
                Integrations
              </CardTitle>
              <CardDescription>
                Connect your favorite tools and platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                        {integration.status === "connected" ? "Connected" : "Not Connected"}
                      </Badge>
                      <Button 
                        variant={integration.status === "connected" ? "outline" : "default"}
                        size="sm"
                      >
                        {integration.status === "connected" ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className="bg-success text-success-foreground mb-2">Pro Plan</Badge>
                <p className="text-sm text-muted-foreground">Your account is in good standing</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Campaigns Created</span>
                  <span className="font-medium">12 / 50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>API Calls Used</span>
                  <span className="font-medium">2.4K / 10K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Storage Used</span>
                  <span className="font-medium">1.2GB / 5GB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="font-semibold">Pro Plan - $99/month</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="font-semibold">August 15, 2024</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  View Billing History
                </Button>
                <Button variant="outline" className="w-full">
                  Change Plan
                </Button>
                <Button variant="outline" className="w-full">
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Export Campaign Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                API Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;