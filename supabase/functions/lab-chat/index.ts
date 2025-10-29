import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { action, labId, channelType, senderAddress, content, limit = 50 } = await req.json();
    console.log('[lab-chat] Received request:', { action, labId, channelType, senderAddress: senderAddress?.slice(0, 10) });

    if (action === 'send') {
      // Validate required fields
      if (!labId || !channelType || !senderAddress || !content) {
        console.error('[lab-chat] Missing required fields:', { labId, channelType, senderAddress, content });
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[lab-chat] Inserting message for lab:', labId, 'channel:', channelType);

      // Insert message
      const { data, error } = await supabase
        .from('lab_messages')
        .insert({
          lab_id: labId,
          channel_type: channelType,
          sender_address: senderAddress.toLowerCase(),
          content: content
        })
        .select()
        .single();

      if (error) {
        console.error('[lab-chat] Error inserting message:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[lab-chat] Message inserted successfully:', data.id);
      return new Response(
        JSON.stringify({ success: true, message: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'getMessages') {
      // Validate required fields
      if (!labId || !channelType) {
        console.error('[lab-chat] Missing labId or channelType:', { labId, channelType });
        return new Response(
          JSON.stringify({ error: 'Missing labId or channelType' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[lab-chat] Fetching messages for lab:', labId, 'channel:', channelType);

      // Get messages
      const { data, error } = await supabase
        .from('lab_messages')
        .select('*')
        .eq('lab_id', labId)
        .eq('channel_type', channelType)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('[lab-chat] Error fetching messages:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('[lab-chat] Found', data?.length || 0, 'messages');
      return new Response(
        JSON.stringify({ messages: data || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error('[lab-chat] Invalid action:', action);
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[lab-chat] Error in lab-chat function:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
