import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Target } from "lucide-react";

const Optimizer = () => {
  const campaigns = [
    {
      name: "Summer Sale Campaign",
      status: "action-needed",
      spend: "$2,450",
      roas: "3.2x",
      issues: 2,
      opportunities: 3,
      health: 65
    },
    {
      name: "Product Launch Ads", 
      status: "optimized",
      spend: "$1,890",
      roas: "5.8x",
      issues: 0,
      opportunities: 1,
      health: 92
    },
    {
      name: "Retargeting Campaign",
      status: "review",
      spend: "$890",
      roas: "4.1x", 
      issues: 1,
      opportunities: 2,
      health: 78
    }
  ];

  const optimizations = [
    {
      type: "critical",
      title: "High Cost Per Result Detected",
      campaign: "Summer Sale Campaign",
      description: "Your cost per conversion increased 45% this week. Consider pausing underperforming ad sets.",
      impact: "Save $200-300/day",
      action: "Pause 3 ad sets"
    },
    {
      type: "opportunity", 
      title: "Audience Expansion Opportunity",
      campaign: "Product Launch Ads",
      description: "Similar audiences are showing 35% better ROAS. Expand to lookalike audiences.",
      impact: "Increase ROAS by 1.2x",
      action: "Create lookalike"
    },
    {
      type: "warning",
      title: "Budget Redistribution Needed",
      campaign: "Retargeting Campaign", 
      description: "Mobile placements are outperforming desktop 3:1. Reallocate budget accordingly.",
      impact: "Improve efficiency 25%",
      action: "Adjust budgets"
    },
    {
      type: "success",
      title: "Perfect Timing Detected",
      campaign: "Summer Sale Campaign",
      description: "Your ads perform best between 7-9 PM. Consider dayparting optimization.",
      impact: "Boost CTR by 18%",
      action: "Set schedule"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "action-needed": return "destructive";
      case "optimized": return "success";
      case "review": return "warning";
      default: return "secondary";
    }
  };

  const getOptimizationIcon = (type: string) => {
    switch (type) {
      case "critical": return AlertTriangle;
      case "opportunity": return Target;
      case "warning": return RefreshCw;
      case "success": return CheckCircle;
      default: return BarChart3;
    }
  };

  const getOptimizationColor = (type: string) => {
    switch (type) {
      case "critical": return "destructive";
      case "opportunity": return "primary"; 
      case "warning": return "warning";
      case "success": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaign Optimizer</h1>
          <p className="text-muted-foreground">AI-powered insights to improve your ad performance</p>
        </div>
        <Button className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300">
          <RefreshCw className="mr-2 h-4 w-4" />
          Analyze All Campaigns
        </Button>
      </div>

      {/* Campaign Health Overview */}
      <Card className="hover:shadow-custom-md transition-all duration-300">
        <CardHeader>
          <CardTitle>Campaign Health Overview</CardTitle>
          <CardDescription>Track the performance health of your active campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <Badge variant={getStatusColor(campaign.status) === "success" ? "success" : getStatusColor(campaign.status) === "warning" ? "warning" : "destructive"}>
                      {campaign.status === "action-needed" && "Action Needed"}
                      {campaign.status === "optimized" && "Optimized"}
                      {campaign.status === "review" && "Review"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <span>Spend: {campaign.spend}</span>
                    <span>ROAS: {campaign.roas}</span>
                    <span>{campaign.issues} issues • {campaign.opportunities} opportunities</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Health Score</div>
                    <div className="text-2xl font-bold">{campaign.health}%</div>
                  </div>
                  <div className="w-16">
                    <Progress value={campaign.health} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Optimization Insights */}
      <Card className="hover:shadow-custom-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            AI Optimization Insights
          </CardTitle>
          <CardDescription>
            Actionable recommendations to improve your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizations.map((opt, index) => {
              const Icon = getOptimizationIcon(opt.type);
              return (
                <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full bg-${getOptimizationColor(opt.type)}-muted`}>
                        <Icon className={`h-4 w-4 text-${getOptimizationColor(opt.type)}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{opt.title}</h4>
                        <p className="text-sm text-muted-foreground">{opt.campaign}</p>
                      </div>
                    </div>
                    <Badge variant={getOptimizationColor(opt.type) === "success" ? "success" : getOptimizationColor(opt.type) === "warning" ? "warning" : "destructive"} className="text-xs">
                      {opt.impact}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{opt.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Recommended Action:</span>
                      <span className="ml-1 text-muted-foreground">{opt.action}</span>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      Apply Fix
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Optimization Impact</CardTitle>
            <CardDescription>Results from applied optimizations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Average ROAS Improvement</span>
              <span className="font-bold text-success">+23%</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Cost Reduction</span>
              <span className="font-bold text-success">-18%</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">CTR Improvement</span>
              <span className="font-bold text-success">+31%</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Conversion Rate</span>
              <span className="font-bold text-success">+15%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Best Performing Segments</CardTitle>
            <CardDescription>Top audience and placement insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mobile News Feed</span>
                <span className="font-medium">ROAS: 5.8x</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Instagram Stories</span>
                <span className="font-medium">ROAS: 4.2x</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Facebook Video</span>
                <span className="font-medium">ROAS: 3.9x</span>
              </div>
              <Progress value={61} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Desktop Right Column</span>
                <span className="font-medium">ROAS: 2.1x</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Optimizer;