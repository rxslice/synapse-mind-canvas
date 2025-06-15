
export interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  type: "thought" | "image" | "link" | "note";
  color: string;
  createdAt: Date;
  updatedAt?: Date;
  tags?: string[];
  metadata?: {
    source?: string;
    priority?: "low" | "medium" | "high";
    category?: string;
    isArchived?: boolean;
  };
}

export interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: "synapse" | "inspiration" | "reference" | "contradiction" | "evolution";
  strength: number; // 0-1, affects visual intensity
  createdAt: Date;
  updatedAt?: Date;
  label?: string;
  metadata?: {
    bidirectional?: boolean;
    weight?: number;
    confidence?: number;
  };
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  selectedNodeIds?: string[];
  mode?: "default" | "connecting" | "selecting";
  history?: {
    past: CanvasSnapshot[];
    present: CanvasSnapshot;
    future: CanvasSnapshot[];
  };
}

export interface CanvasSnapshot {
  nodes: Node[];
  connections: Connection[];
  timestamp: Date;
  description?: string;
}

export interface AIInsight {
  id: string;
  type: "pattern" | "suggestion" | "optimization" | "creative" | "warning";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  nodeIds?: string[];
  connectionIds?: string[];
}

export interface NetworkStats {
  nodeCount: number;
  connectionCount: number;
  networkDensity: number;
  averageConnections: number;
  isolatedNodes: number;
  clusters: number;
  centralNodes: string[];
}
