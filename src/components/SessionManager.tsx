
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, Plus, Trash2, FileText, Calendar, Users, Activity, X, AlertTriangle } from "lucide-react";
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

interface SavedSession {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  nodeCount: number;
  connectionCount: number;
  nodes: Node[];
  connections: Connection[];
  thumbnail?: string;
}

export const SessionManager = ({
  nodes,
  connections,
  onNewSession,
  onLoadSession,
  isOpen,
  onClose
}: SessionManagerProps) => {
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>(() => {
    try {
      const saved = localStorage.getItem('synapse-saved-sessions');
      return saved ? JSON.parse(saved).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        nodes: session.nodes.map((node: any) => ({
          ...node,
          createdAt: new Date(node.createdAt),
          updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined
        })),
        connections: session.connections.map((conn: any) => ({
          ...conn,
          createdAt: new Date(conn.createdAt),
          updatedAt: conn.updatedAt ? new Date(conn.updatedAt) : undefined
        }))
      })) : [];
    } catch {
      return [];
    }
  });

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveCurrentSession = () => {
    if (!sessionName.trim()) {
      toast.error("Session name required");
      return;
    }

    const newSession: SavedSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: sessionName.trim(),
      description: sessionDescription.trim(),
      createdAt: new Date(),
      nodeCount: nodes.length,
      connectionCount: connections.length,
      nodes: [...nodes],
      connections: [...connections]
    };

    const updatedSessions = [...savedSessions, newSession];
    setSavedSessions(updatedSessions);
    localStorage.setItem('synapse-saved-sessions', JSON.stringify(updatedSessions));

    setShowSaveDialog(false);
    setSessionName("");
    setSessionDescription("");

    toast.success("Neural session crystallized", {
      description: `"${newSession.name}" saved with ${newSession.nodeCount} thoughts`,
      duration: 3000
    });
  };

  const loadSession = (session: SavedSession) => {
    onLoadSession(session.nodes, session.connections);
    onClose();
    
    toast.success("Neural session restored", {
      description: `Loaded "${session.name}" with ${session.nodeCount} thoughts`,
      duration: 3000
    });
  };

  const deleteSession = (sessionId: string) => {
    const session = savedSessions.find(s => s.id === sessionId);
    const updatedSessions = savedSessions.filter(s => s.id !== sessionId);
    setSavedSessions(updatedSessions);
    localStorage.setItem('synapse-saved-sessions', JSON.stringify(updatedSessions));
    setShowDeleteConfirm(null);

    toast("Neural session dissolved", {
      description: `"${session?.name}" removed from memory`,
      duration: 2000
    });
  };

  const exportSession = () => {
    const exportData = {
      nodes,
      connections,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `synapse-session-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Neural data exported", {
      description: `Downloaded session with ${nodes.length} thoughts`,
      duration: 3000
    });
  };

  const importSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (!importData.nodes || !importData.connections) {
          throw new Error("Invalid session format");
        }

        const importedNodes = importData.nodes.map((node: any) => ({
          ...node,
          createdAt: new Date(node.createdAt),
          updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined
        }));

        const importedConnections = importData.connections.map((conn: any) => ({
          ...conn,
          createdAt: new Date(conn.createdAt),
          updatedAt: conn.updatedAt ? new Date(conn.updatedAt) : undefined
        }));

        onLoadSession(importedNodes, importedConnections);
        onClose();

        toast.success("Neural session imported", {
          description: `Loaded ${importedNodes.length} thoughts and ${importedConnections.length} connections`,
          duration: 4000
        });
      } catch (error) {
        console.error('Import failed:', error);
        toast.error("Import failed", {
          description: "Invalid session file format",
          duration: 4000
        });
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNewSession = () => {
    onNewSession();
    onClose();
    
    toast("New neural session initiated", {
      description: "Canvas cleared and ready for fresh thoughts",
      duration: 3000
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/90 backdrop-blur-xl border border-[#00FFD1]/50 shadow-[0_0_40px_rgba(0,255,209,0.3)] overflow-hidden">
            <CardHeader className="border-b border-[#00FFD1]/30 bg-gradient-to-r from-[#00FFD1]/10 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-light text-[#00FFD1] flex items-center gap-3">
                    <Activity className="w-6 h-6" />
                    Session Manager
                  </CardTitle>
                  <p className="text-[#F0F0F0]/60 mt-1">Manage your neural network sessions</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-[#F0F0F0]/50 hover:text-[#00FFD1] hover:bg-[#00FFD1]/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                <Button
                  onClick={handleNewSession}
                  className="bg-gradient-to-r from-[#00FFD1]/20 to-[#00FFD1]/10 text-[#00FFD1] border border-[#00FFD1]/40 hover:from-[#00FFD1]/30 hover:to-[#00FFD1]/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Session
                </Button>

                <Button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={nodes.length === 0}
                  className="bg-gradient-to-r from-[#E8A135]/20 to-[#E8A135]/10 text-[#E8A135] border border-[#E8A135]/40 hover:from-[#E8A135]/30 hover:to-[#E8A135]/20 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Save Current
                </Button>

                <Button
                  onClick={exportSession}
                  disabled={nodes.length === 0}
                  className="bg-gradient-to-r from-[#9945FF]/20 to-[#9945FF]/10 text-[#9945FF] border border-[#9945FF]/40 hover:from-[#9945FF]/30 hover:to-[#9945FF]/20 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                <div className="relative">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-[#F0F0F0]/20 to-[#F0F0F0]/10 text-[#F0F0F0] border border-[#F0F0F0]/40 hover:from-[#F0F0F0]/30 hover:to-[#F0F0F0]/20"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={importSession}
                    className="hidden"
                  />
                </div>
              </div>

              <Separator className="bg-[#00FFD1]/20 mb-6" />

              {/* Saved Sessions */}
              <div>
                <h3 className="text-lg font-medium text-[#F0F0F0] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00FFD1]" />
                  Saved Sessions ({savedSessions.length})
                </h3>

                {savedSessions.length === 0 ? (
                  <div className="text-center py-12 text-[#F0F0F0]/50">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No saved sessions yet</p>
                    <p className="text-sm mt-1">Save your current neural network to revisit later</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {savedSessions.map((session) => (
                      <Card
                        key={session.id}
                        className="bg-gradient-to-r from-[#083838]/60 to-[#0B3D3D]/40 border border-[#00FFD1]/20 hover:border-[#00FFD1]/40 transition-all duration-300"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-[#00FFD1] mb-1">{session.name}</h4>
                              {session.description && (
                                <p className="text-sm text-[#F0F0F0]/70 mb-2">{session.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-[#F0F0F0]/50">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {session.createdAt.toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {session.nodeCount} thoughts
                                </span>
                                <span className="flex items-center gap-1">
                                  <Activity className="w-3 h-3" />
                                  {session.connectionCount} connections
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => loadSession(session)}
                                className="bg-[#00FFD1]/20 text-[#00FFD1] hover:bg-[#00FFD1]/30 border border-[#00FFD1]/40"
                              >
                                Load
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowDeleteConfirm(session.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/90 border border-[#00FFD1]/50 text-[#F0F0F0]">
          <DialogHeader>
            <DialogTitle className="text-[#00FFD1]">Save Neural Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sessionName" className="text-[#F0F0F0]/80">Session Name</Label>
              <Input
                id="sessionName"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Enter session name..."
                className="bg-[#083838]/50 border-[#00FFD1]/30 text-[#F0F0F0] placeholder:text-[#F0F0F0]/40"
              />
            </div>
            <div>
              <Label htmlFor="sessionDescription" className="text-[#F0F0F0]/80">Description (Optional)</Label>
              <Textarea
                id="sessionDescription"
                value={sessionDescription}
                onChange={(e) => setSessionDescription(e.target.value)}
                placeholder="Describe this neural session..."
                className="bg-[#083838]/50 border-[#00FFD1]/30 text-[#F0F0F0] placeholder:text-[#F0F0F0]/40 resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowSaveDialog(false)}
                className="text-[#F0F0F0]/60 hover:text-[#F0F0F0]"
              >
                Cancel
              </Button>
              <Button
                onClick={saveCurrentSession}
                className="bg-[#00FFD1] text-[#0B3D3D] hover:bg-[#00FFD1]/90"
              >
                Save Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <DialogContent className="bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/90 border border-red-400/50 text-[#F0F0F0]">
            <DialogHeader>
              <DialogTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Delete Session
              </DialogTitle>
            </DialogHeader>
            <p className="text-[#F0F0F0]/80">
              Are you sure you want to delete this neural session? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(null)}
                className="text-[#F0F0F0]/60 hover:text-[#F0F0F0]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteSession(showDeleteConfirm)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

