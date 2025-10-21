import { useState, useCallback } from "react";
import { Dataset } from "@/components/DatasetCard";

interface PurchaseData {
  datasets: Dataset[];
  totalAmount: number;
  paymentMethod: "eth" | "stables" | "labs";
}

interface PurchaseResult {
  success: boolean;
  txHash?: string;
  blockNumber?: number;
  error?: string;
  receipt?: {
    transactionHash: string;
    blockNumber: number;
    gasUsed: string;
    status: number;
  };
}

interface RevenueDistribution {
  labOwners: number;
  creators: number;
  supervisors: number;
  buybackReserve: number;
  h1Protocol: number;
}

export function useDatasetPurchase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null);

  /**
   * Execute dataset purchase via blockchain
   * Calls RevenueFacet.batchDistributeRevenue() on H1Diamond
   * Revenue per dataset is distributed to that dataset's lab
   */
  const purchaseDatasets = useCallback(
    async (purchaseData: PurchaseData): Promise<PurchaseResult> => {
      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        // Check if wallet is connected
        if (!window.ethereum) {
          throw new Error("Ethereum wallet not installed");
        }

        // Get provider and signer using ethers v6
        const { ethers } = await import("ethers");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        console.log("🔗 Connected wallet:", userAddress);

        // Get H1Diamond address from environment
        const diamondAddress =
          process.env.REACT_APP_H1_DIAMOND_ADDRESS ||
          "0x0000000000000000000000000000000000000000";

        if (diamondAddress === "0x0000000000000000000000000000000000000000") {
          throw new Error(
            "H1Diamond address not configured. Set REACT_APP_H1_DIAMOND_ADDRESS."
          );
        }

        console.log("💎 H1Diamond address:", diamondAddress);

        // Prepare function data for batch distribution
        // Each dataset maps to its own lab
        const datasetIds = purchaseData.datasets.map((ds) => BigInt(ds.id.replace("ds_", "")));
        const labIds = purchaseData.datasets.map((ds) => BigInt(ds.labId));
        const amounts = purchaseData.datasets.map((ds) => BigInt(Math.round(ds.price * 1e18)));

        console.log("📊 Batch Distribution Data:", {
          datasetIds: datasetIds.map(String),
          labIds: labIds.map(String),
          amounts: amounts.map(String),
          totalValue: purchaseData.totalAmount,
          paymentMethod: purchaseData.paymentMethod,
        });

        // Create contract interface for RevenueFacet.batchDistributeRevenue()
        const abi = [
          "function batchDistributeRevenue(uint256[] calldata datasetIds, uint256[] calldata labIds, uint256[] calldata amounts) external payable",
        ];

        const iface = new ethers.Interface(abi);
        const encodedData = iface.encodeFunctionData("batchDistributeRevenue", [
          datasetIds,
          labIds,
          amounts,
        ]);

        // Prepare transaction
        const tx = {
          to: diamondAddress,
          data: encodedData,
          value: ethers.parseEther(
            (purchaseData.totalAmount / 1e18).toString()
          ),
        };

        console.log("📝 Transaction prepared:", tx);

        // Show user confirmation
        const estimateGas = await provider.estimateGas(tx);
        console.log("⛽ Estimated gas:", estimateGas.toString());

        // Send transaction
        const txResponse = await signer.sendTransaction(tx);
        console.log("🚀 Transaction sent:", txResponse.hash);

        setTxHash(txResponse.hash);

        // Wait for receipt
        const txReceipt = await txResponse.wait(1); // Wait for 1 confirmation

        if (!txReceipt) {
          throw new Error("Transaction failed - no receipt");
        }

        console.log("✅ Transaction confirmed:", txReceipt.hash);
        setReceipt(txReceipt);

        return {
          success: true,
          txHash: txReceipt.hash,
          blockNumber: txReceipt.blockNumber,
          receipt: {
            transactionHash: txReceipt.hash,
            blockNumber: txReceipt.blockNumber,
            gasUsed: txReceipt.gasUsed.toString(),
            status: txReceipt.status,
          },
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("❌ Transaction error:", errorMessage);
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Calculate revenue distribution for UI preview
   * Per-dataset distribution:
   * - Lab Owners: 50%
   * - Data Creators: 40%
   * - Supervisors: 10%
   * - Buyback Reserve: 20%
   * - H1 Protocol: 5%
   * Total: 125% (represents where each dollar goes)
   */
  const calculateRevenueDistribution = useCallback(
    (totalAmount: number): RevenueDistribution => {
      return {
        labOwners: Math.round(totalAmount * 0.5),      // 50%
        creators: Math.round(totalAmount * 0.4),       // 40%
        supervisors: Math.round(totalAmount * 0.1),    // 10%
        buybackReserve: Math.round(totalAmount * 0.2), // 20%
        h1Protocol: Math.round(totalAmount * 0.05),    // 5%
      };
    },
    []
  );

  /**
   * Encode batch transaction for smart contract
   * Returns structured data ready for blockchain call
   * Per-dataset/per-lab distribution ensures revenue goes to the correct lab owner
   */
  const encodeBatchTransaction = useCallback(
    (purchaseData: PurchaseData) => {
      const datasetIds = purchaseData.datasets.map((ds) => ds.id);
      const labIds = purchaseData.datasets.map((ds) => ds.labId);
      const amounts = purchaseData.datasets.map((ds) => ds.price);

      return {
        to: process.env.REACT_APP_H1_DIAMOND_ADDRESS,
        functionName: "batchDistributeRevenue",
        args: [datasetIds, labIds, amounts],
        value: purchaseData.totalAmount.toString(),
        description: `Batch purchase of ${purchaseData.datasets.length} datasets with per-lab revenue distribution`,
        datasets: purchaseData.datasets.map((ds) => ({
          id: ds.id,
          name: ds.name,
          price: ds.price,
          labId: ds.labId,
          labName: `Lab ${ds.labId}`,
        })),
      };
    },
    []
  );

  /**
   * Get transaction history URL for verification
   */
  const getExplorerUrl = useCallback((hash: string): string => {
    const explorerBase =
      process.env.REACT_APP_EXPLORER_URL || "https://sepolia.etherscan.io";
    return `${explorerBase}/tx/${hash}`;
  }, []);

  /**
   * Validate purchase data before sending
   */
  const validatePurchaseData = useCallback(
    (purchaseData: PurchaseData): { valid: boolean; error?: string } => {
      if (!purchaseData.datasets || purchaseData.datasets.length === 0) {
        return { valid: false, error: "No datasets selected" };
      }

      if (purchaseData.totalAmount <= 0) {
        return { valid: false, error: "Invalid total amount" };
      }

      if (!["eth", "stables", "labs"].includes(purchaseData.paymentMethod)) {
        return { valid: false, error: "Invalid payment method" };
      }

      // Verify all datasets have required fields
      for (const ds of purchaseData.datasets) {
        if (!ds.labId || ds.labId <= 0) {
          return { valid: false, error: `Dataset ${ds.id} has invalid lab ID` };
        }
        if (!ds.price || ds.price <= 0) {
          return { valid: false, error: `Dataset ${ds.id} has invalid price` };
        }
      }

      return { valid: true };
    },
    []
  );

  return {
    purchaseDatasets,
    calculateRevenueDistribution,
    encodeBatchTransaction,
    getExplorerUrl,
    validatePurchaseData,
    isLoading,
    error,
    txHash,
    receipt,
  };
}
