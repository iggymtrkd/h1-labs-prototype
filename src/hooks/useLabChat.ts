import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, type Group } from '@xmtp/browser-sdk';
import { ethers } from 'ethers';
import { LabVault_ABI } from '@/contracts/abis';
import { useBaseAccount } from '@/hooks/useBaseAccount';

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
  const { sdk } = useBaseAccount();
  const [messages, setMessages] = useState<LabChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<Group | null>(null);
  const streamRef = useRef<any>(null);

  // Check user's token balance to determine role
  const checkTokenBalance = useCallback(async () => {
    if (!labVaultAddress || !userAddress || !sdk) {
      setTokenBalance('0');
      return;
    }

    // Skip balance check for mock addresses (testnet placeholder vaults)
    if (labVaultAddress.match(/^0x0+[0-9]+$/)) {
      console.log('[LabChat] Skipping balance check for mock vault address');
      setTokenBalance('0');
      return;
    }

    try {
      const baseProvider = sdk.getProvider();
      const provider = new ethers.BrowserProvider(baseProvider);
      const vaultContract = new ethers.Contract(labVaultAddress, LabVault_ABI, provider);
      const balance = await vaultContract.balanceOf(userAddress);
      setTokenBalance(ethers.formatEther(balance));
    } catch (err) {
      console.warn('[LabChat] Could not check token balance - vault may not exist yet:', err);
      setTokenBalance('0');
    }
  }, [labVaultAddress, userAddress, sdk]);

  // Determine user role based on token balance
  const userRole: 'owner' | 'holder' | 'guest' = parseFloat(tokenBalance) > 0 ? 'holder' : 'guest';
  const canSendMessages = parseFloat(tokenBalance) > 0;

  // Initialize conversation and start streaming messages
  useEffect(() => {
    if (!xmtpClient || !labId) {
      if (labId && !xmtpClient) {
        setError('XMTP client not initialized. Please connect your wallet.');
      }
      return;
    }
    
    // Reset messages when switching between open/gated
    setMessages([]);

    const initConversation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('[LabChat] Initializing group chat for lab:', labId, 'holdersOnly:', isHoldersOnly);
        
        // For now, show a message that group chat is being set up
        // In production, you would:
        // 1. Create a group with the lab name
        // 2. Add members based on token holdings
        // 3. Use the group's inbox ID as the identifier
        
        setError('Lab group chat feature coming soon. XMTP is connected and ready!');
        console.log('[LabChat] XMTP client ready, group chat implementation pending');
        
        // TODO: Implement group creation
        // const group = await xmtpClient.conversations.newGroup(
        //   [/* member inbox IDs */],
        //   { name: `Lab ${labId}`, description: isHoldersOnly ? 'Holders Only' : 'Open Chat' }
        // );
        
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
