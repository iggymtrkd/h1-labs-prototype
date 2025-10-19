import { useParams, Link } from "react-router-dom";
import { useState } from "react";
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
      { name: "HeartMonitor", icon: "H" },
      { name: "ECG Analyzer", icon: "E" },
      { name: "CardioScan", icon: "C" },
    ],
    channels: ["Block", "Rumors", "News", "Rules"],
    messages: [
      {
        id: 1,
        user: "Dr_Chen",
        avatar: "DC",
        message: "The new cardiac imaging dataset is incredible. Accuracy improved by 15%!",
        time: "10:32 AM",
        color: "hsl(263 97% 58%)",
      },
      {
        id: 2,
        user: "CardioResearcher",
        avatar: "CR",
        message: "Just analyzed the arrhythmia detection models. Results are promising 🫀",
        time: "10:45 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "TokenTrader_Pro",
        avatar: "TT",
        message: "CARDIO pumping! Up 127% this week. Partnership announcement incoming?",
        time: "11:02 AM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 4,
        user: "Prof_Kim",
        avatar: "PK",
        message: "Major Update: Phase 3 Clinical Trial Data Now Available\n\nOur collaboration with Stanford Medical has yielded groundbreaking results. The new ECG analysis dataset includes 50,000 annotated cases with expert validation.\n\nThis represents the largest publicly available cardiac dataset for AI training.",
        time: "11:15 AM",
        color: "hsl(263 97% 58%)",
        isAnnouncement: true,
      },
      {
        id: 5,
        user: "HealthBot",
        avatar: "HB",
        message: "Thanks for the update! When does the dataset go live?",
        time: "11:18 AM",
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
      { value: 0.025 },
      { value: 0.089 },
      { value: 0.031 },
      { value: 0.105 },
      { value: 0.042 },
      { value: 0.132 },
      { value: 0.058 },
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
        message: "Just validated a Monet with the new authentication AI. 99.8% confidence score!",
        time: "9:15 AM",
        color: "hsl(280 75% 58%)",
      },
      {
        id: 2,
        user: "GalleryExpert",
        avatar: "GE",
        message: "ART tokens consolidating nicely. Floor price holding strong at 0.028 ETH 📊",
        time: "9:28 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "Isabella_Romano",
        avatar: "IR",
        message: "Provenance Tracking 2.0 Launch\n\nExcited to announce our partnership with Christie's and Sotheby's. The new blockchain-verified provenance system goes live next week.\n\nThis will revolutionize art authentication.",
        time: "9:42 AM",
        color: "hsl(280 75% 58%)",
        isAnnouncement: true,
      },
      {
        id: 4,
        user: "MuseumCurator",
        avatar: "MC",
        message: "The Renaissance dataset is exactly what we needed for our exhibition!",
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
      { value: 0.018 },
      { value: 0.072 },
      { value: 0.024 },
      { value: 0.091 },
      { value: 0.035 },
      { value: 0.108 },
      { value: 0.029 },
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
        message: "Autonomous navigation update: New obstacle detection dataset with 2M labeled images just dropped 🤖",
        time: "2:30 PM",
        color: "hsl(200 85% 58%)",
      },
      {
        id: 2,
        user: "AI_Engineer",
        avatar: "AE",
        message: "The LIDAR point cloud quality is phenomenal. Edge cases finally covered!",
        time: "2:45 PM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "TokenWhale_88",
        avatar: "TW",
        message: "ROBO just broke resistance at 0.055! Volume up 340% 🚀📈",
        time: "3:15 PM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 4,
        user: "SafetyFirst",
        avatar: "SF",
        message: "All safety validation tests passed. ISO 26262 compliant ✓",
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
      { value: 0.039 },
      { value: 0.125 },
      { value: 0.047 },
      { value: 0.098 },
      { value: 0.055 },
      { value: 0.142 },
      { value: 0.068 },
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
        message: "The new diagnostic reasoning dataset is a game changer for rare diseases. Already seeing 92% accuracy on zebra diagnoses!",
        time: "8:00 AM",
        color: "hsl(150 80% 48%)",
      },
      {
        id: 2,
        user: "MedResearcher",
        avatar: "MR",
        message: "MEDM price action looking healthy. Broke through $0.08 resistance 💊📈",
        time: "9:15 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "Dr_Zhang",
        avatar: "DZ",
        message: "Mayo Clinic Partnership Announcement\n\nWe're thrilled to announce our collaboration with Mayo Clinic to develop the world's largest annotated medical imaging dataset.\n\n15,000+ radiology cases with expert annotations. Launch date: March 1st.",
        time: "10:30 AM",
        color: "hsl(150 80% 48%)",
        isAnnouncement: true,
      },
      {
        id: 4,
        user: "ClinicDirector",
        avatar: "CD",
        message: "This is huge for medical AI! Can we get early access for our hospital network?",
        time: "10:45 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 5,
        user: "AI_Medic",
        avatar: "AM",
        message: "Early access applications open next week. Priority for token holders 🏥",
        time: "10:52 AM",
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
      { value: 0.045 },
      { value: 0.138 },
      { value: 0.056 },
      { value: 0.119 },
      { value: 0.072 },
      { value: 0.165 },
      { value: 0.081 },
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
        message: "The contract analysis AI just saved me 20 hours on a M&A deal. This is incredible! ⚖️",
        time: "1:45 PM",
        color: "hsl(30 85% 55%)",
      },
      {
        id: 2,
        user: "LegalWhale",
        avatar: "LW",
        message: "LEGAL tokens up 45% today. Smart contracts integration news driving the pump 📊",
        time: "2:20 PM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "LegalTech_Pro",
        avatar: "LP",
        message: "2024 Supreme Court rulings now in the database. 500+ new precedent cases indexed 📚",
        time: "3:00 PM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 4,
        user: "ParalegalMike",
        avatar: "PM",
        message: "Anyone working on IP law datasets? Need patent case analysis for a client.",
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
      { value: 0.022 },
      { value: 0.095 },
      { value: 0.028 },
      { value: 0.113 },
      { value: 0.041 },
      { value: 0.087 },
      { value: 0.036 },
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
        message: "The new CRISPR dataset integration is brilliant! Gene editing accuracy prediction at 97.3% 🧬",
        time: "7:30 AM",
        color: "hsl(330 85% 58%)",
      },
      {
        id: 2,
        user: "CryptoMed_Investor",
        avatar: "CI",
        message: "GENE just hit new ATH! Price discovery mode after the NIH partnership leak 🚀",
        time: "8:15 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "BioInformatics",
        avatar: "BI",
        message: "Genome Database Milestone\n\n10,000 new whole genome sequences now validated and available! Includes rare disease variants and pharmacogenomic data.\n\nThis is the largest publicly available genomic dataset for precision medicine AI.",
        time: "9:00 AM",
        color: "hsl(330 85% 58%)",
        isAnnouncement: true,
      },
      {
        id: 4,
        user: "PrivacyOfficer",
        avatar: "PO",
        message: "All genomic data meets HIPAA, GDPR, and GINA compliance standards. Privacy-first architecture ✓",
        time: "11:45 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 5,
        user: "LabTech_Emma",
        avatar: "LE",
        message: "Working on rare disease variant database. 2,500 ultra-rare mutations cataloged. ETA March!",
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
      { value: 0.051 },
      { value: 0.158 },
      { value: 0.068 },
      { value: 0.142 },
      { value: 0.079 },
      { value: 0.189 },
      { value: 0.095 },
    ],
  },
  "7": {
    name: "GameSense",
    symbol: "GAME",
    price: "620,000",
    color: "hsl(270 75% 60%)",
    apps: [
      { name: "CharacterForge", icon: "C" },
      { name: "GameAI Studio", icon: "G" },
      { name: "DialogueCraft", icon: "D" },
    ],
    channels: ["Development", "NPC_AI", "Procedural", "Community"],
    messages: [
      {
        id: 1,
        user: "GameDev_Alex",
        avatar: "GA",
        message: "New NPC dialogue dataset includes 50K conversations with emotional context tagging! 🎮",
        time: "11:00 AM",
        color: "hsl(270 75% 60%)",
      },
      {
        id: 2,
        user: "TokenGamer_99",
        avatar: "TG",
        message: "GAME price up 18.9% today! Unity integration announcement drove major volume 📈",
        time: "11:30 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "StudioDirector",
        avatar: "SD",
        message: "Unreal Engine 5 Plugin Released\n\nOur H1 SDK plugin for UE5 is now live! Integrate provenance-verified game AI datasets directly into your projects.\n\nIncludes procedural generation, character behavior, and world-building datasets.",
        time: "12:15 PM",
        color: "hsl(270 75% 60%)",
        isAnnouncement: true,
      },
      {
        id: 4,
        user: "IndieCreator",
        avatar: "IC",
        message: "This is exactly what indie devs needed. Finally ethical AI training data for games!",
        time: "1:45 PM",
        color: "hsl(80 95% 49%)",
      },
    ],
    owners: [
      { name: "Sarah Martinez", role: "Game AI Lead", status: "online", avatar: "SM" },
      { name: "James Wong", role: "Creative Director", status: "online", avatar: "JW" },
    ],
    holders: [
      { name: "GameDev_Alex", tokens: "145,000", avatar: "GA" },
      { name: "StudioVentures", tokens: "128,000", avatar: "SV" },
      { name: "IndieCollective", tokens: "98,000", avatar: "IC" },
    ],
    guests: [
      { name: "Unity_Developer", avatar: "UD" },
      { name: "AIArtist_Pro", avatar: "AP" },
      { name: "GameDesigner_42", avatar: "GD" },
    ],
    priceData: [
      { value: 0.038 },
      { value: 0.067 },
      { value: 0.045 },
      { value: 0.078 },
      { value: 0.052 },
      { value: 0.085 },
      { value: 0.061 },
    ],
  },
  "8": {
    name: "FinTrack",
    symbol: "FIN",
    price: "785,000",
    color: "hsl(190 80% 55%)",
    apps: [
      { name: "FraudDetect", icon: "F" },
      { name: "ComplianceAI", icon: "C" },
      { name: "KYC Validator", icon: "K" },
    ],
    channels: ["Compliance", "AML", "Fraud", "Market_Data"],
    messages: [
      {
        id: 1,
        user: "FinAnalyst_Pro",
        avatar: "FP",
        message: "New AML pattern recognition dataset just cleared SEC review. 99.2% fraud detection rate! 💰",
        time: "9:00 AM",
        color: "hsl(190 80% 55%)",
      },
      {
        id: 2,
        user: "ComplianceOfficer",
        avatar: "CO",
        message: "FIN breaking out! +7.3% on banking partnership rumors. Institutional interest surging 📊",
        time: "10:15 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "RiskManager_Sarah",
        avatar: "RS",
        message: "The transaction anomaly detection is phenomenal. Caught 3 suspicious patterns our legacy system missed.",
        time: "11:45 AM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 4,
        user: "BankingAI_Lead",
        avatar: "BL",
        message: "KYC automation dataset now includes 200K verified identity cases. Full GDPR compliance ✓",
        time: "2:30 PM",
        color: "hsl(190 80% 55%)",
      },
    ],
    owners: [
      { name: "David Chen CFA", role: "Financial Lead", status: "online", avatar: "DC" },
      { name: "Rachel Kim", role: "Compliance Director", status: "offline", avatar: "RK" },
    ],
    holders: [
      { name: "FinAnalyst_Pro", tokens: "189,000", avatar: "FP" },
      { name: "BankingCorp", tokens: "167,000", avatar: "BC" },
      { name: "FinTech_Ventures", tokens: "142,000", avatar: "FV" },
    ],
    guests: [
      { name: "Quant_Trader", avatar: "QT" },
      { name: "RegTech_Analyst", avatar: "RA" },
      { name: "Banking_Consultant", avatar: "BC" },
    ],
    priceData: [
      { value: 0.055 },
      { value: 0.078 },
      { value: 0.062 },
      { value: 0.089 },
      { value: 0.071 },
      { value: 0.095 },
      { value: 0.074 },
    ],
  },
  "9": {
    name: "StratAI",
    symbol: "STRAT",
    price: "1,120,000",
    color: "hsl(15 75% 55%)",
    apps: [
      { name: "TacticalMap", icon: "T" },
      { name: "RiskAssess", icon: "R" },
      { name: "SecureComm", icon: "S" },
    ],
    channels: ["Classified", "Operations", "Analytics", "Ethics"],
    messages: [
      {
        id: 1,
        user: "Defense_Analyst",
        avatar: "DA",
        message: "Threat assessment dataset cleared DoD review. ITAR compliant with full audit trail 🛡️",
        time: "8:30 AM",
        color: "hsl(15 75% 55%)",
      },
      {
        id: 2,
        user: "Strategic_Investor",
        avatar: "SI",
        message: "STRAT holding strong despite broader market volatility. Defense sector demand is solid.",
        time: "9:45 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "Ethics_Officer",
        avatar: "EO",
        message: "All datasets meet DoD AI Ethics Framework requirements. Human oversight validated ✓",
        time: "11:00 AM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 4,
        user: "Operations_Lead",
        avatar: "OL",
        message: "Geospatial analysis models showing excellent performance on simulation datasets.",
        time: "2:15 PM",
        color: "hsl(15 75% 55%)",
      },
    ],
    owners: [
      { name: "Col. Marcus Reed", role: "Strategic Director", status: "offline", avatar: "MR" },
      { name: "Dr. Elena Volkov", role: "AI Ethics Lead", status: "online", avatar: "EV" },
    ],
    holders: [
      { name: "Defense_Contractor_A", tokens: "312,000", avatar: "DA" },
      { name: "SecureVentures", tokens: "278,000", avatar: "SV" },
      { name: "Strategic_Fund", tokens: "245,000", avatar: "SF" },
    ],
    guests: [
      { name: "Cleared_Analyst", avatar: "CA" },
      { name: "Systems_Engineer", avatar: "SE" },
    ],
    priceData: [
      { value: 0.082 },
      { value: 0.105 },
      { value: 0.091 },
      { value: 0.115 },
      { value: 0.098 },
      { value: 0.122 },
      { value: 0.103 },
    ],
  },
  "12": {
    name: "GovData",
    symbol: "GOV",
    price: "695,000",
    color: "hsl(220 70% 58%)",
    apps: [
      { name: "PolicyAI", icon: "P" },
      { name: "CitizenServe", icon: "C" },
      { name: "PublicData", icon: "P" },
    ],
    channels: ["Policy", "Services", "Transparency", "Innovation"],
    messages: [
      {
        id: 1,
        user: "Policy_Analyst",
        avatar: "PA",
        message: "New public policy dataset includes 20 years of regulatory impact data. FedRAMP authorized! 🏛️",
        time: "9:00 AM",
        color: "hsl(220 70% 58%)",
      },
      {
        id: 2,
        user: "Gov_Investor",
        avatar: "GI",
        message: "GOV price up 9.6% after federal contract announcement. Smart city initiatives driving demand 📊",
        time: "10:15 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "Digital_Services",
        avatar: "DS",
        message: "Citizen Services AI Platform Launch\n\nPartnership with 15 state governments to modernize public services. AI-powered chatbots for DMV, benefits, and permits.\n\n500K historical service requests now available as training data.",
        time: "11:30 AM",
        color: "hsl(220 70% 58%)",
        isAnnouncement: true,
      },
      {
        id: 4,
        user: "Municipal_Tech",
        avatar: "MT",
        message: "The predictive maintenance models for infrastructure are incredible. Already deployed in 3 cities! 🌆",
        time: "2:00 PM",
        color: "hsl(80 95% 49%)",
      },
    ],
    owners: [
      { name: "Director Sarah Johnson", role: "Public Sector Lead", status: "online", avatar: "SJ" },
      { name: "Dr. Robert Martinez", role: "Innovation Officer", status: "online", avatar: "RM" },
    ],
    holders: [
      { name: "GovTech_Fund", tokens: "198,000", avatar: "GF" },
      { name: "Municipal_Ventures", tokens: "176,000", avatar: "MV" },
      { name: "Public_Sector_AI", tokens: "154,000", avatar: "PS" },
    ],
    guests: [
      { name: "City_Planner", avatar: "CP" },
      { name: "Federal_Analyst", avatar: "FA" },
      { name: "Innovation_Lead", avatar: "IL" },
    ],
    priceData: [
      { value: 0.048 },
      { value: 0.071 },
      { value: 0.056 },
      { value: 0.079 },
      { value: 0.063 },
      { value: 0.085 },
      { value: 0.068 },
    ],
  },
  "10": {
    name: "EduLab",
    symbol: "EDU",
    price: "485,000",
    color: "hsl(45 85% 58%)",
    apps: [
      { name: "LearningPath", icon: "L" },
      { name: "AssessAI", icon: "A" },
      { name: "TutorBot", icon: "T" },
    ],
    channels: ["Pedagogy", "Assessment", "Research", "Ethics"],
    messages: [
      {
        id: 1,
        user: "Prof_Anderson",
        avatar: "PA",
        message: "New adaptive learning dataset includes 100K student interaction patterns. FERPA compliant! 📚",
        time: "10:00 AM",
        color: "hsl(45 85% 58%)",
      },
      {
        id: 2,
        user: "EdTech_Founder",
        avatar: "EF",
        message: "EDU price looking strong. University partnership announcement next week should drive demand 📈",
        time: "11:30 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "Education_Researcher",
        avatar: "ER",
        message: "The assessment prediction models are remarkably accurate. Great for personalized learning!",
        time: "1:15 PM",
        color: "hsl(80 95% 49%)",
      },
      {
        id: 4,
        user: "AI_Tutor_Dev",
        avatar: "AT",
        message: "Natural language Q&A dataset enriched with 50K teacher-verified responses. Quality is exceptional.",
        time: "3:00 PM",
        color: "hsl(45 85% 58%)",
      },
    ],
    owners: [
      { name: "Dr. Jennifer Lee", role: "Education Director", status: "online", avatar: "JL" },
      { name: "Prof. Robert Singh", role: "Research Lead", status: "online", avatar: "RS" },
    ],
    holders: [
      { name: "Prof_Anderson", tokens: "167,000", avatar: "PA" },
      { name: "EdTech_Ventures", tokens: "145,000", avatar: "EV" },
      { name: "University_Fund", tokens: "123,000", avatar: "UF" },
    ],
    guests: [
      { name: "Teacher_Network", avatar: "TN" },
      { name: "K12_Developer", avatar: "KD" },
      { name: "EdResearcher_99", avatar: "ER" },
    ],
    priceData: [
      { value: 0.032 },
      { value: 0.051 },
      { value: 0.039 },
      { value: 0.058 },
      { value: 0.044 },
      { value: 0.062 },
      { value: 0.048 },
    ],
  },
  "11": {
    name: "GreenLens",
    symbol: "GREEN",
    price: "545,000",
    color: "hsl(140 70% 50%)",
    apps: [
      { name: "ClimateModel", icon: "C" },
      { name: "EcoMonitor", icon: "E" },
      { name: "SustainAI", icon: "S" },
    ],
    channels: ["Climate", "Monitoring", "Policy", "Research"],
    messages: [
      {
        id: 1,
        user: "Climate_Scientist",
        avatar: "CS",
        message: "New satellite imaging dataset covers 500K sq km of deforestation patterns. Resolution is incredible! 🌍",
        time: "7:45 AM",
        color: "hsl(140 70% 50%)",
      },
      {
        id: 2,
        user: "Green_Investor",
        avatar: "GI",
        message: "GREEN up 14.8%! ESG fund allocations driving sustained buying pressure 📊",
        time: "9:00 AM",
        color: "hsl(240 10% 18%)",
      },
      {
        id: 3,
        user: "Environmental_NGO",
        avatar: "EN",
        message: "Carbon Emissions Tracking Dataset Released\n\nPartnership with UN Environment Programme announced. 10-year historical emissions data across 150 countries.\n\nOpen access for climate research institutions.",
        time: "10:30 AM",
        color: "hsl(140 70% 50%)",
        isAnnouncement: true,
      },
      {
        id: 4,
        user: "Sustainability_Lead",
        avatar: "SL",
        message: "Biodiversity monitoring models showing 95% accuracy in species identification. Game changer! 🦋",
        time: "2:00 PM",
        color: "hsl(80 95% 49%)",
      },
    ],
    owners: [
      { name: "Dr. Maria Silva", role: "Climate Lead", status: "online", avatar: "MS" },
      { name: "Prof. James Green", role: "Environmental Director", status: "online", avatar: "JG" },
    ],
    holders: [
      { name: "Climate_Fund", tokens: "178,000", avatar: "CF" },
      { name: "Green_Ventures", tokens: "156,000", avatar: "GV" },
      { name: "ESG_Investors", tokens: "134,000", avatar: "EI" },
    ],
    guests: [
      { name: "Environmental_Scientist", avatar: "ES" },
      { name: "Policy_Analyst", avatar: "PA" },
      { name: "Sustainability_Consultant", avatar: "SC" },
    ],
    priceData: [
      { value: 0.037 },
      { value: 0.059 },
      { value: 0.046 },
      { value: 0.068 },
      { value: 0.053 },
      { value: 0.072 },
      { value: 0.058 },
    ],
  },
};

