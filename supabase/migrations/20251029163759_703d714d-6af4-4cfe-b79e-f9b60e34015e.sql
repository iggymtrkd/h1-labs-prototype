-- Drop existing table if it exists
DROP TABLE IF EXISTS public.lab_messages CASCADE;

-- Create lab_messages table for storing chat messages
CREATE TABLE public.lab_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id TEXT NOT NULL,
  channel_type TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add check constraint
ALTER TABLE public.lab_messages ADD CONSTRAINT channel_type_check CHECK (channel_type IN ('open', 'holders'));

-- Enable RLS
ALTER TABLE public.lab_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Anyone can read lab messages"
ON public.lab_messages
FOR SELECT
USING (true);

-- Allow anyone to insert messages
CREATE POLICY "Anyone can insert messages"
ON public.lab_messages
FOR INSERT
WITH CHECK (true);

-- Add index for better query performance
CREATE INDEX idx_lab_messages_lab_channel ON public.lab_messages(lab_id, channel_type, created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_messages;