-- Drop all existing tables and their dependencies
DROP TABLE IF EXISTS public.automation_logs CASCADE;
DROP TABLE IF EXISTS public.deployment_logs CASCADE;
DROP TABLE IF EXISTS public.container_events CASCADE;
DROP TABLE IF EXISTS public.credential_access_logs CASCADE;
DROP TABLE IF EXISTS public.extracted_workflows CASCADE;
DROP TABLE IF EXISTS public.usage_tracking CASCADE;
DROP TABLE IF EXISTS public.user_containers CASCADE;
DROP TABLE IF EXISTS public.user_credentials CASCADE;
DROP TABLE IF EXISTS public.communications CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.integrations CASCADE;
DROP TABLE IF EXISTS public.automation_rules CASCADE;
DROP TABLE IF EXISTS public.agent_templates CASCADE;
DROP TABLE IF EXISTS public.agent_packages CASCADE;
DROP TABLE IF EXISTS public.competitor_analysis CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop any existing enums
DROP TYPE IF EXISTS public.agent_status CASCADE;
DROP TYPE IF EXISTS public.communication_type CASCADE;
DROP TYPE IF EXISTS public.integration_type CASCADE;
DROP TYPE IF EXISTS public.lead_status CASCADE;
DROP TYPE IF EXISTS public.subscription_plan CASCADE;
DROP TYPE IF EXISTS public.subscription_status CASCADE;

-- Create fresh enums for our MVP
CREATE TYPE public.agent_status AS ENUM ('draft', 'active', 'paused');
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted');
CREATE TYPE public.communication_type AS ENUM ('sms', 'voice', 'email');
CREATE TYPE public.integration_type AS ENUM ('meta_ads', 'google_ads', 'calendly', 'webhooks');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agents table
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status public.agent_status DEFAULT 'draft',
  prompt_template TEXT,
  voice_config JSONB DEFAULT '{}',
  sms_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  status public.lead_status DEFAULT 'new',
  source TEXT,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create communications table
CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  type public.communication_type NOT NULL,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  content TEXT,
  status TEXT DEFAULT 'sent',
  external_id TEXT,
  cost_cents INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create integrations table
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.integration_type NOT NULL,
  credentials JSONB DEFAULT '{}',
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for agents
CREATE POLICY "Users can view own agents" ON public.agents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own agents" ON public.agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own agents" ON public.agents
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own agents" ON public.agents
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for leads
CREATE POLICY "Users can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leads" ON public.leads
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for communications
CREATE POLICY "Users can view own communications" ON public.communications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own communications" ON public.communications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own communications" ON public.communications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for integrations
CREATE POLICY "Users can view own integrations" ON public.integrations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own integrations" ON public.integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own integrations" ON public.integrations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own integrations" ON public.integrations
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();