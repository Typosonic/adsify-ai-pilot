import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Sparkles, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateCampaign = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(false);
  const { toast } = useToast();

  const businessTypes = [
    "E-commerce",
    "SaaS",
    "Local Business",
    "Professional Services",
    "Education",
    "Health & Wellness",
    "Real Estate",
    "Food & Beverage"
  ];

  const tones = [
    "Professional",
    "Friendly & Casual",
    "Urgent & Direct",
    "Luxury & Premium",
    "Funny & Humorous",
    "Educational",
    "Emotional & Inspiring"
  ];

  const mockGeneratedAds = [
    {
      headline: "Transform Your Business with AI-Powered Solutions",
      primaryText: "Discover how our cutting-edge AI platform can revolutionize your workflow and boost productivity by 300%. Join thousands of satisfied customers who've already made the switch.",
      cta: "Start Free Trial"
    },
    {
      headline: "Ready to 10x Your Results? This Changes Everything",
      primaryText: "Stop wasting time on manual processes. Our AI does the heavy lifting so you can focus on what matters most - growing your business and serving your customers.",
      cta: "Get Started Now"
    },
    {
      headline: "The Future of Business is Here (And It's Affordable)",
      primaryText: "Experience the power of AI without breaking the bank. Our platform pays for itself within 30 days through increased efficiency and better results.",
      cta: "See Pricing"
    }
  ];

  const generateAds = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedContent(true);
      toast({
        title: "Ads Generated!",
        description: "3 high-converting ad variations have been created for you.",
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Ad copy has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">Generate high-converting Facebook ads with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Campaign Details
            </CardTitle>
            <CardDescription>
              Tell our AI about your business and goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offer">Product/Offer Description</Label>
              <Textarea 
                id="offer"
                placeholder="Describe your product, service, or special offer..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input 
                id="audience"
                placeholder="e.g., Small business owners, 25-45 years old"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Desired Tone</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your ad tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone} value={tone.toLowerCase()}>{tone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Campaign Goal</Label>
              <Textarea 
                id="goal"
                placeholder="What do you want to achieve? (e.g., increase sales, generate leads, drive traffic)"
                className="min-h-[60px]"
              />
            </div>

            <Button 
              onClick={generateAds}
              disabled={isGenerating}
              className="w-full bg-gradient-primary hover:shadow-custom-md transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Ads...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Ads
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardHeader>
            <CardTitle>Generated Ad Variations</CardTitle>
            <CardDescription>
              AI-powered ad copy ready for Facebook
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedContent ? (
              <div className="h-[400px] flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Fill out the form and click "Generate AI Ads"</p>
                  <p className="text-muted-foreground text-sm">to see your custom ad variations</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {mockGeneratedAds.map((ad, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Variation {index + 1}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(`${ad.headline}\n\n${ad.primaryText}\n\nCTA: ${ad.cta}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <h4 className="font-semibold text-sm mb-2 text-primary">Headline:</h4>
                    <p className="text-sm mb-3 font-medium">{ad.headline}</p>
                    
                    <h4 className="font-semibold text-sm mb-2 text-primary">Primary Text:</h4>
                    <p className="text-sm mb-3 text-muted-foreground">{ad.primaryText}</p>
                    
                    <h4 className="font-semibold text-sm mb-2 text-primary">Call to Action:</h4>
                    <Badge className="bg-success text-success-foreground">{ad.cta}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Creative Upload Section */}
      <Card className="hover:shadow-custom-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5 text-primary" />
            Upload Creatives
          </CardTitle>
          <CardDescription>
            Add images or videos for your ad campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drag & drop your creatives</h3>
            <p className="text-muted-foreground mb-4">Support for JPG, PNG, MP4, and GIF files</p>
            <Button variant="outline">Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* Launch Section */}
      <Card className="hover:shadow-custom-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to Launch?</h3>
              <p className="text-muted-foreground">
                {generatedContent 
                  ? "Your AI-generated ads are ready. Connect Facebook to launch your campaign."
                  : "Generate your ads first, then you can launch directly to Facebook."
                }
              </p>
            </div>
            <Button 
              disabled={!generatedContent}
              className="bg-gradient-success hover:shadow-custom-md transition-all duration-300"
            >
              Launch Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCampaign;