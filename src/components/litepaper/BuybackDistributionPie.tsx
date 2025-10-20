import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign } from "lucide-react";

const buybackData = [
  { name: "Lab Owner (Direct Revenue)", value: 50, color: "hsl(var(--primary))", description: "Founder/owner receives half of all dataset sales" },
  { name: "Protocol Treasury (H1 Pool Custody)", value: 25, color: "hsl(var(--secondary))", description: "Used for grants to validators and platform development" },
  { name: "Buyback Budget (All H1 Holders)", value: 15, color: "hsl(var(--accent))", description: "Buy pressure benefits all H1 token holders proportionally" },
  { name: "Validators/Scholars (Contributors)", value: 10, color: "hsl(142, 76%, 36%)", description: "Rewards for data enrichment and validation work" },
];

const example = {
  saleAmount: 100000,
  labOwner: 50000,
  treasury: 25000,
  buyback: 15000,
  validators: 10000,
};

export default function BuybackDistributionPie() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Revenue Distribution & Buyback Mechanics
          </h3>
          <p className="text-sm text-muted-foreground">
            How dataset sales revenue is split among stakeholders
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={buybackData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {buybackData.map((entry, index) => (
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
              <Badge className="mb-3 bg-primary">Example: $100K Dataset Sale</Badge>
            </div>

            {buybackData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-semibold truncate">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">${(example.saleAmount * item.value / 100).toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-5">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column: Recipients */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold mb-2 text-primary">Lab Owner (50%)</p>
                <p className="text-xs text-muted-foreground">
                  Direct payment for creating and managing the lab. Incentivizes high-quality dataset curation.
                </p>
              </div>

              <div>
                <p className="text-sm font-bold mb-2 text-secondary">Protocol Treasury (25%)</p>
                <p className="text-xs text-muted-foreground">
                  Funds validator grants, platform development, compliance infrastructure, and ecosystem growth.
                </p>
              </div>
            </div>

            {/* Right Column: Mechanisms */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold mb-2 text-accent">Buyback Budget (15%)</p>
                <p className="text-xs text-muted-foreground">
                  Creates constant buy pressure on H1 tokens. Benefits all holders through supply reduction and price appreciation.
                </p>
              </div>

              <div>
                <p className="text-sm font-bold mb-2" style={{ color: "hsl(142, 76%, 36%)" }}>Validators/Scholars (10%)</p>
                <p className="text-xs text-muted-foreground">
                  Rewards contributors who enriched and validated the dataset. Distributed proportionally based on contribution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <p className="text-sm font-bold mb-2">Economic Impact</p>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-semibold text-primary mb-1">Lab Owners</p>
              <p className="text-muted-foreground">Earn 50% + H1 appreciation from buybacks</p>
            </div>
            <div>
              <p className="font-semibold text-accent mb-1">H1 Holders</p>
              <p className="text-muted-foreground">Benefit from 15% buyback + decreasing supply</p>
            </div>
            <div>
              <p className="font-semibold text-secondary mb-1">Validators</p>
              <p className="text-muted-foreground">10% direct + treasury grants for quality work</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
