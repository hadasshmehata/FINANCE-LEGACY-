import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  FileText,
  AlertCircle,
  Building,
  UserCheck,
  ArrowRight,
  Shield,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Landmark,
  Coins,
  BadgeAlert,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClaimNavigator: React.FC = () => {
  const { assets, setActiveTab, addClaim } = useApp();

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const activeAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const [checklist, setChecklist] = useState({
    identityProof: true,
    employmentRecords: true,
    uanInfo: true,
    bankPassbookCopy: false,
    indemnityBond: false,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate readiness percentage
  const totalItems = Object.keys(checklist).length;
  const completedItems = Object.values(checklist).filter(Boolean).length;
  const readinessPercent = Math.round((completedItems / totalItems) * 100);

  const isConfirmed = activeAsset?.verificationStatus === 'Verified';

  // Institutional guidance helper based on asset type
  const getDomainSpecificRules = (asset: typeof activeAsset) => {
    if (!asset) return null;
    const nameLower = (asset.name + ' ' + asset.institution + ' ' + asset.category).toLowerCase();

    if (nameLower.includes('nsc') || nameLower.includes('post') || nameLower.includes('national savings')) {
      return {
        frameworkName: 'India Post NSC & Small Savings Settlement Framework',
        badge: 'India Post Rules',
        badgeColor: 'amber',
        rules: [
          'Post-Maturity Interest Rule: NSCs stop accruing interest upon reaching maturity date. Immediate redemption or reinvestment is critical.',
          'Lost Physical Certificate: If physical NSC certs are missing, submit an Indemnity Bond (Form NC-54a) supported by two solvent sureties or bank guarantee.',
          'Deceased Depositor Settlement: Claims without registered nomination up to ₹5,00,000 can be sanctioned by the Head Postmaster via Form 11 (Claim without Legal Evidence). With nomination, use Form 12.',
        ],
        regulatoryBody: 'Department of Posts, Ministry of Communications & Post Office Savings Bank General Rules 2018',
        actionLabel: 'Form 11 / NC-54a Guidance',
      };
    }

    if (nameLower.includes('sgb') || nameLower.includes('gold') || nameLower.includes('rbi')) {
      return {
        frameworkName: 'RBI Sovereign Gold Bond (SGB) Recovery & Interest Framework',
        badge: 'RBI Public Debt Office (PDO)',
        badgeColor: 'cyan',
        rules: [
          'Dual Format Status: SGBs are held either in Demat format (NSDL/CDSL) or as a physical Certificate of Holding (CoH) issued by RBI via Receiving Offices (Banks/SHCIL/Post Office).',
          'Interest Arrears (2.5% p.a.): Half-yearly interest is directly credited via ECS/NEFT. If your linked bank account became dormant/closed, file ECS Mandate Revision with the Receiving Office.',
          'Premature & Maturity Redemption: Encashment allowed from 5th year on coupon dates; final 8-year redemption price is based on the simple average of closing gold prices (999 purity) published by IBJA.',
        ],
        regulatoryBody: 'Government of India Sovereign Gold Bond Scheme & RBI Master Direction - SGB 2015',
        actionLabel: 'SGB Mandate Update SOP',
      };
    }

    // Default: Banking / DEAF (Depositor Education and Awareness Fund)
    return {
      frameworkName: 'RBI DEAF (Depositor Education & Awareness Fund) & UDGAM Portal Framework',
      badge: 'RBI DEAF Guidelines',
      badgeColor: 'emerald',
      rules: [
        '10-Year Inactivity Rule: Balances in bank accounts unoperated for 10 or more years are legally transferred to the RBI DEAF account under Section 26A of the Banking Regulation Act, 1949.',
        'Continuous Interest Accrual: Depositors can still claim back their funds from the home bank with interest at RBI mandated rates (currently ~3.0% for savings deposits).',
        'UDGAM Portal Search: Use RBI’s centralized UDGAM (Unclaimed Deposits - Gateway to Access inforMation) portal to locate dormant accounts across all participating public and private sector banks.',
      ],
      regulatoryBody: 'Reserve Bank of India Master Circular - Depositor Education and Awareness Fund Scheme, 2014',
      actionLabel: 'RBI DEAF Claim SOP',
    };
  };

  const domainRules = getDomainSpecificRules(activeAsset);

  const handleStartClaim = () => {
    if (!activeAsset) return;
    addClaim({
      assetId: activeAsset.id,
      assetName: activeAsset.name,
      institution: activeAsset.institution,
      assetType: activeAsset.category,
      amount: activeAsset.estimatedValue,
      currentStage: 'Claim Submitted',
      progressPercentage: readinessPercent,
      submissionDate: 'Today',
      followUpDate: 'In 14 Days',
      readinessScore: readinessPercent,
      notes: `Claim initiated via AI Claim Navigator for ${activeAsset.name}`,
      tasks: [
        { id: `t_${Date.now()}_1`, title: 'Identity Proof Verification', completed: checklist.identityProof },
        { id: `t_${Date.now()}_2`, title: 'Form and Cheque Submission', completed: checklist.bankPassbookCopy },
      ],
      history: [
        { stage: 'Asset Discovered', date: activeAsset.discoveryDate, description: 'Asset discovered', completed: true },
        { stage: 'Verification Complete', date: 'Today', description: 'Documentation checklist verified', completed: true },
        { stage: 'Claim Submitted', date: 'Today', description: 'Lodge with institution', completed: true },
        { stage: 'Under Verification', date: 'Pending', description: 'Awaiting institutional officer', completed: false },
        { stage: 'Recovery Pending', date: 'Pending', description: 'Fund transfer to account', completed: false },
      ],
    });
    setActiveTab('tracker');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              AI Claim Navigator
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Get Step-by-Step Recovery Guidance</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated checklist, institutional SOPs, and statutory recovery frameworks for every discovered asset.
          </p>
        </div>

        {/* Asset Selector Dropdown or Empty Badge */}
        <div className="flex items-center gap-2">
          {assets.length > 0 ? (
            <>
              <label className="text-xs text-slate-400 font-medium hidden sm:inline">Active Asset:</label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="bg-[#061525] border border-emerald-500/50 rounded-xl px-3.5 py-2 text-xs font-semibold text-emerald-300 outline-none"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} (₹{a.estimatedValue.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('assets')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              + Add Asset First
            </button>
          )}
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-10 text-center shadow-card space-y-4">
          <Compass className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Discovered Assets to Navigate</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            The AI Claim Navigator generates personalized statutory checklists and standard operating procedures once an asset is detected or added.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('assets')}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
            >
              Go to Asset Discovery
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-4 py-2 rounded-xl bg-[#061525] border border-[#1E3A5F] text-cyan-300 font-bold text-xs"
            >
              Upload Statement
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Asset Classification & Verification Status Header */}
          <div className="p-4 rounded-2xl bg-[#0A2238] border border-[#1E3A5F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isConfirmed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {isConfirmed ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{activeAsset?.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isConfirmed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {isConfirmed ? 'Institutional Verified' : 'Clue-Based Unverified Estimate'}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Institution: <strong className="text-cyan-300">{activeAsset?.institution}</strong> • Value:{' '}
                  <strong className="text-emerald-400">₹{activeAsset?.estimatedValue.toLocaleString('en-IN')}</strong> • Ref:{' '}
                  <span className="font-mono text-slate-300">{activeAsset?.maskedAccountRef}</span>
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 self-start sm:self-auto">
              {!isConfirmed && (
                <span className="text-amber-400/90 italic">
                  * Estimated from tax/salary clues. Formal balance confirmed post-KYC.
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Readiness Gauge & Checklists */}
            <div className="lg:col-span-6 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Target Recovery Entity
                    </span>
                    <h3 className="text-lg font-extrabold text-white">{activeAsset?.name}</h3>
                    <p className="text-xs text-slate-400">
                      {activeAsset?.institution} • Match Confidence: {activeAsset?.confidenceScore}%
                    </p>
                  </div>

                  {/* Circular Gauge */}
                  <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#0B1E32"
                        strokeWidth="3.8"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3.8"
                        strokeDasharray={`${readinessPercent}, 100`}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-black text-white">{readinessPercent}%</span>
                      <span className="text-[8px] font-bold text-emerald-400 uppercase">Ready</span>
                    </div>
                  </div>
                </div>

                {/* Required Document Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Document Checklist & Proofs
                  </h4>

                  <div
                    onClick={() => toggleCheck('identityProof')}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      checklist.identityProof
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-4 h-4 ${checklist.identityProof ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-semibold text-slate-200">Identity Proof (Aadhaar / PAN Card)</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase">{checklist.identityProof ? 'Verified' : 'Pending'}</span>
                  </div>

                  <div
                    onClick={() => toggleCheck('employmentRecords')}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      checklist.employmentRecords
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-4 h-4 ${checklist.employmentRecords ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-semibold text-slate-200">Address Proof & Signature Specimen</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase">{checklist.employmentRecords ? 'Verified' : 'Pending'}</span>
                  </div>

                  <div
                    onClick={() => toggleCheck('uanInfo')}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      checklist.uanInfo
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-4 h-4 ${checklist.uanInfo ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-semibold text-slate-200">Original / Matured Certificate or Passbook Reference</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase">{checklist.uanInfo ? 'Verified' : 'Pending'}</span>
                  </div>

                  <div
                    onClick={() => toggleCheck('bankPassbookCopy')}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      checklist.bankPassbookCopy
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-4 h-4 ${checklist.bankPassbookCopy ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-semibold text-slate-200">Active Bank Cancelled Cheque (For ECS credit)</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase">{checklist.bankPassbookCopy ? 'Verified' : 'Pending'}</span>
                  </div>

                  <div
                    onClick={() => toggleCheck('indemnityBond')}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      checklist.indemnityBond
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-4 h-4 ${checklist.indemnityBond ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-semibold text-slate-200">Notarized Indemnity Bond (If original receipt lost)</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase">{checklist.indemnityBond ? 'Verified' : 'Optional'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#1E3A5F] flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleStartClaim}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Generate Checklist & Submit Claim</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('letters')}
                  className="px-4 py-2.5 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-cyan-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Draft Claim Letter</span>
                </button>
              </div>
            </div>

            {/* Right Column: Institutional Recovery Step-by-Step SOP */}
            <div className="lg:col-span-6 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-cyan-400" />
                    Official Recovery Roadmap
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {activeAsset?.institution} SOP
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Identify & Lock Account Footprint</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        Match the masked reference ({activeAsset?.maskedAccountRef}) with your consolidated tax credit (Form 26AS) or historical salary records.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Generate Formal Recovery Application</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        Use our AI Claim Letter Generator to draft an RBI / India Post compliant claim petition with statutory reference numbers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Institutional KYC Verification</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        Submit self-attested Aadhaar, PAN, and active bank cancelled cheque to {activeAsset?.institution} online portal or designated home branch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Fund Disbursement & Closure</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                        Direct electronic NEFT/RTGS credit to your verified active bank account within 15–21 working days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-slate-400">
                <span>Official Government Guidelines strictly adhered to.</span>
                <button
                  onClick={() => setActiveTab('tracker')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>View In Claim Tracker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* DEDICATED DOMAIN FRAMEWORK (RBI DEAF, INDIA POST NSC, OR SGB) */}
          {domainRules && (
            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E3A5F] pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{domainRules.frameworkName}</h3>
                    <p className="text-[11px] text-slate-400">
                      Domain-specific statutory compliance and avoidance of institutional claim rejection.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  {domainRules.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {domainRules.rules.map((rule, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>Recovery Directive</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-[#061525]/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Regulatory Reference:</span> {domainRules.regulatoryBody}
                </div>
                <button
                  onClick={() => setActiveTab('letters')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs hover:bg-cyan-500/30 transition-all self-start sm:self-auto"
                >
                  {domainRules.actionLabel}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};


