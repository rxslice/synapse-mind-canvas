
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Settings, X, Palette, Brain, Save, Trash2, Monitor } from "lucide-react";
import { toast } from "sonner";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingChange: (key: string, value: any) => void;
}

interface AppSettings {
  autoSave: boolean;
  aiEnabled: boolean;
  darkMode: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  autoSaveInterval: number;
  networkHealth: boolean;
  notifications: boolean;
  theme: 'neural' | 'classic' | 'minimal';
}

export const SettingsPanel = ({ isOpen, onClose, onSettingChange }: SettingsPanelProps) => {
  const [settings, setSettings] = useState<AppSettings>({
    autoSave: true,
    aiEnabled: true,
    darkMode: true,
    animationsEnabled: true,
    soundEnabled: false,
    autoSaveInterval: 30,
    networkHealth: true,
    notifications: true,
    theme: 'neural'
  });

  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('synapse-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('synapse-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    onSettingChange(key, value);
    
    toast.success("Setting updated", {
      description: `${key} has been ${typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : 'updated'}`,
      duration: 2000
    });
  };

  const resetToDefaults = () => {
    const defaults: AppSettings = {
      autoSave: true,
      aiEnabled: true,
      darkMode: true,
      animationsEnabled: true,
      soundEnabled: false,
      autoSaveInterval: 30,
      networkHealth: true,
      notifications: true,
      theme: 'neural'
    };
    
    setSettings(defaults);
    Object.entries(defaults).forEach(([key, value]) => {
      onSettingChange(key, value);
    });
    
    toast.success("Settings reset", {
      description: "All settings have been restored to defaults",
      duration: 3000
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/95 backdrop-blur-xl border border-[#00FFD1]/30 rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-[#00FFD1]" />
            <h2 className="text-xl font-semibold text-[#F0F0F0]">Neural Settings</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-[#F0F0F0]/60 hover:text-[#F0F0F0] hover:bg-[#00FFD1]/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {/* System Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#00FFD1] uppercase tracking-wide">System</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[#F0F0F0] font-medium">Auto-Save</label>
                <p className="text-sm text-[#F0F0F0]/60">Automatically save your neural network</p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(value) => handleSettingChange('autoSave', value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[#F0F0F0] font-medium">Auto-Save Interval</label>
                <span className="text-[#00FFD1] text-sm">{settings.autoSaveInterval}s</span>
              </div>
              <Slider
                value={[settings.autoSaveInterval]}
                onValueChange={(value) => handleSettingChange('autoSaveInterval', value[0])}
                max={120}
                min={10}
                step={10}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-[#F0F0F0] font-medium">Network Health</label>
                <p className="text-sm text-[#F0F0F0]/60">Show network health indicators</p>
              </div>
              <Switch
                checked={settings.networkHealth}
                onCheckedChange={(value) => handleSettingChange('networkHealth', value)}
              />
            </div>
          </div>

          {/* AI Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#E8A135] uppercase tracking-wide">AI & Intelligence</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[#F0F0F0] font-medium">AI Analysis</label>
                <p className="text-sm text-[#F0F0F0]/60">Enable real-time AI insights</p>
              </div>
              <Switch
                checked={settings.aiEnabled}
                onCheckedChange={(value) => handleSettingChange('aiEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-[#F0F0F0] font-medium">Smart Notifications</label>
                <p className="text-sm text-[#F0F0F0]/60">AI-powered insight notifications</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(value) => handleSettingChange('notifications', value)}
              />
            </div>
          </div>

          {/* Interface Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#9945FF] uppercase tracking-wide">Interface</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[#F0F0F0] font-medium">Animations</label>
                <p className="text-sm text-[#F0F0F0]/60">Enable smooth transitions</p>
              </div>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={(value) => handleSettingChange('animationsEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-[#F0F0F0] font-medium">Sound Effects</label>
                <p className="text-sm text-[#F0F0F0]/60">Audio feedback for actions</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(value) => handleSettingChange('soundEnabled', value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#F0F0F0] font-medium">Neural Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'neural', name: 'Neural', icon: Brain },
                  { key: 'classic', name: 'Classic', icon: Monitor },
                  { key: 'minimal', name: 'Minimal', icon: Palette }
                ].map(({ key, name, icon: Icon }) => (
                  <Button
                    key={key}
                    onClick={() => handleSettingChange('theme', key)}
                    variant={settings.theme === key ? "default" : "outline"}
                    size="sm"
                    className={`flex flex-col items-center gap-1 h-auto py-3 ${
                      settings.theme === key 
                        ? 'bg-[#00FFD1]/20 border-[#00FFD1] text-[#00FFD1]' 
                        : 'border-[#F0F0F0]/20 text-[#F0F0F0]/70 hover:border-[#00FFD1]/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#F0F0F0]/10">
            <Button
              onClick={resetToDefaults}
              variant="outline"
              size="sm"
              className="flex-1 border-[#F0F0F0]/20 text-[#F0F0F0]/70 hover:border-[#00FFD1]/50 hover:text-[#00FFD1]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:shadow-[0_0_20px_rgba(0,255,209,0.3)]"
            >
              <Save className="w-4 h-4 mr-2" />
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
