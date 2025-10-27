import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: 'a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2', // Public fallback ID
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
