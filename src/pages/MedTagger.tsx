import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Stethoscope, MessageCircle, Send, Zap, Tag, CheckCircle2, 
  AlertCircle, Pill, Heart, Brain, Award, User, Bot, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock data
const MOCK_RECORD = `Chief Complaint: Persistent cough and chest discomfort for 3 weeks

History of Present Illness:
45-year-old presents with persistent dry cough and intermittent chest discomfort. Patient reports the cough started after an upper respiratory infection. Denies fever or chills. Chest discomfort is pleuritic in nature, worse with deep breathing. Patient is concerned about possible cardiac involvement given family history.

Past Medical History:
Hypertension (well-controlled)
Mild asthma (intermittent, no recent exacerbations)

Medications:
Lisinopril 10mg daily
Albuterol inhaler as needed

Physical Examination:
Vital signs stable, BP 142/88, HR 88
Lungs clear to auscultation bilaterally
Cardiac exam normal, no murmurs or arrhythmias
No peripheral edema

Assessment:
Likely viral bronchitis with pleurisy. Possible asthma exacerbation. Rule out cardiac involvement given symptoms and family history.

Plan:
1. CXR to rule out pneumonia
2. EKG to assess cardiac etiology
3. Continue Lisinopril
4. Trial albuterol inhaler 4-6 hours
5. Follow up in 1 week`;

interface Reviewer {
  id: string;
  name: string;
  avatar: string;
  completed: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderType: 'clinician' | 'ai' | 'user';
  message: string;
  timestamp: Date;
}

interface TagInstance {
  id: string;
  type: 'REASONING' | 'HALLUCINATION' | 'PRESCRIPTION' | 'PATHOLOGY' | 'MEDICINE_DOMAIN';
  startIdx: number;
  endIdx: number;
  text: string;
  addedBy: string;
}

