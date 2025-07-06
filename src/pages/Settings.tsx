import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Link, Bell, Shield, CreditCard, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFacebookIntegration } from "@/hooks/useFacebookIntegration";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company_name: "",
    phone: ""
  });
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    weekly_reports: true,
    campaign_alerts: true
  });
  
  const { user, signOut } = useAuth();
  const { integration, isConnected, disconnectFacebook } = useFacebookIntegration();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          company_name: data.company_name || "",
          phone: data.phone || ""
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          company_name: profile.company_name,
          phone: profile.phone
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectFacebook = async () => {
    try {
      await disconnectFacebook();
      toast({
        title: "Facebook Disconnected",
        description: "Your Facebook account has been disconnected.",
      });
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect Facebook. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                  <Input 
                    id="first-name" 
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input 
                    id="last-name" 
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input 
                    id="company" 
                    value={profile.company_name}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <Button 
                onClick={updateProfile}
                disabled={loading}
                className="w-full bg-gradient-primary hover:shadow-custom-md transition-all duration-300"
              >
                {loading ? "Updating..." : "Save Changes"}
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
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, email_notifications: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                </div>
                <Switch 
                  checked={preferences.sms_notifications}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, sms_notifications: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekly Reports</h4>
                  <p className="text-sm text-muted-foreground">Get weekly performance summaries</p>
                </div>
                <Switch 
                  checked={preferences.weekly_reports}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, weekly_reports: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Campaign Alerts</h4>
                  <p className="text-sm text-muted-foreground">Get notified about campaign issues</p>
                </div>
                <Switch 
                  checked={preferences.campaign_alerts}
                  onCheckedChange={(checked) => 
                    setPreferences({ ...preferences, campaign_alerts: checked })
                  }
                />
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
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">f</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Facebook Ads</h4>
                      <p className="text-sm text-muted-foreground">
                        {isConnected ? `Connected as ${integration?.account_name}` : "Access your ad accounts and campaign data"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={isConnected ? "success" : "secondary"}>
                      {isConnected ? "Connected" : "Not Connected"}
                    </Badge>
                    {isConnected && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleDisconnectFacebook}
                      >
                        Disconnect
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="font-medium">Google Analytics</h4>
                      <p className="text-sm text-muted-foreground">Track website conversions and user behavior</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <h4 className="font-medium">Slack</h4>
                      <p className="text-sm text-muted-foreground">Get notifications about campaign performance</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
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

          {/* Account Actions */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <Trash2 className="mr-2 h-5 w-5" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start opacity-50" 
                disabled
              >
                Export Campaign Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start opacity-50"
                disabled
              >
                Download Reports
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                disabled
              >
                <Trash2 className="mr-2 h-4 w-4" />
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