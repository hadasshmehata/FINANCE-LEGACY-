import React, { useState } from 'react';
import {
  FolderArchive,
  FileCheck,
  FileText,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory, DocumentItem } from '../../types';

export const DocumentVault: React.FC = () => {
  const { documents, deleteDocument, uploadDocument, assets, linkDocumentToAsset, searchQuery, setSearchQuery } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const categories = [
    'All',
    'Bank Statements',
    'Salary Slips',
    'EPF Records',
    'Insurance Policies',
    'Investment Statements',
    'Claim Documents',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.financialInstitution && doc.financialInstitution.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Document Vault
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Secure Evidence Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Encrypted client-side storage for tax filings, bank passbooks, salary slips, and legal claim letters.
          </p>
        </div>

        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e: any) => {
              if (e.target.files && e.target.files[0]) {
                const f = e.target.files[0];
                uploadDocument({
                  name: f.name,
                  size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
                  category: 'Bank Statements',
                });
              }
            };
            input.click();
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1E3A5F] pb-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === c
                ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                : 'bg-[#10283D] text-slate-400 hover:text-white border border-[#1E3A5F]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#10283D] hover:bg-[#13334E] border border-[#1E3A5F] hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-card flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {doc.confidenceScore}% Validated
                </span>
              </div>

              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                {doc.fileName}
              </h3>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <span>{doc.category}</span>
                <span>•</span>
                <span>{doc.fileSize}</span>
              </div>

              {doc.potentialAssetFound && (
                <div className="mt-3 p-2.5 rounded-xl bg-[#061525]/80 border border-[#1E3A5F] text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-semibold block">Extracted Asset:</span>
                  {doc.potentialAssetFound}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#1E3A5F] mt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">{doc.uploadDate}</span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  className="p-1.5 rounded-lg bg-[#061525] text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Preview Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 rounded-lg bg-[#061525] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl max-w-lg w-full p-6 shadow-card animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white truncate max-w-xs">{selectedDoc.fileName}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#061525] border border-[#1E3A5F] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-white">{selectedDoc.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Size:</span>
                  <span className="font-mono text-slate-300">{selectedDoc.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Upload Date:</span>
                  <span className="font-mono text-slate-300">{selectedDoc.uploadDate}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1.5">Extracted Financial Entities:</span>
                <div className="space-y-1.5">
                  {selectedDoc.extractedEntities.map((ent, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-[#061525]/80 border border-[#1E3A5F] flex justify-between">
                      <span className="text-slate-400">{ent.label}:</span>
                      <span className="font-bold text-cyan-300">{ent.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDoc.aiExplanation && (
                <div className="p-3 rounded-2xl bg-[#061525]/70 border border-[#1E3A5F] text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-400 block mb-0.5">AI Forensic Report:</span>
                  {selectedDoc.aiExplanation}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#1E3A5F] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

