import React, { useState } from 'react';
import {
  Trophy,
  Wallet,
  Shield,
  Gauge,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileSearch,
  Coins,
  Footprints,
  Radar,
  Compass,
  FileCheck,
  Users,
  ShieldAlert,
  Bot,
  ChevronRight,
  Sparkles,
  UploadCloud,
  FileText,
  AlertTriangle,
  Send,
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AssetCategory } from '../../types';

export const MainDashboard: React.FC = () => {
  const {
    currentUser,
    legacyScore,
    totalPotentialAssetsValue,
    assetsDiscoveredCount,
    claimsCount,
    readinessScore,
    recoveryProgress,
    activities,
    setActiveTab,
    assets,
    claims,
    documents,
    gaps,
    footprint,
    analyzeFootprintAI,
    isAnalyzingFootprint,
    nomineeRequest,
    uploadDocument,
    analyzeFraudText,
    fraudScans,
    messages,
    sendMessage,
    isAiTyping,
    addAsset,
    setShowOnboarding,
    selectDemoProfile,
  } = useApp();

  // Format currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Local widget states for quick interactions on the panoramic dashboard
  const [fraudInput, setFraudInput] = useState(
    'Urgent: Unclaimed bank settlement of ₹85,000 approved. Pay ₹1,200 verification charge to release funds: http://rbi-claim-support.net'
  );
  const [quickFraudResult, setQuickFraudResult] = useState(fraudScans[0]);
  const [quickAiInput, setQuickAiInput] = useState('');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetVal, setNewAssetVal] = useState('50000');
  const [newAssetInst, setNewAssetInst] = useState('ABC Bank');

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#22D3EE', '#F59E0B'],
    });
  };

  const handleQuickFraudScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fraudInput.trim()) return;
    const res = analyzeFraudText(fraudInput);
    setQuickFraudResult(res);
  };

  const handleQuickAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAiInput.trim()) return;
    sendMessage(quickAiInput.trim());
    setQuickAiInput('');
  };

  const handleCreateQuickAsset = (e: React.FormEvent) => {
    e.preventDefault();
    addAsset({
      name: newAssetName || 'Discovered Deposit',
      category: 'Banking',
      institution: newAssetInst || 'Verified Bank',
      estimatedValue: Number(newAssetVal) || 50000,
      maskedAccountRef: 'XXXXXX' + Math.floor(1000 + Math.random() * 9000),
      evidenceSource: 'Manual dashboard registration',
      confidenceScore: 95,
      verificationStatus: 'Verified',
      nomineeName: 'Priya Kumar',
      linkedDocumentIds: [],
    });
    triggerConfetti();
    setShowAddAssetModal(false);
    setNewAssetName('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* ============================================================== */}
      {/* TOP ROW: MAIN DASHBOARD BANNER & CHARTS (LEFT) + DOCUMENT SCANNER (RIGHT) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TOP LEFT (8 Cols): DASHBOARD HEADER, METRICS, CHARTS & AI RECOMMENDATIONS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Dashboard Header Bar with Welcome & Legacy Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#10283D] via-[#0D2235] to-[#0B1E32] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Dashboard
                </span>
                <span className="text-xs text-slate-400">Live AI Monitoring</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, {currentUser.name.split(' ')[0]}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Your financial legacy at a glance.
              </p>
            </div>

            {/* Legacy Score Trophy Card (Exact match from prototype: 92/100) */}
            <div
              onClick={() => setActiveTab('legacyScore')}
              className="cursor-pointer bg-gradient-to-br from-[#13334E] to-[#10283D] border-2 border-amber-400/60 hover:border-amber-400 rounded-2xl px-5 py-3 shadow-glow-gold/30 flex items-center gap-4 transition-all transform hover:scale-[1.02] flex-shrink-0"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Legacy Score
                </div>
                <div className="text-2xl font-black text-white tracking-tight flex items-baseline gap-1">
                  <span>{legacyScore}</span>
                  <span className="text-sm font-semibold text-amber-400">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* First-Time User Welcome Banner (Empty profile onboarding guide) */}
          {!currentUser.isDemoUser && assets.length === 0 && (
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#10283D] to-[#0B1E32] border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-glow-emerald/20 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Welcome to Finance Legacy
                    </span>
                    <span className="text-xs text-slate-400">Clean Slate Initialized</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Your Financial Footprint is Ready for Discovery
                  </h2>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Your profile starts completely empty. Run the 5-step onboarding wizard to register personal details, add family nominees, record known accounts, and upload statements for AI discovery.
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowOnboarding(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch Onboarding</span>
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('dashFileInput');
                      el?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#061525] hover:bg-[#0B1E32] text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload First Document</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4 Metrics Row (With Clear Verified vs Clue-Based Potential Value Distinction) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Potential Assets */}
            <div
              onClick={() => setActiveTab('assets')}
              className="cursor-pointer bg-[#10283D] hover:bg-[#13334E] border border-[#1E3A5F] hover:border-emerald-500/40 rounded-2xl p-3.5 shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Potential Assets</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-lg font-black text-white">
                {formatINR(totalPotentialAssetsValue)}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] mt-1 flex-wrap">
                <span className="text-emerald-400 font-semibold">{assets.filter(a => a.verificationStatus === 'Verified').length} Verified</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 font-semibold">{assets.filter(a => a.verificationStatus !== 'Verified').length} Clue-Based</span>
              </div>
            </div>

            {/* Metric 2: Claims in Progress */}
            <div
              onClick={() => setActiveTab('tracker')}
              className="cursor-pointer bg-[#10283D] hover:bg-[#13334E] border border-[#1E3A5F] hover:border-cyan-500/40 rounded-2xl p-3.5 shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Claims in Progress</span>
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Shield className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-lg font-black text-white">{claimsCount}</div>
              <div className="text-[10px] text-cyan-400 font-medium mt-0.5">
                {claims.reduce((acc, c) => acc + c.tasks.filter((t) => !t.completed).length, 0)} actions pending
              </div>
            </div>

            {/* Metric 3: Readiness Score */}
            <div
              onClick={() => setActiveTab('navigator')}
              className="cursor-pointer bg-[#10283D] hover:bg-[#13334E] border border-[#1E3A5F] hover:border-emerald-500/40 rounded-2xl p-3.5 shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Readiness Score</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Gauge className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-lg font-black text-white">{readinessScore}%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Recovery Preparedness</div>
            </div>

            {/* Metric 4: Recovery Progress */}
            <div
              onClick={() => setActiveTab('tracker')}
              className="cursor-pointer bg-[#10283D] hover:bg-[#13334E] border border-[#1E3A5F] hover:border-emerald-500/40 rounded-2xl p-3.5 shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Recovery Progress</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-lg font-black text-white">{recoveryProgress}%</div>
              <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                {claims.filter((c) => c.currentStage === 'Recovered').length}/{claims.length || 1} Settled
              </div>
            </div>
          </div>

          {/* Verification & Trust Disclaimer Banner */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#081a2e] border border-cyan-500/25 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>
                <strong>Asset Classification:</strong> Inferred clues from Form 26AS, PF records, and salary deductions are marked as <em>Clue-Based Estimates</em> until verified with institutional branch records.
              </span>
            </div>
            <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
              {assets.filter(a => a.verificationStatus === 'Verified').length} Verified • {assets.filter(a => a.verificationStatus !== 'Verified').length} Clues
            </span>
          </div>

          {/* Row of 2 Visualizations: Assets by Category Donut + Recovery Progress Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Donut Chart (Exact match: ₹2.5L in center) */}
            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 sm:p-5 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-cyan-400" />
                  Assets by Category
                </h3>
                <span className="text-[10px] text-slate-400">Distribution</span>
              </div>

              <div className="flex items-center justify-around py-1">
                {/* SVG Donut */}
                <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0B1E32" strokeWidth="14" />
                    {/* Banking (40%) - Cyan */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#22D3EE" strokeWidth="14" strokeDasharray="95.5 143.2" strokeDashoffset="0" />
                    {/* Investments (30%) - Purple */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#A855F7" strokeWidth="14" strokeDasharray="71.6 167.1" strokeDashoffset="-95.5" />
                    {/* Insurance (20%) - Emerald */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10B981" strokeWidth="14" strokeDasharray="47.7 191" strokeDashoffset="-167.1" />
                    {/* Others (10%) - Amber */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="14" strokeDasharray="23.9 214.8" strokeDashoffset="-214.8" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-base font-extrabold text-white">
                      {totalPotentialAssetsValue >= 100000
                        ? `₹${(totalPotentialAssetsValue / 100000).toFixed(1)}L`
                        : totalPotentialAssetsValue === 0
                        ? '₹0'
                        : formatINR(totalPotentialAssetsValue)}
                    </span>
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">Total</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE]" />
                    <span className="text-slate-300">Banking</span>
                    <span className="font-bold text-white ml-auto">40%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                    <span className="text-slate-300">Investments</span>
                    <span className="font-bold text-white ml-auto">30%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    <span className="text-slate-300">Insurance</span>
                    <span className="font-bold text-white ml-auto">20%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="text-slate-300">Others</span>
                    <span className="font-bold text-white ml-auto">10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart (Jan-Jun with 72% peak badge) */}
            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 sm:p-5 shadow-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Recovery Progress
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  72%
                </span>
              </div>

              <div className="relative h-32 w-full pt-2">
                <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 15 100 L 65 90 L 120 78 L 175 62 L 230 45 L 285 28 L 285 110 L 15 110 Z" fill="url(#chartGrad)" />
                  <path d="M 15 100 L 65 90 L 120 78 L 175 62 L 230 45 L 285 28" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="15" cy="100" r="3.5" fill="#061525" stroke="#10B981" strokeWidth="2" />
                  <circle cx="65" cy="90" r="3.5" fill="#061525" stroke="#10B981" strokeWidth="2" />
                  <circle cx="120" cy="78" r="3.5" fill="#061525" stroke="#10B981" strokeWidth="2" />
                  <circle cx="175" cy="62" r="3.5" fill="#061525" stroke="#10B981" strokeWidth="2" />
                  <circle cx="230" cy="45" r="3.5" fill="#061525" stroke="#10B981" strokeWidth="2" />
                  <circle cx="285" cy="28" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1 border-t border-[#1E3A5F] pt-1">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span className="text-emerald-400 font-bold">Jun</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations & Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI Recommendations */}
            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 sm:p-5 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  AI Recommendations
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Verify EPF account</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Check missing insurance policy</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Update nominee details</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-[#1E3A5F] mt-3 flex justify-end">
                <button
                  onClick={() => setActiveTab('gaps')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 shadow-glow-emerald"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 sm:p-5 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Recent Activity
                </h3>
                <div className="space-y-2 text-[11px]">
                  {activities && activities.length > 0 ? (
                    activities.slice(0, 3).map((act) => (
                      <div key={act.id} className="flex items-center gap-2 text-slate-300">
                        <FileSearch className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{act.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-xs italic py-2">
                      No recent activity recorded yet. Upload a document to trigger AI extraction.
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-3 border-t border-[#1E3A5F] mt-3 flex justify-end">
                <button
                  onClick={() => setActiveTab('vault')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  View All Activity →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TOP RIGHT (4 Cols): DOCUMENT SCANNER WIDGET (Exact match from prototype) */}
        <div className="lg:col-span-4 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSearch className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Document Scanner</h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Upload your financial documents and let AI discover potential assets.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onClick={() => {
                const el = document.getElementById('dashFileInput');
                el?.click();
              }}
              className="cursor-pointer border-2 border-dashed border-[#1E3A5F] hover:border-emerald-400/60 rounded-2xl p-4 text-center bg-[#061525]/80 transition-all mb-4"
            >
              <input
                type="file"
                id="dashFileInput"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const f = e.target.files[0];
                    uploadDocument({
                      name: f.name,
                      size: (f.size / 1024).toFixed(0) + ' KB',
                      category: 'Bank Statements',
                    });
                    triggerConfetti();
                  }
                }}
              />
              <UploadCloud className="w-7 h-7 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-xs font-bold text-white">Drag & Drop Documents Here</div>
              <p className="text-[10px] text-slate-400 mb-2">PDF, JPG, PNG supported</p>
              <button
                type="button"
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-glow-emerald"
              >
                Browse Files
              </button>
            </div>

            {/* Document Categories */}
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Document Categories
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F] hover:border-emerald-500/40 text-slate-300 text-left truncate"
                >
                  Bank Statements
                </button>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F] hover:border-emerald-500/40 text-slate-300 text-left truncate"
                >
                  Salary Slips
                </button>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F] hover:border-emerald-500/40 text-slate-300 text-left truncate"
                >
                  EPF Records
                </button>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F] hover:border-emerald-500/40 text-slate-300 text-left truncate"
                >
                  Insurance Policies
                </button>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F] hover:border-emerald-500/40 text-slate-300 text-left truncate"
                >
                  Investment Statements
                </button>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F] hover:border-emerald-500/40 text-slate-300 text-left truncate"
                >
                  Pension Docs
                </button>
              </div>
            </div>

            {/* AI Analysis Progress (Dynamic Real State) */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold text-white">AI Analysis Progress</span>
                <span className="font-bold text-emerald-400">
                  {documents.length === 0 && assets.length === 0
                    ? '15%'
                    : `${Math.min(100, Math.round((documents.length > 0 ? 35 : 15) + (documents.some((d) => d.analyzed || (d.extractedEntities && d.extractedEntities.length > 0)) ? 25 : 10) + (assets.length > 0 ? 30 : 0) + (assets.filter((a) => a.verificationStatus === 'Verified').length > 0 ? 10 : 0)))}%`}
                </span>
              </div>
              <div className="w-full bg-[#061525] rounded-full h-2 overflow-hidden mb-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${documents.length === 0 && assets.length === 0 ? 15 : Math.min(100, Math.round((documents.length > 0 ? 35 : 15) + (documents.some((d) => d.analyzed || (d.extractedEntities && d.extractedEntities.length > 0)) ? 25 : 10) + (assets.length > 0 ? 30 : 0) + (assets.filter((a) => a.verificationStatus === 'Verified').length > 0 ? 10 : 0)))}%`,
                  }}
                />
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${documents.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className={documents.length > 0 ? 'text-slate-300' : 'text-slate-500'}>
                    {documents.length > 0 ? `${documents.length} Documents Classified` : 'Awaiting Document Upload'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${documents.some((d) => d.analyzed || (d.extractedEntities && d.extractedEntities.length > 0)) || assets.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className={documents.some((d) => d.analyzed || (d.extractedEntities && d.extractedEntities.length > 0)) || assets.length > 0 ? 'text-slate-300' : 'text-slate-500'}>
                    Metadata & Financial Entities Extracted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {assets.length > 0 ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="text-cyan-300 font-medium">{assets.length} Financial Clues Correlated</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
                      <span className="text-slate-400">Scanner Engine Ready</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-4 flex justify-end">
            <button
              onClick={() => setActiveTab('scanner')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
            >
              Open Full Scanner →
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MIDDLE ROW: ASSET DISCOVERY, FOOTPRINT, GAPS, NAVIGATOR, TRACKER */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. ASSET DISCOVERY CARD */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">Asset Discovery</h3>
              </div>
              <button
                onClick={() => setShowAddAssetModal(true)}
                className="px-2 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Your potential financial assets.</p>

            <div className="flex items-center justify-between p-2 rounded-xl bg-[#061525] border border-[#1E3A5F] mb-3 text-[11px]">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Total Potential</span>
                <span className="font-extrabold text-white text-xs">{formatINR(totalPotentialAssetsValue)}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block uppercase">Identified</span>
                <span className="font-bold text-cyan-300">{assetsDiscoveredCount} Assets</span>
              </div>
            </div>

            <div className="space-y-2">
              {assets.length === 0 ? (
                <div className="p-3 text-center rounded-2xl bg-[#061525]/70 border border-dashed border-[#1E3A5F]">
                  <Coins className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-white mb-0.5">No Assets Found Yet</div>
                  <p className="text-[9px] text-slate-400 mb-2">Upload a statement or add an asset manually</p>
                  <button
                    onClick={() => setShowAddAssetModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold hover:bg-emerald-500/30"
                  >
                    + Add Asset Manually
                  </button>
                </div>
              ) : (
                assets.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-2 rounded-xl bg-[#061525]/80 border border-[#1E3A5F] text-[11px]">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span className="truncate">{a.name}</span>
                      <span className="text-emerald-400 font-bold ml-1">₹{a.estimatedValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{a.institution}</span>
                      <button
                        onClick={() => setActiveTab('assets')}
                        className="text-cyan-400 hover:text-cyan-300 font-bold"
                      >
                        View →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-3 text-right">
            <button
              onClick={() => setActiveTab('assets')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
            >
              Full Inventory →
            </button>
          </div>
        </div>

        {/* 2. FINANCIAL FOOTPRINT DETECTIVE CARD */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Footprint Detective</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Find connections from your history.</p>

            <div className="space-y-2 text-[11px] mb-3">
              <div className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F]">
                <span className="text-[9px] text-slate-400 block">Previous Employer:</span>
                <span className="font-semibold text-white truncate block">ABC Technologies</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F]">
                <span className="text-[9px] text-slate-400 block">Known Banks:</span>
                <span className="font-semibold text-cyan-300 truncate block">HDFC, SBI</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#061525] border border-[#1E3A5F]">
                <span className="text-[9px] text-slate-400 block">Previous Addresses:</span>
                <span className="font-semibold text-slate-300 truncate block">Mumbai, Delhi</span>
              </div>
            </div>

            <button
              onClick={() => {
                analyzeFootprintAI();
                triggerConfetti();
              }}
              disabled={isAnalyzingFootprint}
              className="w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-glow-emerald transition-all mb-3"
            >
              {isAnalyzingFootprint ? 'Scanning...' : 'Analyze Footprint'}
            </button>

            <div className="space-y-1.5 text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-200">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>EPF Account Clue (94%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Insurance Payment (89%)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-3 text-right">
            <button
              onClick={() => setActiveTab('footprint')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Explore Footprint →
            </button>
          </div>
        </div>

        {/* 3. FINANCIAL GAP INTELLIGENCE CARD */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Radar className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Gap Intelligence</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Identify missing financial connections.</p>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded-xl bg-[#061525] border border-red-500/30">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-white">EPF Info Missing</span>
                  <span className="text-[9px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.2 rounded">High</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Previous employment found, no EPF docs.</p>
              </div>

              <div className="p-2 rounded-xl bg-[#061525] border border-amber-500/30">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-white">Insurance Policy Missing</span>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded">Medium</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Recurring payments detected in statement.</p>
              </div>

              <div className="p-2 rounded-xl bg-[#061525] border border-cyan-500/30">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-white">FD Maturity Details</span>
                  <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/20 px-1.5 py-0.2 rounded">Info</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Fixed deposit reference found in 26AS.</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-3 text-right">
            <button
              onClick={() => setActiveTab('gaps')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
            >
              View Detailed Analysis →
            </button>
          </div>
        </div>

        {/* 4. AI CLAIM NAVIGATOR CARD */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">AI Claim Navigator</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Get step-by-step recovery guidance.</p>

            <div className="p-2.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-white block">EPF Recovery</span>
                <span className="text-[9px] text-slate-400">Potential EPF detected</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                65% Ready
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] mb-3">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Identity Proof</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Employment Records</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>UAN Information</span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerConfetti();
                setActiveTab('navigator');
              }}
              className="w-full py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-glow-emerald transition-all"
            >
              Generate Checklist
            </button>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-3 text-right">
            <button
              onClick={() => setActiveTab('navigator')}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Open Navigator →
            </button>
          </div>
        </div>

        {/* 5. CLAIM TRACKER CARD */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Claim Tracker</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Track your recovery journey.</p>

            {/* Dynamic Claim Timeline matching active profile */}
            {claims.length > 0 ? (
              <div className="space-y-2 text-[11px] pl-1 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E3A5F]">
                <div className="flex items-center gap-2.5 relative">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-bold z-10">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-white block">Asset Discovered</span>
                    <span className="text-[9px] text-slate-400">{claims[0].assetName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 relative">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold z-10 ${
                      claims[0].progressPercentage >= 35
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-[#061525] border-2 border-cyan-400 text-cyan-400'
                    }`}
                  >
                    {claims[0].progressPercentage >= 35 ? '✓' : '•'}
                  </div>
                  <div>
                    <span className="font-bold text-white block">Documentation & KYC</span>
                    <span className="text-[9px] text-slate-400">{claims[0].institution}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 relative">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold z-10 ${
                      claims[0].progressPercentage >= 60
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-[#061525] border border-[#1E3A5F] text-slate-500'
                    }`}
                  >
                    {claims[0].progressPercentage >= 60 ? '✓' : '•'}
                  </div>
                  <div>
                    <span className="font-bold text-white block">Claim Docket Filed</span>
                    <span className="text-[9px] text-cyan-400 font-mono">{claims[0].claimReferenceNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 relative">
                  <div
                    className={`w-4 h-4 rounded-full z-10 ${
                      claims[0].currentStage === 'Recovered'
                        ? 'bg-emerald-500 text-slate-950 flex items-center justify-center text-[9px] font-bold'
                        : 'bg-[#061525] border-2 border-amber-400 animate-pulse'
                    }`}
                  >
                    {claims[0].currentStage === 'Recovered' && '✓'}
                  </div>
                  <div>
                    <span className="font-bold text-amber-300 block">{claims[0].currentStage}</span>
                    <span className="text-[9px] text-slate-400">
                      Follow-up: {claims[0].followUpDate || 'Institutional Review in Progress'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[#061525] border border-[#1E3A5F] text-center my-2">
                <FileCheck className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-slate-300">No Active Claims Yet</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Convert discovered assets into institutional recovery claims in the Claim Navigator.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-3 text-right">
            <button
              onClick={() => setActiveTab('tracker')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
            >
              Manage Claims →
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM ROW: NOMINEE PORTAL, FRAUD DETECTOR, AI ASSISTANT, SETTINGS */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. NOMINEE ACCESS PORTAL */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Nominee Access Portal</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-4">Secure access for your nominated family member.</p>

            <div className="p-3 rounded-2xl bg-[#061525] border border-[#1E3A5F] mb-4 text-center">
              <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1 animate-pulse" />
              <div className="text-[10px] text-slate-400 uppercase">Access Request Status</div>
              <div className="text-xs font-bold text-amber-400">
                {nomineeRequest.status}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 mb-4 text-center">
              Upload required documents to proceed.
            </p>

            <button
              onClick={() => setActiveTab('nominee')}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald"
            >
              Upload Documents
            </button>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-4 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Priya Kumar (Spouse)</span>
            <button onClick={() => setActiveTab('nominee')} className="text-cyan-400 font-bold">
              Details →
            </button>
          </div>
        </div>

        {/* 2. AI FRAUD DETECTOR */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold text-white">AI Fraud Detector</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Check suspicious messages and links.</p>

            <form onSubmit={handleQuickFraudScan} className="space-y-2 mb-3">
              <textarea
                rows={2}
                value={fraudInput}
                onChange={(e) => setFraudInput(e.target.value)}
                className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl p-2 text-[11px] font-mono text-slate-200 outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider shadow-glow-cyan"
              >
                Analyze
              </button>
            </form>

            {/* High Risk Banner matching prototype */}
            <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/40 text-center mb-2">
              <div className="text-[11px] font-black text-red-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{quickFraudResult.riskLevel} RISK</span>
              </div>
            </div>

            <div className="space-y-1 text-[10px] text-slate-300">
              <span className="text-slate-400 font-bold block">Suspicious Indicators:</span>
              <p>• Urgent action required</p>
              <p>• External link</p>
              <p>• Guaranteed reward</p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-3 text-right">
            <button onClick={() => setActiveTab('fraud')} className="text-[11px] text-cyan-400 font-bold">
              Full Fraud Engine →
            </button>
          </div>
        </div>

        {/* 3. AI FINANCIAL ASSISTANT */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white">AI Financial Assistant</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">Ask anything about your financial legacy.</p>

            {/* Dynamic chat conversation preview matching active user portfolio */}
            <div className="space-y-2 mb-3">
              <div className="ml-auto max-w-[85%] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 p-2 rounded-xl text-[11px] font-medium">
                What are my potential assets?
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#061525] border border-[#1E3A5F] text-slate-200 p-2.5 rounded-xl text-[11px] leading-snug">
                  {assets.length > 0 ? (
                    <>
                      You have <strong className="text-emerald-400">{assets.length} potential {assets.length === 1 ? 'asset' : 'assets'}</strong> totaling <strong className="text-white">{formatINR(totalPotentialAssetsValue)}</strong>
                      {assets.length > 0 && (
                        <span> including {assets.slice(0, 2).map((a) => a.name).join(' and ')}</span>
                      )}.
                    </>
                  ) : (
                    <>
                      No assets discovered yet for <strong className="text-white">{currentUser.name}</strong>. Upload your bank statements or employment documents in the Document Scanner to begin discovery.
                    </>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleQuickAiSend} className="flex gap-1.5">
              <input
                type="text"
                value={quickAiInput}
                onChange={(e) => setQuickAiInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-[#061525] border border-[#1E3A5F] focus:border-cyan-400 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center shadow-glow-emerald"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-3 text-right">
            <button onClick={() => setActiveTab('assistant')} className="text-[11px] text-emerald-400 font-bold">
              Open Full Chatbot →
            </button>
          </div>
        </div>

        {/* 4. SETTINGS CARD */}
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">Settings</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-4">Manage your account and preferences.</p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab('settings')}
                className="w-full p-2 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-left flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <User className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block text-[11px]">Profile</span>
                    <span className="text-[9px] text-slate-400">Personal information</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full p-2 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-left flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <Lock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block text-[11px]">Security</span>
                    <span className="text-[9px] text-slate-400">Password & Authentication</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full p-2 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-left flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <Bell className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block text-[11px]">Notifications</span>
                    <span className="text-[9px] text-slate-400">Claim updates & alerts</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="w-full p-2 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-left flex items-center justify-between text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <Shield className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-bold block text-[11px]">Privacy</span>
                    <span className="text-[9px] text-slate-400">Data control & export</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E3A5F] mt-3 text-right">
            <button onClick={() => setActiveTab('settings')} className="text-[11px] text-emerald-400 font-bold">
              Full Settings →
            </button>
          </div>
        </div>
      </div>

      {/* Add Asset Quick Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl max-w-sm w-full p-5 shadow-card animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F] mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                Add Discovered Asset
              </h3>
              <button onClick={() => setShowAddAssetModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateQuickAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="e.g. Axis Bank Inoperative Savings"
                  className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Institution</label>
                <input
                  type="text"
                  required
                  value={newAssetInst}
                  onChange={(e) => setNewAssetInst(e.target.value)}
                  placeholder="e.g. Axis Bank"
                  className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Estimated Value (₹)</label>
                <input
                  type="number"
                  required
                  value={newAssetVal}
                  onChange={(e) => setNewAssetVal(e.target.value)}
                  className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#061525] text-slate-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase shadow-glow-emerald"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
