import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

const Dashboard = () => {
  // Mock data for demonstration
  const metrics = [
    {
      title: "Total Spend",
      value: "$12,450",
      change: "+12.5%",
      trending: "up",
      icon: DollarSign,
      color: "primary"
    },
    {
      title: "Impressions",
      value: "2.4M",
      change: "+8.2%",
      trending: "up", 
      icon: BarChart3,
      color: "success"
    },
    {
      title: "ROAS",
      value: "4.2x",
      change: "-2.1%",
      trending: "down",
      icon: TrendingUp,
      color: "warning"
    },
    {
      title: "Reach",
      value: "156K",
      change: "+15.3%",
      trending: "up",
      icon: Users,
      color: "success"
    }
  ];

  const campaigns = [
    {
      name: "Summer Sale Campaign",
      status: "Active",
      spend: "$2,450",
      roas: "5.2x",
      impressions: "450K",
      statusColor: "success"
    },
    {
      name: "Product Launch Ads",
      status: "Review Needed",
      spend: "$1,890",
      roas: "3.1x", 
      impressions: "320K",
      statusColor: "warning"
    },
    {
      name: "Retargeting Campaign",
      status: "Optimizing",
      spend: "$890",
      roas: "6.8x",
      impressions: "125K",
      statusColor: "primary"
    },
    {
      name: "Brand Awareness",
      status: "Paused",
      spend: "$0",
      roas: "2.9x",
      impressions: "89K", 
      statusColor: "destructive"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your Facebook ad performance</p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300">
          Create New Campaign
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-custom-md transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 text-${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                {metric.trending === "up" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={metric.trending === "up" ? "text-success" : "text-destructive"}>
                  {metric.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Spend vs ROAS trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart placeholder - Connect Facebook to see live data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Audience Insights</CardTitle>
            <CardDescription>Top performing demographics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Age 25-34</span>
                <span>68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Age 35-44</span>
                <span>24%</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Age 18-24</span>
                <span>8%</span>
              </div>
              <Progress value={8} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card className="hover:shadow-custom-md transition-all duration-300">
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Your latest Facebook ad campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-medium">{campaign.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant={campaign.statusColor === "success" ? "success" : campaign.statusColor === "warning" ? "warning" : "destructive"}>{campaign.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {campaign.impressions} impressions
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{campaign.spend}</div>
                  <div className="text-sm text-muted-foreground">ROAS: {campaign.roas}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;