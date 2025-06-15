
import { useRef, useEffect, useState, useCallback } from "react";
import { Node, Connection, CanvasState } from "@/types/canvas";
import { NodeComponent } from "./NodeComponent";
import { ConnectionComponent } from "./ConnectionComponent";

interface CanvasProps {
  nodes: Node[];
  connections: Connection[];
  onCreateNode: (x: number, y: number) => void;
  onSelectNode: (node: Node | null) => void;
  onUpdateNode: (node: Node) => void;
  onDeleteNode: (nodeId: string) => void;
  onCreateConnection: (fromNodeId: string, toNodeId: string) => void;
  selectedNode: Node | null;
}

export const Canvas = ({
  nodes,
  connections,
  onCreateNode,
  onSelectNode,
  onUpdateNode,
  onDeleteNode,
  onCreateConnection,
  selectedNode,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setCanvasState(prev => {
      const newZoom = Math.max(0.1, Math.min(3, prev.zoom - e.deltaY * 0.001));
      const zoomRatio = newZoom / prev.zoom;
      
      return {
        zoom: newZoom,
        panX: mouseX - (mouseX - prev.panX) * zoomRatio,
        panY: mouseY - (mouseY - prev.panY) * zoomRatio,
      };
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasState.panX, y: e.clientY - canvasState.panY });
      onSelectNode(null);
    }
  }, [canvasState.panX, canvasState.panY, onSelectNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setCanvasState(prev => ({
        ...prev,
        panX: e.clientX - dragStart.x,
        panY: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasState.panX) / canvasState.zoom;
      const y = (e.clientY - rect.top - canvasState.panY) / canvasState.zoom;
      onCreateNode(x, y);
    }
  }, [canvasState.panX, canvasState.panY, canvasState.zoom, onCreateNode]);

  const handleNodeConnect = useCallback((nodeId: string) => {
    if (connectingFrom && connectingFrom !== nodeId) {
      onCreateConnection(connectingFrom, nodeId);
      setConnectingFrom(null);
    } else {
      setConnectingFrom(nodeId);
    }
  }, [connectingFrom, onCreateConnection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-screen cursor-grab active:cursor-grabbing relative overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      style={{
        background: `
          radial-gradient(circle at 20% 50%, rgba(0, 255, 209, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(232, 161, 53, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(0, 255, 209, 0.05) 0%, transparent 50%),
          #0B3D3D
        `,
      }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 209, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 209, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: `${50 * canvasState.zoom}px ${50 * canvasState.zoom}px`,
          transform: `translate(${canvasState.panX % (50 * canvasState.zoom)}px, ${canvasState.panY % (50 * canvasState.zoom)}px)`,
        }}
      />

      {/* Canvas content */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Render connections first (behind nodes) */}
        {connections.map(connection => (
          <ConnectionComponent
            key={connection.id}
            connection={connection}
            fromNode={nodes.find(n => n.id === connection.fromNodeId)}
            toNode={nodes.find(n => n.id === connection.toNodeId)}
          />
        ))}

        {/* Render nodes */}
        {nodes.map(node => (
          <NodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            isConnecting={connectingFrom === node.id}
            onSelect={() => onSelectNode(node)}
            onUpdate={onUpdateNode}
            onDelete={() => onDeleteNode(node.id)}
            onConnect={() => handleNodeConnect(node.id)}
          />
        ))}
      </div>

      {/* Instructions overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-[#F0F0F0] opacity-60">
            <div className="text-4xl font-light mb-4">Welcome to Synapse</div>
            <div className="text-lg">Double-click anywhere to create your first thought</div>
            <div className="text-sm mt-2 opacity-75">Scroll to zoom • Drag to pan</div>
          </div>
        </div>
      )}
    </div>
  );
};