export default function LabChat() {
  const { id } = useParams();
  const [isHoldersOnly, setIsHoldersOnly] = useState(false);
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsHoldersOnly(!isHoldersOnly)}
              className={`rounded-full transition-colors ${
                isHoldersOnly ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <Key className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <span className="text-muted-foreground">•••</span>
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className={`flex-1 p-4 ${isHoldersOnly ? "bg-primary/5" : ""}`}>
          {isHoldersOnly && (
            <div className="max-w-4xl mb-4 px-4 py-3 bg-primary/20 border border-primary/30 rounded-lg flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Holders-Only Chat</span>
            </div>
          )}
          <div className="space-y-4 max-w-4xl">
            {(isHoldersOnly 
              ? [
                  {
                    id: 101,
                    user: "Holder Alpha",
                    avatar: "HA",
                    message: "Price action looking strong! Up 127% this week. New partnerships definitely driving momentum 🚀",
                    time: "2:15 PM",
                    color: "hsl(263 97% 58%)",
                    isAnnouncement: false,
                  },
                  {
                    id: 102,
                    user: "Holder Beta",
                    avatar: "HB",
                    message: "Should we discuss the governance vote for the treasury allocation? $2M for new dataset partnerships.",
                    time: "2:18 PM",
                    color: "hsl(80 95% 49%)",
                    isAnnouncement: false,
                  },
                  {
                    id: 103,
                    user: "Holder Gamma",
                    avatar: "HG",
                    message: "I'm voting yes. The ROI projections are conservative at 3x, but could easily be 10x if adoption accelerates.",
                    time: "2:22 PM",
                    color: "hsl(240 10% 18%)",
                    isAnnouncement: false,
                  },
                  {
                    id: 104,
                    user: "Holder Alpha",
                    avatar: "HA",
                    message: "Agreed. Plus the tokenomics update should reduce sell pressure by 40%.",
                    time: "2:25 PM",
                    color: "hsl(263 97% 58%)",
                    isAnnouncement: false,
                  },
                ]
              : lab.messages
            ).map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.align === "right" ? "justify-end" : ""}`}
              >
                {msg.align !== "right" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${msg.align === "right" ? "items-end max-w-[75%]" : "items-start max-w-[75%]"}`}>
                  {msg.align !== "right" && (
                    <div className="flex items-baseline gap-2 mb-1 px-1">
                      <span className="font-semibold text-xs" style={{ color: msg.color }}>
                        {msg.user}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                    </div>
                  )}
                  <div
                    className={`${
                      msg.isAnnouncement
                        ? "bg-primary/10 border border-primary/30 p-4 rounded-2xl w-full"
                        : msg.align === "right"
                        ? "bg-primary text-primary-foreground px-4 py-2.5 rounded-[18px] rounded-tr-sm shadow-sm"
                        : "bg-muted px-4 py-2.5 rounded-[18px] rounded-tl-sm shadow-sm"
                    }`}
                  >
                    <p className="text-[15px] leading-[1.4] whitespace-pre-wrap">{msg.message}</p>
                    {msg.isAnnouncement && (
                      <Button variant="link" className="text-primary px-0 mt-2 h-auto text-sm">
                        Show more
                      </Button>
                    )}
                  </div>
                  {msg.align === "right" && (
                    <div className="text-[10px] text-muted-foreground text-right mt-1 px-1">
                      {msg.time}
                    </div>
                  )}
                </div>
                {msg.align === "right" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className={`p-4 border-t border-border ${isHoldersOnly ? "bg-primary/5" : ""}`}>
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
            isHoldersOnly ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
          }`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Input
              placeholder={isHoldersOnly ? "Message holders..." : "Type your message"}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l border-border bg-card/50 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6 pb-24">
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

        {/* Training Apps - Fixed at Bottom */}
        <div className="border-t border-border bg-card p-6">
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
      </div>
    </div>
  );
}
