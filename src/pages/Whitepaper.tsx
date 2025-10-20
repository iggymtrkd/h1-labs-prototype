import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, ChevronRight, Menu, Target, Sparkles, ArrowLeft } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CompetitiveComparison from "@/components/litepaper/CompetitiveComparison";
import ComplianceCards from "@/components/litepaper/ComplianceCards";
import FinancialChart from "@/components/litepaper/FinancialChart";
import BlockchainBenefits from "@/components/litepaper/BlockchainBenefits";
import LabCreationFlow from "@/components/litepaper/LabCreationFlow";
import ArchitectureDiagram from "@/components/litepaper/ArchitectureDiagram";
import EconomicFlywheel from "@/components/litepaper/EconomicFlywheel";
import CredentialFlow from "@/components/litepaper/CredentialFlow";
import DualIntelligenceFlow from "@/components/litepaper/DualIntelligenceFlow";
import BondingCurveExample from "@/components/litepaper/BondingCurveExample";
import UserFlows from "@/components/litepaper/UserFlows";
import DiamondStandardDesign from "@/components/litepaper/DiamondStandardDesign";
import H1TokenEconomies from "@/components/litepaper/H1TokenEconomies";
import BondingCurveGraph from "@/components/litepaper/BondingCurveGraph";
import LabOwnershipPie from "@/components/litepaper/LabOwnershipPie";
import BuybackDistributionPie from "@/components/litepaper/BuybackDistributionPie";
import LabLevelProgression from "@/components/litepaper/LabLevelProgression";
import TokenAppreciationTimeline from "@/components/litepaper/TokenAppreciationTimeline";
import UseCaseROIComparison from "@/components/litepaper/UseCaseROIComparison";
import RoadmapTimeline from "@/components/litepaper/RoadmapTimeline";
import RiskMatrix from "@/components/litepaper/RiskMatrix";

