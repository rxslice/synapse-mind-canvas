
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Brain, Network, Lightbulb, Clock } from 'lucide-react';

interface AnalyticsData {
  totalNodes: number;
  totalConnections: number;
  aiInsightsGenerated: number;
  sessionDuration: number;
  dailyActivity: Array<{ date: string; nodes: number; connections: number }>;
  insightTypes: Array<{ type: string; count: number }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  isVisible: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  data, 
  isVisible 
}) => {
  if (!isVisible) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="fixed top-16 right-4 w-96 max-h-[80vh] overflow-y-auto bg-slate-900/95 backdrop-blur-sm border border-teal-500/30 rounded-lg p-4 z-50">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-teal-400 mb-4">Analytics Dashboard</h3>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-teal-400" />
                Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{data.totalNodes}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Network className="w-4 h-4 text-orange-400" />
                Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{data.totalConnections}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{data.aiInsightsGenerated}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatDuration(data.sessionDuration)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={data.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }} 
                />
                <Line type="monotone" dataKey="nodes" stroke="#14B8A6" strokeWidth={2} />
                <Line type="monotone" dataKey="connections" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insight Types */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm">AI Insight Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.insightTypes.map((insight, index) => (
                <div key={index} className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {insight.type}
                  </Badge>
                  <span className="text-sm text-gray-400">{insight.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData>({
    totalNodes: 0,
    totalConnections: 0,
    aiInsightsGenerated: 0,
    sessionDuration: 0,
    dailyActivity: [],
    insightTypes: []
  });

  const trackNodeCreation = () => {
    setAnalyticsData(prev => ({ ...prev, totalNodes: prev.totalNodes + 1 }));
  };

  const trackConnectionCreation = () => {
    setAnalyticsData(prev => ({ ...prev, totalConnections: prev.totalConnections + 1 }));
  };

  const trackAIInsight = (type: string) => {
    setAnalyticsData(prev => ({
      ...prev,
      aiInsightsGenerated: prev.aiInsightsGenerated + 1,
      insightTypes: [
        ...prev.insightTypes.filter(i => i.type !== type),
        { type, count: (prev.insightTypes.find(i => i.type === type)?.count || 0) + 1 }
      ]
    }));
  };

  React.useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        sessionDuration: Math.floor((Date.now() - startTime) / 60000)
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return { analyticsData, trackNodeCreation, trackConnectionCreation, trackAIInsight };
};
