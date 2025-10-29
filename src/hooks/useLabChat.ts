import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ethers } from 'ethers';

interface LabChatMessage {
  id: string;
  sender_address: string;
  content: string;
  created_at: string;
  lab_id: string;
  channel_type: string;
}

interface UseLabChatReturn {
  messages: LabChatMessage[];
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  userRole: 'holder' | 'visitor';
  tokenBalance: string;
  sendMessage: (content: string) => Promise<void>;
  error: string | null;
}

export function useLabChat(
  labId: string,
  channelType: 'open' | 'holders',
  userAddress: string | null,
  labVaultAddress: string | null
): UseLabChatReturn {
  const [messages, setMessages] = useState<LabChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  // Check token balance for access control
  const checkTokenBalance = useCallback(async () => {
    if (!labVaultAddress || !userAddress || labVaultAddress === '0x0000000000000000000000000000000000000000') {
      console.log('[LabChat] Skipping balance check for mock vault address');
      setTokenBalance('0');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        labVaultAddress,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      const balance = await contract.balanceOf(userAddress);
      setTokenBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error('[LabChat] Error checking token balance:', err);
      setTokenBalance('0');
    }
  }, [labVaultAddress, userAddress]);

  const userRole = parseFloat(tokenBalance) > 0 ? 'holder' : 'visitor';
  const canSendMessages = channelType === 'open' || userRole === 'holder';

  // Load messages from database
  useEffect(() => {
    if (!labId) return;

    console.log('[LabChat] Loading messages for lab:', labId, 'channel:', channelType);

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      setMessages([]); // Clear messages when switching channels
      try {
        const { data, error } = await supabase.functions.invoke('lab-chat', {
          body: { action: 'getMessages', labId, channelType }
        });

        console.log('[LabChat] Messages response:', { data, error });

        if (error) throw error;
        if (data?.messages) {
          console.log('[LabChat] Loaded', data.messages.length, 'messages');
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('[LabChat] Error loading messages:', err);
        setError('Failed to load messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();

    // Subscribe to realtime updates
    console.log('[LabChat] Setting up realtime subscription for lab:', labId, 'channel:', channelType);
    const channel = supabase
      .channel(`lab-chat-${labId}-${channelType}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lab_messages',
        },
        (payload) => {
          console.log('[LabChat] Realtime event received:', payload);
          const newMessage = payload.new as LabChatMessage;
          
          // Only add messages for current lab and channel
          if (newMessage.lab_id === labId && newMessage.channel_type === channelType) {
            console.log('[LabChat] Adding message from realtime:', newMessage);
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.some(msg => msg.id === newMessage.id)) {
                console.log('[LabChat] Duplicate message detected, skipping');
                return prev;
              }
              return [...prev, newMessage];
            });
          } else {
            console.log('[LabChat] Ignoring message for different lab/channel');
          }
        }
      )
      .subscribe((status) => {
        console.log('[LabChat] Subscription status:', status);
      });

    return () => {
      console.log('[LabChat] Cleaning up subscription');
      channel.unsubscribe();
    };
  }, [labId, channelType]);

  // Check token balance periodically
  useEffect(() => {
    checkTokenBalance();
    const interval = setInterval(checkTokenBalance, 30000);
    return () => clearInterval(interval);
  }, [checkTokenBalance]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!userAddress) {
        setError('Please connect your wallet');
        return;
      }

      if (channelType === 'holders' && !canSendMessages) {
        setError('Only token holders can send messages in holders channel');
        return;
      }

      if (!content.trim()) {
        setError('Message cannot be empty');
        return;
      }

      console.log('[LabChat] Sending message:', { labId, channelType, userAddress: userAddress.slice(0, 10) });

      setIsSendingMessage(true);
      setError(null);

      try {
        const { data, error: sendError } = await supabase.functions.invoke('lab-chat', {
          body: {
            action: 'send',
            labId,
            channelType,
            senderAddress: userAddress,
            content: content.trim(),
          }
        });

        console.log('[LabChat] Send response:', { data, error: sendError });

        if (sendError) throw sendError;
        console.log('[LabChat] Message sent successfully, realtime will update UI');
      } catch (err: any) {
        console.error('[LabChat] Error sending message:', err);
        setError(err.message || 'Failed to send message');
        throw err;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [userAddress, labId, channelType, canSendMessages]
  );

  return {
    messages,
    isLoadingMessages,
    isSendingMessage,
    userRole,
    tokenBalance,
    sendMessage,
    error,
  };
}
