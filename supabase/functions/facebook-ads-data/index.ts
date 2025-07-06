import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's Facebook integration
    const { data: integration, error: integrationError } = await supabaseClient
      .from('facebook_integrations')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (integrationError || !integration) {
      return new Response(JSON.stringify({ error: 'Facebook not connected' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'accounts') {
      // Get Facebook Ad Accounts
      const accountsResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/adaccounts?access_token=${integration.access_token}&fields=id,name,account_status,currency,timezone_name`
      );
      const accountsData = await accountsResponse.json();

      return new Response(JSON.stringify(accountsData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'campaigns') {
      const accountId = url.searchParams.get('account_id');
      if (!accountId) {
        return new Response(JSON.stringify({ error: 'Account ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get campaigns with insights
      const campaignsResponse = await fetch(
        `https://graph.facebook.com/v18.0/${accountId}/campaigns?` +
        `access_token=${integration.access_token}&` +
        `fields=id,name,status,objective,created_time,start_time,stop_time,insights.date_preset(last_30_days){spend,impressions,clicks,reach,ctr,cpc,cpm,actions}`
      );
      const campaignsData = await campaignsResponse.json();

      return new Response(JSON.stringify(campaignsData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'insights') {
      const accountId = url.searchParams.get('account_id');
      const datePreset = url.searchParams.get('date_preset') || 'last_30_days';
      
      if (!accountId) {
        return new Response(JSON.stringify({ error: 'Account ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get account insights
      const insightsResponse = await fetch(
        `https://graph.facebook.com/v18.0/${accountId}/insights?` +
        `access_token=${integration.access_token}&` +
        `date_preset=${datePreset}&` +
        `fields=spend,impressions,clicks,reach,ctr,cpc,cpm,actions,cost_per_action_type&` +
        `time_increment=1&` +
        `level=account`
      );
      const insightsData = await insightsResponse.json();

      // Process the data to calculate ROAS
      const processedData = insightsData.data?.map((insight: any) => {
        const spend = parseFloat(insight.spend || 0);
        const actions = insight.actions || [];
        const purchases = actions.find((action: any) => action.action_type === 'purchase')?.value || 0;
        const purchaseValue = actions.find((action: any) => action.action_type === 'purchase_roas')?.value || 0;
        
        const roas = spend > 0 ? (parseFloat(purchaseValue) / spend) : 0;

        return {
          ...insight,
          roas: roas.toFixed(2),
          purchases: parseInt(purchases),
          purchase_value: parseFloat(purchaseValue)
        };
      });

      return new Response(JSON.stringify({ 
        data: processedData,
        summary: calculateSummary(processedData || [])
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404 });

  } catch (error) {
    console.error('Facebook Ads API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateSummary(data: any[]) {
  const totals = data.reduce((acc, item) => ({
    spend: acc.spend + parseFloat(item.spend || 0),
    impressions: acc.impressions + parseInt(item.impressions || 0),
    clicks: acc.clicks + parseInt(item.clicks || 0),
    reach: acc.reach + parseInt(item.reach || 0),
    purchases: acc.purchases + parseInt(item.purchases || 0),
    purchase_value: acc.purchase_value + parseFloat(item.purchase_value || 0)
  }), { spend: 0, impressions: 0, clicks: 0, reach: 0, purchases: 0, purchase_value: 0 });

  return {
    ...totals,
    ctr: totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : 0,
    cpc: totals.clicks > 0 ? (totals.spend / totals.clicks).toFixed(2) : 0,
    cpm: totals.impressions > 0 ? ((totals.spend / totals.impressions) * 1000).toFixed(2) : 0,
    roas: totals.spend > 0 ? (totals.purchase_value / totals.spend).toFixed(2) : 0
  };
}