export default function Whitepaper() {
  const [content, setContent] = useState("");
  const [sections, setSections] = useState<{ title: string; id: string; level: number }[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fromHome = searchParams.get("from") === "home";

  useEffect(() => {
    const path = "/litepaper.md";
    fetch(path)
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setActiveSection("");

        // Extract headings for navigation
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const matches = [...text.matchAll(headingRegex)];
        const tocSections = matches.map((match) => ({
          level: match[1].length,
          title: match[2].replace(/\*/g, ""),
          id: match[2]
            .toLowerCase()
            .replace(/\*/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-"),
        }));
        setSections(tocSections);
        
        // Initialize all level 1 sections as expanded (skip first which is the title)
        const level1Indices = new Set(
          tocSections
            .map((section, i) => (section.level === 1 && i > 0 ? i : -1))
            .filter(i => i !== -1)
        );
        setExpandedSections(level1Indices);
      })
      .catch((err) => console.error("Error loading litepaper:", err));
  }, []);

  // Track scroll position and highlight current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (!scrollArea || sections.length === 0) return;

      const headings = sections
        .map((section) => document.getElementById(section.id))
        .filter((el): el is HTMLElement => el !== null);

      // Find the current section based on scroll position
      let currentSection = "";
      const scrollTop = scrollArea.scrollTop;
      const offset = 100; // Offset for triggering highlight

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading.offsetTop - offset <= scrollTop) {
          currentSection = heading.id;
          break;
        }
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sections, activeSection]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const TableOfContents = () => {
    // Filter out the first two sections (title and subtitle)
    const filteredSections = sections.slice(2);
    
    return (
      <nav className="space-y-1">
        <Link to="/about">
          <Button variant="outline" className="w-full mb-4 justify-start bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/50 hover:from-primary/30 hover:to-secondary/30">
            <Target className="mr-2 h-4 w-4 text-primary" />
            TLDR
          </Button>
        </Link>
        <Link to="/upcoming-features">
          <Button variant="outline" className="w-full mb-4 justify-start bg-gradient-to-r from-accent/20 to-primary/20 border-accent/50 hover:from-accent/30 hover:to-primary/30">
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            Upcoming Features
          </Button>
        </Link>
        {filteredSections.map((section, index) => {
          const originalIndex = index + 1; // Offset for skipped first section
          const hasSubsections = filteredSections[index + 1]?.level > section.level;
          const isExpanded = expandedSections.has(originalIndex);
          const isLevel1 = section.level === 1;
          
          // Skip rendering subsections if parent is collapsed
          if (section.level > 1) {
            // Find the parent level 1 section
            let parentIdx = index - 1;
            while (parentIdx >= 0 && filteredSections[parentIdx].level > 1) {
              parentIdx--;
            }
            if (parentIdx >= 0) {
              const parentOriginalIndex = parentIdx + 1;
              if (!expandedSections.has(parentOriginalIndex)) {
                return null;
              }
            }
          }

          return (
            <button
              key={originalIndex}
              onClick={() => {
                if (isLevel1 && hasSubsections) {
                  toggleSection(originalIndex);
                }
                scrollToSection(section.id);
              }}
              className={`w-full text-left py-2 rounded-lg transition-all text-sm ${
                section.level === 1
                  ? "font-semibold px-2"
                  : section.level === 2
                  ? "pl-6 pr-2 text-muted-foreground"
                  : "pl-10 pr-2 text-muted-foreground text-xs"
              } ${
                activeSection === section.id
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                {section.level === 1 && hasSubsections && (
                  <ChevronRight className={`h-3 w-3 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                )}
                <span className="line-clamp-2 break-words">{section.title}</span>
              </div>
            </button>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="min-h-screen pt-8 md:pt-24 pb-12 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {fromHome && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-3xl md:text-4xl font-bold glow-green flex items-center gap-3">
                <BookOpen className="h-8 w-8 md:h-10 md:w-10" />
                <span className="break-words">H1 Labs Litepaper</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile TOC Toggle - only show if not from home */}
              {!fromHome && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <h2 className="text-lg font-bold mb-4">Contents</h2>
                    <ScrollArea className="h-[calc(100vh-100px)] pr-4">
                      <TableOfContents />
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground break-words">
            A concise overview of H1 Labs — advancing AI with provable, human‑validated data
          </p>
        </div>

        <div className={fromHome ? "" : "grid lg:grid-cols-4 gap-8"}>
          {/* Desktop Table of Contents - hide if from home */}
          {!fromHome && (
            <Card className="hidden lg:block lg:col-span-1 p-6 bg-gradient-card border-border h-fit lg:sticky lg:top-24">
              <h2 className="text-lg font-bold mb-4">Contents</h2>
              <ScrollArea className="h-[600px] pr-4">
                <TableOfContents />
              </ScrollArea>
            </Card>
          )}

          {/* Content */}
          <Card className={`${fromHome ? "" : "lg:col-span-3"} p-4 md:p-8 bg-gradient-card border-border overflow-x-hidden`}>
            <ScrollArea className="h-[600px] md:h-[800px] pr-2 md:pr-6">
              <article className="prose prose-invert prose-primary max-w-none prose-sm md:prose-base overflow-x-hidden break-words">
                <ReactMarkdown
                  components={{
                    // Custom rendering for special sections and diagrams
                    h1: ({ node, children, ...props }) => {
                      const text = children?.toString() || "";
                      const id = text
                        .toLowerCase()
                        .replace(/\*/g, "")
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-");
                      return (
                        <h1
                          id={id}
                          className="text-2xl md:text-3xl font-bold mb-4 mt-8 scroll-mt-24 glow-green break-words"
                          {...props}
                        >
                          {children}
                        </h1>
                      );
                    },
                    h3: ({ node, children, ...props }) => {
                      const text = children?.toString() || "";
                      const id = text
                        .toLowerCase()
                        .replace(/\*/g, "")
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-");
                      
                      // Check if this is a section that should render a custom diagram
                      if (text.includes("Lab Creation") || text.includes("Lab Lifecycle")) {
                        return (
                          <>
                            <h3 id={id} className="text-lg md:text-xl font-bold mb-2 mt-4 scroll-mt-24 text-secondary break-words" {...props}>
                              {children}
                            </h3>
                            <LabOwnershipPie />
                            <LabCreationFlow />
                          </>
                        );
                      }
                      
                      if (text.includes("Credential Lifecycle")) {
                        return (
                          <>
                            <h3 id={id} className="text-lg md:text-xl font-bold mb-2 mt-4 scroll-mt-24 text-secondary break-words" {...props}>
                              {children}
                            </h3>
                            <CredentialFlow />
                          </>
                        );
                      }
                      
                      if (text.includes("Diamond Standard Design")) {
                        return (
                          <>
                            <h3 id={id} className="text-lg md:text-xl font-bold mb-2 mt-4 scroll-mt-24 text-secondary break-words" {...props}>
                              {children}
                            </h3>
                            <DiamondStandardDesign />
                          </>
                        );
                      }
                      
                      if (text.includes("H1 Tokens") && text.includes("Per-Lab")) {
                        return (
                          <>
                            <h3 id={id} className="text-lg md:text-xl font-bold mb-2 mt-4 scroll-mt-24 text-secondary break-words" {...props}>
                              {children}
                            </h3>
                            <H1TokenEconomies />
                            <TokenAppreciationTimeline />
                          </>
                        );
                      }
                      
                      return (
                        <h3 id={id} className="text-lg md:text-xl font-bold mb-2 mt-4 scroll-mt-24 text-secondary break-words" {...props}>
                          {children}
                        </h3>
                      );
                    },
                    h2: ({ node, children, ...props }) => {
                      const text = children?.toString() || "";
                      const id = text
                        .toLowerCase()
                        .replace(/\*/g, "")
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-");
                      
                      // Check for sections that should render custom diagrams
                      if (text.includes("Competitive Positioning")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <CompetitiveComparison />
                          </>
                        );
                      }
                      
                      if (text.includes("User Flows")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <UserFlows />
                          </>
                        );
                      }
                      
                      if (text.includes("Architecture")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <ArchitectureDiagram />
                          </>
                        );
                      }
                      
                      if (text.includes("Economic Flywheel")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <BuybackDistributionPie />
                            <EconomicFlywheel />
                          </>
                        );
                      }
                      
                      if (text.includes("Bonding Curves")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <BondingCurveGraph />
                            <BondingCurveExample />
                          </>
                        );
                      }
                      
                      if (text.includes("Dual")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <DualIntelligenceFlow />
                          </>
                        );
                      }
                      
                      if (text.includes("Use Case Scenarios")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <UseCaseROIComparison />
                          </>
                        );
                      }
                      
                      if (text.includes("Roadmap")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <RoadmapTimeline />
                          </>
                        );
                      }
                      
                      if (text.includes("Risks") && text.includes("Mitigations")) {
                        return (
                          <>
                            <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                              {children}
                            </h2>
                            <RiskMatrix />
                          </>
                        );
                      }
                      
                      return (
                        <h2 id={id} className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    // Hide mermaid code blocks
                    code: ({ node, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const lang = match ? match[1] : '';
                      
                      if (lang === 'mermaid') {
                        return null; // Don't render mermaid code blocks
                      }
                      
                      return (
                        <code className={`bg-muted px-2 py-1 rounded text-primary text-sm break-all ${className || ''}`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    table: ({ node, ...props }) => {
                      // Check if this is one of our special tables to replace with custom components
                      // We'll check the raw content for specific keywords
                      const tableStr = JSON.stringify(node);
                      
                      // Competitive Positioning table
                      if (tableStr.includes("Dimension") || (tableStr.includes("Focus") && tableStr.includes("Compliance"))) {
                        return <CompetitiveComparison />;
                      }
                      
                      // Compliance Framework table
                      if (tableStr.includes("Domain") && tableStr.includes("Compliance Standards")) {
                        return <ComplianceCards />;
                      }
                      
                      // Financial Model table
                      if (tableStr.includes("Metric") && tableStr.includes("Year") && tableStr.includes("TVL")) {
                        return <FinancialChart />;
                      }
                      
                      // Blockchain Benefits table
                      if (tableStr.includes("Challenge") && tableStr.includes("Blockchain Benefit")) {
                        return <BlockchainBenefits />;
                      }
                      
                      // Default table rendering
                      return (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full border-collapse border border-border" {...props} />
                        </div>
                      );
                    },
                    thead: ({ node, ...props }) => (
                      <thead className="bg-muted" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-border px-4 py-2 text-left font-bold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-border px-4 py-2" {...props} />
                    ),
                    p: ({ node, children, ...props }) => {
                      const text = children?.toString() || '';
                      
                      // Check for special comment markers
                      if (text.includes('Lab level progression chart')) {
                        return <LabLevelProgression />;
                      }
                      if (text.includes('Token appreciation timeline chart')) {
                        return <TokenAppreciationTimeline />;
                      }
                      if (text.includes('Use case ROI comparison chart')) {
                        return <UseCaseROIComparison />;
                      }
                      if (text.includes('Roadmap timeline chart')) {
                        return <RoadmapTimeline />;
                      }
                      if (text.includes('Risk matrix chart')) {
                        return <RiskMatrix />;
                      }
                      
                      return <p className="mb-4 text-muted-foreground leading-relaxed break-words" {...props}>{children}</p>;
                    },
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground break-words" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground break-words" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-4 break-words" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground break-words" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-primary hover:text-primary-glow underline break-all" {...props} />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
