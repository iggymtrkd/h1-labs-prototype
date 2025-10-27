import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

export function XMTPWalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center justify-between gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      className="w-full gap-2"
    >
      <Wallet className="h-4 w-4" />
      Connect Chat Wallet
    </Button>
  );
}
