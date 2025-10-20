import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Shield, Code, CheckCircle, Upload, FileText, Award, Lock, ChevronDown, ChevronUp } from "lucide-react";

export default function UpcomingFeatures() {
  const [selectedModel, setSelectedModel] = useState("mistral");
  const [appConfig, setAppConfig] = useState({
    name: "NeuralLab",
    symbol: "NEURAL",
    domain: "healthcare",
    specialty: "neurology"
  });
  const [isDomainExpanded, setIsDomainExpanded] = useState(false);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Upcoming Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore early previews of H1 Labs' dual-intelligence SDK and credentialing system
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="sdk" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="sdk">H1 SDK Demo</TabsTrigger>
            <TabsTrigger value="credentialing">Credentialing Portal</TabsTrigger>
          </TabsList>

          {/* SDK Demo Tab */}
          <TabsContent value="sdk">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Architecture Diagram */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-primary rounded-lg p-4 text-center">
                      <div className="font-bold mb-2">H1 SDK</div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Domain: {appConfig.domain}<br/>
                        Specialty: {appConfig.specialty}
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-accent"></div>
                    </div>

                    <div className="border rounded-lg p-4 text-center bg-card/50">
                      <div className="font-semibold mb-2">{appConfig.name}</div>
                      <div className="text-xs text-muted-foreground">Your App</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="border rounded p-2 text-center text-xs">
                        <Brain className="h-4 w-4 mx-auto mb-1 text-accent" />
                        <div className="font-medium">Agent</div>
                        <div className="text-muted-foreground">AI First</div>
                      </div>
                      <div className="border rounded p-2 text-center text-xs">
                        <Shield className="h-4 w-4 mx-auto mb-1 text-primary" />
                        <div className="font-medium">Validator</div>
                        <div className="text-muted-foreground">Human 2nd</div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-accent to-primary"></div>
                    </div>

                    <div className="border border-green-500 rounded-lg p-3 text-center bg-green-500/5">
                      <CheckCircle className="h-5 w-5 mx-auto mb-2 text-green-500" />
                      <div className="text-xs font-medium">Δ-Gain Asset</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Attribution + Compliance ✓
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Middle: Configuration */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Configure Your App
                  </CardTitle>
                  <CardDescription>
                    Select your AI model and compliance requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Model Selection */}
                  <div>
                    <h3 className="font-semibold mb-3">Step 1: Choose Base Model</h3>
                    <div className="grid gap-3">
                      {[
                        { id: "mistral", name: "Mistral 7B", badge: "Recommended", desc: "Fast, optimized for healthcare" },
                        { id: "llama", name: "LLaMA 3", badge: "Most Powerful", desc: "70B params, best reasoning" },
                        { id: "openai", name: "OpenAI GPT-4", badge: "Most Accurate", desc: "Highest accuracy, multimodal" },
                        { id: "custom", name: "Plug in your own", badge: "Soon", desc: "Use your custom model", disabled: true }
                      ].map((model) => (
                        <div
                          key={model.id}
                          className={`border rounded-lg p-3 transition-all ${
                            model.disabled 
                              ? "opacity-60 cursor-not-allowed" 
                              : `cursor-pointer ${selectedModel === model.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}`
                          }`}
                          onClick={() => !model.disabled && setSelectedModel(model.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-sm text-muted-foreground">{model.desc}</div>
                            </div>
                            <Badge variant={selectedModel === model.id ? "default" : "outline"}>
                              {model.badge}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: App Config */}
                  <div>
                    <h3 className="font-semibold mb-3">Step 2: App Configuration</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="appName">App Name</Label>
                        <Input
                          id="appName"
                          value={appConfig.name}
                          onChange={(e) => setAppConfig({ ...appConfig, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="symbol">Symbol</Label>
                          <Input
                            id="symbol"
                            value={appConfig.symbol}
                            onChange={(e) => setAppConfig({ ...appConfig, symbol: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="specialty">Specialty</Label>
                          <Input
                            id="specialty"
                            value={appConfig.specialty}
                            onChange={(e) => setAppConfig({ ...appConfig, specialty: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Compliance */}
                  <div>
                    <h3 className="font-semibold mb-3">Step 3: Compliance</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="hipaa" defaultChecked />
                        <label htmlFor="hipaa" className="text-sm cursor-pointer">
                          HIPAA (US Healthcare) - <span className="text-muted-foreground">De-identification + audit logging</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="gdpr" />
                        <label htmlFor="gdpr" className="text-sm cursor-pointer">
                          GDPR (EU Data Protection) - <span className="text-muted-foreground">Right to erasure</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Generated Code Preview */}
                  <div>
                    <h3 className="font-semibold mb-3">Generated Code</h3>
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre>{`import { H1SDK } from '@h1/sdk';

const app = new H1SDK({
  name: '${appConfig.name}',
  symbol: '${appConfig.symbol}',
  domain: '${appConfig.domain}',
  specialty: ['${appConfig.specialty}'],
  
  baseModel: {
    provider: '${selectedModel}',
    endpoint: 'https://api.${selectedModel}.ai/v1'
  },
  
  compliance: {
    hipaa: { enabled: true, deIdentify: true }
  }
});`}</pre>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <FileText className="mr-2 h-4 w-4" />
                        Copy Code
                      </Button>
                      <Button className="flex-1">
                        Deploy to Testnet
                      </Button>
                    </div>
                    <Button variant="secondary" className="w-full">
                      Submit for H1 DAO Approval
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Credentialing Portal Tab */}
          <TabsContent value="credentialing">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">Get Credentialed. Earn More.</CardTitle>
                  <CardDescription className="text-lg">
                    Verifiable professional identity for ethical AI training
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-5 gap-4 text-center">
                    {[
                      { icon: FileText, label: "Apply", desc: "Submit credentials" },
                      { icon: Shield, label: "Verify", desc: "License validation" },
                      { icon: CheckCircle, label: "Approve", desc: "DAO review" },
                      { icon: Award, label: "Earn 3x", desc: "Premium rewards" },
                      { icon: Lock, label: "Renew", desc: "Annual update" }
                    ].map((step, i) => (
                      <div key={i} className="space-y-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="font-semibold">{step.label}</div>
                        <div className="text-xs text-muted-foreground">{step.desc}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Domain Tabs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsDomainExpanded(!isDomainExpanded)}>
                    <CardTitle>Select Your Domain</CardTitle>
                    {isDomainExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🏥</div>
                          <div>
                            <div className="font-semibold">Medical</div>
                            <div className="text-sm text-muted-foreground">Active - Apply now</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge>Available</Badge>
                          <Badge variant="outline">Regulated</Badge>
                        </div>
                      </div>
                    </div>

                    {isDomainExpanded && (
                      <>
                        {[
                          { icon: "🏛️", name: "Legal", date: "Q2 2025", regulated: true },
                          { icon: "🛡️", name: "Defense", date: "Q3 2025", regulated: true },
                          { icon: "💼", name: "Finance", date: "Q2 2025", regulated: true },
                          { icon: "🤖", name: "Robotics", date: "Q3 2025", regulated: true },
                          { icon: "🎮", name: "Gaming", date: "Q3 2025", regulated: false },
                          { icon: "🎨", name: "Art", date: "Q4 2025", regulated: false }
                        ].map((domain, i) => (
                          <div key={i} className="border rounded-lg p-4 opacity-60">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">{domain.icon}</div>
                                <div>
                                  <div className="font-semibold">{domain.name}</div>
                                  <div className="text-sm text-muted-foreground">Coming {domain.date}</div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                <Badge variant="outline">{domain.regulated ? "Regulated" : "Semi-Regulated"}</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Medical Credential Application */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical Credential Application</CardTitle>
                  <CardDescription>
                    Complete your professional verification to earn 3x rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Required Documents Checklist */}
                  <div>
                    <h3 className="font-semibold mb-3">Required Documents</h3>
                    <div className="space-y-2">
                      {[
                        "Professional Resume (PDF)",
                        "Medical License(s)",
                        "Board Certification",
                        "Academic Degrees (MD, DO, PhD)",
                        "Proof of Malpractice Insurance",
                        "Background Check Consent"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Checkbox id={`doc-${i}`} />
                          <label htmlFor={`doc-${i}`} className="text-sm cursor-pointer">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="font-semibold mb-3">Personal Information</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="Dr. Sarah Chen" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="sarah@hospital.org" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical License */}
                  <div>
                    <h3 className="font-semibold mb-3">Medical License</h3>
                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="licenseType">License Type</Label>
                        <Input id="licenseType" placeholder="MD (Doctor of Medicine)" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="licenseNumber">License Number</Label>
                          <Input id="licenseNumber" placeholder="A123456" />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" placeholder="California" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input id="specialty" placeholder="Cardiology" />
                      </div>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          Click to upload license document
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          PDF, JPEG, PNG (max 10MB)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Consent */}
                  <div>
                    <h3 className="font-semibold mb-3">Compliance Consent</h3>
                    <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="hipaa-consent" />
                        <label htmlFor="hipaa-consent" className="text-sm cursor-pointer">
                          I understand my responsibilities for handling PHI in accordance with HIPAA
                        </label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="privacy-consent" />
                        <label htmlFor="privacy-consent" className="text-sm cursor-pointer">
                          I consent to credential verification and background checks
                        </label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="nft-consent" />
                        <label htmlFor="nft-consent" className="text-sm cursor-pointer">
                          I understand that a non-transferable Credential NFT will be minted to my wallet
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Earning Preview */}
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
                    <h3 className="font-semibold mb-3">Your Earning Potential</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Reward:</span>
                        <span className="font-mono">1 H1 token</span>
                      </div>
                      <div className="flex justify-between text-primary">
                        <span>Credentialed Multiplier:</span>
                        <span className="font-mono">+3x = 3 H1</span>
                      </div>
                      <div className="flex justify-between text-accent">
                        <span>Board Cert Bonus:</span>
                        <span className="font-mono">+0.5x = 0.5 H1</span>
                      </div>
                      <div className="h-px bg-border my-2"></div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total per Validation:</span>
                        <span className="font-mono">3.5 H1 tokens</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Submit Application
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
