import React, { useState } from 'react';
import {
  Radar,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  UploadCloud,
  FileText,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinancialGap, GapPriority } from '../../types';

export const GapIntelligence: React.FC = () => {
  const { gaps, resolveGap, setActiveTab } = useApp();
  const [selectedGap, setSelectedGap] = useState<FinancialGap | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'All' | GapPriority>('All');

  const filteredGaps = gaps.filter(g => priorityFilter === 'All' || g.priority === priorityFilter);

  const getPriorityBadge = (priority: GapPriority) => {
    switch (priority) {
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
            Medium
          </span>
        );
      case 'Info':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Info
          </span>
        );
    }
  };

  const getPriorityIcon = (priority: GapPriority) => {
    switch (priority) {
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />;
      case 'Medium':
        return <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case 'Info':
      default:
        return <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Financial Gap Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Identify Missing Financial Connections
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            AI correlates bank debit records, tax filings, and resumes to locate missing policies and unlinked assets.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-[#061525] p-1 rounded-full border border-[#1E3A5F]">
          {(['All', 'High', 'Medium', 'Info'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                priorityFilter === p
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Gaps Grid (Exact match with prototype: EPF Information Missing [High], Insurance Policy Missing [Medium], FD Maturity Details Missing [Info]) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredGaps.map((gap) => (
          <div
            key={gap.id}
            className={`bg-[#10283D] border rounded-3xl p-5 shadow-card flex flex-col justify-between transition-all group ${
              gap.resolved
                ? 'border-emerald-500/40 opacity-80'
                : gap.priority === 'High'
                ? 'border-red-500/40 hover:border-red-500/80 shadow-glow-emerald/10'
                : gap.priority === 'Medium'
                ? 'border-amber-500/40 hover:border-amber-500/80'
                : 'border-cyan-500/40 hover:border-cyan-500/80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {gap.resolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : getPriorityIcon(gap.priority)}
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {gap.title}
                  </span>
                </div>
                {gap.resolved ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    Resolved
                  </span>
                ) : (
                  getPriorityBadge(gap.priority)
                )}
              </div>

              <p className="text-xs text-slate-300 font-medium mb-2 leading-relaxed">
                {gap.evidence}
              </p>

              <div className="p-3 rounded-2xl bg-[#061525]/80 border border-[#1E3A5F] text-[11px] space-y-1.5 my-3">
                <div className="text-slate-400">
                  <span className="text-slate-200 font-semibold">Potential Asset:</span> {gap.potentialConnection}
                </div>
                <div className="text-slate-400">
                  <span className="text-emerald-400 font-semibold">Action:</span> {gap.recommendedAction}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E3A5F] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedGap(gap)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View Detailed Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {!gap.resolved && (
                <button
                  type="button"
                  onClick={() => resolveGap(gap.id)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-[11px] border border-emerald-500/30 transition-all"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis Modal */}
      {selectedGap && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl max-w-lg w-full p-6 shadow-card animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
              <div className="flex items-center gap-2">
                {getPriorityIcon(selectedGap.priority)}
                <h3 className="text-base font-bold text-white">{selectedGap.title}</h3>
              </div>
              <button onClick={() => setSelectedGap(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#061525] border border-[#1E3A5F]">
                <span className="text-slate-400">Gap Urgency Level</span>
                <div>{getPriorityBadge(selectedGap.priority)}</div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Documentary Evidence:</span>
                <p className="text-slate-200 bg-[#061525]/60 p-3 rounded-xl border border-[#1E3A5F]">
                  {selectedGap.evidence}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">AI Explanation & Regulatory Basis:</span>
                <p className="text-slate-300 bg-[#061525]/60 p-3 rounded-xl border border-[#1E3A5F] leading-relaxed">
                  {selectedGap.explanation}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Official Verification Portals:</span>
                <ul className="space-y-1.5">
                  {selectedGap.verificationResources.map((res, i) => (
                    <li key={i} className="flex items-center gap-2 text-cyan-300 font-medium">
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E3A5F] flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedGap(null);
                  setActiveTab('scanner');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase shadow-glow-emerald flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Missing Document</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  resolveGap(selectedGap.id);
                  setSelectedGap(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#061525] border border-emerald-500/40 text-emerald-300 text-xs font-semibold"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

