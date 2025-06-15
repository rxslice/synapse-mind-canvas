
import { useEffect } from "react";
import { toast } from "sonner";

interface KeyboardShortcutsProps {
  onQuickCreate: () => void;
  onSave: () => void;
  onToggleAI: () => void;
  onShowTutorial: () => void;
  onShowSessionManager: () => void;
  selectedNode: any;
  onDeleteSelected: () => void;
}

export const KeyboardShortcuts = ({
  onQuickCreate,
  onSave,
  onToggleAI,
  onShowTutorial,
  onShowSessionManager,
  selectedNode,
  onDeleteSelected
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          (e.target as any)?.contentEditable === 'true') {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + N: New thought
      if (modKey && e.key === 'n') {
        e.preventDefault();
        onQuickCreate();
        return;
      }

      // Ctrl/Cmd + S: Save
      if (modKey && e.key === 's') {
        e.preventDefault();
        onSave();
        return;
      }

      // Ctrl/Cmd + A: Toggle AI
      if (modKey && e.key === 'a') {
        e.preventDefault();
        onToggleAI();
        return;
      }

      // Ctrl/Cmd + H: Show tutorial
      if (modKey && e.key === 'h') {
        e.preventDefault();
        onShowTutorial();
        return;
      }

      // Ctrl/Cmd + M: Session manager
      if (modKey && e.key === 'm') {
        e.preventDefault();
        onShowSessionManager();
        return;
      }

      // Delete: Delete selected node
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode) {
        e.preventDefault();
        onDeleteSelected();
        return;
      }

      // ? : Show help
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        showKeyboardHelp();
        return;
      }

      // Space: Quick create at center
      if (e.key === ' ') {
        e.preventDefault();
        onQuickCreate();
        return;
      }
    };

    const showKeyboardHelp = () => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKeySymbol = isMac ? '⌘' : 'Ctrl';
      
      toast("⌨️ Keyboard Shortcuts", {
        description: `${modKeySymbol}+N: New thought • ${modKeySymbol}+S: Save • ${modKeySymbol}+A: Toggle AI\n${modKeySymbol}+H: Tutorial • ${modKeySymbol}+M: Session Manager • Space: Quick create\nDelete: Remove selected • ?: Show this help`,
        duration: 8000
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onQuickCreate, onSave, onToggleAI, onShowTutorial, onShowSessionManager, selectedNode, onDeleteSelected]);

  return null;
};
