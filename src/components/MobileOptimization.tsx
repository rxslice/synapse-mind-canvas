
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setOrientation(window.innerWidth < window.innerHeight ? 'portrait' : 'landscape');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  const showMobileOptimizationTip = () => {
    if (isMobile) {
      toast({
        title: "Mobile Tips",
        description: "Pinch to zoom, long press to create nodes, swipe to navigate",
        duration: 3000,
      });
    }
  };

  return { isMobile, orientation, showMobileOptimizationTip };
};

export const MobileCanvas = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useMobileOptimization();

  return (
    <div 
      className={`
        ${isMobile ? 'touch-manipulation select-none' : ''}
        w-full h-full overflow-hidden
      `}
      style={{
        touchAction: isMobile ? 'pan-x pan-y pinch-zoom' : 'auto',
      }}
    >
      {children}
    </div>
  );
};
