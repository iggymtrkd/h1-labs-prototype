import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const initialOwnershipData = [
  { name: "Lab Owner (Vested 6mo)", value: 30, color: "hsl(var(--primary))" },
  { name: "Bonding Curve (Liquid)", value: 10, color: "hsl(var(--secondary))" },
  { name: "Scholar Reserve (Vested)", value: 40, color: "hsl(142, 76%, 36%)" },
  { name: "Dev Reserve (Vested)", value: 15, color: "hsl(var(--accent))" },
  { name: "Protocol Treasury (Instant)", value: 5, color: "hsl(0, 84%, 60%)" },
];

export default function LabOwnershipPie() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Initial Lab Ownership Distribution
          </h3>
          <p className="text-sm text-muted-foreground">
            How ownership is allocated when a lab is first created
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={initialOwnershipData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {initialOwnershipData.map((entry, index) => (
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
              <Badge className="mb-3 bg-primary">At Launch</Badge>
              <p className="text-xs text-muted-foreground mb-4">
                Example: 100,000 H1 minted from 100,000 LABS staked
              </p>
            </div>

            {initialOwnershipData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
                <p className="text-xs text-muted-foreground pl-5">
                  {item.name === "Lab Owner (Vested 6mo)" && "30% → Vested H1 tokens for 6 months"}
                  {item.name === "Bonding Curve (Liquid)" && "10% → Liquid H1 tokens on the bonding curve"}
                  {item.name === "Scholar Reserve (Vested)" && "40% → Vested H1 tokens for the scholar reserve"}
                  {item.name === "Dev Reserve (Vested)" && "15% → Vested H1 tokens for the dev reserve"}
                  {item.name === "Protocol Treasury (Instant)" && "5% → Instant H1 tokens for the protocol treasury"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Context */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold mb-2 text-primary">Founder Advantages</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Largest initial H1 token allocation</li>
                <li>• First-mover benefit on bonding curve</li>
                <li>• Controls lab governance initially</li>
                <li>• Receives 50% of all dataset revenue</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2 text-secondary">Public Staker Benefits</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Can buy H1 tokens at fair bonding curve price</li>
                <li>• Proportional governance rights</li>
                <li>• Share in dataset revenue via H1 appreciation</li>
                <li>• Benefit from buyback mechanisms</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2 text-primary">Lab Owner</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Receives 30% of initial H1 allocation</li>
                <li>• Vested over 6 months (weekly unlocks)</li>
                <li>• Can claim vested tokens from week 1</li>
                <li>• Receives 50% of all dataset revenue</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2 text-secondary">H1 Distribution Model</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Scholar Reserve (40%) - Pays validators & data creators</li>
                <li>• Dev Reserve (15%) - Rewards SDK/app developers</li>
                <li>• Bonding Curve (10%) - Immediate community trading</li>
                <li>• Protocol Treasury (5%) - Operations & infrastructure</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
