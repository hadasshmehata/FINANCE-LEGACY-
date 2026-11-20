import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Copy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FraudAnalysisResult } from '../../types';

export const FraudDetector: React.FC = () => {
  const { analyzeFraudText, fraudScans } = useApp();

  const [inputText, setInputText] = useState(
    'You have won ₹1,00,000! Click here to claim: http://fake-link.com'
  );
  const [currentResult, setCurrentResult] = useState<FraudAnalysisResult>(fraudScans[0]);
  const [isScanning, setIsScanning] = useState(false);

  const presets = [
    {
      label: 'Lottery Phishing (From Prototype)',
      text: 'You have won ₹1,00,000! Click here to claim: http://fake-link.com',
    },
    {
      label: 'EPFO Account Block Phishing',
      text: 'URGENT: Your EPFO account UAN 1012**** has been blocked due to pending KYC. Pay ₹500 verification fee immediately: http://epfo-online-kyc.xyz/unblock or reply with OTP.',
    },
    {
      label: 'Legitimate Bank Advisory',
      text: 'Dear Customer, your ABC Bank account balance is ₹1,25,000. For security reasons, remember ABC Bank never asks for OTP or net banking password.',
    },
  ];

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      const res = analyzeFraudText(inputText);
      setCurrentResult(res);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              AI Fraud & Phishing Detector
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Check Suspicious Messages & Recovery Scams
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Predatory scammers target forgotten asset claimants. Test SMS, WhatsApp messages, and links before clicking.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-2xl">
          <Lock className="w-4 h-4" />
          <span>Zero Credential Storage • 100% Confidential Analysis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form (Exact match with prototype) */}
        <div className="lg:col-span-6 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Paste Suspicious Message or Link
            </h3>
            <span className="text-[10px] text-slate-400">SMS / WhatsApp / Email</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(p.text)}
                className="px-2.5 py-1 rounded-lg bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-slate-300 hover:text-cyan-300 text-[11px] font-medium transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div className="relative">
              <textarea
                rows={5}
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the message content, email body, or recovery claim link here..."
                className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 rounded-2xl p-4 text-xs text-white placeholder-slate-500 outline-none leading-relaxed transition-all font-mono"
              />
            </div>

            {/* Analyze Button (Exact match with prototype: Cyan button) */}
            <button
              type="submit"
              disabled={isScanning}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>Scanning Threat Vectors...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </form>

          {/* Safety rule reminder */}
          <div className="p-3.5 rounded-2xl bg-[#061525]/70 border border-[#1E3A5F] text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
              Golden Financial Safety Rules:
            </span>
            <p>• Never share Banking Passwords, ATM PINs, OTPs, or CVVs with anyone.</p>
            <p>• Real recovery officers and banks never demand payment through UPI or WhatsApp.</p>
          </div>
        </div>

        {/* Right Column: Threat Evaluation Result (Exact match with prototype: HIGH RISK red badge) */}
        <div className="lg:col-span-6 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                AI Threat Assessment
              </h3>
              <span className="text-[10px] font-mono text-slate-400">{currentResult?.analyzedAt || 'Just now'}</span>
            </div>

            {currentResult && (
              <div className="space-y-4">
                {/* Risk Level Card (Exact replica of prototype) */}
                <div
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center ${
                    currentResult.riskLevel === 'HIGH'
                      ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-glow-emerald/10'
                      : currentResult.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                      currentResult.riskLevel === 'HIGH'
                        ? 'bg-red-500/20 text-red-400'
                        : currentResult.riskLevel === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <AlertTriangle className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="text-lg font-black tracking-wider uppercase">
                    {currentResult.riskLevel} RISK
                  </div>
                  <span className="text-xs text-slate-300 font-semibold mt-0.5">
                    Threat Probability: {currentResult.riskScore}%
                  </span>
                </div>

                {/* Suspicious Indicators (Exact match with prototype: Urgent action required, External link, Guaranteed reward) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Suspicious Indicators Detected:
                  </h4>
                  <div className="space-y-1.5">
                    {currentResult.suspiciousIndicators.map((ind, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-[#061525] border border-[#1E3A5F] flex items-center gap-2.5 text-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                        <span className="text-slate-200 font-medium">{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-2xl bg-[#061525]/80 border border-[#1E3A5F] text-xs">
                  <span className="font-bold text-slate-400 block mb-1">AI Forensic Explanation:</span>
                  <p className="text-slate-300 leading-relaxed">{currentResult.explanation}</p>
                </div>

                {/* Safe Actions */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                    Recommended Safe Actions:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {currentResult.safeActions.map((act, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-slate-400">
            <span>Report Cyber Crime Helpline: 1930</span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>National Cyber Crime Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

