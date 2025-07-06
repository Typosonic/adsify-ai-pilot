import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdData {
  platform: string;
  ad_text: string;
  headline: string;
  cta: string;
  estimated_budget: number;
  engagement_rate: number;
  estimated_reach: number;
}

interface CompetitorInsights {
  messaging_strategy: string;
  budget_insights: string;
  targeting_approach: string;
  creative_themes: string[];
  opportunities: string[];
  counter_strategies: string[];
  overall_assessment: string;
}

interface CompetitorAnalysis {
  id: string;
  competitor_name: string;
  ad_data: AdData[];
  insights: CompetitorInsights;
  scraped_at: string;
  created_at: string;
}

export const useCompetitorSpy = () => {
  const [analyses, setAnalyses] = useState<CompetitorAnalysis[]>([]);
  const [loading, setLoading] = useState(false);

  const analyzeCompetitor = async (competitorName: string, competitorUrl: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('competitor-spy', {
        body: { 
          action: 'analyze', 
          competitorName,
          competitorUrl 
        }
      });

      if (error) throw error;
      
      // Refresh analyses after new analysis
      await getAnalyses();
      
      return data;
    } catch (error) {
      console.error('Error analyzing competitor:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAnalyses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('competitor-spy', {
        body: { action: 'get_analyses' }
      });

      if (error) throw error;
      setAnalyses(data.analyses || []);
      return data.analyses;
    } catch (error) {
      console.error('Error fetching analyses:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyses,
    loading,
    analyzeCompetitor,
    getAnalyses
  };
};