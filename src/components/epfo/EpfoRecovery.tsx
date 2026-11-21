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
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EpfEdgeCase {
  id: string;
  title: string;
  rejectionReason: string;
  frequency: string;
  solution: string;
  mandatoryDocs: string[];
  statutoryRule: string;
}

export const EpfoRecovery: React.FC = () => {
  const { setActiveTab, assets, footprint, currentUser, addAsset } = useApp();

  const epfAsset = assets.find((a) => a.category === 'EPF');
  const targetEmployer = footprint.previousEmployers[0] || (currentUser.occupation ? currentUser.occupation.split('(')[0].trim() : 'Primary Employer');
  const epfAmount = epfAsset ? epfAsset.estimatedValue : 42500;
  const hasEpfRecord = !!epfAsset || footprint.previousEmployers.length > 0;

  const [uanInput, setUanInput] = useState('101288498829');
  const [selectedEdgeCase, setSelectedEdgeCase] = useState<string>('name-mismatch');

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

  // Specific Indian EPFO Edge Cases & Rejection Resolutions
  const edgeCases: EpfEdgeCase[] = [
    {
      id: 'name-mismatch',
      title: 'Name or Date of Birth Mismatch (Joint Declaration Form)',
      rejectionReason: 'EPFO rejects claim if name on Aadhaar differs even slightly from employer EPFO records, or if DOB differs by > 3 years.',
      frequency: 'Most Common (42% of rejections)',
      solution: 'Submit Online Joint Declaration Form (JDF) via the Unified Portal signed by both employee and employer with supporting documentary proof.',
      mandatoryDocs: ['Class 10 / Birth Certificate', 'Passport / Aadhaar', 'Employer Attested Joint Declaration Form'],
      statutoryRule: 'EPFO Head Office Circular No. WSU/2022/1/UIDAI/Part(1) & Standard Operating Procedure (SOP) for Member Profile Correction v3.0.',
    },
    {
      id: 'kyc-bank',
      title: 'Bank KYC Seeding & Merged Bank IFSC Invalidation',
      rejectionReason: 'Bank account not digitally approved by employer, or outdated IFSC from nationalized bank mergers (e.g. Syndicate to Canara, Allahabad to Indian Bank).',
      frequency: 'High (28% of rejections)',
      solution: 'Update active Bank Account with new IFSC under "KYC" tab on Member Portal, then request employer to approve pending request via employer DSC token.',
      mandatoryDocs: ['Cancelled Cheque with printed Member Name', 'Bank Passbook first page attested by Branch Manager'],
      statutoryRule: 'EPFO Online Services Guidelines 2024: Bank account seeded must have name matching exactly with Aadhaar database.',
    },
    {
      id: 'employer-closed',
      title: 'Employer Defunct / Closed Establishment (No DSC Available)',
      rejectionReason: 'Previous establishment is shut down or employer is unreachable to sign off via Digital Signature Certificate (DSC).',
      frequency: 'Moderate (15% of rejections)',
      solution: 'Submit manual physical claim attested by an authorized officer: Bank Manager of your KYC-linked bank, Gazetted Officer, or Regional PF Commissioner (RPFC).',
      mandatoryDocs: ['Form 19 & 10C with Bank Manager Attestation', 'Indemnity Bond if establishment is closed', 'Company RoC Strike-off certificate copy'],
      statutoryRule: 'EPFO Manual of Accounting Procedures, Para 10.18: In absence of employer, attestation by authorized bank manager is statutory substitute.',
    },
    {
      id: 'dual-uan',
      title: 'Dual / Multiple UAN Consolidation',
      rejectionReason: 'Having multiple UANs created by different employers causes balance fragmentation and prevents unified pension calculations.',
      frequency: 'Moderate (12% of rejections)',
      solution: 'Use "One Member - One EPF Account" to transfer previous Member IDs into the latest active UAN, then request EPFO Helpdesk to deactivate older UAN.',
      mandatoryDocs: ['Service History from both UANs', 'Transfer Claim Form 13 tracking receipt'],
      statutoryRule: 'EPFO Notification: Previous UANs must be linked and transferred before filing final withdrawal Form 19/10D.',
    },
  ];

  const activeCase = edgeCases.find((e) => e.id === selectedEdgeCase) || edgeCases[0];

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
            Recover un-transferred and dormant EPF corpus from previous establishments legally and securely with edge-case resolution.
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

      {/* NEW SECTION: EPFO Rejection & Edge Case Diagnostics */}
      <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E3A5F] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-extrabold text-white">
                EPFO Rejection & Edge Case Diagnostics
              </h3>
              <p className="text-[11px] text-slate-400">
                EPF transfers commonly fail due to subtle KYC, demographic, or employer sign-off issues. Select an issue to view the statutory resolution SOP.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full self-start sm:self-auto">
            EPFO SOP v3.0 Guidelines
          </span>
        </div>

        {/* Edge Case Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {edgeCases.map((ec) => (
            <button
              key={ec.id}
              onClick={() => setSelectedEdgeCase(ec.id)}
              className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                selectedEdgeCase === ec.id
                  ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-glow-amber/20'
                  : 'bg-[#061525] border-[#1E3A5F] text-slate-300 hover:border-slate-500'
              }`}
            >
              <span className="font-bold block truncate mb-1">{ec.title}</span>
              <span className="text-[10px] text-amber-400/90 font-medium block">{ec.frequency}</span>
            </button>
          ))}
        </div>

        {/* Selected Edge Case Resolution Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#061525] border border-[#1E3A5F] space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              {activeCase.title}
            </h4>
            <span className="text-[10px] font-semibold text-slate-400 font-mono">
              Frequency: {activeCase.frequency}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-[#10283D] border border-red-500/30 space-y-1">
              <span className="font-bold text-red-400 uppercase tracking-wider text-[10px] block">
                Why EPFO Rejects:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{activeCase.rejectionReason}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#10283D] border border-emerald-500/30 space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block">
                Statutory Resolution SOP:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{activeCase.solution}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1E3A5F]">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Mandatory Documentation Required:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCase.mandatoryDocs.map((doc, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-[#10283D] border border-cyan-500/30 text-cyan-300 text-[10px]"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('letters')}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Draft Joint Petition</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-500 italic">
            Statutory Basis: {activeCase.statutoryRule}
          </p>
        </div>
      </div>
    </div>
  );
};
