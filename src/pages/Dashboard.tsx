import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Eye, MousePointer, Target, Users } from "lucide-react";
import { useFacebookIntegration } from "@/hooks/useFacebookIntegration";
import { useFacebookAds } from "@/hooks/useFacebookAds";

const Dashboard = () => {
  const { isConnected } = useFacebookIntegration();
  const { adAccounts, selectedAccount, setSelectedAccount, campaigns, insights, loading } = useFacebookAds();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Connect Facebook Ads</CardTitle>
            <CardDescription>
              Connect your Facebook Ads account to view campaign data and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Click "Connect Facebook" in the header to get started
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const summary = insights?.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your Facebook Ads performance</p>
        </div>
        
        {adAccounts.length > 0 && (
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select Ad Account" />
            </SelectTrigger>
            <SelectContent>
              {adAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Metrics Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.spend)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.impressions)}</div>
              <p className="text-xs text-muted-foreground">Total views</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.clicks)}</div>
              <p className="text-xs text-muted-foreground">{summary.ctr}% CTR</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reach</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.reach)}</div>
              <p className="text-xs text-muted-foreground">Unique users</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.roas}x</div>
              <p className="text-xs text-muted-foreground">Return on ad spend</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.purchases}</div>
              <p className="text-xs text-muted-foreground">{formatCurrency(summary.purchase_value)} value</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {insights?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle>Spend Over Time</CardTitle>
              <CardDescription>Daily ad spend for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={insights.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date_start" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Spend']} />
                  <Line type="monotone" dataKey="spend" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle>ROAS Over Time</CardTitle>
              <CardDescription>Return on ad spend trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={insights.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date_start" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}x`, 'ROAS']} />
                  <Bar dataKey="roas" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Campaigns Table */}
      {campaigns.length > 0 && (
        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Overview of your current ad campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const insight = campaign.insights?.data?.[0];
                return (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant={campaign.status === 'ACTIVE' ? 'success' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        <span>{campaign.objective}</span>
                      </div>
                    </div>
                    {insight && (
                      <div className="text-right space-y-1">
                        <div className="font-medium">{formatCurrency(Number(insight.spend))}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(Number(insight.impressions))} impressions
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;