import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, MessageCircle, Brain, Stethoscope, Activity } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import medloopIcon from '@/assets/medloop-icon.png';

export default function MedLoop() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromChat = location.state?.from;

  const handleLaunchApp = () => {
    // Link to external app - replace with actual URL
    window.open('https://medloop.example.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        {fromChat && (
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={() => navigate(fromChat)}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={medloopIcon} alt="MedLoop" className="w-20 h-20 rounded-2xl shadow-lg" />
            <div>
              <h1 className="text-4xl font-bold text-white">MedLoop</h1>
              <p className="text-blue-300 text-lg">AI Health Assistant</p>
            </div>
          </div>
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            Powered by Advanced AI
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Features */}
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">AI-Powered Insights</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Get intelligent health recommendations and insights powered by advanced AI models trained on medical knowledge.
            </p>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Conversational Interface</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Chat naturally with your AI health assistant. Ask questions, get explanations, and receive personalized guidance.
            </p>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Medical Expertise</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Access comprehensive medical knowledge and evidence-based recommendations for better health decisions.
            </p>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-semibold text-white">Health Tracking</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Monitor your health metrics, track symptoms, and receive timely reminders for medications and checkups.
            </p>
          </Card>
        </div>

        {/* Launch Button */}
        <Card className="p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 backdrop-blur">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Ready to Get Started?</h3>
            <p className="text-slate-300">
              Launch MedLoop to start your personalized AI health assistant experience
            </p>
            <Button
              onClick={handleLaunchApp}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Launch MedLoop
            </Button>
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-200 text-center">
            ⚠️ MedLoop is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
