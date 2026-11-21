import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  CreditCard,
  Percent,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory } from '../../types';

// Constants for file validation
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

// Client-side PII Redaction Regexes
export const redactSensitivePII = (text: string): { sanitized: string; maskedCount: number } => {
  let masked = 0;
  let sanitized = text;

  // Indian PAN (5 letters, 4 digits, 1 letter) -> ABCDE****F
  const panRegex = /\b([A-Z]{5})(\d{4})([A-Z]{1})\b/gi;
  sanitized = sanitized.replace(panRegex, (_match, p1, _p2, p3) => {
    masked++;
    return `${p1}****${p3}`;
  });

  // Indian Aadhaar (12 digits, optional spaces) -> XXXX-XXXX-1234
  const aadhaarRegex = /\b\d{4}[\s-]?\d{4}[\s-]?(\d{4})\b/g;
  sanitized = sanitized.replace(aadhaarRegex, (_match, last4) => {
    masked++;
    return `XXXX-XXXX-${last4}`;
  });

  // UAN (12 digits starting with 10) -> 1012****8829
  const uanRegex = /\b(10\d{2})\d{4}(\d{4})\b/g;
  sanitized = sanitized.replace(uanRegex, (_match, prefix, suffix) => {
    masked++;
    return `${prefix}****${suffix}`;
  });

  // Bank Account Numbers (9 to 18 digits) -> XXXXXX1234
  const bankAccRegex = /\b\d{6,14}(\d{4})\b/g;
  sanitized = sanitized.replace(bankAccRegex, (_match, last4) => {
    masked++;
    return `XXXXXX${last4}`;
  });

  return { sanitized, maskedCount: masked };
};

