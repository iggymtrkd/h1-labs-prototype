import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, ChevronRight, Menu, Target, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function Whitepaper() {
  const [content, setContent] = useState("");
  const [sections, setSections] = useState<{ title: string; id: string; level: number }[]>([]);
  const [activeSection, setActiveSection] = useState("");

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
      })
      .catch((err) => console.error("Error loading litepaper:", err));
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const TableOfContents = () => (
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
      {sections.map((section, index) => (
        <button
          key={index}
          onClick={() => scrollToSection(section.id)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
            section.level === 1
              ? "font-semibold"
              : section.level === 2
              ? "pl-6 text-muted-foreground"
              : "pl-9 text-muted-foreground text-xs"
          } ${
            activeSection === section.id
              ? "bg-primary/20 text-primary"
              : "hover:bg-muted"
          }`}
        >
          <div className="flex items-center gap-2">
            {section.level === 1 && (
              <ChevronRight className="h-3 w-3 flex-shrink-0" />
            )}
            <span className="line-clamp-2 break-words">{section.title}</span>
          </div>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen pt-8 md:pt-24 pb-12 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold glow-green flex items-center gap-3">
              <BookOpen className="h-8 w-8 md:h-10 md:w-10" />
              <span className="break-words">H1 Labs Litepaper</span>
            </h1>

            <div className="flex items-center gap-2">
              {/* Mobile TOC Toggle */}
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
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground break-words">
            A concise overview of H1 Labs — advancing AI with provable, human‑validated data
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Table of Contents */}
          <Card className="hidden lg:block lg:col-span-1 p-6 bg-gradient-card border-border h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-bold mb-4">Contents</h2>
            <ScrollArea className="h-[600px] pr-4">
              <TableOfContents />
            </ScrollArea>
          </Card>

          {/* Content */}
          <Card className="lg:col-span-3 p-4 md:p-8 bg-gradient-card border-border overflow-x-hidden">
            <ScrollArea className="h-[600px] md:h-[800px] pr-2 md:pr-6">
              <article className="prose prose-invert prose-primary max-w-none prose-sm md:prose-base overflow-x-hidden break-words">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => {
                      const text = props.children?.toString() || "";
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
                        />
                      );
                    },
                    h2: ({ node, ...props }) => {
                      const text = props.children?.toString() || "";
                      const id = text
                        .toLowerCase()
                        .replace(/\*/g, "")
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-");
                      return (
                        <h2
                          id={id}
                          className="text-xl md:text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary break-words"
                          {...props}
                        />
                      );
                    },
                    h3: ({ node, ...props }) => {
                      const text = props.children?.toString() || "";
                      const id = text
                        .toLowerCase()
                        .replace(/\*/g, "")
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-");
                      return (
                        <h3
                          id={id}
                          className="text-lg md:text-xl font-bold mb-2 mt-4 scroll-mt-24 text-secondary break-words"
                          {...props}
                        />
                      );
                    },
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-muted-foreground leading-relaxed break-words" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground break-words" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground break-words" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-4 break-words" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-muted px-2 py-1 rounded text-primary text-sm break-all" {...props} />
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
