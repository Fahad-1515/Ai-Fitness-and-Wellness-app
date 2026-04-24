-- Add health fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS medical_conditions TEXT[],
  ADD COLUMN IF NOT EXISTS medications TEXT[],
  ADD COLUMN IF NOT EXISTS injuries TEXT,
  ADD COLUMN IF NOT EXISTS avg_sleep_hours NUMERIC,
  ADD COLUMN IF NOT EXISTS stress_level INTEGER,
  ADD COLUMN IF NOT EXISTS smoking_status TEXT,
  ADD COLUMN IF NOT EXISTS alcohol_frequency TEXT;

-- Health assessments history
CREATE TABLE IF NOT EXISTS public.health_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  input_snapshot JSONB NOT NULL,
  insights TEXT NOT NULL,
  intensity_level TEXT,
  precautions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health assessments"
  ON public.health_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health assessments"
  ON public.health_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_health_assessments_user_created
  ON public.health_assessments(user_id, created_at DESC);