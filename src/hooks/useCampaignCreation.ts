import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdVariation {
  primary_text: string;
  headline: string;
  description: string;
  call_to_action: string;
}

interface CampaignData {
  campaignName: string;
  objective: string;
  targetAudience: string;
  productDescription: string;
  budget: number;
  duration: number;
}

export const useCampaignCreation = () => {
  const [loading, setLoading] = useState(false);
  const [generatedAds, setGeneratedAds] = useState<AdVariation[]>([]);

  const generateAdCopy = async (campaignData: CampaignData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-campaign', {
        body: {
          action: 'generate',
          ...campaignData
        }
      });

      if (error) throw error;
      
      setGeneratedAds(data.variations || []);
      return data.variations || [];
    } catch (error) {
      console.error('Error generating ad copy:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const launchCampaign = async (campaignData: CampaignData, adAccountId: string, selectedAds: AdVariation[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-campaign', {
        body: {
          action: 'launch',
          ...campaignData,
          adAccountId,
          generatedAds: selectedAds
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error launching campaign:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generatedAds,
    generateAdCopy,
    launchCampaign,
    setGeneratedAds
  };
};