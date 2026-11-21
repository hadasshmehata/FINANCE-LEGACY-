import React, { useState } from 'react';
import {
  Coins,
  Plus,
  Shield,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinancialAsset, AssetCategory, VerificationStatus } from '../../types';

export const AssetDiscovery: React.FC = () => {
  const {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    verifyAsset,
    totalPotentialAssetsValue,
    assetsDiscoveredCount,
    setActiveTab,
    addClaim,
    searchQuery,
    nomineeRequest,
    familyMembers,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<FinancialAsset | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for adding/editing
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<AssetCategory>('Banking');
  const [formInstitution, setFormInstitution] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formAccountRef, setFormAccountRef] = useState('');
  const [formEvidence, setFormEvidence] = useState('');
  const [formConfidence, setFormConfidence] = useState(90);
  const [formNominee, setFormNominee] = useState('');

  // Category filter list
  const categories = ['All', 'Banking', 'EPF', 'Insurance', 'Mutual Funds', 'Investments'];

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = filterCategory === 'All' || asset.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.maskedAccountRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified':
      case 'Approved':
      case 'Recovered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            Verified
          </span>
        );
      case 'Unverified':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            Unverified
          </span>
        );
      case 'Potentially Discovered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            Potential
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            {status}
          </span>
        );
    }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultNominee = nomineeRequest.nomineeName || familyMembers.find((m) => m.isNominee)?.name || 'Designated Beneficiary';
    addAsset({
      name: formName,
      category: formCategory,
      institution: formInstitution,
      estimatedValue: Number(formValue) || 10000,
      maskedAccountRef: formAccountRef || 'XXXXXX' + Math.floor(1000 + Math.random() * 9000),
      evidenceSource: formEvidence || 'User self-reported registration',
      confidenceScore: formConfidence,
      verificationStatus: 'Unverified',
      nomineeName: formNominee || defaultNominee,
      linkedDocumentIds: [],
    });
    setShowAddModal(false);
    // Reset
    setFormName('');
    setFormInstitution('');
    setFormValue('');
    setFormAccountRef('');
    setFormEvidence('');
    setFormNominee('');
  };

  const handleStartClaimFromAsset = (asset: FinancialAsset) => {
    addClaim({
      assetId: asset.id,
      assetName: asset.name,
      institution: asset.institution,
      assetType: asset.category,
      amount: asset.estimatedValue,
      currentStage: 'Claim Submitted',
      progressPercentage: 60,
      submissionDate: 'Today',
      followUpDate: 'In 14 Days',
      readinessScore: 90,
      notes: `Claim auto-generated for ${asset.name} via Asset Discovery`,
      tasks: [
        { id: `t_${Date.now()}_1`, title: 'Verify KYC documentation with Branch', completed: true },
        { id: `t_${Date.now()}_2`, title: 'Submit Standard Form & Cancelled Cheque', completed: false },
      ],
      history: [
        { stage: 'Asset Discovered', date: asset.discoveryDate, description: asset.evidenceSource, completed: true },
        { stage: 'Verification Complete', date: 'Today', description: 'Institutional match validated', completed: true },
        { stage: 'Claim Submitted', date: 'Today', description: 'Claim lodged in tracker', completed: true },
        { stage: 'Under Verification', date: 'Pending', description: 'Awaiting officer processing', completed: false },
        { stage: 'Recovery Pending', date: 'Pending', description: 'Credit to bank account', completed: false },
      ],
    });
    setSelectedAsset(null);
    setActiveTab('tracker');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner (Replicating prototype header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Asset Discovery & Verification
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Your Potential Financial Assets</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Dormant bank balances, untouched EPF accounts, matured insurance, and unclaimed mutual fund folios.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Summary KPI Badges (Exact match with prototype: ₹2,52,500 Total Potential Value | 4 Assets identified) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#10283D] border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Potential Value</div>
            <div className="text-2xl font-black text-white">
              ₹{totalPotentialAssetsValue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="bg-[#10283D] border border-cyan-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assets Identified</div>
            <div className="text-2xl font-black text-white">
              {assetsDiscoveredCount} <span className="text-sm font-normal text-slate-400">Records Registered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1E3A5F] pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                : 'bg-[#10283D] text-slate-400 hover:text-white border border-[#1E3A5F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Asset List (Matching prototype cards: ABC Bank Savings, XYZ Fixed Deposit, EPF Account, etc.) */}
      <div className="space-y-3">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-[#10283D] hover:bg-[#13334E] border border-[#1E3A5F] hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group shadow-card"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {asset.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">
                    ₹{asset.estimatedValue.toLocaleString('en-IN')}
                  </span>
                  <span>•</span>
                  <span>{asset.institution}</span>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-slate-400">{asset.maskedAccountRef}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E3A5F]">
              {/* Status Badge */}
              <div>{getStatusBadge(asset.verificationStatus)}</div>

              {/* Confidence Score */}
              <div className="text-right">
                <div className="text-xs font-bold text-slate-200">{asset.confidenceScore}%</div>
                <div className="text-[10px] text-slate-400 uppercase">Match</div>
              </div>

              {/* View Button (Exact match from prototype) */}
              <button
                onClick={() => setSelectedAsset(asset)}
                className="px-3.5 py-1.5 rounded-xl bg-[#061525] hover:bg-emerald-500 hover:text-slate-950 text-slate-300 border border-[#1E3A5F] hover:border-emerald-500 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl max-w-lg w-full p-6 shadow-card animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">{selectedAsset.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-[#061525] border border-[#1E3A5F]">
                <span className="text-slate-400">Estimated Value</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  ₹{selectedAsset.estimatedValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Institution:</span>
                <span className="font-semibold text-white">{selectedAsset.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-cyan-300">{selectedAsset.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Masked Reference:</span>
                <span className="font-mono text-slate-200">{selectedAsset.maskedAccountRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evidence Source:</span>
                <span className="font-medium text-slate-300">{selectedAsset.evidenceSource}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Designated Nominee:</span>
                <span className="font-semibold text-white">{selectedAsset.nomineeName || 'Not Set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verification Status:</span>
                <span>{getStatusBadge(selectedAsset.verificationStatus)}</span>
              </div>

              {selectedAsset.notes && (
                <div className="p-2.5 rounded-xl bg-[#061525]/70 border border-[#1E3A5F] text-slate-300">
                  <span className="font-semibold text-slate-400 block mb-0.5">AI Discovery Notes:</span>
                  {selectedAsset.notes}
                </div>
              )}
            </div>

            {/* Quick Status toggle & Claim creation */}
            <div className="pt-2 border-t border-[#1E3A5F] space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    verifyAsset(selectedAsset.id, 'Verified');
                    setSelectedAsset({ ...selectedAsset, verificationStatus: 'Verified' });
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#061525] border border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs transition-all"
                >
                  Mark as Verified
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteAsset(selectedAsset.id);
                    setSelectedAsset(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs"
                  title="Delete Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleStartClaimFromAsset(selectedAsset)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all flex items-center justify-center gap-2"
              >
                <span>Initiate Recovery Claim</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl max-w-md w-full p-6 shadow-card animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add Financial Asset
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Canara Bank Dormant Savings"
                  className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AssetCategory)}
                    className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Banking">Banking</option>
                    <option value="EPF">EPF</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Investments">Investments</option>
                    <option value="Pension">Pension</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Institution</label>
                  <input
                    type="text"
                    required
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    placeholder="e.g. Canara Bank"
                    className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Masked Ref / A/C</label>
                  <input
                    type="text"
                    value={formAccountRef}
                    onChange={(e) => setFormAccountRef(e.target.value)}
                    placeholder="XXXXXX9081"
                    className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Designated Nominee</label>
                <input
                  type="text"
                  value={formNominee}
                  onChange={(e) => setFormNominee(e.target.value)}
                  placeholder={
                    nomineeRequest.nomineeName
                      ? `Default: ${nomineeRequest.nomineeName}`
                      : 'e.g. Designated Nominee'
                  }
                  className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Evidence Clue / Source</label>
                <input
                  type="text"
                  value={formEvidence}
                  onChange={(e) => setFormEvidence(e.target.value)}
                  placeholder="e.g. Found in old diary / tax receipt"
                  className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#061525] border border-[#1E3A5F] text-slate-300 text-xs"
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

