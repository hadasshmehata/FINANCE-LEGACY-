import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  UserCheck,
  Shield,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Download,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EpfoRecovery: React.FC = () => {
  const { setActiveTab, assets, footprint, currentUser, addAsset } = useApp();

  const epfAsset = assets.find((a) => a.category === 'EPF');
  const targetEmployer = footprint.previousEmployers[0] || (currentUser.occupation ? currentUser.occupation.split('(')[0].trim() : 'Primary Employer');
  const epfAmount = epfAsset ? epfAsset.estimatedValue : 42500;
  const hasEpfRecord = !!epfAsset || footprint.previousEmployers.length > 0;

  const [uanInput, setUanInput] = useState('101288498829');
  const [verifiedUan, setVerifiedUan] = useState(true);

  const epfSteps = [
    {
      title: 'Step 1: Identify UAN & Service History',
      description: `Extracted from ${targetEmployer} salary records: UAN 1012****8829, Member ID DL/CPM/0045812/000/000109.`,
      status: 'Completed',
    },
    {
      title: 'Step 2: Complete e-KYC on Member e-Sewa',
      description: 'Aadhaar and PAN must be linked and verified with OTP on the EPFO Unified Portal.',
      status: 'Completed',
    },
    {
      title: 'Step 3: Submit Online Transfer Form 13',
      description: `Merge historical PF balance (₹${epfAmount.toLocaleString('en-IN')}) into your current active employer account or request final settlement.`,
      status: epfAsset?.verificationStatus === 'Verified' ? 'Ready to Submit' : 'Action Required',
    },
    {
      title: 'Step 4: Regional PF Commissioner Attestation',
      description: 'Electronic employer sign-off via digital signature token (DSC).',
      status: 'Pending',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              EPFO Recovery Assistant
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Provident Fund Recovery Navigator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Recover un-transferred and dormant EPF corpus from previous establishments legally and securely.
          </p>
        </div>

        <a
          href="https://unifiedportal-mem.epfindia.gov.in/memberinterface/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-cyan-300 font-semibold text-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Official Member Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: EPF Footprint & UAN Detector */}
        <div className="lg:col-span-5 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Detected PF Profile
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {epfAsset ? epfAsset.verificationStatus : 'Footprint Trace'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#061525] border border-[#1E3A5F] space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Establishment:</span>
                <span className="font-bold text-white">{targetEmployer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Detected UAN:</span>
                <span className="font-mono font-bold text-emerald-400">{epfAsset?.maskedAccountRef || '1012****8829'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Member ID:</span>
                <span className="font-mono text-slate-300">DL/CPM/0045812/000/000109</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Unclaimed Corpus:</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  ₹{epfAmount.toLocaleString('en-IN')}.00
                </span>
              </div>
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] leading-relaxed flex items-start gap-2">
              <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                Under Section 17(1) of the EPF Act, unclaimed balances continue to accumulate compounding annual interest (currently 8.25% p.a.) even in inactive accounts until the employee turns 58.
              </span>
            </div>

            <button
              onClick={() => setActiveTab('letters')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Form 13 Petition Letter</span>
            </button>
          </div>
        </div>

        {/* Right Column: Step-by-Step SOP & Form Guidance */}
        <div className="lg:col-span-7 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Standard Operating Procedure (SOP)
              </h3>
              <span className="text-[10px] text-slate-400">EPFO Citizen Charter</span>
            </div>

            <div className="space-y-3">
              {epfSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] hover:border-emerald-500/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{step.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        step.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : step.status === 'Ready to Submit'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-slate-400">
            <span>Mandatory Documents: Cancelled Cheque, Aadhaar, Salary Slip</span>
            <button
              onClick={() => setActiveTab('navigator')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>View Claim Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
