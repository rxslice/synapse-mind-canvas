
import { Connection, Node } from "@/types/canvas";
import { useEffect, useState } from "react";

interface ConnectionComponentProps {
  connection: Connection;
  fromNode?: Node;
  toNode?: Node;
}

export const ConnectionComponent = ({
  connection,
  fromNode,
  toNode,
}: ConnectionComponentProps) => {
  const [animationOffset, setAnimationOffset] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0.5);
  const [particlePositions, setParticlePositions] = useState<number[]>([]);

  useEffect(() => {
    // Initialize particle positions
    setParticlePositions([0.15, 0.35, 0.55, 0.75, 0.95]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1.5) % 100);
      setPulseIntensity(prev => 0.4 + Math.sin(Date.now() * 0.002) * 0.3);
      
      // Update particle positions for flowing effect
      setParticlePositions(prev => prev.map((pos, index) => 
        (pos + 0.008 + index * 0.002) % 1
      ));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  if (!fromNode || !toNode) return null;

  const fromX = fromNode.x + fromNode.width;
  const fromY = fromNode.y + fromNode.height / 2;
  const toX = toNode.x;
  const toY = toNode.y + toNode.height / 2;

  // Enhanced curve calculation with more organic flow
  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const curvature = Math.min(0.6, distance / 600);
  const dx = toX - fromX;
  const dy = toY - fromY;
  
  // Multiple control points for more natural curves
  const controlX1 = fromX + dx * 0.25 + (dy * curvature * distance) / 300;
  const controlY1 = fromY + dy * 0.25 - (dx * curvature * distance) / 300;
  const controlX2 = toX - dx * 0.25 + (dy * curvature * distance) / 300;
  const controlY2 = toY - dy * 0.25 - (dx * curvature * distance) / 300;

  const pathData = `M ${fromX} ${fromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${toY}`;

  // Calculate path length for proper particle distribution
  const pathLength = distance * 1.2; // Approximate
  
  // Bezier curve calculation for particle positioning
  const getBezierPoint = (t: number) => {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    
    const x = mt2 * mt * fromX + 
              3 * mt2 * t * controlX1 + 
              3 * mt * t2 * controlX2 + 
              t2 * t * toX;
              
    const y = mt2 * mt * fromY + 
              3 * mt2 * t * controlY1 + 
              3 * mt * t2 * controlY2 + 
              t2 * t * toY;
              
    return { x, y };
  };

  const getConnectionColor = () => {
    switch (connection.type) {
      case "inspiration": return "#E8A135";
      case "reference": return "#C0C0C0";
      case "synapse": return "#00FFD1";
      default: return "#00FFD1";
    }
  };

  const getSecondaryColor = () => {
    switch (connection.type) {
      case "inspiration": return "#FFD700";
      case "reference": return "#E6E6FA";
      case "synapse": return "#40E0D0";
      default: return "#40E0D0";
    }
  };

  const color = getConnectionColor();
  const secondaryColor = getSecondaryColor();
  const opacity = Math.max(0.3, connection.strength);
  const glowIntensity = pulseIntensity * connection.strength;
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        {/* Multi-stop gradient for depth */}
        <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.2} />
          <stop offset="15%" stopColor={secondaryColor} stopOpacity={opacity * 0.6} />
          <stop offset="35%" stopColor={color} stopOpacity={opacity * 0.9} />
          <stop offset="50%" stopColor={secondaryColor} stopOpacity={opacity} />
          <stop offset="65%" stopColor={color} stopOpacity={opacity * 0.9} />
          <stop offset="85%" stopColor={secondaryColor} stopOpacity={opacity * 0.6} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.2} />
        </linearGradient>

        {/* Enhanced glow filter with multiple layers */}
        <filter id={`glow-${connection.id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feGaussianBlur stdDeviation="8" result="mediumGlow"/>
          <feGaussianBlur stdDeviation="15" result="bigGlow"/>
          <feMerge> 
            <feMergeNode in="bigGlow"/>
            <feMergeNode in="mediumGlow"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Animated pulse gradient */}
        <radialGradient id={`pulse-${connection.id}`}>
          <stop offset="0%" stopColor={color} stopOpacity={glowIntensity * 0.8} />
          <stop offset="40%" stopColor={secondaryColor} stopOpacity={glowIntensity * 0.6} />
          <stop offset="70%" stopColor={color} stopOpacity={glowIntensity * 0.3} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        {/* Flowing energy gradient */}
        <linearGradient id={`flow-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor={secondaryColor} stopOpacity="1" />
          <stop offset="70%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Outer glow path - largest */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="12"
        fill="none"
        opacity={0.15}
        filter={`url(#glow-${connection.id})`}
        strokeLinecap="round"
      />

      {/* Middle glow path */}
      <path
        d={pathData}
        stroke={secondaryColor}
        strokeWidth="8"
        fill="none"
        opacity={0.25}
        filter={`url(#glow-${connection.id})`}
        strokeLinecap="round"
      />

      {/* Main connection line with enhanced gradient */}
      <path
        d={pathData}
        stroke={`url(#gradient-${connection.id})`}
        strokeWidth="4"
        fill="none"
        filter={`url(#glow-${connection.id})`}
        className="transition-all duration-700"
        strokeLinecap="round"
      />

      {/* Flowing energy streams */}
      <path
        d={pathData}
        stroke={`url(#flow-${connection.id})`}
        strokeWidth="3"
        fill="none"
        opacity={glowIntensity * 1.2}
        strokeDasharray="20,30"
        strokeDashoffset={-animationOffset * 2}
        strokeLinecap="round"
        className="animate-synapse-flow"
      />

      {/* Secondary energy flow in opposite direction */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity={glowIntensity * 0.8}
        strokeDasharray="8,15"
        strokeDashoffset={animationOffset}
        strokeLinecap="round"
      />

      {/* Enhanced particle effects along the curve */}
      {particlePositions.map((position, index) => {
        const point = getBezierPoint(position);
        const size = 2 + Math.sin(Date.now() * 0.003 + index) * 1;
        const particleOpacity = glowIntensity * (0.6 + Math.sin(Date.now() * 0.004 + index * 1.5) * 0.4);
        
        return (
          <g key={index}>
            {/* Particle glow */}
            <circle
              cx={point.x}
              cy={point.y}
              r={size * 2}
              fill={index % 2 === 0 ? color : secondaryColor}
              opacity={particleOpacity * 0.3}
              filter={`url(#glow-${connection.id})`}
            />
            {/* Particle core */}
            <circle
              cx={point.x}
              cy={point.y}
              r={size}
              fill={index % 2 === 0 ? color : secondaryColor}
              opacity={particleOpacity}
              className="animate-pulse-glow"
            />
          </g>
        );
      })}

      {/* Connection strength indicator with enhanced design */}
      <g>
        <circle
          cx={midX}
          cy={midY}
          r={8 + connection.strength * 4}
          fill={`url(#pulse-${connection.id})`}
          className="animate-pulse-glow"
        />
        <circle
          cx={midX}
          cy={midY}
          r={4 + connection.strength * 2}
          fill={color}
          opacity={glowIntensity}
          className="animate-pulse"
        />
        {/* Inner highlight */}
        <circle
          cx={midX}
          cy={midY}
          r={2}
          fill="rgba(255,255,255,0.8)"
          opacity={glowIntensity * 0.6}
        />
      </g>

      {/* Enhanced connection label with premium styling */}
      {connection.label && (
        <g>
          {/* Label background with glow */}
          <rect
            x={midX - connection.label.length * 4}
            y={midY - 20}
            width={connection.label.length * 8}
            height={20}
            rx="10"
            fill={color}
            opacity="0.3"
            filter={`url(#glow-${connection.id})`}
          />
          <rect
            x={midX - connection.label.length * 4}
            y={midY - 20}
            width={connection.label.length * 8}
            height={20}
            rx="10"
            fill="rgba(11,61,61,0.9)"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          {/* Label text */}
          <text
            x={midX}
            y={midY - 7}
            fill="#F0F0F0"
            fontSize="11"
            fontWeight="500"
            textAnchor="middle"
            className="opacity-95"
            style={{ 
              filter: `drop-shadow(0 0 4px ${color})`,
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            {connection.label}
          </text>
        </g>
      )}

      {/* Ambient energy field around the entire connection */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="20"
        fill="none"
        opacity={0.05}
        className="animate-pulse-glow"
        strokeLinecap="round"
      />
    </svg>
  );
};
