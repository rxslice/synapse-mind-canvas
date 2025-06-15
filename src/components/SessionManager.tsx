
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  RotateCcw, 
  Plus, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle,
  FileDown,
  FileUp
} from "lucide-react";
import { Node, Connection } from "@/types/canvas";
import { toast } from "sonner";

interface SessionManagerProps {
  nodes: Node[];
  connections: Connection[];
  onNewSession: () => void;
  onLoadSession: (nodes: Node[], connections: Connection[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SessionManager = ({ 
  nodes, 
  connections, 
  onNewSession, 
  onLoadSession,
  isOpen,
  onClose 
}: SessionManagerProps) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleNewSession = () => {
    if (nodes.length > 0 || connections.length > 0) {
      setShowResetConfirm(true);
    } else {
      onNewSession();
      onClose();
    }
  };

  const confirmReset = () => {
    onNewSession();
    setShowResetConfirm(false);
    onClose();
    toast.success("New session started", {
      description: "Your neural network has been reset",
      duration: 3000
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const exportData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        nodes: nodes.map(node => ({
          ...node,
          createdAt: node.createdAt.toISOString(),
          updatedAt: node.updatedAt?.toISOString()
        })),
        connections: connections.map(conn => ({
          ...conn,
          createdAt: conn.createdAt.toISOString(),
          updatedAt: conn.updatedAt?.toISOString()
        })),
        stats: {
          nodeCount: nodes.length,
          connectionCount: connections.length,
          networkDensity: nodes.length > 0 ? (connections.length / Math.max(nodes.length - 1, 1)) * 100 : 0
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `synapse-session-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Session exported", {
        description: "Your neural network has been saved to a file",
        duration: 3000
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Export failed", {
        description: "Unable to export your session. Please try again.",
        duration: 4000
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (!importData.nodes || !importData.connections) {
          throw new Error("Invalid file format");
        }

        const importedNodes: Node[] = importData.nodes.map((node: any) => ({
          ...node,
          createdAt: new Date(node.createdAt),
          updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined
        }));

        const importedConnections: Connection[] = importData.connections.map((conn: any) => ({
          ...conn,
          createdAt: new Date(conn.createdAt),
          updatedAt: conn.updatedAt ? new Date(conn.updatedAt) : undefined
        }));

        onLoadSession(importedNodes, importedConnections);
        onClose();

        toast.success("Session imported", {
          description: `Loaded ${importedNodes.length} thoughts and ${importedConnections.length} connections`,
          duration: 4000
        });
      } catch (error) {
        console.error('Import failed:', error);
        toast.error("Import failed", {
          description: "Invalid file format or corrupted data",
          duration: 4000
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const sessionStats = {
    nodeCount: nodes.length,
    connectionCount: connections.length,
    networkDensity: nodes.length > 0 ? Math.round((connections.length / Math.max(nodes.length - 1, 1)) * 100) : 0,
    lastActivity: nodes.length > 0 ? Math.max(...nodes.map(n => n.updatedAt?.getTime() || n.createdAt.getTime())) : null
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/90 border border-[#00FFD1]/30 text-[#F0F0F0] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#00FFD1] text-xl">Session Manager</DialogTitle>
            <DialogDescription className="text-[#F0F0F0]/70">
              Manage your neural network sessions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Session Stats */}
            <Card className="bg-[#083838]/40 border border-[#00FFD1]/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-[#00FFD1]">Current Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#F0F0F0]/70">Thoughts:</span>
                  <span className="text-[#00FFD1] font-medium">{sessionStats.nodeCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#F0F0F0]/70">Connections:</span>
                  <span className="text-[#E8A135] font-medium">{sessionStats.connectionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#F0F0F0]/70">Network Density:</span>
                  <span className="text-[#9945FF] font-medium">{sessionStats.networkDensity}%</span>
                </div>
                {sessionStats.lastActivity && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F0F0F0]/70">Last Activity:</span>
                    <span className="text-[#F0F0F0]/50 text-xs">
                      {new Date(sessionStats.lastActivity).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Session Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleNewSession}
                className="h-12 bg-gradient-to-r from-[#E8A135]/20 to-[#E8A135]/10 text-[#E8A135] border border-[#E8A135]/40 hover:from-[#E8A135]/30 hover:to-[#E8A135]/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>

              <Button
                onClick={handleExport}
                disabled={nodes.length === 0 || isExporting}
                className="h-12 bg-gradient-to-r from-[#9945FF]/20 to-[#9945FF]/10 text-[#9945FF] border border-[#9945FF]/40 hover:from-[#9945FF]/30 hover:to-[#9945FF]/20 disabled:opacity-50"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>

              <label className="col-span-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button
                  as="div"
                  className="w-full h-12 bg-gradient-to-r from-[#00FFD1]/20 to-[#00FFD1]/10 text-[#00FFD1] border border-[#00FFD1]/40 hover:from-[#00FFD1]/30 hover:to-[#00FFD1]/20 cursor-pointer"
                >
                  <FileUp className="w-4 h-4 mr-2" />
                  Import Session
                </Button>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#F0F0F0]/30 text-[#F0F0F0] hover:bg-[#F0F0F0]/10"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/90 border border-[#E8A135]/50 text-[#F0F0F0]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#E8A135]">
              <AlertTriangle className="w-5 h-5" />
              Confirm New Session
            </DialogTitle>
            <DialogDescription className="text-[#F0F0F0]/70">
              Starting a new session will clear your current neural network. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-[#E8A135]/10 border border-[#E8A135]/30 rounded-lg p-4">
            <p className="text-sm text-[#F0F0F0]/80">
              You currently have <strong className="text-[#00FFD1]">{nodes.length} thoughts</strong> and{' '}
              <strong className="text-[#E8A135]">{connections.length} connections</strong> that will be lost.
            </p>
            <p className="text-xs text-[#F0F0F0]/60 mt-2">
              Consider exporting your session first to save your work.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(false)}
              className="border-[#F0F0F0]/30 text-[#F0F0F0] hover:bg-[#F0F0F0]/10"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReset}
              className="bg-gradient-to-r from-[#E8A135] to-[#E8A135]/90 text-[#0B3D3D] hover:shadow-[0_0_20px_rgba(232,161,53,0.4)]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Start New Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
