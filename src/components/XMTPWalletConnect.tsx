import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

export function XMTPWalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Chat Wallet: {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      variant="outline"
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet for Chat
    </Button>
  );
}
