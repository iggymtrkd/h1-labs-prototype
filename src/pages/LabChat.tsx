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
  "2": {
    name: "ArtProof",
    symbol: "ART",
    price: "175,000",
    color: "hsl(280 75% 58%)",
    apps: [
      { name: "Verify AI", icon: "V" },
      { name: "ArtScan Pro", icon: "A" },
      { name: "Canvas Trace", icon: "C" },
    ],
    channels: ["General", "Authenticity", "Market", "Resources"],
    messages: [
      {
        id: 1,
        user: "ArtCollector_99",
        avatar: "AC",
        message: "Just validated a Picasso dataset. The accuracy is incredible!",
        time: "9:15 AM",
        color: "hsl(280 75% 58%)",
      },
      {
        id: 2,
        user: "GalleryExpert",
        avatar: "GE",
        message: "New provenance tracking module is live",
        time: "9:42 AM",
        color: "hsl(80 95% 49%)",
        isAnnouncement: true,
      },
      {
        id: 3,
        user: "MuseumCurator",
        avatar: "MC",
        message: "Looking forward to the Renaissance dataset release!",
        time: "11:20 AM",
        color: "hsl(240 10% 18%)",
      },
    ],
    owners: [
      { name: "Isabella Romano", role: "Lead Curator", status: "online", avatar: "IR" },
      { name: "Marcus Dubois", role: "Tech Director", status: "offline", avatar: "MD" },
    ],
    holders: [
      { name: "ArtCollector_99", tokens: "78,500", avatar: "AC" },
      { name: "Gallery_Master", tokens: "65,200", avatar: "GM" },
      { name: "ProvTracker", tokens: "52,100", avatar: "PT" },
    ],
    guests: [
      { name: "Visitor_Art123", avatar: "V1" },
      { name: "NewCollector", avatar: "NC" },
    ],
    priceData: [
      { value: 0.028 },
      { value: 0.029 },
      { value: 0.027 },
      { value: 0.028 },
      { value: 0.026 },
      { value: 0.027 },
      { value: 0.028 },
    ],
  },
  "3": {
    name: "RoboTrace",
    symbol: "ROBO",
    price: "425,000",
    color: "hsl(200 85% 58%)",
    apps: [
      { name: "AutoNav", icon: "A" },
      { name: "SensorFusion", icon: "S" },
      { name: "PathPlanner", icon: "P" },
    ],
    channels: ["Engineering", "Testing", "Safety", "Updates"],
    messages: [
      {
        id: 1,
        user: "RoboDev_42",
        avatar: "RD",
        message: "New obstacle detection dataset just dropped. Testing now.",
        time: "2:30 PM",
        color: "hsl(200 85% 58%)",
      },
      {
        id: 2,
        user: "AI_Engineer",
        avatar: "AE",
        message: "The LIDAR data quality is phenomenal 🚀",
        time: "3:15 PM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 3,
        user: "SafetyFirst",
        avatar: "SF",
        message: "All datasets passed safety validation ✓",
        time: "4:45 PM",
        color: "hsl(240 10% 18%)",
      },
    ],
    owners: [
      { name: "Dr. Alex Tanaka", role: "Lead Engineer", status: "online", avatar: "AT" },
      { name: "Sofia Martinez", role: "Safety Lead", status: "online", avatar: "SM" },
    ],
    holders: [
      { name: "RoboDev_42", tokens: "156,000", avatar: "RD" },
      { name: "AutoSystems", tokens: "142,000", avatar: "AS" },
      { name: "TechVision", tokens: "98,000", avatar: "TV" },
    ],
    guests: [
      { name: "ResearchStudent", avatar: "RS" },
      { name: "Industry_Observer", avatar: "IO" },
      { name: "StartupFounder", avatar: "SF" },
    ],
    priceData: [
      { value: 0.052 },
      { value: 0.054 },
      { value: 0.053 },
      { value: 0.055 },
      { value: 0.056 },
      { value: 0.057 },
      { value: 0.056 },
    ],
  },
  "4": {
    name: "MedicalMind",
    symbol: "MEDM",
    price: "520,000",
    color: "hsl(150 80% 48%)",
    apps: [
      { name: "DiagnosticsAI", icon: "D" },
      { name: "ClinicalHelper", icon: "C" },
      { name: "HealthPredict", icon: "H" },
    ],
    channels: ["Clinical", "Research", "Diagnostics", "Ethics"],
    messages: [
      {
        id: 1,
        user: "Dr_Wilson",
        avatar: "DW",
        message: "The new diagnostic reasoning dataset is a game changer for rare diseases.",
        time: "8:00 AM",
        color: "hsl(150 80% 48%)",
      },
      {
        id: 2,
        user: "ClinicDirector",
        avatar: "CD",
        message: "Partnership announcement with Mayo Clinic coming soon!",
        time: "10:30 AM",
        color: "hsl(150 80% 48%)",
        isAnnouncement: true,
      },
      {
        id: 3,
        user: "MedResearcher",
        avatar: "MR",
        message: "Can we get more cardiology case studies in the next batch?",
        time: "2:15 PM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 4,
        user: "AI_Medic",
        avatar: "AM",
        message: "Absolutely! Adding 500 new cases this week.",
        time: "2:18 PM",
        color: "hsl(80 95% 49%)",
        align: "right",
      },
    ],
    owners: [
      { name: "Dr. Emily Zhang", role: "Chief Medical Officer", status: "online", avatar: "EZ" },
      { name: "Dr. Robert Johnson", role: "Research Director", status: "offline", avatar: "RJ" },
    ],
    holders: [
      { name: "Dr_Wilson", tokens: "210,000", avatar: "DW" },
      { name: "HealthSystems_Inc", tokens: "189,000", avatar: "HS" },
      { name: "MedTech_Ventures", tokens: "165,000", avatar: "MT" },
      { name: "ClinicalAI_Group", tokens: "142,000", avatar: "CA" },
    ],
    guests: [
      { name: "MedStudent_2024", avatar: "MS" },
      { name: "Pharmaceutical_Rep", avatar: "PR" },
      { name: "Healthcare_Analyst", avatar: "HA" },
    ],
    priceData: [
      { value: 0.064 },
      { value: 0.066 },
      { value: 0.068 },
      { value: 0.071 },
      { value: 0.073 },
      { value: 0.074 },
      { value: 0.073 },
    ],
  },
  "5": {
    name: "LegalLogic",
    symbol: "LEGAL",
    price: "245,000",
    color: "hsl(30 85% 55%)",
    apps: [
      { name: "CaseLaw Pro", icon: "C" },
      { name: "ContractAI", icon: "C" },
      { name: "LegalBrief", icon: "L" },
    ],
    channels: ["Practice", "Case_Law", "Contracts", "Compliance"],
    messages: [
      {
        id: 1,
        user: "AttorneySmith",
        avatar: "AS",
        message: "The contract analysis dataset saved me 20 hours this week.",
        time: "1:45 PM",
        color: "hsl(30 85% 55%)",
      },
      {
        id: 2,
        user: "LegalTech_Pro",
        avatar: "LP",
        message: "New Supreme Court rulings added to the database 📚",
        time: "3:00 PM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 3,
        user: "ParalegalMike",
        avatar: "PM",
        message: "Anyone working on IP law datasets?",
        time: "4:30 PM",
        color: "hsl(240 10% 18%)",
      },
    ],
    owners: [
      { name: "Margaret Chen, JD", role: "Legal Director", status: "offline", avatar: "MC" },
      { name: "David Park, Esq", role: "Tech Lead", status: "online", avatar: "DP" },
    ],
    holders: [
      { name: "AttorneySmith", tokens: "92,000", avatar: "AS" },
      { name: "LawFirm_Partners", tokens: "85,000", avatar: "LF" },
      { name: "LegalTech_Corp", tokens: "71,000", avatar: "LT" },
    ],
    guests: [
      { name: "LawStudent_NYU", avatar: "LS" },
      { name: "Corporate_Counsel", avatar: "CC" },
    ],
    priceData: [
      { value: 0.032 },
      { value: 0.033 },
      { value: 0.034 },
      { value: 0.033 },
      { value: 0.034 },
      { value: 0.035 },
      { value: 0.034 },
    ],
  },
  "6": {
    name: "GenomeData",
    symbol: "GENE",
    price: "680,000",
    color: "hsl(330 85% 58%)",
    apps: [
      { name: "GenomeSeq", icon: "G" },
      { name: "DNAnalyzer", icon: "D" },
      { name: "PersonaMed", icon: "P" },
    ],
    channels: ["Genomics", "Research", "Privacy", "Clinical"],
    messages: [
      {
        id: 1,
        user: "Geneticist_PhD",
        avatar: "GP",
        message: "The new CRISPR dataset integration is brilliant!",
        time: "7:30 AM",
        color: "hsl(330 85% 58%)",
      },
      {
        id: 2,
        user: "BioInformatics",
        avatar: "BI",
        message: "Major update: 10,000 new genome sequences validated ✨",
        time: "9:00 AM",
        color: "hsl(330 85% 58%)",
        isAnnouncement: true,
      },
      {
        id: 3,
        user: "PrivacyOfficer",
        avatar: "PO",
        message: "All data meets HIPAA and GDPR compliance standards.",
        time: "11:45 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 4,
        user: "LabTech_Emma",
        avatar: "LE",
        message: "Working on rare disease variant database. ETA next month!",
        time: "2:00 PM",
        color: "hsl(80 95% 49%)",
      },
    ],
    owners: [
      { name: "Dr. Lisa Kumar", role: "Chief Geneticist", status: "online", avatar: "LK" },
      { name: "Prof. Michael Chen", role: "Research Lead", status: "online", avatar: "MC" },
      { name: "Dr. Nina Patel", role: "Privacy Officer", status: "offline", avatar: "NP" },
    ],
    holders: [
      { name: "Geneticist_PhD", tokens: "298,000", avatar: "GP" },
      { name: "BioTech_Ventures", tokens: "267,000", avatar: "BV" },
      { name: "PharmaCorp", tokens: "234,000", avatar: "PC" },
      { name: "Research_Institute", tokens: "198,000", avatar: "RI" },
    ],
    guests: [
      { name: "PhD_Candidate", avatar: "PC" },
      { name: "Biotech_Investor", avatar: "BI" },
      { name: "Clinical_Trialist", avatar: "CT" },
    ],
    priceData: [
      { value: 0.075 },
      { value: 0.079 },
      { value: 0.083 },
      { value: 0.086 },
      { value: 0.089 },
      { value: 0.090 },
      { value: 0.089 },
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
