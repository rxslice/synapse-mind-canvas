import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X, ArrowRight, ArrowLeft, Lightbulb, MousePointer,
  Zap, Brain, Network, BookOpen, Rocket, Users, Target, Link, Plus
} from "lucide-react";

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
            {/* ... unchanged intro page content */}
            {/* skipped for brevity, unchanged */}
          </ScrollArea>

          <div className="border-t border-[#00FFD1]/20 p-6">
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={onSkip} className="text-[#F0F0F0]/60 hover:text-[#F0F0F0]">
                Skip Tutorial
              </Button>
              <Button onClick={onStart} className="bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:shadow-[0_0_20px_rgba(0,255,209,0.4)] px-8">
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
    content: "This is your neural network's control center...",
    icon: <Brain className="w-5 h-5" />,
    position: { x: 50, y: 35 }, // modified from 25 to 35
    illustration: (
      <div className="bg-gradient-to-br from-[#0B3D3D]/50 to-[#083838]/30 rounded-lg p-4 border border-[#00FFD1]/30 mb-4">
        {/* ... unchanged illustration */}
      </div>
    )
  },
  {
    id: 2,
    title: "Create Your First Thought",
    content: "Double-click anywhere on the canvas...",
    icon: <Plus className="w-5 h-5" />,
    position: { x: 25, y: 50 }, // unchanged
    illustration: (
      <div className="text-center mb-4">
        {/* ... unchanged illustration */}
      </div>
    )
  },
  {
    id: 3,
    title: "Connect Related Ideas",
    content: "Click the link button on any node...",
    icon: <Link className="w-5 h-5" />,
    position: { x: 75, y: 50 }, // unchanged
    illustration: (
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* ... unchanged illustration */}
      </div>
    )
  },
  {
    id: 4,
    title: "Navigate Your Neural Network",
    content: "Use mouse wheel to zoom in/out...",
    icon: <MousePointer className="w-5 h-5" />,
    position: { x: 50, y: 55 }, // modified from 65 to 55
    illustration: (
      <div className="bg-gradient-to-br from-[#0B3D3D]/50 to-[#083838]/30 rounded-lg p-4 border border-[#9945FF]/30 mb-4">
        {/* ... unchanged illustration */}
      </div>
    )
  },
  {
    id: 5,
    title: "Activate AI Brain",
    content: "Turn on your AI brain to get intelligent insights...",
    icon: <Zap className="w-5 h-5" />,
    position: { x: 50, y: 35 }, // unchanged
    illustration: (
      <div className="bg-gradient-to-br from-[#9945FF]/20 to-[#9945FF]/10 rounded-lg p-4 border border-[#9945FF]/40 mb-4">
        {/* ... unchanged illustration */}
      </div>
    )
  }
];

export const Tutorial = ({ isVisible, onComplete, onSkip }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(-1);
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
      setCurrentStep(-1);
    }
  };

  const handleStartTour = () => {
    setCurrentStep(0);
  };

  if (!isVisible) return null;

  if (currentStep === -1) {
    return <IntroPage onStart={handleStartTour} onSkip={onSkip} />;
  }

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
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
              <Button variant="ghost" size="sm" onClick={onSkip} className="h-8 w-8 p-0 text-[#F0F0F0]/50 hover:text-[#00FFD1]">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {currentStepData.illustration && (
              <div className="mb-4">
                {currentStepData.illustration}
              </div>
            )}

            <p className="text-[#F0F0F0]/80 mb-6 leading-relaxed">
              {currentStepData.content}
            </p>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-[#F0F0F0]/50 mb-2">
                <span>
                  {currentStep > 0 ? `Back to Step ${currentStep}` : "Back"}
                </span>
                <span>
                  {currentStep < tutorialSteps.length - 1 ? `Step ${currentStep + 2}` : "Finish"}
                </span>
              </div>
              <div className="flex h-2 bg-[#00FFD1]/20 rounded-full overflow-hidden">
                <div
                  className="bg-[#00FFD1] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={handlePrevious} className="text-[#F0F0F0]/60 hover:text-[#F0F0F0]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNext} className="bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:shadow-[0_0_20px_rgba(0,255,209,0.4)] px-6">
                {currentStep < tutorialSteps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Finish
                    <Rocket className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
