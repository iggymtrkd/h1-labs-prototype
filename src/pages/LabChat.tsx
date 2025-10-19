import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Key, 
  Smile, 
  Paperclip, 
  ChevronUp,
  ExternalLink 
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Mock data for different labs
const labChatData = {
  "1": {
    name: "CardioLab",
    symbol: "CARDIO",
    price: "300,000",
    color: "hsl(263 97% 58%)",
    apps: [
      { name: "Wearable Maker", icon: "W" },
      { name: "Ghost Feet", icon: "G" },
      { name: "MiniChef", icon: "M" },
    ],
    channels: ["Block", "Rumors", "News", "Rules"],
    messages: [
      {
        id: 1,
        user: "L_Speak_Whale",
        avatar: "LW",
        message: "Are you there? I'm busy yesterday.",
        time: "10:50 AM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 2,
        user: "Necro_mancer",
        avatar: "NM",
        message: "Hello?",
        time: "10:50 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "DataDragon",
        avatar: "DD",
        message: "Okay...Do we have a deal?",
        time: "10:50 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 4,
        user: "Necro_mancer",
        avatar: "NM",
        message: "My announcement title\n\nTempor incididunt ut labore et dolore magna aliqua.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        time: "10:50 AM",
        color: "hsl(263 97% 58%)",
        isAnnouncement: true,
      },
      {
        id: 5,
        user: "HealthBot",
        avatar: "HB",
        message: "Hi there!",
        time: "1:03:32 AM",
        color: "hsl(80 95% 49%)",
        align: "right",
      },
    ],
    owners: [
      { name: "Dr. Sarah Chen", role: "Team/Moderator", status: "offline", avatar: "SC" },
      { name: "Prof. James Kim", role: "Team/Moderator", status: "online", avatar: "JK" },
    ],
    holders: [
      { name: "Holder Alpha", tokens: "125,000", avatar: "HA" },
      { name: "Holder Beta", tokens: "98,500", avatar: "HB" },
      { name: "Holder Gamma", tokens: "87,200", avatar: "HG" },
    ],
    guests: [
      { name: "Guest_Researcher1", avatar: "G1" },
      { name: "Guest_Researcher2", avatar: "G2" },
      { name: "Guest_Analyst", avatar: "GA" },
    ],
    priceData: [
      { value: 0.035 },
      { value: 0.037 },
      { value: 0.036 },
      { value: 0.039 },
      { value: 0.042 },
      { value: 0.041 },
      { value: 0.042 },
    ],
  },
};

export default function LabChat() {
  const { id } = useParams();
  const lab = labChatData[id as keyof typeof labChatData];

  if (!lab) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Lab Chat Not Found</h1>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to={`/lab/${id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Tabs defaultValue={lab.channels[0]} className="w-full">
              <TabsList className="bg-transparent">
                {lab.channels.map((channel) => (
                  <TabsTrigger
                    key={channel}
                    value={channel}
                    className="data-[state=active]:bg-transparent data-[state=active]:text-primary"
                  >
                    {channel}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-primary">
              <div className="w-2 h-2 rounded-full bg-background" />
            </Button>
            <Button variant="ghost" size="icon">
              <span className="text-muted-foreground">•••</span>
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl">
            {lab.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.align === "right" ? "justify-end" : ""}`}
              >
                {msg.align !== "right" && (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex-1 ${msg.align === "right" ? "max-w-md" : ""}`}>
                  {msg.align !== "right" && (
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: msg.color }}>
                        {msg.user}
                      </span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                  )}
                  <div
                    className={`${
                      msg.isAnnouncement
                        ? "bg-primary/20 border border-primary/30 p-4 rounded-lg"
                        : msg.align === "right"
                        ? "bg-primary text-primary-foreground px-4 py-2 rounded-lg inline-block"
                        : ""
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    {msg.isAnnouncement && (
                      <Button variant="link" className="text-primary px-0 mt-2 h-auto">
                        Show more
                      </Button>
                    )}
                  </div>
                  {msg.align === "right" && (
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {msg.time}
                    </div>
                  )}
                </div>
                {msg.align === "right" && (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-4 py-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Input
              placeholder="Type your message"
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border bg-card/50 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Lab Profile */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-bold" style={{ background: lab.color }}>
                {lab.symbol[0]}
              </div>
              <h2 className="text-2xl font-bold">{lab.name}</h2>
              <div className="text-3xl font-bold text-primary">
                {lab.price} ${lab.symbol}
              </div>
            </div>

            {/* Training Apps */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                Training apps
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {lab.apps.map((app, i) => (
                  <div key={i} className="text-center">
                    <div className="w-full aspect-square rounded-lg bg-gradient-secondary flex items-center justify-center text-2xl font-bold mb-2">
                      {app.icon}
                    </div>
                    <p className="text-xs text-muted-foreground">{app.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Chart */}
            <Card className="p-4 bg-muted/20 border-border">
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={lab.priceData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={lab.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* View Details Button */}
            <Link to={`/lab/${id}`}>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </Link>

            {/* Toggle to Holders Chat */}
            <Button className="w-full bg-gradient-primary">
              <Key className="mr-2 h-4 w-4" />
              Holders Chat
            </Button>

            {/* Owners Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Owners • {lab.owners.length}
                </h3>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {lab.owners.map((owner, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">{owner.avatar}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                          owner.status === "online" ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{owner.name}</p>
                      <p className="text-xs text-muted-foreground">{owner.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Holders Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Holders • {lab.holders.length}
                </h3>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {lab.holders.map((holder, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{holder.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{holder.name}</p>
                      <p className="text-xs text-primary font-semibold">{holder.tokens} tokens</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      #{i + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Guests Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Guests • {lab.guests.length}
                </h3>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                {lab.guests.map((guest, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{guest.avatar}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium truncate">{guest.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
