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

    const { action, competitorName, competitorUrl } = await req.json();

    if (action === 'analyze') {
      // Mock competitor analysis data (in real implementation, this would scrape competitor ads)
      const mockAdData = [
        {
          platform: 'Facebook',
          ad_text: `Discover ${competitorName}'s amazing products! Limited time offer - 50% off!`,
          headline: 'Transform Your Life Today',
          cta: 'Shop Now',
          estimated_budget: 5000,
          engagement_rate: 3.2,
          estimated_reach: 125000
        },
        {
          platform: 'Facebook', 
          ad_text: `Join thousands who trust ${competitorName} for quality and value.`,
          headline: 'Join The Revolution',
          cta: 'Learn More',
          estimated_budget: 3500,
          engagement_rate: 4.1,
          estimated_reach: 98000
        },
        {
          platform: 'Instagram',
          ad_text: `${competitorName} - Your go-to solution for premium results.`,
          headline: 'Premium Quality Guaranteed',
          cta: 'Get Started',
          estimated_budget: 2800,
          engagement_rate: 5.3,
          estimated_reach: 87000
        }
      ];

      // Generate AI insights using OpenAI
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openAIApiKey) {
        return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const analysisPrompt = `Analyze this competitor's advertising data and provide strategic insights:

Competitor: ${competitorName}
Website: ${competitorUrl}

Ad Data:
${mockAdData.map(ad => `
Platform: ${ad.platform}
Ad Text: ${ad.ad_text}
Headline: ${ad.headline}
CTA: ${ad.cta}
Est. Budget: $${ad.estimated_budget}
Engagement Rate: ${ad.engagement_rate}%
Est. Reach: ${ad.estimated_reach}
`).join('\n')}

Provide insights on:
1. Key messaging strategies they use
2. Budget allocation patterns
3. Audience targeting approach
4. Creative themes and angles
5. Opportunities for differentiation
6. Recommended counter-strategies

Format as JSON:
{
  "messaging_strategy": "...",
  "budget_insights": "...",
  "targeting_approach": "...",
  "creative_themes": ["...", "..."],
  "opportunities": ["...", "..."],
  "counter_strategies": ["...", "..."],
  "overall_assessment": "..."
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
              content: 'You are an expert competitive intelligence analyst specializing in advertising strategy. Provide detailed, actionable insights based on competitor ad data.' 
            },
            { role: 'user', content: analysisPrompt }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      const aiData = await aiResponse.json();
      let insights;
      
      try {
        insights = JSON.parse(aiData.choices[0].message.content);
      } catch (e) {
        // Fallback insights
        insights = {
          messaging_strategy: "Focus on value proposition and urgency",
          budget_insights: "Heavy investment in Facebook and Instagram",
          targeting_approach: "Broad demographic targeting with interest-based refinement",
          creative_themes: ["Limited time offers", "Social proof", "Premium quality"],
          opportunities: ["Less competition on emerging platforms", "Underserved audience segments"],
          counter_strategies: ["Focus on unique value props", "Target competitor's audience gaps"],
          overall_assessment: "Strong competitor with consistent messaging across platforms"
        };
      }

      // Store analysis in database
      const { error: insertError } = await supabaseClient
        .from('competitor_analysis')
        .upsert({
          user_id: user.id,
          competitor_name: competitorName,
          ad_data: mockAdData,
          insights: insights,
          scraped_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,competitor_name'
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
      }

      return new Response(JSON.stringify({ 
        ad_data: mockAdData,
        insights: insights
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_analyses') {
      // Fetch stored competitor analyses
      const { data: analyses, error } = await supabaseClient
        .from('competitor_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ analyses: analyses || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404 });

  } catch (error) {
    console.error('Competitor spy error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});