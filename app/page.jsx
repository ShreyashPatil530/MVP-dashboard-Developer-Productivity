'use client';

import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  RefreshCcw, 
  Bug, 
  Rocket, 
  GitPullRequest, 
  Calendar,
  LayoutDashboard,
  Bell,
  Search,
  Settings,
  CheckCircle2
} from 'lucide-react';

import MetricCard from '@/components/MetricCard';
import InsightCard from '@/components/InsightCard';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const res = await fetch('/api/metrics');
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Analyzing SDLC data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-sm border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { developer, metrics, insight } = data;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Sidebar (Visual only for MVP) */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 hidden xl:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">DevInsight Pro</span>

        </div>

        <nav className="space-y-1 flex-1">
          <NavItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem 
            icon={Clock} 
            label="Timeline" 
            active={currentView === 'timeline'} 
            onClick={() => setCurrentView('timeline')}
          />
          <NavItem 
            icon={Bug} 
            label="Bugs & Issues" 
            active={currentView === 'bugs'} 
            onClick={() => setCurrentView('bugs')}
          />
          <NavItem 
            icon={GitPullRequest} 
            label="Pull Requests" 
            active={currentView === 'prs'} 
            onClick={() => setCurrentView('prs')}
          />
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <NavItem 
            icon={Settings} 
            label="Settings" 
            active={currentView === 'settings'} 
            onClick={() => setCurrentView('settings')}
          />
        </div>

      </aside>

      {/* Main Content */}
      <main className="xl:ml-64 p-4 md:p-8 lg:p-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Developer Productivity</h1>
            <p className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              April 2024 Performance Overview
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className={`p-2 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all ${refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
              title="Refresh Data"
            >
              <RefreshCcw className={`w-5 h-5 text-indigo-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-100">
                <img src={developer.avatar} alt={developer.name} className="w-full h-full object-cover" />
              </div>
              <div className="pr-4">
                <p className="text-sm font-bold text-gray-900">{developer.name}</p>
                <p className="text-xs text-gray-500">{developer.team}</p>
              </div>
            </div>
          </div>
        </header>


        {currentView === 'dashboard' && (
          <>
            {/* Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              <MetricCard 
                title="Lead Time" 
                value={metrics.leadTime} 
                unit="days" 
                icon={Clock} 
                description="PR open to deployment"
                trend={-12}
              />
              <MetricCard 
                title="Cycle Time" 
                value={metrics.cycleTime} 
                unit="days" 
                icon={RefreshCcw} 
                description="Issue start to done"
                trend={-5}
              />
              <MetricCard 
                title="Bug Rate" 
                value={metrics.bugRate} 
                unit="%" 
                icon={Bug} 
                description="Bugs vs Completed issues"
                trend={8}
              />
              <MetricCard 
                title="Deployment Freq" 
                value={metrics.deploymentFrequency} 
                unit="/ wk" 
                icon={Rocket} 
                description="Average weekly deploys"
                trend={15}
              />
              <MetricCard 
                title="PR Throughput" 
                value={metrics.prThroughput} 
                unit="PRs" 
                icon={GitPullRequest} 
                description="Merged pull requests"
                trend={2}
              />
            </section>

            {/* Insights & Actions */}
            <section className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                    Intelligent Insights
                  </h2>
                  <span className="text-xs font-medium text-gray-400">AI-Powered Analysis</span>
                </div>
                <div className="p-8">
                  <InsightCard insight={insight} />
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'timeline' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              Activity Timeline
            </h2>
            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {[...data.raw.deployments.map(d => ({ ...d, type: 'deploy', time: d.deploy_time })), 
                ...data.raw.pull_requests.map(p => ({ ...p, type: 'pr', time: p.merged_time }))]
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .map((event, idx) => (
                  <div key={idx} className="relative pl-12">
                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                      event.type === 'deploy' ? 'bg-indigo-600' : 'bg-emerald-500'
                    }`}>
                      {event.type === 'deploy' ? <Rocket className="w-4 h-4 text-white" /> : <GitPullRequest className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {event.type === 'deploy' ? 'Production Deployment' : `PR Merged: ${event.id}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {event.type === 'deploy' && (
                        <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded bg-indigo-50 text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
                          v1.{idx + 10}.0 • Stable
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {currentView === 'bugs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bug className="w-6 h-6 text-red-500" />
                  Recent Bugs & Stability
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {data.raw.bugs.map((bug, idx) => (
                  <div key={idx} className="px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">Regression in Auth Flow</p>
                        <p className="text-xs text-gray-500">Reported on {new Date(bug.created_time).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-red-50 text-red-600 rounded uppercase">Critical</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <RefreshCcw className="w-6 h-6 text-indigo-500" />
                  Completed Issues
                </h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.raw.issues.map((issue, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/30 flex items-center gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{issue.issue_id}</p>
                      <p className="text-xs text-gray-500">Completed in {((new Date(issue.end_time) - new Date(issue.start_time)) / (1000 * 60 * 60 * 24)).toFixed(1)} days</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'prs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <GitPullRequest className="w-6 h-6 text-indigo-600" />
                  Pull Request Throughput
                </h2>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {data.raw.pull_requests.length} Total PRs
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50/30">
                      <th className="px-8 py-4">ID</th>
                      <th className="px-8 py-4">Opened</th>
                      <th className="px-8 py-4">Merged</th>
                      <th className="px-8 py-4">Review Time</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.raw.pull_requests.map((pr, idx) => {
                      const opened = new Date(pr.opened_time);
                      const merged = new Date(pr.merged_time);
                      const diffDays = ((merged - opened) / (1000 * 60 * 60 * 24)).toFixed(1);
                      
                      return (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-4 font-mono text-sm font-bold text-indigo-600">{pr.id}</td>
                          <td className="px-8 py-4 text-sm text-gray-600">{opened.toLocaleDateString()}</td>
                          <td className="px-8 py-4 text-sm text-gray-600">{merged.toLocaleDateString()}</td>
                          <td className="px-8 py-4">
                            <span className={`text-sm font-medium ${parseFloat(diffDays) > 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {diffDays} days
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 uppercase">
                              Merged
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Review Efficiency</h3>
                <p className="text-indigo-200 text-sm max-w-md mb-6">
                  Your average PR review turnaround is faster than the team average. Keeping PRs small has helped maintain this velocity.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1">
                    <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider mb-1">Fastest Merge</p>
                    <p className="text-2xl font-bold">0.8 <span className="text-sm font-normal opacity-60">days</span></p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1">
                    <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider mb-1">Weekly Volume</p>
                    <p className="text-2xl font-bold">~2.4 <span className="text-sm font-normal opacity-60">PRs</span></p>
                  </div>
                </div>
              </div>
              <GitPullRequest className="absolute -right-8 -bottom-8 w-48 h-48 text-white opacity-5" />
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <LayoutDashboard className="w-10 h-10 text-indigo-400 opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced View Coming Soon</h2>
            <p className="text-gray-500 max-w-xs text-center">
              The <span className="font-bold text-indigo-600 capitalize">{currentView}</span> analytics are being compiled.
            </p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}




        {/* Simple Footer/Info */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Data sourced from GitHub & Jira • Updated 2 minutes ago
          </p>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm border border-indigo-100/50' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
      <span className="text-sm">{label}</span>
    </button>
  );
}


const Lightbulb = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);
