import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name: string;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  created_time: string;
  insights?: {
    data: Array<{
      spend: string;
      impressions: string;
      clicks: string;
      ctr: string;
      cpc: string;
      cpm: string;
    }>;
  };
}

interface AdInsights {
  data: Array<{
    date_start: string;
    spend: string;
    impressions: string;
    clicks: string;
    reach: string;
    ctr: string;
    cpc: string;
    cpm: string;
    roas: string;
    purchases: number;
    purchase_value: number;
  }>;
  summary: {
    spend: number;
    impressions: number;
    clicks: number;
    reach: number;
    purchases: number;
    purchase_value: number;
    ctr: string;
    cpc: string;
    cpm: string;
    roas: string;
  };
}

export const useFacebookAds = () => {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [insights, setInsights] = useState<AdInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAdAccounts = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('facebook-ads-data', {
        body: { action: 'accounts' }
      });

      if (error) throw error;
      setAdAccounts(data.data || []);
      
      // Auto-select first account
      if (data.data && data.data.length > 0) {
        setSelectedAccount(data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async (accountId: string) => {
    if (!accountId) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('facebook-ads-data', {
        body: { action: 'campaigns', account_id: accountId }
      });

      if (error) throw error;
      setCampaigns(data.data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async (accountId: string, datePreset = 'last_30_days') => {
    if (!accountId) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('facebook-ads-data', {
        body: { action: 'insights', account_id: accountId, date_preset: datePreset }
      });

      if (error) throw error;
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAdAccounts();
    }
  }, [user]);

  useEffect(() => {
    if (selectedAccount) {
      fetchCampaigns(selectedAccount);
      fetchInsights(selectedAccount);
    }
  }, [selectedAccount]);

  return {
    adAccounts,
    selectedAccount,
    setSelectedAccount,
    campaigns,
    insights,
    loading,
    refetch: () => {
      fetchAdAccounts();
      if (selectedAccount) {
        fetchCampaigns(selectedAccount);
        fetchInsights(selectedAccount);
      }
    }
  };
};