import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dataset } from "@/components/DatasetCard";
import { useDatasetPurchase } from "@/hooks/useDatasetPurchase";
import {
  AlertCircle,
  CheckCircle2,
  Zap,
  Lock,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Loader,
} from "lucide-react";

interface CheckoutItem extends Dataset {
  quantity?: number;
}

interface CheckoutState {
  items: CheckoutItem[];
  total: number;
}

export default function CheckoutCart() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("eth");
  const [purchaseStep, setPurchaseStep] = useState<"review" | "processing" | "success" | "error">("review");

  const {
    purchaseDatasets,
    calculateRevenueDistribution,
    validatePurchaseData,
    getExplorerUrl,
    isLoading,
    error,
    txHash,
    receipt,
  } = useDatasetPurchase();

  const state = location.state as CheckoutState | undefined;
  const cartItems = state?.items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const protocolFee = Math.round(subtotal * 0.02);
  const bulkDiscount = cartItems.length >= 3 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + protocolFee - bulkDiscount;

  const revenue = calculateRevenueDistribution(total);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <h2 className="text-white font-semibold mb-2">Cart is Empty</h2>
          <p className="text-slate-400 mb-4">
            Browse datasets and add them to your cart to get started.
          </p>
          <Button onClick={() => navigate("/marketplace")}>
            Back to Marketplace
          </Button>
        </Card>
      </div>
    );
  }

  const handleCheckout = async () => {
    const validation = validatePurchaseData({
      datasets: cartItems,
      totalAmount: total,
      paymentMethod: paymentMethod as "eth" | "stables" | "labs",
    });

    if (!validation.valid) {
      alert(`Validation error: ${validation.error}`);
      return;
    }

    setPurchaseStep("processing");

    const result = await purchaseDatasets({
      datasets: cartItems,
      totalAmount: total,
      paymentMethod: paymentMethod as "eth" | "stables" | "labs",
    });

    if (result.success) {
      setPurchaseStep("success");
    } else {
      setPurchaseStep("error");
    }
  };

  // Render success state
  if (purchaseStep === "success" && txHash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-gradient-to-br from-green-900/20 to-slate-800 border-green-700/50 p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Purchase Complete! 🎉
            </h1>
            <p className="text-slate-300 mb-6">
              Your dataset purchase has been successfully processed on the blockchain.
            </p>

            <div className="bg-slate-800/50 p-6 rounded-lg mb-6 text-left">
              <h3 className="text-white font-semibold mb-3">Purchase Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Datasets Purchased:</span>
                  <span className="text-white font-semibold">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="text-white font-semibold">${total.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between">
                  <span className="text-slate-400">Transaction Hash:</span>
                  <a
                    href={getExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-mono text-xs flex items-center gap-1"
                  >
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 p-6 rounded-lg mb-6 text-left">
              <h3 className="text-white font-semibold mb-3">Revenue Distribution</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-green-900/20 p-3 rounded border border-green-700/50">
                  <div className="text-slate-400 mb-1">Lab Owners (50%)</div>
                  <div className="text-green-400 font-bold">
                    ${revenue.labOwners.toLocaleString()}
                  </div>
                </div>
                <div className="bg-blue-900/20 p-3 rounded border border-blue-700/50">
                  <div className="text-slate-400 mb-1">Creators (40%)</div>
                  <div className="text-blue-400 font-bold">
                    ${revenue.creators.toLocaleString()}
                  </div>
                </div>
                <div className="bg-purple-900/20 p-3 rounded border border-purple-700/50">
                  <div className="text-slate-400 mb-1">Supervisors (10%)</div>
                  <div className="text-purple-400 font-bold">
                    ${revenue.supervisors.toLocaleString()}
                  </div>
                </div>
                <div className="bg-yellow-900/20 p-3 rounded border border-yellow-700/50">
                  <div className="text-slate-400 mb-1">Buyback (20%)</div>
                  <div className="text-yellow-400 font-bold">
                    ${revenue.buybackReserve.toLocaleString()}
                  </div>
                </div>
                <div className="bg-indigo-900/20 p-3 rounded border border-indigo-700/50 col-span-2">
                  <div className="text-slate-400 mb-1">H1 Protocol (5%)</div>
                  <div className="text-indigo-400 font-bold">
                    ${revenue.h1Protocol.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  navigate("/marketplace");
                  window.location.reload();
                }}
              >
                Continue Shopping
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() =>
                  window.open(getExplorerUrl(txHash), "_blank")
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render error state
  if (purchaseStep === "error" && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="bg-gradient-to-br from-red-900/20 to-slate-800 border-red-700/50 p-8">
            <div className="flex items-start gap-4 mb-6">
              <AlertCircle className="h-12 w-12 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Purchase Failed
                </h1>
                <p className="text-red-300">{error}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded mb-6 text-sm text-slate-300">
              <p>Please check your wallet balance and try again.</p>
              {txHash && (
                <p className="mt-2">
                  Transaction hash: <code className="text-xs">{txHash}</code>
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setPurchaseStep("review");
                }}
              >
                Try Again
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/marketplace")}
              >
                Back to Marketplace
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render processing state
  if (purchaseStep === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 text-center max-w-md">
          <Loader className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-white font-semibold mb-2 text-xl">
            Processing Purchase
          </h2>
          <p className="text-slate-400 mb-4">
            Please confirm the transaction in your wallet...
          </p>
          {txHash && (
            <p className="text-xs text-slate-500 font-mono break-all mb-4">
              TX: {txHash}
            </p>
          )}
          <div className="text-sm text-slate-400">
            <p>⏱️ This may take a few seconds</p>
          </div>
        </Card>
      </div>
    );
  }

  // Render review state (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-slate-300 hover:text-white"
          onClick={() => navigate("/marketplace")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>

        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <Card key={`${item.id}-${index}`} className="bg-slate-800 border-slate-700">
                <div className="p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                      <Badge variant="secondary">{item.domain}</Badge>
                      <span>{item.dataCount.toLocaleString()} data points</span>
                      <span className="flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                        {item.qualityScore}% quality
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Creator: {item.creator} | Supervisor: {item.supervisor}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-xl">
                      ${item.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Bulk Discount */}
            {cartItems.length >= 3 && (
              <Card className="bg-green-900/20 border-green-700/50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-300 font-semibold mb-1">
                      Bulk Purchase Discount Applied
                    </h4>
                    <p className="text-green-200 text-sm">
                      You're purchasing {cartItems.length} datasets! You qualify
                      for a 5% bulk discount, saving ${bulkDiscount.toLocaleString()}.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Compliance Notice */}
            <Card className="bg-blue-900/20 border-blue-700/50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-300 font-semibold mb-1">
                    Verified Compliance
                  </h4>
                  <p className="text-blue-200 text-sm">
                    All datasets are verified to comply with HIPAA, GDPR, and
                    other regulatory requirements. Your purchase is legally
                    auditable.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-4">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 pb-4 border-b border-slate-700">
                    <div className="flex justify-between text-slate-400">
                      <span>Datasets ({cartItems.length})</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Protocol Fee (2%)</span>
                      <span>${protocolFee.toLocaleString()}</span>
                    </div>
                    {bulkDiscount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Bulk Discount (5%)</span>
                        <span>-${bulkDiscount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-white font-bold text-lg pt-4 mb-4">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>

                  <div className="bg-slate-700/50 p-3 rounded text-xs text-slate-400">
                    ≈ {(total / 2500).toFixed(3)} ETH (@ $2500/ETH)
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="text-white font-semibold mb-3">
                    Payment Method
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: "eth", label: "ETH (Recommended)" },
                      { id: "stables", label: "USDC / USDT" },
                      { id: "labs", label: "$LABS Token" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-3 rounded border cursor-pointer transition ${
                          paymentMethod === method.id
                            ? "bg-blue-600 border-blue-500"
                            : "bg-slate-700 border-slate-600 hover:border-slate-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-white text-sm font-medium">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Revenue Distribution Preview */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-white text-sm font-semibold mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                    Revenue Distribution
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lab Owners (50%)</span>
                      <span className="text-green-400 font-semibold">
                        ${revenue.labOwners.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Data Creators (40%)</span>
                      <span className="text-green-400 font-semibold">
                        ${revenue.creators.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Supervisors (10%)</span>
                      <span className="text-green-400 font-semibold">
                        ${revenue.supervisors.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Buyback Reserve (20%)</span>
                      <span className="text-blue-400 font-semibold">
                        ${revenue.buybackReserve.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between">
                      <span className="text-slate-400">H1 Protocol (5%)</span>
                      <span className="text-purple-400 font-semibold">
                        ${revenue.h1Protocol.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Batch Transaction Info */}
                <div className="bg-purple-900/20 border border-purple-700/50 p-3 rounded text-xs text-purple-200">
                  <p className="font-semibold mb-1">Batch Transaction</p>
                  <p>
                    This purchase will execute a single on-chain transaction
                    that automatically distributes revenue to all creators,
                    supervisors, and protocol stakeholders.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                    onClick={handleCheckout}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Complete Purchase
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => navigate("/marketplace")}
                    disabled={isLoading}
                  >
                    Continue Shopping
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Secured by Ethereum smart contract
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
