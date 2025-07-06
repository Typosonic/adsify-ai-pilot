import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface FacebookIntegration {
  id: string;
  facebook_user_id: string;
  account_name: string;
  account_id: string;
  granted_permissions: string[];
  created_at: string;
  token_expires_at: string;
}

export const useFacebookIntegration = () => {
  const [integration, setIntegration] = useState<FacebookIntegration | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchIntegration();
    }
  }, [user]);

  const fetchIntegration = async () => {
    try {
      const { data, error } = await supabase
        .from('facebook_integrations')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setIntegration(data);
    } catch (error) {
      console.error('Error fetching Facebook integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectFacebook = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('facebook-oauth', {
        body: { action: 'auth_url' }
      });

      if (error) throw error;
      
      // Redirect to Facebook OAuth
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error connecting to Facebook:', error);
      throw error;
    }
  };

  const disconnectFacebook = async () => {
    try {
      const { error } = await supabase
        .from('facebook_integrations')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;
      setIntegration(null);
    } catch (error) {
      console.error('Error disconnecting Facebook:', error);
      throw error;
    }
  };

  return {
    integration,
    loading,
    isConnected: !!integration,
    connectFacebook,
    disconnectFacebook,
    refetch: fetchIntegration
  };
};