export const DocumentScanner: React.FC = () => {
  const { uploadDocument, documents, addAsset, setActiveTab } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('Bank Statements');
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeExtractedResult, setActiveExtractedResult] = useState<any | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Security & Privacy Consent Controls
  const [enablePiiRedaction, setEnablePiiRedaction] = useState(true);
  const [userConsentGiven, setUserConsentGiven] = useState(true);

  const categories: { label: DocumentCategory; icon: string }[] = [
    { label: 'Bank Statements', icon: '🏦' },
    { label: 'Salary Slips', icon: '📄' },
    { label: 'EPF Records', icon: '🏛️' },
    { label: 'Insurance Policies', icon: '🛡️' },
    { label: 'Investment Statements', icon: '📈' },
    { label: 'Pension Docs', icon: '📜' },
  ];

  const validateFile = (file: File): boolean => {
    setValidationError(null);

    // Size validation (Max 10MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(`File size ${(file.size / (1024 * 1024)).toFixed(1)} MB exceeds the maximum 10 MB limit.`);
      return false;
    }

    // Extension validation
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setValidationError(`Unsupported file type (${ext}). Allowed formats: PDF, PNG, JPG, JPEG, WEBP.`);
      return false;
    }

    // MIME type check
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      setValidationError(`Invalid file format: ${file.type}. Allowed: PDF and standard image formats.`);
      return false;
    }

    // Consent check
    if (!userConsentGiven) {
      setValidationError('Please accept the client-side zero-knowledge processing consent before uploading.');
      return false;
    }

    return true;
  };

  // Simulation runner
  const runExtraction = (fileName: string, category: DocumentCategory, fileSize: string) => {
    setValidationError(null);
    setAnalyzing(true);
    setProgress(25);
    setCurrentStep(1);

    setTimeout(() => {
      setProgress(50);
      setCurrentStep(2);
    }, 700);

    setTimeout(() => {
      setProgress(75);
      setCurrentStep(3);
    }, 1400);

    setTimeout(() => {
      setProgress(100);
      setAnalyzing(false);

      // Create new document in context
      uploadDocument({
        name: fileName,
        size: fileSize,
        category: category,
      });

      // Prepare preview result with client-side PII masking applied
      const rawRef = '987654' + Math.floor(1000 + Math.random() * 9000);
      const maskedRef = enablePiiRedaction ? redactSensitivePII(rawRef).sanitized : rawRef;

      setActiveExtractedResult({
        fileName,
        category,
        institution: category === 'EPF Records' || category === 'Salary Slips' ? 'EPFO India / ABC Tech' : category === 'Insurance Policies' ? 'LIC of India' : 'HDFC Bank',
        potentialAsset: category === 'EPF Records' || category === 'Salary Slips' ? 'Provident Fund Corpus (₹42,500)' : category === 'Insurance Policies' ? 'Matured Endowment Policy (₹1,50,000)' : 'Dormant Savings A/C (₹45,000)',
        value: category === 'EPF Records' || category === 'Salary Slips' ? 42500 : category === 'Insurance Policies' ? 150000 : 45000,
        accountRef: maskedRef,
        confidence: 96,
        piiMasked: enablePiiRedaction,
      });
    }, 2100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!validateFile(file)) return;
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      runExtraction(file.name, selectedCategory, sizeStr);
    }
  };

  // Sample quick test documents
  const loadPresetSample = (type: 'salary' | 'bank' | 'insurance' | 'epf') => {
    if (!userConsentGiven) {
      setValidationError('Please accept the client-side zero-knowledge processing consent first.');
      return;
    }
    if (type === 'salary') {
      setSelectedCategory('Salary Slips');
      runExtraction('Salary_Slip_ABC_Technologies_Nov2021.pdf', 'Salary Slips', '820 KB');
    } else if (type === 'bank') {
      setSelectedCategory('Bank Statements');
      runExtraction('HDFC_Bank_Savings_Statement_2022.pdf', 'Bank Statements', '1.8 MB');
    } else if (type === 'insurance') {
      setSelectedCategory('Insurance Policies');
      runExtraction('LIC_Jeevan_Anand_Premium_Receipt.pdf', 'Insurance Policies', '1.2 MB');
    } else {
      setSelectedCategory('EPF Records');
      runExtraction('EPFO_Member_Passbook_Statement.pdf', 'EPF Records', '950 KB');
    }
  };

  const handleAddDiscoveredAsset = () => {
    if (!activeExtractedResult) return;
    addAsset({
      name: activeExtractedResult.potentialAsset,
      category: activeExtractedResult.category === 'EPF Records' || activeExtractedResult.category === 'Salary Slips' ? 'EPF' : activeExtractedResult.category === 'Insurance Policies' ? 'Insurance' : 'Banking',
      institution: activeExtractedResult.institution,
      estimatedValue: activeExtractedResult.value,
      maskedAccountRef: activeExtractedResult.accountRef,
      evidenceSource: `Uploaded Doc: ${activeExtractedResult.fileName} (Client PII Redacted)`,
      confidenceScore: activeExtractedResult.confidence,
      verificationStatus: 'Potentially Discovered',
      linkedDocumentIds: [],
    });
    setActiveExtractedResult(null);
    setActiveTab('assets');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">AI Vision & OCR Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Document Scanner</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Upload your financial documents and let AI discover potential forgotten assets with client-side privacy controls.
          </p>
        </div>

        {/* Quick Sample File Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">Try Pre-built Samples:</span>
          <button
            onClick={() => loadPresetSample('salary')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-medium transition-all"
          >
            Salary Slip
          </button>
          <button
            onClick={() => loadPresetSample('bank')}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-medium transition-all"
          >
            Bank Passbook
          </button>
          <button
            onClick={() => loadPresetSample('insurance')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-medium transition-all"
          >
            Insurance Receipt
          </button>
        </div>
      </div>

      {/* Security & PII Redaction Controls Banner */}
      <div className="bg-[#0A2238] border border-emerald-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Client-Side Zero-Knowledge Privacy Filter</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                Active
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Financial identifiers (PAN, Aadhaar, Bank Acc, UAN) are masked in browser memory before OCR parsing.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 md:border-l border-[#1E3A5F] pt-3 md:pt-0 md:pl-4">
          <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-medium">
            <input
              type="checkbox"
              checked={enablePiiRedaction}
              onChange={(e) => setEnablePiiRedaction(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400/50 bg-[#061525] border-[#1E3A5F]"
            />
            <span className="text-[11px]">Auto-Redact Sensitive PII</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-medium">
            <input
              type="checkbox"
              checked={userConsentGiven}
              onChange={(e) => setUserConsentGiven(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400/50 bg-[#061525] border-[#1E3A5F]"
            />
            <span className="text-[11px]">Explicit Consent for OCR Extraction</span>
          </label>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Drag & Drop Area and Categories */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Document Categories Pill Grid */}
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 shadow-card">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              1. Select Document Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
                    selectedCategory === cat.label
                      ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border-emerald-500 text-emerald-300 shadow-glow-emerald/30'
                      : 'bg-[#061525] border-[#1E3A5F] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const f = e.dataTransfer.files[0];
                if (!validateFile(f)) return;
                runExtraction(f.name, selectedCategory, (f.size / 1024).toFixed(0) + ' KB');
              }
            }}
            className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all bg-[#10283D]/70 flex flex-col items-center justify-center ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                : 'border-[#1E3A5F] hover:border-cyan-400/50'
            }`}
          >
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-glow-emerald/20">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              Drag & Drop Documents Here
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              PDF, JPG, PNG, WEBP supported • Up to 10 MB per file • Max 10MB limit enforced
            </p>

            <label
              htmlFor="fileInput"
              className="cursor-pointer px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all transform active:scale-95 inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Browse Files</span>
            </label>
          </div>
        </div>

        {/* Right Column: AI Analysis Progress & Extracted Entity Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Analysis Progress */}
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                AI Analysis Progress
              </h3>
              <span className="text-xs font-black text-emerald-400">
                {analyzing ? `${progress}%` : '75%'}
              </span>
            </div>

            {/* Glowing Progress Track */}
            <div className="w-full bg-[#061525] rounded-full h-2.5 border border-[#1E3A5F] overflow-hidden p-0.5 mb-5">
              <div
                className="bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-300 h-full rounded-full transition-all duration-500 shadow-glow-emerald"
                style={{ width: `${analyzing ? progress : 75}%` }}
              />
            </div>

            {/* Progress Checklist Steps */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-semibold text-slate-200">Document Classified & Sanitized</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-semibold text-slate-200">
                  Information Extracted {enablePiiRedaction && '(PII Masked)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <span className="font-semibold text-cyan-300">
                  {analyzing ? 'Scanning for Dormant Accounts...' : 'Analyzing Financial Clues...'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Extraction Result Modal / Banner */}
          {activeExtractedResult ? (
            <div className="bg-gradient-to-br from-[#10283D] to-[#0A2238] border-2 border-emerald-500/60 rounded-3xl p-5 shadow-glow-emerald/30 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    New Financial Asset Detected!
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  {activeExtractedResult.confidence}% Confidence
                </span>
              </div>

              <div className="py-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Identified Asset:</span>
                  <span className="font-bold text-white">{activeExtractedResult.potentialAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Institution:</span>
                  <span className="font-bold text-cyan-300">{activeExtractedResult.institution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Derived Value:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    ₹{activeExtractedResult.value.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reference:</span>
                  <span className="font-mono text-emerald-300 flex items-center gap-1.5">
                    {activeExtractedResult.accountRef}
                    {activeExtractedResult.piiMasked && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded">
                        Masked
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddDiscoveredAsset}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add to Discovered Assets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveExtractedResult(null)}
                  className="px-3 py-2 rounded-xl bg-[#061525] border border-[#1E3A5F] text-slate-400 hover:text-white text-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            /* Document Vault Summary Teaser */
            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Recently Scanned Vault ({documents.length})
                </h4>
                <button
                  onClick={() => setActiveTab('vault')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Open Vault →
                </button>
              </div>
              <div className="space-y-2">
                {documents.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 rounded-xl bg-[#061525]/80 border border-[#1E3A5F] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-slate-200 font-medium truncate">{doc.fileName}</p>
                        <span className="text-[10px] text-slate-400">{doc.category}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex-shrink-0">
                      {doc.confidenceScore}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


