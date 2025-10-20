-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  basename TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();