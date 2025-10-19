import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { createBaseAccountSDK } from '@base-org/account';
import { useBaseAccount } from '@/hooks/useBaseAccount';
import { useNavigate } from 'react-router-dom';

const sdk = createBaseAccountSDK({
  appName: 'H1 Labs',
  appLogoUrl: 'https://base.org/logo.png',
});

export const BaseWalletConnect = () => {
  const { setConnected } = useBaseAccount();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const provider = sdk.getProvider();
      await provider.request({ method: 'wallet_connect' });
      
      const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
      
      if (accounts && accounts.length > 0) {
        setConnected(accounts[0]);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <SignInWithBaseButton
      align="center"
      variant="solid"
      colorScheme="light"
      onClick={handleSignIn}
    />
  );
};
