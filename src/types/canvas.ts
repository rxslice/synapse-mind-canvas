
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
  tags?: string[];
}

export interface Connection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: "synapse" | "inspiration" | "reference";
  strength: number; // 0-1, affects visual intensity
  createdAt: Date;
  label?: string;
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
}
