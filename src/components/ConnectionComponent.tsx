
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

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!fromNode || !toNode) return null;

  const fromX = fromNode.x + fromNode.width;
  const fromY = fromNode.y + fromNode.height / 2;
  const toX = toNode.x;
  const toY = toNode.y + toNode.height / 2;

  // Calculate control points for a curved line
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const curvature = 0.3;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const controlX = midX + (dy * curvature * distance) / 300;
  const controlY = midY - (dx * curvature * distance) / 300;

  const pathData = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

  const getConnectionColor = () => {
    switch (connection.type) {
      case "inspiration": return "#E8A135";
      case "reference": return "#00FFD1";
      default: return "#00FFD1";
    }
  };

  const color = getConnectionColor();
  const opacity = Math.max(0.3, connection.strength);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.5} />
          <stop offset="50%" stopColor={color} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.5} />
        </linearGradient>
        <filter id={`glow-${connection.id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main connection line */}
      <path
        d={pathData}
        stroke={`url(#gradient-${connection.id})`}
        strokeWidth="2"
        fill="none"
        filter={`url(#glow-${connection.id})`}
        className="transition-all duration-300"
      />

      {/* Animated pulse effect */}
      <path
        d={pathData}
        stroke={color}
        strokeWidth="4"
        fill="none"
        opacity={0.6}
        strokeDasharray="10,10"
        strokeDashoffset={-animationOffset}
        className="animate-pulse"
      />

      {/* Connection label */}
      {connection.label && (
        <text
          x={controlX}
          y={controlY - 10}
          fill="#F0F0F0"
          fontSize="12"
          textAnchor="middle"
          className="opacity-75"
        >
          {connection.label}
        </text>
      )}
    </svg>
  );
};
