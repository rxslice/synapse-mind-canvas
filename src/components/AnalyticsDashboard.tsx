
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, X, Brain, Zap, Network, Clock, Target, Activity } from "lucide-react";
import { Node, Connection } from "@/types/canvas";

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  connections: Connection[];
}

interface NetworkMetrics {
  totalNodes: number;
  totalConnections: number;
  connectionDensity: number;
  averageConnections: number;
  networkGrowth: number;
  activeNodes: number;
  thoughtTypes: { [key: string]: number };
  dailyActivity: Array<{ date: string; nodes: number; connections: number }>;
  networkHealth: number;
}

export const AnalyticsDashboard = ({ isOpen, onClose, nodes, connections }: AnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const metrics = useMemo((): NetworkMetrics => {
    const now = new Date();
    const rangeMs = timeRange === '7d' ? 7 * 24 * 60 * 60 * 1000 : 
                    timeRange === '30d' ? 30 * 24 * 60 * 60 * 1000 : 
                    90 * 24 * 60 * 60 * 1000;

    const recentNodes = nodes.filter(node => 
      now.getTime() - node.createdAt.getTime() < rangeMs
    );

    const recentConnections = connections.filter(conn => 
      now.getTime() - conn.createdAt.getTime() < rangeMs
    );

    // Calculate connection density
    const maxPossibleConnections = nodes.length * (nodes.length - 1) / 2;
    const connectionDensity = maxPossibleConnections > 0 ? 
      (connections.length / maxPossibleConnections) * 100 : 0;

    // Calculate average connections per node
    const avgConnections = nodes.length > 0 ? connections.length / nodes.length : 0;

    // Calculate network growth
    const oldNodes = nodes.filter(node => 
      now.getTime() - node.createdAt.getTime() > rangeMs
    ).length;
    const networkGrowth = oldNodes > 0 ? ((nodes.length - oldNodes) / oldNodes) * 100 : 0;

    // Count active nodes (updated recently or with connections)
    const activeNodeIds = new Set([
      ...connections.map(c => c.fromNodeId),
      ...connections.map(c => c.toNodeId),
      ...nodes.filter(n => n.updatedAt && now.getTime() - n.updatedAt.getTime() < 24 * 60 * 60 * 1000).map(n => n.id)
    ]);

    // Count thought types
    const thoughtTypes = nodes.reduce((acc, node) => {
      const type = node.type || 'thought';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Generate daily activity data
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayNodes = nodes.filter(n => 
        n.createdAt >= dayStart && n.createdAt < dayEnd
      ).length;
      
      const dayConnections = connections.filter(c => 
        c.createdAt >= dayStart && c.createdAt < dayEnd
      ).length;

      dailyActivity.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        nodes: dayNodes,
        connections: dayConnections
      });
    }

    // Calculate network health
    const healthFactors = [
      Math.min(connectionDensity / 20, 1) * 25, // Connection density (target 20%)
      Math.min(avgConnections / 3, 1) * 25, // Average connections (target 3)
      Math.min(activeNodeIds.size / Math.max(nodes.length * 0.5, 1), 1) * 25, // Node activity (target 50%)
      Math.min(recentNodes.length / Math.max(nodes.length * 0.2, 1), 1) * 25 // Recent growth (target 20%)
    ];
    const networkHealth = healthFactors.reduce((sum, factor) => sum + factor, 0);

    return {
      totalNodes: nodes.length,
      totalConnections: connections.length,
      connectionDensity,
      averageConnections: avgConnections,
      networkGrowth,
      activeNodes: activeNodeIds.size,
      thoughtTypes,
      dailyActivity,
      networkHealth
    };
  }, [nodes, connections, timeRange]);

  const chartColors = ['#00FFD1', '#E8A135', '#9945FF', '#FF6B6B', '#4ECDC4'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-[#0B3D3D]/95 to-[#083838]/95 backdrop-blur-xl border border-[#00FFD1]/30 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#00FFD1]" />
            <h2 className="text-xl font-semibold text-[#F0F0F0]">Neural Analytics</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  className={timeRange === range ? 
                    'bg-[#00FFD1]/20 text-[#00FFD1] border-[#00FFD1]' : 
                    'text-[#F0F0F0]/60 hover:text-[#F0F0F0]'
                  }
                >
                  {range}
                </Button>
              ))}
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
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Neural Nodes', value: metrics.totalNodes, icon: Brain, color: '#00FFD1' },
            { label: 'Synapses', value: metrics.totalConnections, icon: Zap, color: '#E8A135' },
            { label: 'Active Nodes', value: metrics.activeNodes, icon: Activity, color: '#9945FF' },
            { label: 'Network Health', value: `${Math.round(metrics.networkHealth)}%`, icon: Target, color: '#4ECDC4' }
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gradient-to-br from-[#F0F0F0]/5 to-[#F0F0F0]/10 rounded-xl p-4 border border-[#F0F0F0]/10">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-sm text-[#F0F0F0]/70">{label}</span>
              </div>
              <div className="text-2xl font-bold text-[#F0F0F0]">{value}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Activity Chart */}
          <div className="bg-gradient-to-br from-[#F0F0F0]/5 to-[#F0F0F0]/10 rounded-xl p-4 border border-[#F0F0F0]/10">
            <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00FFD1]" />
              Daily Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={metrics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0/10" />
                <XAxis dataKey="date" stroke="#F0F0F0" fontSize={12} />
                <YAxis stroke="#F0F0F0" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B3D3D', 
                    border: '1px solid #00FFD1', 
                    borderRadius: '8px',
                    color: '#F0F0F0'
                  }} 
                />
                <Line type="monotone" dataKey="nodes" stroke="#00FFD1" strokeWidth={2} />
                <Line type="monotone" dataKey="connections" stroke="#E8A135" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Thought Types Distribution */}
          <div className="bg-gradient-to-br from-[#F0F0F0]/5 to-[#F0F0F0]/10 rounded-xl p-4 border border-[#F0F0F0]/10">
            <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-[#E8A135]" />
              Thought Types
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={Object.entries(metrics.thoughtTypes).map(([type, count]) => ({ name: type, value: count }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {Object.entries(metrics.thoughtTypes).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B3D3D', 
                    border: '1px solid #00FFD1', 
                    borderRadius: '8px',
                    color: '#F0F0F0'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Network Metrics */}
          <div className="bg-gradient-to-br from-[#F0F0F0]/5 to-[#F0F0F0]/10 rounded-xl p-4 border border-[#F0F0F0]/10 lg:col-span-2">
            <h3 className="text-lg font-semibold text-[#F0F0F0] mb-4">Network Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FFD1] mb-1">
                  {metrics.connectionDensity.toFixed(1)}%
                </div>
                <div className="text-sm text-[#F0F0F0]/70">Connection Density</div>
                <div className="text-xs text-[#F0F0F0]/50 mt-1">
                  How interconnected your thoughts are
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#E8A135] mb-1">
                  {metrics.averageConnections.toFixed(1)}
                </div>
                <div className="text-sm text-[#F0F0F0]/70">Avg Connections</div>
                <div className="text-xs text-[#F0F0F0]/50 mt-1">
                  Average links per thought
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#9945FF] mb-1">
                  {metrics.networkGrowth > 0 ? '+' : ''}{metrics.networkGrowth.toFixed(1)}%
                </div>
                <div className="text-sm text-[#F0F0F0]/70">Network Growth</div>
                <div className="text-xs text-[#F0F0F0]/50 mt-1">
                  Growth in selected period
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#F0F0F0]/10">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#00FFD1] to-[#00FFD1]/90 text-[#0B3D3D] hover:shadow-[0_0_20px_rgba(0,255,209,0.3)]"
          >
            Close Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};
