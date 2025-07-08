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

    const { 
      action, 
      campaignName, 
      objective, 
      targetAudience, 
      productDescription, 
      budget, 
      duration,
      adAccountId,
      generatedAds 
    } = await req.json();

    if (action === 'generate') {
      // Generate ad copy using AI
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
      console.log('OpenAI API Key status:', openAIApiKey ? `Present (${openAIApiKey.substring(0, 10)}...)` : 'Missing');
      
      if (!openAIApiKey) {
        console.error('OpenAI API key is missing from environment variables');
        return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const prompt = `You are an expert Facebook ads copywriter with 10+ years of experience creating high-converting ad copy. Write 3 compelling ad variations for:

Product/Service: ${productDescription}
Campaign Objective: ${objective}
Target Audience: ${targetAudience}
Campaign Name: ${campaignName}

Use these proven high-converting frameworks:

FRAMEWORK 1 - BENEFIT + URGENCY + CTA:
Structure: Hook with benefit → Key features/benefits → Urgency/scarcity → Clear CTA
Example style: "🔥 [OFFER] DEAL ALERT! 🔥 [Benefit statement] 💎 [Feature 1] 🛡️ [Feature 2] 🚗 [Feature 3] 📍 [Location/credibility] 📲 [Urgent CTA]"

FRAMEWORK 2 - CREDIBILITY + BENEFITS + CTA:
Structure: Credibility statement → List benefits → Proof points → Direct CTA
Example style: "✅ [Service] Pros Are Here. [Benefit statement] ✅ [Credibility 1] ✅ [Credibility 2] ✅ [Credibility 3] 📞 [CTA]"

FRAMEWORK 3 - PROBLEM + SOLUTION + PROOF:
Structure: Address pain point → Present solution → Social proof → CTA
Focus on transformation and results.

For each variation, provide:
1. Primary Text (engaging hook and main copy, max 200 characters for better impact)
2. Headline (clear value proposition, max 50 characters)  
3. Description (supporting details/offer, max 40 characters)
4. Call-to-Action (action-oriented button text)

Requirements:
- Use emojis strategically for visual appeal
- Include urgency/scarcity elements
- Focus on benefits over features
- Make it locally relevant if location mentioned
- Use power words that convert
- Each variation should use a different framework

Format as JSON:
{
  "variations": [
    {
      "primary_text": "...",
      "headline": "...", 
      "description": "...",
      "call_to_action": "..."
    }
  ]
}`;

      console.log('Making OpenAI API call with key:', openAIApiKey ? 'Key present' : 'Key missing');
      
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert Facebook Ads copywriter with 10+ years of experience creating high-converting ad copy.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      console.log('OpenAI API response status:', aiResponse.status);
      
      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${aiResponse.status} - ${errorText}`);
      }

      const aiData = await aiResponse.json();
      console.log('OpenAI API response:', JSON.stringify(aiData, null, 2));
      
      let generatedContent;
      
      try {
        if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
          throw new Error('Invalid OpenAI response structure');
        }
        
        const content = aiData.choices[0].message.content;
        console.log('AI generated content:', content);
        
        generatedContent = JSON.parse(content);
      } catch (e) {
        console.error('Error parsing AI response:', e);
        console.error('Raw AI content:', aiData.choices?.[0]?.message?.content);
        
        // Fallback if AI doesn't return valid JSON
        generatedContent = {
          variations: [
            {
              primary_text: "🔥 EXCLUSIVE DEAL ALERT! 🔥 Transform your business with our proven solution that gets results in 30 days or less!",
              headline: "Get Results in 30 Days",
              description: "Money-back guarantee",
              call_to_action: "Learn More"
            }
          ]
        };
      }

      return new Response(JSON.stringify(generatedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'launch') {
      // Launch campaign to Facebook
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

      // Create campaign
      const campaignResponse = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: new URLSearchParams({
          access_token: integration.access_token,
          name: campaignName,
          objective: objective.toUpperCase(),
          status: 'PAUSED', // Start paused for review
          special_ad_categories: '[]'
        })
      });

      const campaignData = await campaignResponse.json();
      
      if (campaignData.error) {
        return new Response(JSON.stringify({ error: campaignData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create ad set
      const adSetResponse = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}/adsets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: new URLSearchParams({
          access_token: integration.access_token,
          name: `${campaignName} - Ad Set`,
          campaign_id: campaignData.id,
          daily_budget: (budget * 100).toString(), // Convert to cents
          billing_event: 'IMPRESSIONS',
          optimization_goal: objective === 'conversions' ? 'CONVERSIONS' : 'LINK_CLICKS',
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          targeting: JSON.stringify({
            age_min: 18,
            age_max: 65,
            genders: [1, 2],
            geo_locations: { countries: ['US'] }
          }),
          status: 'PAUSED'
        })
      });

      const adSetData = await adSetResponse.json();

      if (adSetData.error) {
        return new Response(JSON.stringify({ error: adSetData.error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create ads for each variation
      const createdAds = [];
      for (let i = 0; i < generatedAds.length; i++) {
        const ad = generatedAds[i];
        
        const adResponse = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}/ads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: new URLSearchParams({
            access_token: integration.access_token,
            name: `${campaignName} - Ad ${i + 1}`,
            adset_id: adSetData.id,
            creative: JSON.stringify({
              object_story_spec: {
                page_id: integration.account_id || integration.facebook_user_id,
                link_data: {
                  message: ad.primary_text,
                  name: ad.headline,
                  description: ad.description,
                  call_to_action: {
                    type: ad.call_to_action.toUpperCase().replace(' ', '_'),
                    value: {
                      link: 'https://example.com' // User would provide their landing page
                    }
                  }
                }
              }
            }),
            status: 'PAUSED'
          })
        });

        const adData = await adResponse.json();
        createdAds.push(adData);
      }

      return new Response(JSON.stringify({ 
        campaign: campaignData,
        adSet: adSetData,
        ads: createdAds
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not found', { status: 404 });

  } catch (error) {
    console.error('Campaign creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});