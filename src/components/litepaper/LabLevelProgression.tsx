import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const levelData = [
  {
    level: "Level 1",
    minTVL: 10,
    maxTVL: 50,
    appSlots: 1,
    color: "hsl(var(--primary))",
  },
  {
    level: "Level 2",
    minTVL: 50,
    maxTVL: 250,
    appSlots: 2,
    color: "hsl(var(--secondary))",
  },
  {
    level: "Level 3",
    minTVL: 250,
    maxTVL: 1000,
    appSlots: 3,
    color: "hsl(var(--accent))",
  },
];

export default function LabLevelProgression() {
  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Lab Growth Levels & Thresholds</h3>
      <Card className="p-6 bg-gradient-card border-border">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={levelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="level" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              label={{ value: "TVL ($K)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
              formatter={(value: any, name: string) => {
                if (name === "minTVL") return [`$${value}K`, "Min TVL"];
                if (name === "maxTVL") return [`$${value}K`, "Max TVL"];
                if (name === "appSlots") return [value, "App Slots"];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="minTVL" name="Min TVL" stackId="a">
              {levelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.6} />
              ))}
            </Bar>
            <Bar dataKey="maxTVL" name="Max TVL" stackId="b">
              {levelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {levelData.map((level) => (
            <div key={level.level} className="p-4 rounded-lg border border-border bg-background/50">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: level.color }}
                />
                <h4 className="font-bold">{level.level}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                TVL: ${level.minTVL}K - ${level.maxTVL}K
              </p>
              <p className="text-sm font-medium mt-1">
                {level.appSlots} App Slot{level.appSlots > 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
