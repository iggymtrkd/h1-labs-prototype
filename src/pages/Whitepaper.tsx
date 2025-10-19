import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Whitepaper() {
  const [content, setContent] = useState("");
  const [sections, setSections] = useState<{ title: string; id: string; level: number }[]>([]);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Load whitepaper content
    fetch("/whitepaper.md")
      .then((res) => res.text())
      .then((text) => {
        const appendixIndex = text.search(/^\s*##\s+Appendix:/m);
        const mainText = appendixIndex !== -1 ? text.slice(0, appendixIndex).trimEnd() : text;
        setContent(mainText);

        // Extract headings for navigation (excluding appendices)
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const matches = [...mainText.matchAll(headingRegex)];
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
      .catch((err) => console.error("Error loading whitepaper:", err));
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen pt-8 md:pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 glow-green flex items-center gap-3">
            <BookOpen className="h-10 w-10" />
            H1 Labs Whitepaper
          </h1>
          <p className="text-xl text-muted-foreground">
            The Human-First Protocol for Advancing AI through Provable Blockchain Training
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <Card className="lg:col-span-1 p-6 bg-gradient-card border-border h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-bold mb-4">Contents</h2>
            <ScrollArea className="h-[600px] pr-4">
              <nav className="space-y-1">
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
                        <ChevronRight className="h-3 w-3" />
                      )}
                      <span className="line-clamp-2">{section.title}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </Card>

          {/* Content */}
          <Card className="lg:col-span-3 p-8 bg-gradient-card border-border">
            <ScrollArea className="h-[800px] pr-6">
              <article className="prose prose-invert prose-primary max-w-none">
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
                          className="text-3xl font-bold mb-4 mt-8 scroll-mt-24 glow-green"
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
                          className="text-2xl font-bold mb-3 mt-6 scroll-mt-24 text-primary"
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
                          className="text-xl font-bold mb-2 mt-4 scroll-mt-24 text-secondary"
                          {...props}
                        />
                      );
                    },
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-muted-foreground leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-muted-foreground" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-4" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-muted px-2 py-1 rounded text-primary text-sm" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-primary hover:text-primary-glow underline" {...props} />
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
