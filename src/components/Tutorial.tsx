import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ArrowRight, ArrowLeft, Lightbulb, MousePointer, Zap, Brain, Network, BookOpen, Rocket, Users, Target, Link, Plus } from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  illustration?: React.ReactNode;
  highlight?: string;
}

interface TutorialProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const IntroPage = ({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) => (
  <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm">
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl h-[90vh] bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/90 backdrop-blur-xl border border-[#00FFD1]/50 shadow-[0_0_60px_rgba(0,255,209,0.3)]">
        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Brain className="w-12 h-12 text-[#00FFD1]" />
                <h1 className="text-4xl font-extralight bg-gradient-to-r from-[#00FFD1] to-[#E8A135] bg-clip-text text-transparent">
                  Welcome to Synapse
                </h1>
              </div>
              <p className="text-lg text-[#F0F0F0]/80 mb-2">Your AI-Powered Second Brain</p>
              <p className="text-[#F0F0F0]/60">Capture thoughts, connect ideas, and discover insights through neural networks</p>
            </div>

            {/* What is Synapse */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#00FFD1] mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                What is Synapse?
              </h2>
              <p className="text-[#F0F0F0]/80 leading-relaxed mb-4">
                Synapse is a visual knowledge management tool that mimics how your brain creates associations between ideas. 
                Unlike traditional note-taking, Synapse lets you build interconnected networks of thoughts that grow more valuable over time.
              </p>
            </div>

            {/* Use Cases Grid */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#E8A135] mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Perfect For
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#00FFD1]/20 to-[#00FFD1]/5 rounded-lg p-4 border border-[#00FFD1]/30">
                  <BookOpen className="w-6 h-6 text-[#00FFD1] mb-2" />
                  <h3 className="text-[#00FFD1] font-medium mb-1">Research & Study</h3>
                  <p className="text-[#F0F0F0]/70 text-sm">Map complex topics, identify connections, and build comprehensive knowledge networks</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#E8A135]/20 to-[#E8A135]/5 rounded-lg p-4 border border-[#E8A135]/30">
                  <Rocket className="w-6 h-6 text-[#E8A135] mb-2" />
                  <h3 className="text-[#E8A135] font-medium mb-1">Project Planning</h3>
                  <p className="text-[#F0F0F0]/70 text-sm">Brainstorm ideas, visualize dependencies, and organize complex projects</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/5 rounded-lg p-4 border border-[#9945FF]/30">
                  <Users className="w-6 h-6 text-[#9945FF] mb-2" />
                  <h3 className="text-[#9945FF] font-medium mb-1">Creative Writing</h3>
                  <p className="text-[#F0F0F0]/70 text-sm">Develop characters, plot lines, and story arcs with visual connections</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF6B6B]/5 rounded-lg p-4 border border-[#FF6B6B]/30">
                  <Brain className="w-6 h-6 text-[#FF6B6B] mb-2" />
                  <h3 className="text-[#FF6B6B] font-medium mb-1">Problem Solving</h3>
                  <p className="text-[#F0F0F0]/70 text-sm">Break down complex problems and visualize solution pathways</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#4ECDC4]/20 to-[#4ECDC4]/5 rounded-lg p-4 border border-[#4ECDC4]/30">
                  <Network className="w-6 h-6 text-[#4ECDC4] mb-2" />
                  <h3 className="text-[#4ECDC4] font-medium mb-1">Knowledge Management</h3>
                  <p className="text-[#F0F0F0]/70 text-sm">Build your personal knowledge graph that grows smarter over time</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#FFB84D]/20 to-[#FFB84D]/5 rounded-lg p-4 border border-[#FFB84D]/30">
                  <Zap className="w-6 h-6 text-[#FFB84D] mb-2" />
                  <h3 className="text-[#FFB84D] font-medium mb-1">Learning & Education</h3>
                  <p className="text-[#F0F0F0]/70 text-sm">Connect concepts, track progress, and enhance retention through visualization</p>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#9945FF] mb-4">Why Synapse?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#00FFD1] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-[#F0F0F0]/80 text-sm"><strong>Visual Thinking:</strong> Ideas become tangible objects you can manipulate and connect</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#E8A135] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-[#F0F0F0]/80 text-sm"><strong>AI Insights:</strong> Get intelligent suggestions and pattern recognition</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#9945FF] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-[#F0F0F0]/80 text-sm"><strong>Flexible Organization:</strong> No rigid hierarchies - connect thoughts naturally</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-[#F0F0F0]/80 text-sm"><strong>Growing Value:</strong> Your network becomes more valuable as it expands</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons - Fixed at bottom */}
          <div className="border-t border-[#00FFD1]/20 p-6">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-[#F0F0F0]/60 hover:text-[#F0F0F0]"
              >
                Skip Tutorial
              </Button>
              
              <Button
                onClick={onStart}
                className="bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:shadow-[0_0_20px_rgba(0,255,209,0.4)] px-8"
              >
                Start Interactive Tour
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Neural Hub - Your Command Center",
    content: "This is your neural network's control center. Monitor your thoughts, connections, and activate AI insights. The hub shows real-time analytics and provides quick actions.",
    icon: <Brain className="w-5 h-5" />,
    position: { x: 50, y: 25 }, // Centered horizontally, top area
    illustration: (
      <div className="bg-gradient-to-br from-[#0B3D3D]/50 to-[#083838]/30 rounded-lg p-4 border border-[#00FFD1]/30 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#00FFD1]/20 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#00FFD1]" />
          </div>
          <div>
            <div className="text-sm font-medium text-[#00FFD1]">Neural Hub</div>
            <div className="text-xs text-[#F0F0F0]/60">5 thoughts • 3 connections</div>
          </div>
        </div>
        <div className="text-xs text-[#F0F0F0]/70">
          ✦ AI Brain: Ready • Network Health: 85%
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Create Your First Thought",
    content: "Double-click anywhere on the canvas to create a new thought node. Each thought becomes a visual node in your neural network that you can edit, move, and connect.",
    icon: <Plus className="w-5 h-5" />,
    position: { x: 25, y: 50 }, // Left side, centered vertically
    illustration: (
      <div className="text-center mb-4">
        <div className="relative inline-block">
          <div className="w-40 h-24 bg-gradient-to-br from-[#00FFD1]/20 to-[#00FFD1]/10 rounded-lg border border-[#00FFD1]/40 p-3 text-center">
            <div className="text-sm font-medium text-[#00FFD1] mb-1">💡 Brilliant Insight</div>
            <div className="text-xs text-[#F0F0F0]/70">Double-click created this!</div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00FFD1] rounded-full flex items-center justify-center animate-pulse">
            <Plus className="w-3 h-3 text-[#0B3D3D]" />
          </div>
        </div>
        <div className="text-xs text-[#F0F0F0]/60 mt-2">Try double-clicking on the canvas!</div>
      </div>
    )
  },
  {
    id: 3,
    title: "Connect Related Ideas",
    content: "Click the link button on any node to enter connection mode, then click another node to create a neural pathway. These connections help you visualize relationships between thoughts.",
    icon: <Link className="w-5 h-5" />,
    position: { x: 75, y: 50 }, // Right side, centered vertically
    illustration: (
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="w-20 h-16 bg-gradient-to-br from-[#00FFD1]/20 to-[#00FFD1]/10 rounded-lg border border-[#00FFD1]/40 p-2 text-center">
          <div className="text-xs font-medium text-[#00FFD1]">Idea A</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-1 bg-gradient-to-r from-[#00FFD1] to-[#E8A135] rounded-full"></div>
          <div className="text-xs text-[#F0F0F0]/60 mt-1">Connected!</div>
        </div>
        <div className="w-20 h-16 bg-gradient-to-br from-[#E8A135]/20 to-[#E8A135]/10 rounded-lg border border-[#E8A135]/40 p-2 text-center">
          <div className="text-xs font-medium text-[#E8A135]">Idea B</div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Navigate Your Neural Network",
    content: "Use mouse wheel to zoom in/out and drag the canvas to pan around. As your network grows, smooth navigation helps you explore different areas of your knowledge graph.",
    icon: <MousePointer className="w-5 h-5" />,
    position: { x: 50, y: 65 }, // Center, lower area
    illustration: (
      <div className="bg-gradient-to-br from-[#0B3D3D]/50 to-[#083838]/30 rounded-lg p-4 border border-[#9945FF]/30 mb-4">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`w-8 h-6 rounded border ${
              i === 4 ? 'bg-[#00FFD1]/30 border-[#00FFD1]/60' : 'bg-[#F0F0F0]/10 border-[#F0F0F0]/20'
            }`}></div>
          ))}
        </div>
        <div className="text-xs text-[#F0F0F0]/70 text-center">
          Scroll to zoom • Drag to pan • Click to select
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Activate AI Brain",
    content: "Turn on your AI brain to get intelligent insights, pattern recognition, and suggestions. The AI analyzes your neural network to discover hidden connections and provide valuable insights.",
    icon: <Zap className="w-5 h-5" />,
    position: { x: 50, y: 35 }, // Center, upper-middle area
    illustration: (
      <div className="bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/10 rounded-lg p-4 border border-[#9945FF]/40 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-[#9945FF]" />
          <div className="text-sm font-medium text-[#9945FF]">AI Brain Active</div>
        </div>
        <div className="text-xs text-[#F0F0F0]/70 mb-2">🧠 Analyzing patterns...</div>
        <div className="text-xs text-[#F0F0F0]/70 mb-2">💡 Found 3 potential connections</div>
        <div className="text-xs text-[#E8A135]">⚡ Insight: Your research nodes cluster around sustainability themes</div>
      </div>
    )
  }
];

export const Tutorial = ({ isVisible, onComplete, onSkip }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(-1); // Start with intro page
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 200);
    } else if (currentStep === 0) {
      setCurrentStep(-1); // Go back to intro
    }
  };

  const handleStartTour = () => {
    setCurrentStep(0);
  };

  if (!isVisible) return null;

  // Show intro page
  if (currentStep === -1) {
    return <IntroPage onStart={handleStartTour} onSkip={onSkip} />;
  }

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
      {/* Tutorial Card */}
      <div 
        className={`absolute transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{
          left: `${currentStepData.position.x}%`,
          top: `${currentStepData.position.y}%`,
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
      >
        <Card className="w-96 max-w-[90vw] bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/90 backdrop-blur-xl border border-[#00FFD1]/50 shadow-[0_0_40px_rgba(0,255,209,0.3)]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00FFD1]/20 rounded-lg">
                  {currentStepData.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#00FFD1]">
                    {currentStepData.title}
                  </h3>
                  <span className="text-xs text-[#F0F0F0]/60">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="h-8 w-8 p-0 text-[#F0F0F0]/50 hover:text-[#00FFD1]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Illustration */}
            {currentStepData.illustration && (
              <div className="mb-4">
                {currentStepData.illustration}
              </div>
            )}

            <p className="text-[#F0F0F0]/80 mb-6 leading-relaxed">
              {currentStepData.content}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-[#F0F0F0]/50 mb-2">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-[#083838] rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#00FFD1] to-[#E8A135] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {currentStep === 0 ? 'Overview' : 'Previous'}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-[#F0F0F0]/60 hover:text-[#F0F0F0]"
                >
                  Skip Tour
                </Button>
                <Button
                  onClick={handleNext}
                  size="sm"
                  className="bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:shadow-[0_0_20px_rgba(0,255,209,0.4)]"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skip Tutorial Button */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          onClick={onSkip}
          className="border-[#F0F0F0]/30 text-[#F0F0F0] hover:bg-[#F0F0F0]/10"
        >
          Skip Tutorial
        </Button>
      </div>
    </div>
  );
};
