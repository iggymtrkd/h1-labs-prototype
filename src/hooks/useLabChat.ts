import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
import { LabVault_ABI } from '@/contracts/abis';

export interface LabChatMessage {
  id: string;
  content: string;
  senderAddress: string;
  timestamp: Date;
  isOwn: boolean;
}

export interface UseLabChatReturn {
  messages: LabChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  canSendMessages: boolean;
  userRole: 'owner' | 'holder' | 'guest';
  tokenBalance: string;
  sendMessage: (content: string) => Promise<void>;
  error: string | null;
}

export function useLabChat(
  xmtpClient: Client | null,
  labId: string,
  userAddress: string | null,
  labVaultAddress: string | null,
  isHoldersOnly: boolean = false
): UseLabChatReturn {
  const [messages, setMessages] = useState<LabChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<Conversation | null>(null);
  const streamRef = useRef<any>(null);

  // Check user's token balance to determine role
  const checkTokenBalance = useCallback(async () => {
    if (!labVaultAddress || !userAddress) {
      setTokenBalance('0');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const vaultContract = new ethers.Contract(labVaultAddress, LabVault_ABI, provider);
      const balance = await vaultContract.balanceOf(userAddress);
      setTokenBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error('[LabChat] Error checking token balance:', err);
      setTokenBalance('0');
    }
  }, [labVaultAddress, userAddress]);

  // Determine user role based on token balance
  const userRole: 'owner' | 'holder' | 'guest' = parseFloat(tokenBalance) > 0 ? 'holder' : 'guest';
  const canSendMessages = parseFloat(tokenBalance) > 0;

  // Initialize conversation and start streaming messages
  useEffect(() => {
    if (!xmtpClient || !labId) return;
    
    // Reset messages when switching between open/gated
    setMessages([]);

    const initConversation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('[LabChat] Initializing conversation for lab:', labId, 'holdersOnly:', isHoldersOnly);
        
        // Create a unique topic for this lab (separate for open vs gated)
        const topic = isHoldersOnly ? `/h1labs/lab/${labId}/holders` : `/h1labs/lab/${labId}/open`;
        
        // Get or create conversation with the lab topic
        const conversations = await xmtpClient.conversations.list();
        let conversation = conversations.find(c => c.topic === topic);
        
        if (!conversation) {
          // For group chat, we'd need to create with multiple addresses
          // For now, create a simple conversation (this is a simplified version)
          console.log('[LabChat] Creating new conversation for lab');
          // Note: In production, you'd use XMTP's group chat feature
        }
        
        // Load existing messages
        if (conversation) {
          conversationRef.current = conversation;
          const existingMessages = await conversation.messages();
          
          const formattedMessages: LabChatMessage[] = existingMessages.map((msg: DecodedMessage) => ({
            id: msg.id,
            content: msg.content as string,
            senderAddress: msg.senderAddress,
            timestamp: msg.sent,
            isOwn: msg.senderAddress.toLowerCase() === xmtpClient.address.toLowerCase(),
          }));
          
          setMessages(formattedMessages.reverse());
          
          // Start streaming new messages
          const stream = await conversation.streamMessages();
          streamRef.current = stream;
          
          for await (const message of stream) {
            console.log('[LabChat] New message received:', message);
            setMessages(prev => [...prev, {
              id: message.id,
              content: message.content as string,
              senderAddress: message.senderAddress,
              timestamp: message.sent,
              isOwn: message.senderAddress.toLowerCase() === xmtpClient.address.toLowerCase(),
            }]);
          }
        }
      } catch (err: any) {
        console.error('[LabChat] Error initializing conversation:', err);
        setError(err.message || 'Failed to initialize chat');
      } finally {
        setIsLoading(false);
      }
    };

    initConversation();

    return () => {
      if (streamRef.current) {
        streamRef.current.return?.();
      }
    };
  }, [xmtpClient, labId, isHoldersOnly]);

  // Check token balance on mount and periodically
  useEffect(() => {
    checkTokenBalance();
    const interval = setInterval(checkTokenBalance, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkTokenBalance]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationRef.current) {
      setError('Chat not initialized');
      return;
    }
    
    if (isHoldersOnly && !canSendMessages) {
      setError('You need to hold lab tokens to send messages in holders chat');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      console.log('[LabChat] Sending message:', content);
      await conversationRef.current.send(content);
      console.log('[LabChat] Message sent successfully');
    } catch (err: any) {
      console.error('[LabChat] Error sending message:', err);
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setIsSending(false);
    }
  }, [canSendMessages, isHoldersOnly]);

  return {
    messages,
    isLoading,
    isSending,
    canSendMessages,
    userRole,
    tokenBalance,
    sendMessage,
    error,
  };
}
