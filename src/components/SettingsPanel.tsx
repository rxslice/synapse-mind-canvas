
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { secureApi } from '@/services/secureApiManager';
import { Settings, Shield, Cloud, Smartphone, BarChart } from 'lucide-react';

interface SettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onToggleAnalytics: () => void;
  analyticsEnabled: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isVisible,
  onClose,
  onToggleAnalytics,
  analyticsEnabled
}) => {
  const [apiKey, setApiKey] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [mobileOptimized, setMobileOptimized] = useState(true);
  const { toast } = useToast();

  if (!isVisible) return null;

  const handleSaveApiKey = async () => {
    if (secureApi.setApiKey(apiKey)) {
      const isValid = await secureApi.validateApiKey();
      if (isValid) {
        toast({
          title: "API Key Saved",
          description: "Your API key has been securely stored and validated.",
        });
        setApiKey('');
      } else {
        toast({
          title: "Invalid API Key",
          description: "The API key could not be validated. Please check and try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearApiKey = () => {
    secureApi.clearConfiguration();
    toast({
      title: "API Key Cleared",
      description: "Your API key has been removed from secure storage.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Management */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <h3 className="font-medium">API Security</h3>
              {secureApi.isConfigured() && (
                <Badge variant="outline" className="text-green-400">
                  Configured
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Gemini API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveApiKey} size="sm">
                  Save Key
                </Button>
                <Button onClick={handleClearApiKey} variant="outline" size="sm">
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Cloud Storage */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              <h3 className="font-medium">Data Persistence</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-save to cloud</span>
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </div>

          {/* Mobile Optimization */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <h3 className="font-medium">Mobile Experience</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Touch optimizations</span>
              <Switch
                checked={mobileOptimized}
                onCheckedChange={setMobileOptimized}
              />
            </div>
          </div>

          {/* Analytics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-orange-400" />
              <h3 className="font-medium">Analytics Dashboard</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Show usage insights</span>
              <Switch
                checked={analyticsEnabled}
                onCheckedChange={onToggleAnalytics}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <Button onClick={onClose} className="w-full">
              Close Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
