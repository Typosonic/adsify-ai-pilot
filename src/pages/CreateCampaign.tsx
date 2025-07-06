import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wand2, Target, Upload, Rocket, Copy, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFacebookIntegration } from "@/hooks/useFacebookIntegration";
import { useFacebookAds } from "@/hooks/useFacebookAds";
import { useCampaignCreation } from "@/hooks/useCampaignCreation";

const CreateCampaign = () => {
  const { toast } = useToast();
  const { isConnected } = useFacebookIntegration();
  const { adAccounts } = useFacebookAds();
  const { loading, generatedAds, generateAdCopy, launchCampaign } = useCampaignCreation();

  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    campaignName: "",
    objective: "",
    targetAudience: "",
    productDescription: "",
    budget: 50,
    duration: 7,
    adAccountId: ""
  });
  const [selectedAds, setSelectedAds] = useState<number[]>([]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Connect Facebook Ads</CardTitle>
            <CardDescription>
              Connect your Facebook Ads account to create campaigns
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

  const handleGenerateAds = async () => {
    try {
      await generateAdCopy(campaignData);
      setStep(2);
      toast({
        title: "Ad Copy Generated!",
        description: "Your AI-generated ad variations are ready for review.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate ad copy. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLaunchCampaign = async () => {
    if (selectedAds.length === 0) {
      toast({
        title: "Select Ads",
        description: "Please select at least one ad variation to launch.",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedAdData = selectedAds.map(index => generatedAds[index]);
      await launchCampaign(campaignData, campaignData.adAccountId, selectedAdData);
      
      toast({
        title: "Campaign Launched!",
        description: "Your Facebook ad campaign has been created and is ready for review.",
      });
      
      // Reset form
      setStep(1);
      setCampaignData({
        campaignName: "",
        objective: "",
        targetAudience: "",
        productDescription: "",
        budget: 50,
        duration: 7,
        adAccountId: ""
      });
      setSelectedAds([]);
    } catch (error) {
      toast({
        title: "Launch Failed",
        description: "Failed to launch campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleAdSelection = (index: number) => {
    setSelectedAds(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Wand2 className="mr-3 h-8 w-8 text-primary" />
            Create Campaign
          </h1>
          <p className="text-muted-foreground">Generate AI-powered Facebook ad campaigns</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Step {step} of 2
        </Badge>
      </div>

      {step === 1 && (
        <Card className="hover:shadow-custom-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Campaign Details
            </CardTitle>
            <CardDescription>
              Provide information about your campaign to generate targeted ad copy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  placeholder="e.g. Summer Sale 2024"
                  value={campaignData.campaignName}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, campaignName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adAccount">Ad Account</Label>
                <Select value={campaignData.adAccountId} onValueChange={(value) => setCampaignData(prev => ({ ...prev, adAccountId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ad Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {adAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective</Label>
                <Select value={campaignData.objective} onValueChange={(value) => setCampaignData(prev => ({ ...prev, objective: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traffic">Drive Traffic</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="lead_generation">Lead Generation</SelectItem>
                    <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
                    <SelectItem value="reach">Reach</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Daily Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="5"
                  value={campaignData.budget}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                placeholder="e.g. Young professionals aged 25-35, interested in fitness and health, living in urban areas"
                value={campaignData.targetAudience}
                onChange={(e) => setCampaignData(prev => ({ ...prev, targetAudience: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Product/Service Description</Label>
              <Textarea
                id="productDescription"
                placeholder="Describe what you're promoting - features, benefits, unique selling points..."
                value={campaignData.productDescription}
                onChange={(e) => setCampaignData(prev => ({ ...prev, productDescription: e.target.value }))}
                rows={4}
              />
            </div>

            <Separator />

            <Button 
              onClick={handleGenerateAds}
              disabled={loading || !campaignData.campaignName || !campaignData.objective || !campaignData.productDescription || !campaignData.adAccountId}
              className="w-full bg-gradient-primary hover:shadow-custom-md transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Ad Copy...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate AI Ad Copy
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card className="hover:shadow-custom-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Edit3 className="mr-2 h-5 w-5" />
                Generated Ad Variations
              </CardTitle>
              <CardDescription>
                Review and select the ad variations you want to launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedAds.map((ad, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedAds.includes(index) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => toggleAdSelection(index)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Variation {index + 1}</Badge>
                        {selectedAds.includes(index) && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">PRIMARY TEXT</Label>
                        <p className="text-sm mt-1">{ad.primary_text}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">HEADLINE</Label>
                        <p className="text-sm font-medium mt-1">{ad.headline}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">DESCRIPTION</Label>
                        <p className="text-sm mt-1">{ad.description}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">CALL TO ACTION</Label>
                        <Badge variant="secondary" className="mt-1">{ad.call_to_action}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                >
                  Back to Edit
                </Button>
                
                <div className="space-x-2">
                  <Button 
                    variant="outline"
                    onClick={handleGenerateAds}
                    disabled={loading}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  
                  <Button 
                    onClick={handleLaunchCampaign}
                    disabled={loading || selectedAds.length === 0}
                    className="bg-gradient-primary hover:shadow-custom-md transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Launching...
                      </>
                    ) : (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Launch Campaign ({selectedAds.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreateCampaign;