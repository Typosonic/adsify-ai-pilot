import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Recommendation {
  title: string;
  description: string;
  impact: string;
  effort: string;
}

interface OptimizationInsight {
  id: string;
  campaign_id: string;
  campaign_name: string;
  performance_score: number;
  priority: string;
  recommendations: Recommendation[];
  key_issues: string[];
  next_actions: string[];
  analyzed_at: string;
}

export const useOptimizer = () => {
  const [insights, setInsights] = useState<OptimizationInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const analyzeAccount = async (accountId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimizer-agent', {
        body: { action: 'analyze', accountId }
      });

      if (error) throw error;
      setInsights(data.insights || []);
      return data.insights;
    } catch (error) {
      console.error('Error analyzing account:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimizer-agent', {
        body: { action: 'get_insights' }
      });

      if (error) throw error;
      setInsights(data.insights || []);
      return data.insights;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    insights,
    loading,
    analyzeAccount,
    getInsights
  };
};