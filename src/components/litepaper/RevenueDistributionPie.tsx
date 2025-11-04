import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";

const revenueData = [
  { name: "H1 Buyback (All Holders)", value: 40, color: "hsl(var(--primary))" },
  { name: "Data Creators", value: 20, color: "hsl(var(--secondary))" },
  { name: "Scholars (Validators)", value: 20, color: "hsl(142, 76%, 36%)" },
  { name: "App Developers", value: 15, color: "hsl(var(--accent))" },
  { name: "Protocol Treasury", value: 5, color: "hsl(262, 83%, 58%)" },
];

export default function RevenueDistributionPie() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Revenue Distribution Model: Per-Dataset Purchase
          </h3>
          <p className="text-sm text-muted-foreground">
            How dataset purchase revenue is split across stakeholders
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: any) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown */}
          <div className="space-y-4">
            <div>
              <Badge className="mb-3 bg-primary">Per Dataset Sale</Badge>
              <p className="text-xs text-muted-foreground mb-4">
                Example: $10,000 dataset purchase
              </p>
            </div>

            {revenueData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}% = ${(item.value * 100).toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-5">
                  {item.name === "H1 Buyback (All Holders)" && "Distributed proportionally to all H1 token holders"}
                  {item.name === "Data Creators" && "Direct payment to scholars who create data"}
                  {item.name === "Scholars (Validators)" && "Direct payment to scholars who validate data"}
                  {item.name === "App Developers" && "Rewards for SDK and app builders"}
                  {item.name === "Protocol Treasury" && "Operations and infrastructure costs"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Context */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-semibold mb-2 text-primary">Key Mechanic</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Automated by smart contracts</li>
                <li>• Transparent & auditable on-chain</li>
                <li>• No middlemen or manual invoicing</li>
                <li>• Instant distribution on purchase</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2 text-secondary">Hold Incentive</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Hold H1 = earn from all sales</li>
                <li>• Buyback reduces supply</li>
                <li>• NAV increases with revenue</li>
                <li>• Compounding appreciation effect</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2 text-accent">Payment Options</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• ETH (primary, recommended)</li>
                <li>• USDC / USDT (stablecoins)</li>
                <li>• $LABS (protocol token)</li>
                <li>• 5% bulk discount (3+ datasets)</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
