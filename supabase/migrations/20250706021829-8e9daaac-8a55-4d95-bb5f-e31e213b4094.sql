-- Create optimization insights table
CREATE TABLE public.optimization_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  performance_score INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'medium',
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_issues TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  next_actions TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  raw_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, campaign_id)
);

-- Enable RLS
ALTER TABLE public.optimization_insights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own optimization insights" 
ON public.optimization_insights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own optimization insights" 
ON public.optimization_insights 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own optimization insights" 
ON public.optimization_insights 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own optimization insights" 
ON public.optimization_insights 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_optimization_insights_updated_at
BEFORE UPDATE ON public.optimization_insights
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();