
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

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 2) % 100);
      setPulseIntensity(prev => 0.3 + Math.sin(Date.now() * 0.003) * 0.4);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!fromNode || !toNode) return null;

  const fromX = fromNode.x + fromNode.width;
  const fromY = fromNode.y + fromNode.height / 2;
  const toX = toNode.x;
  const toY = toNode.y + toNode.height / 2;

  // Enhanced curve calculation
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const curvature = Math.min(0.5, distance / 800);
  const dx = toX - fromX;
  const dy = toY - fromY;
  
  const controlX1 = fromX + dx * 0.3 + (dy * curvature * distance) / 400;
  const controlY1 = fromY + dy * 0.3 - (dx * curvature * distance) / 400;
  const controlX2 = toX - dx * 0.3 + (dy * curvature * distance) / 400;
  const controlY2 = toY - dy * 0.3 - (dx * curvature * distance) / 400;

  const pathData = `M ${fromX} ${fromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${toY}`;

  const getConnectionColor = () => {
    switch (connection.type) {
      case "inspiration": return "#E8A135";
      case "reference": return "#C0C0C0";
      case "synapse": return "#00FFD1";
      default: return "#00FFD1";
    }
  };

  const color = getConnectionColor();
  const opacity = Math.max(0.4, connection.strength);
  const glowIntensity = pulseIntensity * connection.strength;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        {/* Enhanced gradient with multiple stops */}
        <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.3} />
          <stop offset="20%" stopColor={color} stopOpacity={opacity * 0.7} />
          <stop offset="50%" stopColor={color} stopOpacity={opacity} />
          <stop offset="80%" stopColor={color} stopOpacity={opacity * 0.7} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.3} />
        </linearGradient>

        {/* Enhanced glow filter */}
        <filter id={`glow-${connection.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feGaussianBlur stdDeviation="8" result="bigGlow"/>
          <feMerge> 
            <feMergeNode in="bigGlow"/>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Pulse animation gradient */}
        <radialGradient id={`pulse-${connection.id}`}>
          <stop offset="0%" stopColor={color} stopOpacity={glowIntensity} />
          <stop offset="70%" stopColor={color} stopOpacity={glowIntensity * 0.5} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow path */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="8"
        fill="none"
        opacity={0.2}
        filter={`url(#glow-${connection.id})`}
      />

      {/* Main connection line with enhanced styling */}
      <path
        d={pathData}
        stroke={`url(#gradient-${connection.id})`}
        strokeWidth="3"
        fill="none"
        filter={`url(#glow-${connection.id})`}
        className="transition-all duration-500"
        strokeLinecap="round"
      />

      {/* Animated energy flow */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity={glowIntensity}
        strokeDasharray="15,25"
        strokeDashoffset={-animationOffset}
        strokeLinecap="round"
        className="animate-synapse-flow"
      />

      {/* Particle effects along the path */}
      {[0.2, 0.5, 0.8].map((position, index) => {
        const t = (position + animationOffset * 0.01) % 1;
        const x = fromX + (controlX1 - fromX) * t + (controlX2 - controlX1) * t * t + (toX - controlX2) * t * t * t;
        const y = fromY + (controlY1 - fromY) * t + (controlY2 - controlY1) * t * t + (toY - controlY2) * t * t * t;
        
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            opacity={glowIntensity * (0.5 + Math.sin(Date.now() * 0.005 + index) * 0.3)}
            className="animate-pulse"
          />
        );
      })}

      {/* Connection strength indicator */}
      <circle
        cx={midX}
        cy={midY}
        r={3 + connection.strength * 2}
        fill={`url(#pulse-${connection.id})`}
        className="animate-pulse-glow"
      />

      {/* Connection label with enhanced styling */}
      {connection.label && (
        <g>
          <rect
            x={midX - connection.label.length * 3}
            y={midY - 15}
            width={connection.label.length * 6}
            height={16}
            rx="8"
            fill={color}
            opacity="0.2"
          />
          <text
            x={midX}
            y={midY - 5}
            fill="#F0F0F0"
            fontSize="10"
            textAnchor="middle"
            className="opacity-90 font-medium"
            style={{ filter: `drop-shadow(0 0 3px ${color})` }}
          >
            {connection.label}
          </text>
        </g>
      )}
    </svg>
  );
};
