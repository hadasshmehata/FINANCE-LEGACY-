import React from 'react';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck,
  Coins,
  FileText,
  Users,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LegacyScoreView: React.FC = () => {
  const {
    legacyScore,
    assets,
    claims,
    documents,
    gaps,
    nomineeRequest,
    recoveryProgress,
    setActiveTab,
  } = useApp();

  const docScore = documents.length > 0
    ? Math.min(100, Math.round((documents.filter((d) => d.analyzed).length / documents.length) * 40 + 60))
    : 70;

  const assetScore = assets.length > 0
    ? Math.min(100, Math.round((assets.filter((a) => a.verificationStatus === 'Verified').length / assets.length) * 40 + 60))
    : 70;

  const claimScore = claims.length > 0
    ? Math.min(100, Math.round(recoveryProgress > 0 ? recoveryProgress : 75))
    : 70;

  const resolvedGaps = gaps.filter((g) => g.resolved).length;
  const gapScore = gaps.length > 0
    ? Math.round((resolvedGaps / gaps.length) * 100)
    : 100;

  const nomineeScore = nomineeRequest.nomineeName
    ? (nomineeRequest.status === 'Approved' ? 95 : 85)
    : 40;

  const topClaimInst = claims[0]?.institution || assets[0]?.institution || 'financial institution';

  const factors = [
    {
      title: 'Document Organization',
      score: docScore,
      weight: '25%',
      detail: `${documents.length} verified documents categorized and indexed in vault.`,
      status: docScore >= 90 ? 'Excellent' : docScore >= 75 ? 'Good' : 'Needs Action',
      icon: FileText,
      color: 'text-emerald-400',
    },
    {
      title: 'Asset Discovery & Matching',
      score: assetScore,
      weight: '25%',
      detail: `${assets.length} financial assets discovered via AI footprint and tax clues.`,
      status: assetScore >= 90 ? 'High' : assetScore >= 75 ? 'Moderate' : 'Needs Action',
      icon: Coins,
      color: 'text-cyan-400',
    },
    {
      title: 'Claim Pipeline Readiness',
      score: claimScore,
      weight: '20%',
      detail: `${claims.length} claims tracked with regulatory follow-up dates.`,
      status: claimScore >= 80 ? 'Optimal' : 'In Progress',
      icon: FileCheck,
      color: 'text-emerald-400',
    },
    {
      title: 'Gap Intelligence Resolution',
      score: gapScore,
      weight: '15%',
      detail: `${resolvedGaps} of ${gaps.length} financial gaps addressed.`,
      status: gapScore >= 90 ? 'Strong' : gapScore >= 60 ? 'Moderate' : 'Needs Action',
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
    {
      title: 'Nominee Succession Safeguard',
      score: nomineeScore,
      weight: '15%',
      detail: nomineeRequest.nomineeName
        ? `Nominee (${nomineeRequest.nomineeName}) designated with encrypted permissions.`
        : 'No nominee designated yet. Add family nominee to protect succession.',
      status: nomineeScore >= 90 ? 'Strong' : nomineeScore >= 70 ? 'Pending Verification' : 'Incomplete',
      icon: Users,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Financial Legacy Score
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Comprehensive Legacy Health Index
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Weighted assessment of documentation integrity, asset recovery readiness, and succession safeguards.
          </p>
        </div>

        {/* Big Trophy Badge */}
        <div className="bg-gradient-to-br from-[#13334E] to-[#10283D] border-2 border-amber-400 rounded-2xl px-6 py-3 shadow-glow-gold flex items-center gap-4 self-start sm:self-auto">
          <Trophy className="w-8 h-8 text-amber-400" />
          <div>
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Score Status</div>
            <div className="text-3xl font-black text-white flex items-baseline gap-1">
              <span>{legacyScore}</span>
              <span className="text-sm font-semibold text-amber-400">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Factor Breakdown */}
        <div className="lg:col-span-7 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Weighted Audit Breakdown
            </h3>
            <span className="text-[10px] text-slate-400">5 Evaluated Categories</span>
          </div>

          <div className="space-y-3.5">
            {factors.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-3.5 rounded-2xl bg-[#061525]/80 border border-[#1E3A5F] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#10283D] flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${f.color}`} />
                      </div>
                      <span className="text-xs font-bold text-white">{f.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-400">Weight: {f.weight}</span>
                      <span className="text-xs font-extrabold text-white">{f.score}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#10283D] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${f.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>{f.detail}</span>
                    <span className="font-semibold text-emerald-400">{f.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recommendations to Reach 100/100 */}
        <div className="lg:col-span-5 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Action Steps to Reach 100/100
              </h3>
              <span className="text-[10px] text-amber-400 font-bold">+8 Points Available</span>
            </div>

            <div className="space-y-3 text-xs">
              <div
                onClick={() => setActiveTab('scanner')}
                className="cursor-pointer p-3 rounded-2xl bg-[#061525] border border-amber-500/30 hover:border-amber-500/70 transition-all group"
              >
                <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                  <span>1. Upload Missing EPF Passbook</span>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">+4 Pts</span>
                </div>
                <p className="text-[11px] text-slate-400 group-hover:text-slate-300">
                  Resolving the EPF gap will eliminate unverified employer dependencies.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('nominee')}
                className="cursor-pointer p-3 rounded-2xl bg-[#061525] border border-cyan-500/30 hover:border-cyan-500/70 transition-all group"
              >
                <div className="flex items-center justify-between text-cyan-300 font-bold mb-1">
                  <span>2. Complete Passkey Biometrics</span>
                  <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded-full">+2 Pts</span>
                </div>
                <p className="text-[11px] text-slate-400 group-hover:text-slate-300">
                  Secure nominee access portal with FIDO2 / biometric authentication.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('tracker')}
                className="cursor-pointer p-3 rounded-2xl bg-[#061525] border border-emerald-500/30 hover:border-emerald-500/70 transition-all group"
              >
                <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                  <span>3. Dispatch Bank Claim Letter</span>
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">+2 Pts</span>
                </div>
                <p className="text-[11px] text-slate-400 group-hover:text-slate-300">
                  Submit the generated claim application to {topClaimInst} branch.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E3A5F]">
            <button
              onClick={() => setActiveTab('gaps')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-2"
            >
              <span>Address Missing Gaps Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

