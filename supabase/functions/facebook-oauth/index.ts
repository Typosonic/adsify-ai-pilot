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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'auth_url') {
      // Generate Facebook OAuth URL
      const facebookAppId = Deno.env.get('FACEBOOK_APP_ID');
      const redirectUri = `${url.origin}/api/facebook-oauth?action=callback`;
      
      const scope = [
        'ads_management',
        'ads_read',
        'business_management',
        'pages_read_engagement',
        'pages_manage_ads'
      ].join(',');

      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${facebookAppId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `state=${user.id}`;

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'callback') {
      // Handle OAuth callback
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code || state !== user.id) {
        return new Response('Invalid request', { status: 400 });
      }

      const facebookAppId = Deno.env.get('FACEBOOK_APP_ID');
      const facebookAppSecret = Deno.env.get('FACEBOOK_APP_SECRET');
      const redirectUri = `${url.origin}/api/facebook-oauth?action=callback`;

      // Exchange code for access token
      const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${facebookAppId}&` +
        `client_secret=${facebookAppSecret}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `code=${code}`
      );

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        console.error('Facebook token error:', tokenData.error);
        return new Response('OAuth error', { status: 400 });
      }

      // Get user info from Facebook
      const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?` +
        `access_token=${tokenData.access_token}&` +
        `fields=id,name`
      );

      const fbUser = await userResponse.json();

      // Store in database
      const { error: dbError } = await supabaseClient
        .from('facebook_integrations')
        .upsert({
          user_id: user.id,
          facebook_user_id: fbUser.id,
          access_token: tokenData.access_token,
          token_expires_at: tokenData.expires_in ? 
            new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
          account_name: fbUser.name,
          granted_permissions: scope.split(',')
        }, {
          onConflict: 'user_id,facebook_user_id'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        return new Response('Database error', { status: 500 });
      }

      // Redirect to success page
      return new Response(null, {
        status: 302,
        headers: {
          'Location': `${Deno.env.get('SITE_URL') || url.origin}/?connected=true`
        }
      });
    }

    return new Response('Not found', { status: 404 });

  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});