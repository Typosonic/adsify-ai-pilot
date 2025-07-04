import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, ExternalLink, Copy, TrendingUp, Target, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CompetitorSpy = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [searchUrl, setSearchUrl] = useState("");
  const { toast } = useToast();

  const mockCompetitorAds = [
    {
      id: 1,
      headline: "Transform Your Business in 30 Days",
      primaryText: "Join over 10,000 successful entrepreneurs who've scaled their business with our proven system. Get instant access to our step-by-step blueprint.",
      cta: "Get Started Free",
      running: "15 days",
      engagement: "High",
      aiAnalysis: {
        strengths: ["Strong social proof", "Clear time frame", "Free trial offer"],
        weaknesses: ["Generic messaging", "Lacks specific benefits"],
        improvements: ["Add specific metrics", "Include urgency", "Personalize for audience"]
      }
    },
    {
      id: 2,
      headline: "Stop Wasting Money on Ads That Don't Work",
      primaryText: "Our AI-powered advertising platform has helped businesses increase their ROAS by 340% on average. See what makes us different.",
      cta: "See Case Studies", 
      running: "8 days",
      engagement: "Medium",
      aiAnalysis: {
        strengths: ["Pain point focused", "Specific metrics", "Proof-driven CTA"],
        weaknesses: ["Negative framing", "Complex terminology"],
        improvements: ["Balance with positive messaging", "Simplify language", "Add testimonial"]
      }
    },
    {
      id: 3,
      headline: "The #1 Tool Every Marketer Needs",
      primaryText: "Automate your marketing, track performance, and scale faster than ever. Over 50k marketers trust our platform to grow their business.",
      cta: "Start Free Trial",
      running: "22 days",
      engagement: "High",
      aiAnalysis: {
        strengths: ["Authority positioning", "Strong social proof", "Clear value prop"],
        weaknesses: ["Vague benefits", "Overused positioning"],
        improvements: ["Be more specific about automation", "Unique positioning angle", "Industry-specific benefits"]
      }
    }
  ];

  const analyzeCompetitor = async () => {
    if (!searchUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a competitor's Facebook page URL to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({
        title: "Analysis Complete!",
        description: "Found 3 active ads with AI insights ready for review.",
      });
    }, 3000);
  };

  const copyAdText = (ad: any) => {
    const text = `${ad.headline}\n\n${ad.primaryText}\n\nCTA: ${ad.cta}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Ad content copied successfully.",
    });
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement.toLowerCase()) {
      case "high": return "success";
      case "medium": return "warning";
      case "low": return "destructive";
      default: return "secondary";
    }
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
            Enter a Facebook page URL to analyze their active ads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="competitor-url">Facebook Page URL</Label>
            <div className="flex space-x-2">
              <Input 
                id="competitor-url"
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                placeholder="https://facebook.com/competitorpage"
                className="flex-1"
              />
              <Button 
                onClick={analyzeCompetitor}
                disabled={isAnalyzing}
                className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300"
              >
                {isAnalyzing ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze Ads
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>• Access live ads from Facebook's Ad Library</p>
            <p>• Get AI-powered insights on copy and strategy</p>
            <p>• Discover what's working in your industry</p>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {!analysisComplete ? (
        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardContent className="p-12">
            <div className="text-center">
              <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to Spy on Competitors?</h3>
              <p className="text-muted-foreground">
                Enter a competitor's Facebook page URL above to uncover their ad strategies
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
              <CardDescription>facebook.com/example-competitor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Active Ads</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-success">22</div>
                  <div className="text-sm text-muted-foreground">Days Running</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-warning">2.1x</div>
                  <div className="text-sm text-muted-foreground">Est. ROAS</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-destructive">High</div>
                  <div className="text-sm text-muted-foreground">Competition</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Ads */}
          <div className="space-y-4">
            {mockCompetitorAds.map((ad) => (
              <Card key={ad.id} className="hover:shadow-custom-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">Ad #{ad.id}</CardTitle>
                      <Badge variant={getEngagementColor(ad.engagement) === "success" ? "success" : getEngagementColor(ad.engagement) === "warning" ? "warning" : "destructive"}>
                        {ad.engagement} Engagement
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Running for {ad.running}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => copyAdText(ad)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ad Content */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Headline:</h4>
                    <p className="font-medium mb-3">{ad.headline}</p>
                    
                    <h4 className="font-semibold text-primary mb-2">Primary Text:</h4>
                    <p className="text-muted-foreground mb-3">{ad.primaryText}</p>
                    
                    <h4 className="font-semibold text-primary mb-2">Call to Action:</h4>
                    <Badge className="bg-success text-success-foreground">{ad.cta}</Badge>
                  </div>

                  <Separator />

                  {/* AI Analysis */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <Target className="mr-2 h-4 w-4 text-primary" />
                      AI Strategy Analysis
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-success mb-2">Strengths</h5>
                        <ul className="text-sm space-y-1">
                          {ad.aiAnalysis.strengths.map((strength, index) => (
                            <li key={index} className="text-muted-foreground">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-destructive mb-2">Weaknesses</h5>
                        <ul className="text-sm space-y-1">
                          {ad.aiAnalysis.weaknesses.map((weakness, index) => (
                            <li key={index} className="text-muted-foreground">• {weakness}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-primary mb-2">Your Improvements</h5>
                        <ul className="text-sm space-y-1">
                          {ad.aiAnalysis.improvements.map((improvement, index) => (
                            <li key={index} className="text-muted-foreground">• {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Strategic Recommendations */}
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Strategic Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered insights to outperform your competition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-l-4 border-primary bg-primary-muted">
                <h4 className="font-semibold mb-2">Messaging Gap Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Your competitors focus heavily on features. Consider emphasizing emotional benefits and customer success stories for differentiation.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-success bg-success-muted">
                <h4 className="font-semibold mb-2">Pricing Strategy Insight</h4>
                <p className="text-sm text-muted-foreground">
                  All competitors lead with "free trial" offers. Consider a money-back guarantee or "results in 30 days" positioning instead.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-warning bg-warning-muted">
                <h4 className="font-semibold mb-2">Creative Direction</h4>
                <p className="text-sm text-muted-foreground">
                  Competitors use generic stock photos. User-generated content or behind-the-scenes content could help you stand out.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompetitorSpy;