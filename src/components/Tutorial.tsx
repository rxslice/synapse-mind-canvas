
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Lightbulb, MousePointer, Zap } from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  highlight?: string;
}

interface TutorialProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to Synapse",
    content: "Your AI-powered second brain for capturing and connecting thoughts. Let's take a quick tour!",
    icon: <Lightbulb className="w-5 h-5" />,
    position: { x: 50, y: 30 }
  },
  {
    id: 2,
    title: "Neural Hub",
    content: "Your command center. Monitor your neural network, create thoughts, and activate AI insights.",
    icon: <MousePointer className="w-5 h-5" />,
    position: { x: 20, y: 15 }
  },
  {
    id: 3,
    title: "Create Thoughts",
    content: "Double-click anywhere on the canvas to create a new thought node. Try it now!",
    icon: <MousePointer className="w-5 h-5" />,
    position: { x: 50, y: 50 }
  },
  {
    id: 4,
    title: "Connect Ideas",
    content: "Click the link button on any node to connect it with another thought, building your neural network.",
    icon: <ArrowRight className="w-5 h-5" />,
    position: { x: 70, y: 40 }
  },
  {
    id: 5,
    title: "AI Insights",
    content: "Activate your AI brain to get intelligent suggestions and pattern recognition across your thoughts.",
    icon: <Zap className="w-5 h-5" />,
    position: { x: 20, y: 70 }
  }
];

export const Tutorial = ({ isVisible, onComplete, onSkip }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
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
    }
  };

  const currentStepData = tutorialSteps[currentStep];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
      {/* Tutorial Card */}
      <div 
        className={`absolute transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{
          left: `${currentStepData.position.x}%`,
          top: `${currentStepData.position.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Card className="w-80 bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/90 backdrop-blur-xl border border-[#00FFD1]/50 shadow-[0_0_40px_rgba(0,255,209,0.3)]">
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
                disabled={currentStep === 0}
                className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous
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
