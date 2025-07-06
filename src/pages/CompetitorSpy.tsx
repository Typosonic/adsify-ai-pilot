import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Eye, TrendingUp, Target, Lightbulb, DollarSign, Users, BarChart3 } from "lucide-react";
import { useCompetitorSpy } from "@/hooks/useCompetitorSpy";
import { useToast } from "@/hooks/use-toast";

const CompetitorSpy = () => {
  const [competitorName, setCompetitorName] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const { analyses, loading, analyzeCompetitor, getAnalyses } = useCompetitorSpy();
  const { toast } = useToast();

  useEffect(() => {
    getAnalyses();
  }, []);

  const handleAnalyze = async () => {
    if (!competitorName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a competitor name",
        variant: "destructive",
      });
      return;
    }

    try {
      await analyzeCompetitor(competitorName, competitorUrl);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${competitorName}'s advertising strategy`,
      });
      setCompetitorName("");
      setCompetitorUrl("");
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze competitor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Competitor Spy Tool</h1>
        <p className="text-muted-foreground">Analyze competitor ads and get strategic insights</p>
      </div>

      {/* Search Section */}
      <Card className="hover:shadow-custom-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5 text-primary" />
            Competitor Analysis
          </CardTitle>
          <CardDescription>
            Analyze competitor advertising strategies with AI insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="competitor-name">Competitor Name</Label>
              <Input 
                id="competitor-name"
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                placeholder="e.g., Nike, Apple, Competitor Inc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="competitor-url">Website (Optional)</Label>
              <Input 
                id="competitor-url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="https://competitor.com"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-gradient-primary hover:shadow-custom-md transition-all duration-300"
          >
            {loading ? (
              <>
                <Search className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Competitor...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Competitor
              </>
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>• AI-powered competitive intelligence</p>
            <p>• Ad strategy analysis and insights</p>
            <p>• Actionable recommendations for your campaigns</p>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analyses.length === 0 ? (
        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardContent className="p-12">
            <div className="text-center">
              <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Spy on Competitors?</h3>
              <p className="text-muted-foreground">
                Enter a competitor's name above to analyze their advertising strategies with AI
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="space-y-6">
              {/* Analysis Header */}
              <Card className="hover:shadow-custom-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{analysis.competitor_name} Analysis</span>
                    <Badge variant="secondary">
                      {new Date(analysis.scraped_at).toLocaleDateString()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    AI-powered competitive intelligence report
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{analysis.ad_data.length}</div>
                      <div className="text-sm text-muted-foreground">Ads Found</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-success">
                        {formatCurrency(analysis.ad_data.reduce((sum, ad) => sum + ad.estimated_budget, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Est. Budget</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-warning">
                        {formatNumber(analysis.ad_data.reduce((sum, ad) => sum + ad.estimated_reach, 0))}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Reach</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {(analysis.ad_data.reduce((sum, ad) => sum + ad.engagement_rate, 0) / analysis.ad_data.length).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Engagement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ad Data */}
              <div className="grid grid-cols-1 gap-4">
                {analysis.ad_data.map((ad, index) => (
                  <Card key={index} className="hover:shadow-custom-md transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                          {ad.platform} Ad
                        </CardTitle>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">{formatCurrency(ad.estimated_budget)}</div>
                            <div className="text-xs text-muted-foreground">Budget</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{ad.engagement_rate}%</div>
                            <div className="text-xs text-muted-foreground">Engagement</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{formatNumber(ad.estimated_reach)}</div>
                            <div className="text-xs text-muted-foreground">Reach</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg space-y-3">
                        <div>
                          <h4 className="font-semibold text-primary mb-1">Headline:</h4>
                          <p className="font-medium">{ad.headline}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-1">Ad Text:</h4>
                          <p className="text-muted-foreground">{ad.ad_text}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-1">Call to Action:</h4>
                          <Badge variant="outline">{ad.cta}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AI Insights */}
              <Card className="hover:shadow-custom-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                    AI Strategic Insights
                  </CardTitle>
                  <CardDescription>
                    Competitive intelligence analysis for {analysis.competitor_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-primary bg-primary/5">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Target className="mr-2 h-4 w-4" />
                          Messaging Strategy
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {analysis.insights.messaging_strategy}
                        </p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-success bg-success/5">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Budget Insights
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {analysis.insights.budget_insights}
                        </p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-warning bg-warning/5">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          Targeting Approach
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {analysis.insights.targeting_approach}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">Creative Themes</h4>
                        <div className="space-y-2">
                          {analysis.insights.creative_themes.map((theme, idx) => (
                            <div key={idx} className="flex items-center p-2 bg-muted rounded">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              <span className="text-sm">{theme}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Opportunities</h4>
                        <div className="space-y-2">
                          {analysis.insights.opportunities.map((opportunity, idx) => (
                            <div key={idx} className="flex items-center p-2 bg-success/10 rounded">
                              <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
                              <span className="text-sm">{opportunity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Counter Strategies</h4>
                        <div className="space-y-2">
                          {analysis.insights.counter_strategies.map((strategy, idx) => (
                            <div key={idx} className="flex items-center p-2 bg-primary/10 rounded">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              <span className="text-sm">{strategy}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Overall Assessment</h4>
                    <p className="text-sm text-muted-foreground">
                      {analysis.insights.overall_assessment}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetitorSpy;