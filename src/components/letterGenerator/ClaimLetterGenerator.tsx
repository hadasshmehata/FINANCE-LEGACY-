import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Printer,
  Check,
  FolderArchive,
  Sparkles,
  Building,
  User,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClaimLetterGenerator: React.FC = () => {
  const { assets, currentUser, addClaimLetter, uploadDocument, setActiveTab } = useApp();

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const activeAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const [templateType, setTemplateType] = useState<'bank' | 'epfo' | 'insurance' | 'mf'>('bank');
  const [recipient, setRecipient] = useState(
    'The Branch Manager, ABC Bank, Connaught Place Branch, New Delhi - 110001'
  );
  const [subject, setSubject] = useState(
    'Request for Reactivation and Disbursement of Balance in Inoperative Savings Account'
  );

  const generateLetterContent = (type: 'bank' | 'epfo' | 'insurance' | 'mf', targetAsset?: any) => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const userPhone = currentUser.phone || '+91 98765 43210';
    const userEmail = currentUser.email;
    const assetInst = targetAsset?.institution || (type === 'bank' ? 'ABC Bank' : type === 'insurance' ? 'HDFC Life' : 'EPFO');
    const assetRef = targetAsset?.maskedAccountRef || 'XXXXXX4821';
    const assetVal = targetAsset ? `₹${targetAsset.estimatedValue.toLocaleString('en-IN')}` : '₹1,25,000';

    if (type === 'epfo') {
      return {
        recipient: 'The Regional Provident Fund Commissioner, EPFO Regional Office',
        subject: `Claim Application for Settlement of Dormant EPF Accumulations under ${assetRef}`,
        body: `To,\nThe Regional Provident Fund Commissioner,\nEmployees' Provident Fund Organisation.\n\nSubject: Claim Application for Settlement of Dormant EPF Accumulations under ${assetRef}\n\nRespected Commissioner,\n\nI was formerly employed with ${targetAsset?.institution || 'an EPFO covered establishment'} having Member ID linked to Universal Account Number ${assetRef}.\n\nMy provident fund balance of approximately ${assetVal} has remained non-operational since separation from service. I have completed Aadhaar seeding and KYC verification on the Unified Member Portal.\n\nI request your good office to process the full settlement of my accumulated provident fund credit to my linked bank account.\n\nEnclosures:\n1. Salary Slip copy bearing Member ID\n2. Cancelled cheque with printed account holder name\n3. Copy of Aadhaar & PAN card\n\nYours sincerely,\n\n${currentUser.name}\nContact: ${userPhone}\nEmail: ${userEmail}\nDate: ${dateStr}`,
      };
    } else if (type === 'insurance') {
      return {
        recipient: `Claims Department, ${assetInst}`,
        subject: `Claim Petition for Maturity / Surrender Value of Life Policy No. ${assetRef}`,
        body: `To,\nClaims Department,\n${assetInst}.\n\nSubject: Claim Petition for Maturity / Surrender Value of Life Policy No. ${assetRef}\n\nDear Sir/Madam,\n\nI am writing with reference to Policy No. ${assetRef} issued in my name, with regular premium deductions confirmed through banking records.\n\nAs the policy has attained maturity / uncollected status, I request the disbursement of the policy value (estimated at ${assetVal}) along with accumulated bonuses to my verified account.\n\nEnclosed:\n1. Policy schedule / ECS payment proof\n2. KYC Identity & Address documents\n3. NEFT mandate form & cancelled cheque\n\nYours faithfully,\n\n${currentUser.name}\nContact: ${userPhone}\nEmail: ${userEmail}\nDate: ${dateStr}`,
      };
    } else if (type === 'mf') {
      return {
        recipient: `CAMS Investor Services / ${assetInst} Mutual Fund Registrar`,
        subject: `Request for Folio Verification and Unclaimed Dividend Transmission - Folio No. ${assetRef}`,
        body: `To,\nThe Registrar & Transfer Agent,\nCAMS / ${assetInst},\n\nSubject: Request for Folio Verification and Unclaimed Dividend Transmission - Folio No. ${assetRef}\n\nDear Registrar,\n\nI hold mutual fund units under Folio No. ${assetRef}. I have identified unclaimed dividend credits (${assetVal}) and wish to update my bank mandate to resume direct credit of distributions.\n\nKindly furnish the latest Consolidated Account Statement (CAS) and register the enclosed bank details.\n\nYours faithfully,\n\n${currentUser.name}\nContact: ${userPhone}\nEmail: ${userEmail}\nDate: ${dateStr}`,
      };
    } else {
      return {
        recipient: `The Branch Manager, ${assetInst}`,
        subject: `Request for Reactivation and Disbursement of Balance in Inoperative Account No. ${assetRef}`,
        body: `To,\nThe Branch Manager,\n${assetInst}.\n\nSubject: Request for Reactivation and Disbursement of Balance in Inoperative Account No. ${assetRef}\n\nRespected Sir/Madam,\n\nI, ${currentUser.name}, am the sole account holder of Account No. ${assetRef} held at your branch.\n\nDue to a change in residence and employment relocation, I was unable to operate the aforementioned account for an extended period, resulting in its classification as Inoperative / Dormant under RBI regulations.\n\nAs per my records and consolidated statements, a sum of approximately ${assetVal} plus accrued interest is standing to the credit of this account.\n\nI hereby submit the required self-attested documents for fresh Know Your Customer (KYC) compliance:\n1. Copy of Aadhaar Card (Proof of Identity & Address)\n2. Copy of PAN Card\n3. Two recent passport-size photographs\n4. Cancelled cheque of my active primary savings account\n\nI request you to kindly re-activate the account and facilitate the transfer of the entire credit balance to my active account details enclosed herewith.\n\nThanking you,\n\nYours faithfully,\n\n${currentUser.name}\nContact: ${userPhone}\nEmail: ${userEmail}\nDate: ${dateStr}`,
      };
    }
  };

  const initialContent = generateLetterContent('bank', activeAsset);
  const [letterBody, setLetterBody] = useState<string>(initialContent.body);

  // Synchronize when active asset or user changes
  React.useEffect(() => {
    const updated = generateLetterContent(templateType, activeAsset);
    setRecipient(updated.recipient);
    setSubject(updated.subject);
    setLetterBody(updated.body);
  }, [activeAsset, currentUser, templateType]);

  const [copied, setCopied] = useState(false);
  const [savedToVault, setSavedToVault] = useState(false);

  const handleTemplateChange = (type: 'bank' | 'epfo' | 'insurance' | 'mf') => {
    setTemplateType(type);
    const updated = generateLetterContent(type, activeAsset);
    setRecipient(updated.recipient);
    setSubject(updated.subject);
    setLetterBody(updated.body);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${subject}</title>
            <style>
              body { font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.6; padding: 40px; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
          </head>
          <body>
            <pre>${letterBody}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSaveToVault = () => {
    addClaimLetter({
      title: subject,
      assetId: activeAsset?.id,
      institution: activeAsset?.institution || 'Financial Institution',
      recipientDesignation: recipient,
      subject: subject,
      category: templateType === 'epfo' ? 'EPF' : templateType === 'insurance' ? 'Insurance' : 'Banking',
      letterBody: letterBody,
    });

    uploadDocument({
      name: `Formal_Claim_Letter_${activeAsset?.institution || 'Bank'}.pdf`,
      size: '180 KB',
      category: 'Claim Documents',
    });

    setSavedToVault(true);
    setTimeout(() => setSavedToVault(false), 3500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">

      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              AI Claim Letter Generator
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Generate Formal Legal Claim Letters
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Standardized recovery petitions, dormancy revival forms, and nominee transmission applications.
          </p>
        </div>

        {/* Template Selector Pills */}
        <div className="flex flex-wrap gap-1.5 bg-[#061525] p-1 rounded-2xl border border-[#1E3A5F]">
          <button
            onClick={() => handleTemplateChange('bank')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${templateType === 'bank' ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald' : 'text-slate-400 hover:text-white'
              }`}
          >
            Bank Inoperative
          </button>
          <button
            onClick={() => handleTemplateChange('epfo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${templateType === 'epfo' ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald' : 'text-slate-400 hover:text-white'
              }`}
          >
            EPFO Form 19/13
          </button>
          <button
            onClick={() => handleTemplateChange('insurance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${templateType === 'insurance' ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald' : 'text-slate-400 hover:text-white'
              }`}
          >
            Insurance Claim
          </button>
          <button
            onClick={() => handleTemplateChange('mf')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${templateType === 'mf' ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald' : 'text-slate-400 hover:text-white'
              }`}
          >
            Mutual Fund
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Letter Configuration Controls */}
        <div className="lg:col-span-5 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Configure Letter Metadata
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold">Auto-Populated</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Asset Reference</label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.institution}) — ₹{a.estimatedValue.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Recipient Institutional Address</label>
              <textarea
                rows={2}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Formal Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* Quick Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSaveToVault}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-2"
              >
                <FolderArchive className="w-4 h-4" />
                <span>{savedToVault ? 'Saved to Document Vault!' : 'Save Letter to Vault'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 py-2 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-[#1E3A5F] text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Editable Letter Preview */}
        <div className="lg:col-span-7 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Live Editable Letter Preview
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Standard Legal Font</span>
            </div>

            <textarea
              rows={16}
              value={letterBody}
              onChange={(e) => setLetterBody(e.target.value)}
              className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-cyan-400 rounded-2xl p-4 text-xs font-mono text-slate-200 outline-none leading-relaxed resize-none selection:bg-emerald-500 selection:text-slate-950"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-slate-400">
            <span>Includes RBI Inoperative Account Circular & EPFO statutory clauses.</span>
            <button
              onClick={() => setActiveTab('tracker')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View In Claim Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

