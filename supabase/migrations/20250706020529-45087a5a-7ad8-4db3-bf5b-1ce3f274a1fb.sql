-- Create Facebook integrations table for storing OAuth tokens
CREATE TABLE public.facebook_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  facebook_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  granted_permissions TEXT[],
  account_name TEXT,
  account_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, facebook_user_id)
);

-- Enable RLS
ALTER TABLE public.facebook_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies for facebook_integrations
CREATE POLICY "Users can view their own Facebook integrations" 
ON public.facebook_integrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Facebook integrations" 
ON public.facebook_integrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Facebook integrations" 
ON public.facebook_integrations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Facebook integrations" 
ON public.facebook_integrations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_facebook_integrations_updated_at
BEFORE UPDATE ON public.facebook_integrations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();