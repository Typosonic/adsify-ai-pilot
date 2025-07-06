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

    const { action, accountId } = await req.json();

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

    if (action === 'analyze') {
      // Fetch campaign performance data
      const campaignResponse = await fetch(
        `https://graph.facebook.com/v18.0/${accountId}/campaigns?` +
        `access_token=${integration.access_token}&` +
        `fields=id,name,status,objective,insights.date_preset(last_7_days){spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,actions,cost_per_action_type}`
      );
      
      const campaignData = await campaignResponse.json();
      
      if (campaignData.error) {
        return new Response(JSON.stringify({ error: campaignData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Process campaigns and generate insights using AI
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const insights = [];
      
      for (const campaign of campaignData.data || []) {
        const insight = campaign.insights?.data?.[0];
        if (!insight) continue;

        const analysisPrompt = `Analyze this Facebook ad campaign performance and provide actionable optimization recommendations:

Campaign: ${campaign.name}
Objective: ${campaign.objective}
Status: ${campaign.status}

Performance Metrics (Last 7 days):
- Spend: $${insight.spend}
- Impressions: ${insight.impressions}
- Clicks: ${insight.clicks}
- CTR: ${insight.ctr}%
- CPC: $${insight.cpc}
- CPM: $${insight.cpm}
- Reach: ${insight.reach}
- Frequency: ${insight.frequency}

Provide 3-5 specific, actionable recommendations to improve this campaign's performance. Focus on:
1. Budget optimization
2. Audience targeting improvements  
3. Creative/copy suggestions
4. Bidding strategy adjustments
5. Any red flags or urgent issues

Format as JSON:
{
  "campaign_id": "${campaign.id}",
  "campaign_name": "${campaign.name}",
  "performance_score": 0-100,
  "priority": "high|medium|low",
  "recommendations": [
    {
      "title": "...",
      "description": "...",
      "impact": "high|medium|low",
      "effort": "high|medium|low"
    }
  ],
  "key_issues": ["..."],
  "next_actions": ["..."]
}`;

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert Facebook Ads optimizer with 10+ years of experience. Analyze campaign data and provide specific, actionable recommendations to improve performance and ROI.' 
              },
              { role: 'user', content: analysisPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1500,
          }),
        });

        const aiData = await aiResponse.json();
        
        try {
          const analysisResult = JSON.parse(aiData.choices[0].message.content);
          insights.push({
            ...analysisResult,
            raw_metrics: insight,
            analyzed_at: new Date().toISOString()
          });
        } catch (e) {
          console.error('Failed to parse AI response:', e);
          // Fallback analysis
          insights.push({
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            performance_score: 65,
            priority: "medium",
            recommendations: [
              {
                title: "Review Campaign Performance",
                description: "Monitor key metrics and adjust targeting based on performance data.",
                impact: "medium",
                effort: "low"
              }
            ],
            key_issues: ["Insufficient data for detailed analysis"],
            next_actions: ["Continue monitoring performance"],
            raw_metrics: insight,
            analyzed_at: new Date().toISOString()
          });
        }
      }

      // Store insights in database
      const { error: insertError } = await supabaseClient
        .from('optimization_insights')
        .upsert(
          insights.map(insight => ({
            user_id: user.id,
            campaign_id: insight.campaign_id,
            campaign_name: insight.campaign_name,
            performance_score: insight.performance_score,
            priority: insight.priority,
            recommendations: insight.recommendations,
            key_issues: insight.key_issues,
            next_actions: insight.next_actions,
            raw_metrics: insight.raw_metrics,
            analyzed_at: insight.analyzed_at
          })),
          { onConflict: 'user_id,campaign_id' }
        );

      if (insertError) {
        console.error('Database insert error:', insertError);
      }

      return new Response(JSON.stringify({ insights }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_insights') {
      // Fetch stored insights from database
      const { data: insights, error } = await supabaseClient
        .from('optimization_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('analyzed_at', { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ insights: insights || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404 });

  } catch (error) {
    console.error('Optimizer agent error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});