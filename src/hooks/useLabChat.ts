import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ethers } from 'ethers';

interface LabChatMessage {
  id: string;
  sender_address: string;
  content: string;
  created_at: string;
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
  userAddress: string | null,
  labVaultAddress: string | null,
  isHoldersOnly: boolean
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
  const canSendMessages = !isHoldersOnly || userRole === 'holder';

  // Load messages from database
  useEffect(() => {
    if (!labId) return;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const { data, error } = await supabase.functions.invoke('lab-chat', {
          body: { action: 'getMessages', labId }
        });

        if (error) throw error;
        if (data?.messages) {
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
    const channel = supabase
      .channel(`lab-${labId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lab_messages',
          filter: `lab_id=eq.${labId}`,
        },
        (payload) => {
          console.log('[LabChat] New message received:', payload);
          setMessages((prev) => [...prev, payload.new as LabChatMessage]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [labId]);

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

      if (isHoldersOnly && !canSendMessages) {
        setError('Only token holders can send messages in this lab');
        return;
      }

      if (!content.trim()) {
        setError('Message cannot be empty');
        return;
      }

      setIsSendingMessage(true);
      setError(null);

      try {
        const { data, error: sendError } = await supabase.functions.invoke('lab-chat', {
          body: {
            action: 'send',
            labId,
            senderAddress: userAddress,
            content: content.trim(),
          }
        });

        if (sendError) throw sendError;
        console.log('[LabChat] Message sent successfully:', data);
      } catch (err: any) {
        console.error('[LabChat] Error sending message:', err);
        setError(err.message || 'Failed to send message');
      } finally {
        setIsSendingMessage(false);
      }
    },
    [userAddress, labId, isHoldersOnly, canSendMessages]
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
