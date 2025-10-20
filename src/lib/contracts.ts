// Contract Interaction Layer for H1 Labs
import { getContract } from 'viem';
import { publicClient, getWalletClient } from '../config/provider';
import { CONTRACTS } from '../config/contracts';

// Import ABIs from deployed contracts
import H1DiamondABI from '../../contracts/JSONs/H1Diamond.json';
import LABSTokenABI from '../../contracts/JSONs/LABSToken.json';
import LABSCoreFacetABI from '../../contracts/JSONs/LABSCoreFacet.json';
import VaultFacetABI from '../../contracts/JSONs/VaultFacet.json';
import BondingCurveFacetABI from '../../contracts/JSONs/BondingCurveFacet.json';
import LabPassFacetABI from '../../contracts/JSONs/LabPassFacet.json';
import RevenueFacetABI from '../../contracts/JSONs/RevenueFacet.json';
import TreasuryFacetABI from '../../contracts/JSONs/TreasuryFacet.json';
import SecurityFacetABI from '../../contracts/JSONs/SecurityFacet.json';

// Parse ABIs (they're stored as compiled artifacts)
const parseABI = (artifact: any) => {
  if (typeof artifact === 'string') {
    const parsed = JSON.parse(artifact);
    return parsed.abi || parsed;
  }
  return artifact.abi || artifact;
};

// H1 Diamond Contract (proxy - use facet ABIs for function calls)
export function getH1Diamond(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.H1Diamond as `0x${string}`,
      abi: parseABI(H1DiamondABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.H1Diamond as `0x${string}`,
    abi: parseABI(H1DiamondABI),
    client: publicClient,
  });
}

// LABS Token Contract
export function getLABSToken(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.LABSToken as `0x${string}`,
      abi: parseABI(LABSTokenABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.LABSToken as `0x${string}`,
    abi: parseABI(LABSTokenABI),
    client: publicClient,
  });
}

// LABSCore Facet (via Diamond proxy)
export function getLABSCoreFacet(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.H1Diamond as `0x${string}`,
      abi: parseABI(LABSCoreFacetABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.H1Diamond as `0x${string}`,
    abi: parseABI(LABSCoreFacetABI),
    client: publicClient,
  });
}

// Vault Facet (via Diamond proxy)
export function getVaultFacet(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.H1Diamond as `0x${string}`,
      abi: parseABI(VaultFacetABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.H1Diamond as `0x${string}`,
    abi: parseABI(VaultFacetABI),
    client: publicClient,
  });
}

// LabVault Contract (deployed per lab)
export function getLabVault(vaultAddress: string, withSigner = false) {
  // LabVault ABI - simplified for now
  const LabVaultABI = [
    'function depositLABS(uint256 assets, address receiver) external returns (uint256 shares)',
    'function requestRedeem(uint256 shares) external returns (uint256 requestId, uint256 assets)',
    'function claimRedeem(uint256 requestId) external',
    'function cancelRedeem(uint256 requestId) external returns (uint256 shares)',
    'function totalAssets() external view returns (uint256)',
    'function balanceOf(address account) external view returns (uint256)',
    'function getLevel() external view returns (uint8)',
    'function getAppSlots() external view returns (uint8)',
    'function previewDeposit(uint256 assets) external view returns (uint256 shares)',
    'function previewRedeem(uint256 shares) external view returns (uint256 assets)',
  ];

  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: vaultAddress as `0x${string}`,
      abi: LabVaultABI,
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: vaultAddress as `0x${string}`,
    abi: LabVaultABI,
    client: publicClient,
  });
}

// Bonding Curve Facet (via Diamond proxy)
export function getBondingCurveFacet(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.H1Diamond as `0x${string}`,
      abi: parseABI(BondingCurveFacetABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.H1Diamond as `0x${string}`,
    abi: parseABI(BondingCurveFacetABI),
    client: publicClient,
  });
}

// LabPass Facet (via Diamond proxy)
export function getLabPassFacet(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.H1Diamond as `0x${string}`,
      abi: parseABI(LabPassFacetABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.H1Diamond as `0x${string}`,
    abi: parseABI(LabPassFacetABI),
    client: publicClient,
  });
}

// Revenue Facet (via Diamond proxy)
export function getRevenueFacet(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.H1Diamond as `0x${string}`,
      abi: parseABI(RevenueFacetABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.H1Diamond as `0x${string}`,
    abi: parseABI(RevenueFacetABI),
    client: publicClient,
  });
}

// Treasury Facet (via Diamond proxy)
export function getTreasuryFacet(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.H1Diamond as `0x${string}`,
      abi: parseABI(TreasuryFacetABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.H1Diamond as `0x${string}`,
    abi: parseABI(TreasuryFacetABI),
    client: publicClient,
  });
}

// Security Facet (via Diamond proxy)
export function getSecurityFacet(withSigner = false) {
  if (withSigner) {
    const walletClient = getWalletClient();
    return getContract({
      address: CONTRACTS.H1Diamond as `0x${string}`,
      abi: parseABI(SecurityFacetABI),
      client: { public: publicClient, wallet: walletClient },
    });
  }
  return getContract({
    address: CONTRACTS.H1Diamond as `0x${string}`,
    abi: parseABI(SecurityFacetABI),
    client: publicClient,
  });
}

// Helper: Format units (wei to ether)
export function formatUnits(value: bigint, decimals = 18): string {
  const divisor = 10n ** BigInt(decimals);
  const wholePart = value / divisor;
  const fractionalPart = value % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  return `${wholePart}.${fractionalStr}`;
}

// Helper: Parse units (ether to wei)
export function parseUnits(value: string, decimals = 18): bigint {
  const [whole, fraction = ''] = value.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}