export default function MedTagger() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<TagInstance[]>([]);

  const [selectedText, setSelectedText] = useState<{ start: number; end: number; text: string } | null>(null);
  const [activeTagType, setActiveTagType] = useState<TagInstance['type'] | null>(null);
  const recordRef = useState<HTMLDivElement | null>(null)[0];
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'Dr. Sarah Chen',
      senderType: 'clinician',
      message: 'The pleurisy diagnosis seems solid, but we should emphasize the need for EKG.',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      sender: 'Dr. Michael Brown',
      senderType: 'clinician',
      message: 'Agreed. Family history of cardiac issues is concerning.',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: '3',
      sender: 'MedTagger AI',
      senderType: 'ai',
      message: 'Suggested MEDICINE_DOMAIN tags added for respiratory and cardiology sections.',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [selectedRecordId] = useState('MED-2025-10-22-001');
  const [usingAI, setUsingAI] = useState(false);

  const reviewers: Reviewer[] = [
    { id: '1', name: 'Dr. Sarah Chen', avatar: '👩‍⚕️', completed: true },
    { id: '2', name: 'Dr. Michael Brown', avatar: '👨‍⚕️', completed: true },
    { id: '3', name: 'Dr. James Wilson', avatar: '👨‍⚕️', completed: true },
    { id: '4', name: 'You', avatar: '👤', completed: false }
  ];

  const tagColors: Record<TagInstance['type'], { bg: string; text: string; border: string; highlight: string }> = {
    REASONING: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', highlight: '#eab308' },
    HALLUCINATION: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', highlight: '#ef4444' },
    PRESCRIPTION: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', highlight: '#3b82f6' },
    PATHOLOGY: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', highlight: '#a855f7' },
    MEDICINE_DOMAIN: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', highlight: '#10b981' }
  };

  const tagLabels: Record<TagInstance['type'], string> = {
    REASONING: 'Reasoning',
    HALLUCINATION: 'Hallucination',
    PRESCRIPTION: 'Prescription',
    PATHOLOGY: 'Pathology',
    MEDICINE_DOMAIN: 'Domain-specific'
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const selectedString = selection.toString();
      const fullText = MOCK_RECORD;
      const startIdx = fullText.indexOf(selectedString);
      
      if (startIdx !== -1) {
        setSelectedText({ 
          start: startIdx, 
          end: startIdx + selectedString.length,
          text: selectedString 
        });
      }
    }
  };

  const addTag = (type: TagInstance['type']) => {
    if (!selectedText) {
      toast.error('Please select text first');
      return;
    }

    const newTag: TagInstance = {
      id: String(Date.now()),
      type,
      startIdx: selectedText.start,
      endIdx: selectedText.end,
      text: selectedText.text,
      addedBy: 'You'
    };

    setTags([...tags, newTag]);
    setSelectedText(null);
    window.getSelection()?.removeAllRanges();
    toast.success(`Tagged as ${tagLabels[type]}`);
  };

  const clearTags = () => {
    setTags([]);
    setSelectedText(null);
    window.getSelection()?.removeAllRanges();
    toast.success('All tags cleared');
  };

  const renderHighlightedText = () => {
    if (tags.length === 0) {
      return <span>{MOCK_RECORD}</span>;
    }

    const sortedTags = [...tags].sort((a, b) => a.startIdx - b.startIdx);
    const segments: JSX.Element[] = [];
    let lastIndex = 0;

    sortedTags.forEach((tag, idx) => {
      if (tag.startIdx > lastIndex) {
        segments.push(
          <span key={`text-${idx}`}>
            {MOCK_RECORD.slice(lastIndex, tag.startIdx)}
          </span>
        );
      }

      segments.push(
        <span
          key={`tag-${tag.id}`}
          style={{
            backgroundColor: `${tagColors[tag.type].highlight}40`,
            color: tagColors[tag.type].highlight,
            fontWeight: 600,
            padding: '2px 0',
            borderRadius: '2px'
          }}
          title={`${tagLabels[tag.type]} - ${tag.addedBy}`}
        >
          {MOCK_RECORD.slice(tag.startIdx, tag.endIdx)}
        </span>
      );

      lastIndex = tag.endIdx;
    });

    if (lastIndex < MOCK_RECORD.length) {
      segments.push(
        <span key="text-end">{MOCK_RECORD.slice(lastIndex)}</span>
      );
    }

    return <>{segments}</>;
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: String(chatMessages.length + 1),
      sender: 'You',
      senderType: 'user',
      message: messageInput,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput('');
  };

  const handleAIAssist = async () => {
    setUsingAI(true);
    // Simulate AI processing
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: String(chatMessages.length + 1),
        sender: 'MedTagger AI',
        senderType: 'ai',
        message: 'I\'ve analyzed the assessment section and identified 2 additional reasoning statements and 1 potential hallucination about cardiac risk. Cost: 0.5 H1',
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, aiMessage]);
      setUsingAI(false);
      toast.success('AI analysis complete - 0.5 H1 charged');
    }, 2000);
  };

  const handleSubmit = () => {
    if (tags.length < 3) {
      toast.error('Please add at least 3 tags before submitting');
      return;
    }
    toast.success('Record enrichment submitted!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/prototype')}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prototype
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">MedTagger</h1>
          </div>
          <p className="text-slate-400">Enrich and validate medical records</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Bounty List & Credentialing */}
          <div className="lg:col-span-1 space-y-4">
            {/* Current Record Bounty */}
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <Label className="text-white font-semibold text-sm mb-3 block">Current Bounty</Label>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Record ID</p>
                  <p className="font-mono text-xs text-blue-400">{selectedRecordId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Reward</p>
                  <p className="text-2xl font-bold text-blue-400">2.5 H1</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">From Lab</p>
                  <p className="text-xs text-slate-300">MedAtlas Lab</p>
                </div>
              </div>
            </Card>

            {/* Credentialing Status */}
            <Card className="p-4 bg-slate-800 border-slate-700">
              <Label className="text-white font-semibold text-sm mb-3 block">Reviewers</Label>
              <div className="space-y-2">
                {reviewers.map(reviewer => (
                  <div
                    key={reviewer.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{reviewer.avatar}</span>
                      <div>
                        <p className="text-xs font-medium text-slate-200">{reviewer.name}</p>
                        {reviewer.completed && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <p className="text-xs text-emerald-400">Completed</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {reviewer.name === 'You' && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        In Progress
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Supervisor */}
            <Card className="p-4 bg-slate-800 border-slate-700">
              <Label className="text-white font-semibold text-sm mb-3 block">Supervisor</Label>
              <div className="flex items-center gap-3">
                <span className="text-2xl">👨‍💼</span>
                <div>
                  <p className="text-sm font-medium text-slate-200">Dr. James Wilson</p>
                  <p className="text-xs text-slate-400">Credential ID: 42</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Center: Record & Enrichment */}
          <div className="lg:col-span-2 space-y-4">
            {/* Enrichment Header */}
            <Card className="p-4 bg-slate-800 border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Label className="text-white font-semibold">Enrichment Interface</Label>
                  <p className="text-xs text-slate-400 mt-1">{tags.length} tags added</p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  3/4 Reviewers
                </Badge>
              </div>
            </Card>

            {/* Record Content with Highlighter */}
            <Card className="p-6 bg-slate-800 border-slate-700">
              <Label className="text-white font-semibold mb-3 block text-sm">
                Medical Record (Select text to tag)
              </Label>
              <div
                onMouseUp={handleTextSelection}
                className="bg-slate-900/50 rounded-lg p-4 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto font-mono border border-slate-700 cursor-text select-text"
              >
                {renderHighlightedText()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-500">💡 Highlight text to tag it</p>
                {tags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearTags}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear All Tags
                  </Button>
                )}
              </div>
            </Card>

            {/* Tagging Interface */}
            <Card className="p-4 bg-slate-800 border-slate-700">
              <Label className="text-white font-semibold mb-3 block text-sm">Tag Options</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ['REASONING', 'HALLUCINATION', 'PRESCRIPTION', 'PATHOLOGY', 'MEDICINE_DOMAIN'] as const
                ).map(type => {
                  const colors = tagColors[type];
                  return (
                    <Button
                      key={type}
                      onClick={() => {
                        setActiveTagType(type);
                        addTag(type);
                      }}
                      disabled={!selectedText}
                      variant="outline"
                      className={`${colors.bg} ${colors.text} border ${colors.border} hover:opacity-80 text-xs h-auto py-2 disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tagLabels[type]}
                    </Button>
                  );
                })}
              </div>
              {selectedText && (
                <p className="text-xs text-emerald-400 mt-2">
                  ✓ Selected: "{selectedText.text.slice(0, 30)}{selectedText.text.length > 30 ? '...' : ''}"
                </p>
              )}
            </Card>

            {/* Added Tags Display */}
            {tags.length > 0 && (
              <Card className="p-4 bg-slate-800 border-slate-700">
                <Label className="text-white font-semibold mb-3 block text-sm">Applied Tags</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {tags.map(tag => {
                    const colors = tagColors[tag.type];
                    return (
                        <div
                          key={tag.id}
                          className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-xs font-semibold ${colors.text}`}>{tagLabels[tag.type]}</p>
                              <p className="text-xs text-slate-300 mt-1">"{tag.text.slice(0, 40)}{tag.text.length > 40 ? '...' : ''}"</p>
                              <p className="text-xs text-slate-500 mt-1">Added by {tag.addedBy}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setTags(tags.filter(t => t.id !== tag.id))}
                              className="text-slate-500 hover:text-slate-300 ml-2"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Submit Section */}
            <div className="flex gap-3">
              <Button
                onClick={handleAIAssist}
                disabled={usingAI}
                variant="outline"
                className="flex-1 bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20"
              >
                <Zap className="w-4 h-4 mr-2" />
                {usingAI ? 'Analyzing...' : 'AI Assist (0.5 H1)'}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={tags.length < 3}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Submit
              </Button>
            </div>
          </div>

          {/* Right: Discussion Chat */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-slate-800 border-slate-700 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <Label className="text-white font-semibold">Discussion</Label>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-96">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{msg.senderType === 'ai' ? '🤖' : msg.senderType === 'user' ? '👤' : '👨‍⚕️'}</span>
                      <p className="font-semibold text-slate-200">{msg.sender}</p>
                      <p className="text-slate-500 text-xs">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <p className="text-slate-300 ml-6 bg-slate-700/50 rounded p-2">{msg.message}</p>
                  </div>
                ))}
              </div>

              <Separator className="bg-slate-700 mb-4" />

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Add comment..."
                  className="text-xs bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
