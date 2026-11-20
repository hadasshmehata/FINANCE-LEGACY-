import React, { useState } from 'react';
import {
  Footprints,
  Building,
  Landmark,
  MapPin,
  Shield,
  Sparkles,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FootprintDetective: React.FC = () => {
  const { footprint, updateFootprint, analyzeFootprintAI, isAnalyzingFootprint, addAsset, setActiveTab } = useApp();

  const [employerInput, setEmployerInput] = useState(() => footprint.previousEmployers[0] || '');
  const [bankInput, setBankInput] = useState(() => footprint.knownBanks.join(', '));
  const [addressInput, setAddressInput] = useState(() => footprint.previousAddresses.join(', '));
  const [insuranceInput, setInsuranceInput] = useState(() => (footprint.knownInsurance || []).join(', '));
  const [selectedConnection, setSelectedConnection] = useState<any | null>(null);

  // Synchronize inputs when profile or footprint updates
  React.useEffect(() => {
    setEmployerInput(footprint.previousEmployers[0] || '');
    setBankInput(footprint.knownBanks.join(', '));
    setAddressInput(footprint.previousAddresses.join(', '));
    setInsuranceInput((footprint.knownInsurance || []).join(', '));
  }, [footprint]);

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    updateFootprint({
      previousEmployers: [employerInput, ...footprint.previousEmployers.filter(x => x !== employerInput)],
      knownBanks: bankInput.split(',').map(s => s.trim()),
      previousAddresses: addressInput.split(',').map(s => s.trim()),
    });
    analyzeFootprintAI();
  };

  const handleConvertConnectionToAsset = (conn: any) => {
    addAsset({
      name: conn.title,
      category: conn.type === 'EPF' ? 'EPF' : conn.type === 'Insurance' ? 'Insurance' : 'Banking',
      institution: conn.institution,
      estimatedValue: conn.type === 'EPF' ? 42500 : conn.type === 'Insurance' ? 150000 : 35000,
      maskedAccountRef: 'CLUE-****' + Math.floor(1000 + Math.random() * 9000),
      evidenceSource: `Footprint Trace: ${conn.evidence}`,
      confidenceScore: conn.confidence,
      verificationStatus: 'Potentially Discovered',
      linkedDocumentIds: [],
    });
    setActiveTab('assets');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Footprints className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Financial Footprint Detective
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Find Financial Connections from Your History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            AI infers forgotten bank accounts, retirement benefits, and insurance policies from past career milestones.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-2 rounded-2xl">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Zero Private Database Scraping • Strictly Deductive Reasoning</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Input Form (Matching prototype fields) */}
        <div className="lg:col-span-5 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Provide Financial Clues
            </h3>
            <span className="text-[10px] text-slate-400">Step 1 of 2</span>
          </div>

          <form onSubmit={handleRunAnalysis} className="space-y-4 text-xs">
            {/* Previous Employers */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                Previous Employer(s)
              </label>
              <input
                type="text"
                value={employerInput}
                onChange={(e) => setEmployerInput(e.target.value)}
                placeholder="e.g. ABC Technologies"
                className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Triggers EPF, Gratuity, Superannuation & Corporate Group Insurance analysis
              </span>
            </div>

            {/* Known Banks */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                Known Banks
              </label>
              <input
                type="text"
                value={bankInput}
                onChange={(e) => setBankInput(e.target.value)}
                placeholder="e.g. HDFC, SBI"
                className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Identifies dormant savings balances, auto-FDs, and locker deposits
              </span>
            </div>

            {/* Previous Addresses */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Previous Addresses
              </label>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="e.g. Mumbai, Delhi"
                className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Traces postal savings, regional cooperative societies, and old branch codes
              </span>
            </div>

            {/* Known Insurance / Investments */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Known Insurance Providers
              </label>
              <input
                type="text"
                value={insuranceInput}
                onChange={(e) => setInsuranceInput(e.target.value)}
                placeholder="e.g. HDFC Life, LIC"
                className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white outline-none"
              />
            </div>

            {/* Analyze Footprint Button (Exact match with prototype: Emerald button) */}
            <button
              type="submit"
              disabled={isAnalyzingFootprint}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {isAnalyzingFootprint ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>Scanning Corporate & Institutional Records...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Footprint</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Potential Connections Found (Matching prototype) */}
        <div className="lg:col-span-7 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Potential Connections Found ({footprint.potentialConnections.length})
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                AI Cross-Validated
              </span>
            </div>

            <div className="space-y-3">
              {footprint.potentialConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-4 rounded-2xl bg-[#061525]/80 border border-[#1E3A5F] hover:border-emerald-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {conn.title}
                        </h4>
                        <p className="text-[11px] text-cyan-300 font-medium">{conn.institution}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{conn.evidence}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        {conn.confidence}% Confidence
                      </span>
                    </div>
                  </div>

                  {/* Recommendation action */}
                  <div className="mt-3 pt-2.5 border-t border-[#1E3A5F]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {conn.recommendedVerification}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleConvertConnectionToAsset(conn)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 self-start sm:self-auto transition-all shadow-sm"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Track Asset</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-slate-400">
            <span>Deductions calculated from Indian regulatory frameworks (EPF Act, RBI Circulars).</span>
            <button
              onClick={() => setActiveTab('gaps')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View Financial Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

