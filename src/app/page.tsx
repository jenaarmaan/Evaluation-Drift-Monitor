'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Layers,
  Zap,
  ArrowRight,
  Monitor,
  Layout,
  BarChart3,
  ShieldAlert,
  ArrowUpRight,
  Target,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { calculateDrift, generateMockData } from '@/lib/drift-engine';

export default function DriftMonitorPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'analytics'>('overview');
  const [data, setData] = useState(generateMockData());
  const [driftResult, setDriftResult] = useState(calculateDrift(data.baseline, data.current));
  const [isSimulated, setIsSimulated] = useState(false);

  const simulateUpdate = () => {
    setIsSimulated(true);
    setTimeout(() => {
      setIsSimulated(false);
    }, 1500);
  };

  const chartData = [
    { name: 'Mon', drift: 0.05, coverage: 0.98 },
    { name: 'Tue', drift: 0.04, coverage: 0.97 },
    { name: 'Wed', drift: 0.12, coverage: 0.94 },
    { name: 'Thu', drift: 0.28, coverage: 0.82 },
    { name: 'Fri', drift: 0.35, coverage: 0.75 },
    { name: 'Sat', drift: 0.42, coverage: 0.68 },
    { name: 'Sun', drift: 0.48, coverage: 0.62 },
  ];

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <nav className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
            <Activity className="w-6 h-6 text-[#22d3ee]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              EDM <span className="text-[#22d3ee]">v1.0</span>
            </h1>
            <p className="text-sm text-muted-foreground mono mt-1">EVALUATION_DRIFT_MONITOR_ACTIVE</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={simulateUpdate}
            className={`glow-button ${isSimulated ? 'opacity-50' : ''}`}
          >
            {isSimulated ? <Activity className="animate-spin w-4 h-4" /> : <FlaskConical className="w-4 h-4" />}
            Run Live Simulation
          </button>
        </div>
      </nav>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
        <StatusCard
          icon={<ShieldAlert className="text-orange-400" />}
          label="Semantic Drift"
          value={`${(driftResult.driftScore * 100).toFixed(1)}%`}
          trend="+15.2%"
          status="warning"
        />
        <StatusCard
          icon={<Target className="text-green-400" />}
          label="Benchmark Coverage"
          value="62.4%"
          trend="-8.4%"
          status="danger"
        />
        <StatusCard
          icon={<Layers className="text-blue-400" />}
          label="New Patterns"
          value={driftResult.affectedClusters.length.toString()}
          trend="+2"
          status="warning"
        />
        <StatusCard
          icon={<Zap className="text-yellow-400" />}
          label="Cost of Stale Eval"
          value="$12.4k"
          trend="Est. Monthly"
          status="neutral"
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Panes: Tabs & Details */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card overflow-hidden">
            <div className="flex border-b border-white/5 p-2 bg-white/5">
              {['overview', 'comparison', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white/10 text-[#22d3ee]' : 'text-muted-foreground hover:text-white'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    key="overview"
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Real-time Drift Trend</h3>
                        <p className="text-sm text-muted-foreground">Historical performance vs current usage pattern divergence.</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs mono bg-white/5 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        LIVE_FEED_SYNCED
                      </div>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="name" fontSize={12} stroke="#6b7280" />
                          <YAxis fontSize={12} stroke="#6b7280" />
                          <Tooltip
                            contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#22d3ee' }}
                          />
                          <Area type="monotone" dataKey="drift" stroke="#22d3ee" fillOpacity={1} fill="url(#colorDrift)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'comparison' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key="comparison"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Baseline */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-sm font-semibold opacity-60 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" /> Baseline (Stable)
                        </span>
                        <span className="text-[10px] mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded">REFERENCE</span>
                      </div>
                      <div className="space-y-3">
                        {data.baseline.map(item => (
                          <DataPoint key={item.id} item={item} type="baseline" />
                        ))}
                      </div>
                    </div>

                    {/* New Run */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-sm font-semibold opacity-60 flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Runtime (Drifted)
                        </span>
                        <span className="text-[10px] mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded">DETECTED</span>
                      </div>
                      <div className="space-y-3">
                        {data.current.map(item => (
                          <DataPoint key={item.id} item={item} type="current" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    key="analytics"
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="flex items-center gap-2 font-bold mb-4">
                          <ArrowUpRight className="w-5 h-5 text-cyan-400" /> Startup adaptation
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          Based on detected drift in <span className="text-white font-semibold">Calculus</span> and <span className="text-white font-semibold">Optimization</span>, your baseline coverage has dropped.
                        </p>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl">
                          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">Recommended Action</p>
                          <p className="text-sm text-white">Synthesize 50 new prompts for "Higher Order Derivatives" to patch the regression hole.</p>
                        </div>
                      </div>

                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="flex items-center gap-2 font-bold mb-4">
                          <CheckCircle className="w-5 h-5 text-green-400" /> ROI Projection
                        </h4>
                        <div className="space-y-4">
                          <ROIMetric label="Saved Annotation Cost" value="$4,500" />
                          <ROIMetric label="Churn Prevention" value="12%" />
                          <ROIMetric label="Engineering Time" value="18 hrs" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Alert Feed */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-red-400">
              <AlertTriangle className="w-5 h-5" /> Critical Alerts
            </h3>

            <div className="space-y-4">
              <AlertItem
                title="Semantic Distribution Shift"
                desc="Centroid Distance > 0.4 detected in Production Session 522."
                time="2m ago"
                severity="high"
              />
              <AlertItem
                title="Missing Test Coverage"
                desc="New cluster 'Calculus' has 0% benchmark overlap."
                time="15m ago"
                severity="medium"
              />
              <AlertItem
                title="Input Complexity Spike"
                desc="Avg token count increased from 42 to 128."
                time="1h ago"
                severity="low"
              />
            </div>
          </div>

          <div className="glass-card p-6 border-cyan-500/20 bg-gradient-to-br from-[#22d3ee]/5 to-transparent">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-cyan-400" /> PhD Insight
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              "The current drift is indicative of a **Concept Shift** rather than random noise. The prompt distribution has moved toward formal mathematical proofs, which the current vector space representation (vec v) under-represents."
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="text-center py-12 border-t border-white/5">
        <p className="text-sm text-muted-foreground mono flex items-center justify-center gap-2">
          <Layers className="w-4 h-4" /> BUILT_FOR_THE_50_DAY_AI_CHALLENGE // 2026
        </p>
      </footer>
    </main>
  );
}

function StatusCard({ icon, label, value, trend, status }: { icon: any, label: string, value: string, trend: string, status: string }) {
  const trendColor = status === 'danger' ? 'text-red-400' : status === 'warning' ? 'text-orange-400' : 'text-cyan-400';

  return (
    <div className="glass-card p-6 flex flex-col justify-between min-h-[140px]">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-white/5 rounded-xl border border-white/10">
          {icon}
        </div>
        <span className={`text-xs font-bold mono ${trendColor}`}>{trend}</span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">{label}</p>
        <p className="text-3xl font-bold font-heading">{value}</p>
      </div>
    </div>
  );
}

function DataPoint({ item, type }: { item: any, type: 'baseline' | 'current' }) {
  return (
    <div className="group p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] mono py-1 px-2 bg-cyan-500/10 rounded-full text-cyan-400">{item.category}</span>
        <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
      </div>
      <p className="text-sm font-medium line-clamp-2 mb-1">Q: {item.prompt}</p>
      <div className="flex gap-1 overflow-hidden h-1 rounded-full bg-white/10 mt-3">
        <div className="h-full bg-cyan-500 transition-all" style={{ width: `${(Math.random() * 60) + 40}%` }} />
      </div>
    </div>
  );
}

function AlertItem({ title, desc, time, severity }: { title: string, desc: string, time: string, severity: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: 'border-l-red-500 bg-red-500/5',
    medium: 'border-l-orange-500 bg-orange-500/5',
    low: 'border-l-cyan-500 bg-cyan-500/5',
  };

  return (
    <div className={`p-4 border-l-2 rounded-r-xl transition-all hover:translate-x-1 ${colors[severity]}`}>
      <div className="flex justify-between items-start mb-1">
        <h5 className="text-sm font-bold">{title}</h5>
        <span className="text-[10px] mono opacity-50">{time}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function ROIMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-cyan-400">{value}</span>
    </div>
  );
}
