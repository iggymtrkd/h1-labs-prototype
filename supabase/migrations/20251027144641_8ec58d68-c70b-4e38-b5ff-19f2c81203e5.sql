-- Create table for lab messages
CREATE TABLE public.lab_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_id TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lab_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing messages (anyone can view)
CREATE POLICY "Anyone can view lab messages"
ON public.lab_messages
FOR SELECT
USING (true);

-- Create policy for inserting messages (must match sender address)
CREATE POLICY "Users can send messages"
ON public.lab_messages
FOR INSERT
WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX idx_lab_messages_lab_id ON public.lab_messages(lab_id, created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_messages;