import React, { useState } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Fingerprint,
  FileText,
  Shield,
  Send,
  Eye,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserPlus,
  Trash2,
  Edit2,
  FileCheck,
  Building,
  Coins,
  ChevronRight,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { AssetCategory, FamilyMember, NomineeAccessStatus } from '../../types';

export const NomineePortal: React.FC = () => {
  const {
    currentUser,
    activeRole,
    nomineeRequest,
    updateNomineeStatus,
    uploadDeathCertificate,
    uploadRelationshipProof,
    simulateBiometricAuth,
    assets,
    switchRole,
    setActiveTab,
    familyMembers,
    addFamilyMember,
    updateFamilyMemberPermission,
    approveNomineeAccess,
    rejectNomineeAccess,
  } = useApp();

  // Invite Nominee Form State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState<'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Other'>('Spouse');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberIsNominee, setNewMemberIsNominee] = useState(true);
  const [newMemberPerms, setNewMemberPerms] = useState<AssetCategory[]>(['Banking', 'EPF', 'Insurance']);

  // Death certificate upload simulation form
  const [deceasedName, setDeceasedName] = useState(nomineeRequest.targetUserName || currentUser.name || 'Asset Owner');
  const [dateOfDeath, setDateOfDeath] = useState('Jan 15, 2025');
  const [regNo, setRegNo] = useState('MCD/DTH/2025/90412');
  const [authority, setAuthority] = useState('Municipal Corporation of Delhi');
  const [deathCertFileName, setDeathCertFileName] = useState<string | null>(
    nomineeRequest.deathCertificateUploaded ? 'Official_Death_Certificate_MCD.pdf' : null
  );
  const [relationshipFileName, setRelationshipFileName] = useState<string | null>(
    nomineeRequest.relationshipProofUploaded ? 'Marriage_Certificate_Reg.pdf' : null
  );

  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isAuthenticatingBio, setIsAuthenticatingBio] = useState(false);
  const [bioSuccessMessage, setBioSuccessMessage] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#22D3EE', '#F59E0B'],
    });
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    addFamilyMember({
      name: newMemberName,
      relationship: newMemberRelation,
      email: newMemberEmail,
      phone: newMemberPhone,
      isNominee: newMemberIsNominee,
      accessPermissions: newMemberPerms,
      verificationStatus: newMemberIsNominee ? 'Verification Pending' : 'Not Requested',
    });

    triggerConfetti();
    setShowAddMemberModal(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
  };

  const toggleCategoryPerm = (cat: AssetCategory) => {
    if (newMemberPerms.includes(cat)) {
      setNewMemberPerms(newMemberPerms.filter((c) => c !== cat));
    } else {
      setNewMemberPerms([...newMemberPerms, cat]);
    }
  };

  const handleUploadCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingDoc(true);
    setTimeout(() => {
      uploadDeathCertificate({ deceasedName, dateOfDeath, regNo, authority });
      setDeathCertFileName('Official_Death_Certificate_MCD.pdf');
      setIsUploadingDoc(false);
      triggerConfetti();
    }, 1200);
  };

  const handleUploadRelation = () => {
    uploadRelationshipProof({ documentType: 'Marriage Certificate', verified: true });
    setRelationshipFileName('Marriage_Certificate_Reg.pdf');
    triggerConfetti();
  };

  const handleBiometricClick = async () => {
    setIsAuthenticatingBio(true);
    const success = await simulateBiometricAuth();
    setIsAuthenticatingBio(false);
    if (success) {
      setBioSuccessMessage(true);
      setTimeout(() => setBioSuccessMessage(false), 3500);
    }
  };

  const getStatusColor = (status: NomineeAccessStatus) => {
    switch (status) {
      case 'Access Approved':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Verification Pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Documents Required':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Access Rejected':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  // Filter assets permitted for nominee
  const permittedAssets = assets.filter((a) => {
    if (!nomineeRequest.permittedAssetCategories || nomineeRequest.permittedAssetCategories.length === 0) {
      return true;
    }
    return nomineeRequest.permittedAssetCategories.includes(a.category);
  });

  const totalPermittedValue = permittedAssets.reduce((sum, a) => sum + a.estimatedValue, 0);

  const isAccessApproved = nomineeRequest.status === 'Access Approved';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner with Perspective Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Nominee Access & Succession Fiduciary
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            {activeRole === 'primary'
              ? 'Family & Nominee Succession Management'
              : `Nominee Recovery Portal — Estate of ${nomineeRequest.targetUserName || 'Asset Owner'}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {activeRole === 'primary'
              ? 'Designate trusted beneficiaries, configure asset-class permissions, and authorize verified claims.'
              : 'Secure verification workflow for legal heirs and designated beneficiaries to recover assets.'}
          </p>
        </div>

        {/* Perspective Switcher */}
        <div className="flex items-center gap-2 bg-[#061525] p-1.5 rounded-2xl border border-[#1E3A5F]">
          <span className="text-[10px] text-slate-400 font-semibold px-2">View As:</span>
          <button
            onClick={() => switchRole('primary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRole === 'primary'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Primary User
          </button>
          <button
            onClick={() => switchRole('nominee')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeRole === 'nominee'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nominee View
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PERSPECTIVE A: PRIMARY USER VIEW (MANAGE FAMILY & NOMINEES) */}
      {/* ============================================================== */}
      {activeRole === 'primary' && (
        <div className="space-y-6">
          
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Family Members</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{familyMembers.length}</div>
              <span className="text-[10px] text-slate-400">Registered in family tree</span>
            </div>

            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Designated Nominees</span>
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-cyan-300">
                {familyMembers.filter((m) => m.isNominee).length}
              </div>
              <span className="text-[10px] text-cyan-400/80">Authorized beneficiaries</span>
            </div>

            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Access Status</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-sm font-extrabold text-amber-400 truncate">
                {nomineeRequest.status}
              </div>
              <span className="text-[10px] text-slate-400">
                {nomineeRequest.nomineeName ? `${nomineeRequest.nomineeName}'s request` : 'Active request'}
              </span>
            </div>

            <div className="bg-[#10283D] border border-[#1E3A5F] rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Protected Portfolio</span>
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-emerald-400">
                ₹{assets.reduce((sum, a) => sum + a.estimatedValue, 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Coverage across assets</span>
            </div>
          </div>

          {/* Family & Nominees Directory */}
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E3A5F] pb-4 mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Family Members & Nominee Registry
                </h2>
                <p className="text-xs text-slate-400">
                  Manage heir status, specify asset category access, and review pending succession petitions.
                </p>
              </div>

              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald flex items-center gap-2 self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Family Member</span>
              </button>
            </div>

            {familyMembers.length === 0 ? (
              <div className="p-8 text-center bg-[#061525]/60 rounded-2xl border border-dashed border-[#1E3A5F]">
                <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">No Family Members Added</h4>
                <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
                  Add your spouse, children, or parents to designate nominees and ensure seamless succession.
                </p>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
                >
                  Add First Member
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E3A5F] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 px-3">Member & Relationship</th>
                      <th className="pb-3 px-3">Contact</th>
                      <th className="pb-3 px-3">Nominee Status</th>
                      <th className="pb-3 px-3">Permitted Categories</th>
                      <th className="pb-3 px-3">Access Verification</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3A5F]/50 text-xs">
                    {familyMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-[#061525]/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-white">{member.name}</div>
                              <span className="text-[10px] text-slate-400">{member.relationship}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-slate-300">
                          <div>{member.email}</div>
                          {member.phone && <div className="text-[10px] text-slate-400">{member.phone}</div>}
                        </td>

                        <td className="py-3.5 px-3">
                          {member.isNominee ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3 h-3" />
                              Official Nominee
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20 w-max">
                              Family Member
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {member.accessPermissions && member.accessPermissions.length > 0 ? (
                              member.accessPermissions.map((cat) => (
                                <span
                                  key={cat}
                                  className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#061525] border border-[#1E3A5F] text-slate-300"
                                >
                                  {cat}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">None specified</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${getStatusColor(
                              member.verificationStatus
                            )}`}
                          >
                            <Clock className="w-3 h-3" />
                            {member.verificationStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {member.isNominee && member.verificationStatus !== 'Access Approved' && (
                              <button
                                onClick={() => {
                                  approveNomineeAccess(member.id);
                                  triggerConfetti();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition-all"
                              >
                                Approve Access
                              </button>
                            )}

                            {member.verificationStatus === 'Access Approved' && (
                              <button
                                onClick={() => rejectNomineeAccess(member.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-[10px] transition-all"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pending Succession Requests Card */}
          <div className="bg-[#10283D] border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-card">
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Active Succession Access Review</h3>
                  <p className="text-xs text-slate-400">
                    Beneficiary claim submitted for estate of {nomineeRequest.targetUserName}
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                  nomineeRequest.status
                )}`}
              >
                {nomineeRequest.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-4">
              <div className="p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Applicant</span>
                <div className="font-bold text-white text-sm">{nomineeRequest.nomineeName}</div>
                <div className="text-slate-400 text-[11px]">{nomineeRequest.nomineeEmail}</div>
                <div className="text-cyan-400 text-[11px] font-semibold mt-1">Relation: {nomineeRequest.relationship}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Submitted Verification Proofs
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Biometric Passkey:</span>
                    <span className={nomineeRequest.biometricVerified ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {nomineeRequest.biometricVerified ? '✓ Authenticated' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Relationship Proof:</span>
                    <span className={nomineeRequest.relationshipProofUploaded ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {nomineeRequest.relationshipProofUploaded ? '✓ Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Death Certificate:</span>
                    <span className={nomineeRequest.deathCertificateUploaded ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {nomineeRequest.deathCertificateUploaded ? '✓ OCR Extracted' : 'Required'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Requested Asset Categories
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {nomineeRequest.permittedAssetCategories.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-[10px] text-slate-400">
                  Estimated Access Value: <strong className="text-white">₹{totalPermittedValue.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            {/* Simulated forensic OCR card */}
            {nomineeRequest.deathCertificateDetails && (
              <div className="p-3.5 rounded-2xl bg-[#061525]/80 border border-emerald-500/30 text-xs mb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px] uppercase tracking-wider mb-2">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Simulated Forensic OCR Extraction Details (Demo Evaluation)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Deceased Name:</span>
                    <strong className="text-white">{nomineeRequest.deathCertificateDetails.deceasedName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date of Demise:</span>
                    <strong className="text-white">{nomineeRequest.deathCertificateDetails.dateOfDeath}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Registration No:</span>
                    <strong className="text-cyan-300 font-mono">{nomineeRequest.deathCertificateDetails.registrationNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Authority:</span>
                    <span className="text-slate-200">{nomineeRequest.deathCertificateDetails.issuingAuthority}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Decision Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#1E3A5F]">
              <span className="text-xs text-slate-400">
                Granting access unseals financial asset details and enables claim filings for the nominee.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {nomineeRequest.status !== 'Access Approved' ? (
                  <button
                    onClick={() => {
                      updateNomineeStatus('Access Approved');
                      triggerConfetti();
                    }}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Nominee Access</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateNomineeStatus('Restricted')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Revoke Access</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PERSPECTIVE B: NOMINEE VIEW (VERIFICATION & RECOVERY) */}
      {/* ============================================================== */}
      {activeRole === 'nominee' && (
        <div className="space-y-6">
          
          {/* STATE 1: ASSETS LOCKED (Pending Verification) */}
          {!isAccessApproved && (
            <div className="space-y-6">
              
              {/* Big Red/Amber Security Shield Banner */}
              <div className="bg-gradient-to-r from-[#1E1B18] via-[#1A2530] to-[#10283D] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-glow-gold/30">
                    <Lock className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Statutory Succession Protocol
                      </span>
                      <span className="text-xs text-slate-400">Security Clearance Required</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Deceased User Assets Locked — Verification & Review Pending
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                      In strict compliance with financial fiduciary regulations, accounts and policies registered under{' '}
                      <strong className="text-white">{nomineeRequest.targetUserName || 'the primary user'}</strong> remain
                      cryptographically sealed. Access is unlocked once biometric passkey verification and official death certificate review are verified.
                    </p>
                  </div>

                  {/* 1-Click Demo Evaluation Unlock */}
                  <div className="flex-shrink-0 pt-3 md:pt-0">
                    <button
                      onClick={() => {
                        updateNomineeStatus('Access Approved');
                        triggerConfetti();
                      }}
                      className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-glow-emerald flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>⚡ Demo: Instant Unlock</span>
                    </button>
                    <span className="text-[10px] text-slate-400 block text-center mt-1">Hackathon review bypass</span>
                  </div>
                </div>
              </div>

              {/* 5-Step Nominee Recovery Workflow */}
              <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  5-Step Succession Authorization Workflow
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-2xl bg-[#061525] border border-emerald-500/40 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Step 1</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="font-bold text-white mb-0.5">Nominee Credentials</div>
                    <p className="text-[11px] text-slate-400">Independent email & passkey</p>
                    <span className="mt-2 inline-block text-[10px] text-emerald-400 font-bold">✓ Completed</span>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-3.5 rounded-2xl bg-[#061525] border text-xs ${
                    nomineeRequest.biometricVerified ? 'border-emerald-500/40' : 'border-cyan-500/40'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">Step 2</span>
                      <Fingerprint className={`w-4 h-4 ${nomineeRequest.biometricVerified ? 'text-emerald-400' : 'text-cyan-400'}`} />
                    </div>
                    <div className="font-bold text-white mb-0.5">Biometric Authentication</div>
                    <p className="text-[11px] text-slate-400">Device WebAuthn passkey</p>
                    <button
                      onClick={handleBiometricClick}
                      disabled={isAuthenticatingBio || nomineeRequest.biometricVerified}
                      className="mt-2 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline block"
                    >
                      {nomineeRequest.biometricVerified
                        ? '✓ Authenticated'
                        : isAuthenticatingBio
                        ? 'Verifying...'
                        : 'Simulate Passkey'}
                    </button>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-3.5 rounded-2xl bg-[#061525] border text-xs ${
                    nomineeRequest.deathCertificateUploaded ? 'border-emerald-500/40' : 'border-amber-500/40'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-amber-400 uppercase">Step 3</span>
                      <FileText className={`w-4 h-4 ${nomineeRequest.deathCertificateUploaded ? 'text-emerald-400' : 'text-amber-400'}`} />
                    </div>
                    <div className="font-bold text-white mb-0.5">Death Certificate</div>
                    <p className="text-[11px] text-slate-400">Forensic OCR extraction</p>
                    <span className={`mt-2 inline-block text-[10px] font-bold ${
                      nomineeRequest.deathCertificateUploaded ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {nomineeRequest.deathCertificateUploaded ? '✓ Extracted' : 'Action Below'}
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-3.5 rounded-2xl bg-[#061525] border text-xs ${
                    nomineeRequest.relationshipProofUploaded ? 'border-emerald-500/40' : 'border-[#1E3A5F]'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Step 4</span>
                      <Users className={`w-4 h-4 ${nomineeRequest.relationshipProofUploaded ? 'text-emerald-400' : 'text-slate-400'}`} />
                    </div>
                    <div className="font-bold text-white mb-0.5">Relationship Proof</div>
                    <p className="text-[11px] text-slate-400">Aadhaar / Marriage proof</p>
                    <button
                      onClick={handleUploadRelation}
                      className="mt-2 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline block"
                    >
                      {nomineeRequest.relationshipProofUploaded ? '✓ Verified' : 'Submit Proof'}
                    </button>
                  </div>

                  {/* Step 5 */}
                  <div className="p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Step 5</span>
                      <Unlock className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="font-bold text-white mb-0.5">Access Authorization</div>
                    <p className="text-[11px] text-slate-400">Unlocks asset recovery</p>
                    <span className="mt-2 inline-block text-[10px] text-amber-400 font-bold">
                      {nomineeRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload Death Certificate & Forensic Verification Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card">
                  <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-cyan-400" />
                      Submit Death Certificate for Forensic Review
                    </h3>
                    <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Simulated OCR
                    </span>
                  </div>

                  <form onSubmit={handleUploadCertificate} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Deceased Account Holder Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={deceasedName}
                        onChange={(e) => setDeceasedName(e.target.value)}
                        className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Date of Demise</label>
                        <input
                          type="text"
                          required
                          value={dateOfDeath}
                          onChange={(e) => setDateOfDeath(e.target.value)}
                          className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Death Registration Certificate Number
                        </label>
                        <input
                          type="text"
                          required
                          value={regNo}
                          onChange={(e) => setRegNo(e.target.value)}
                          className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Issuing Municipal Authority / Registrar
                      </label>
                      <input
                        type="text"
                        required
                        value={authority}
                        onChange={(e) => setAuthority(e.target.value)}
                        className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-[#061525] border border-dashed border-[#1E3A5F] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-emerald-400" />
                        <div>
                          <span className="text-white font-medium block">
                            {deathCertFileName || 'Attach Death_Certificate_Scan.pdf'}
                          </span>
                          <span className="text-[10px] text-slate-400">PDF, JPG up to 10MB</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {deathCertFileName ? 'Attached' : 'Ready'}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploadingDoc}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-cyan transition-all flex items-center justify-center gap-2"
                    >
                      {isUploadingDoc ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                          <span>Processing Forensic Document Metadata...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload & Extract Forensic Certificate Details</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right side: Verification Status & Biometric Passkey */}
                <div className="lg:col-span-5 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-4">
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-emerald-400" />
                        Beneficiary Biometric Verification
                      </h3>
                      <span className="text-[10px] text-emerald-400">Passkey Ready</span>
                    </div>

                    <p className="text-xs text-slate-300 mb-4">
                      Nominees authenticate using client-side biometric sensors (TouchID, FaceID, or Windows Hello) to sign claim requests securely.
                    </p>

                    <div className="p-4 rounded-2xl bg-[#061525] border border-[#1E3A5F] text-center mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-2">
                        <Fingerprint className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-white mb-0.5">Device Biometric Authentication</div>
                      <p className="text-[10px] text-slate-400 mb-3">
                        Simulates WebAuthn ceremony. Raw biometric data is never transmitted.
                      </p>

                      <button
                        onClick={handleBiometricClick}
                        disabled={isAuthenticatingBio}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-cyan transition-all"
                      >
                        {isAuthenticatingBio
                          ? 'Prompting Biometric Sensor...'
                          : nomineeRequest.biometricVerified
                          ? '✓ Biometrics Verified'
                          : 'Verify Device Biometrics'}
                      </button>

                      {bioSuccessMessage && (
                        <div className="mt-2 text-[10px] font-bold text-emerald-400">
                          ✓ Biometric assertion verified successfully!
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Simulated Hackathon Environment: All verification models simulate real-world municipal records and WebAuthn signatures without accessing real government databases.
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-slate-400">
                    <span>Status: {nomineeRequest.status}</span>
                    <button
                      onClick={() => {
                        updateNomineeStatus('Access Approved');
                        triggerConfetti();
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <span>Approve Access</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: ASSETS UNLOCKED (Access Approved) */}
          {isAccessApproved && (
            <div className="space-y-6">
              
              {/* Green Unlocked Banner */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-[#10283D] to-[#0B1E32] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-7 shadow-glow-emerald/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Unlock className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          Succession Clearance Granted
                        </span>
                        <span className="text-xs text-slate-400">All Security Checks Passed</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                        Authorized Financial Assets of {nomineeRequest.targetUserName}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300">
                        You have verified succession rights to view and initiate claims on the authorized accounts below.
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Authorized Value</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                      ₹{totalPermittedValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Authorized Assets Grid */}
              <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card">
                <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Recoverable Asset Inventory ({permittedAssets.length} Accounts)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('letterGenerator')}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-cyan flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate Succession Petition</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permittedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-4 rounded-2xl bg-[#061525] border border-[#1E3A5F] hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10283D] text-cyan-300 border border-[#1E3A5F]">
                            {asset.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {asset.verificationStatus}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-0.5">{asset.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{asset.institution}</span>
                        </p>

                        <div className="p-2.5 rounded-xl bg-[#10283D] border border-[#1E3A5F] text-xs flex justify-between items-center mb-3">
                          <span className="text-slate-400 text-[11px]">Account / Ref:</span>
                          <span className="font-mono text-slate-200">{asset.maskedAccountRef}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#1E3A5F] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Estimated Sum</span>
                          <span className="text-base font-extrabold text-emerald-400">
                            ₹{asset.estimatedValue.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => setActiveTab('navigator')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-glow-emerald"
                        >
                          <span>Claim</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD FAMILY MEMBER / NOMINEE */}
      {/* ============================================================== */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl max-w-lg w-full p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                Add Family Member & Nominee
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Kumar"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Relationship</label>
                  <select
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value as any)}
                    className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child (Son/Daughter)</option>
                    <option value="Parent">Parent (Father/Mother)</option>
                    <option value="Sibling">Sibling (Brother/Sister)</option>
                    <option value="Other">Other Legal Heir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Independent Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya.kumar@email.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Nominees use their own credentials and can never access using your password.
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Designate as Official Nominee</span>
                  <span className="text-[10px] text-slate-400">
                    Enables beneficiary succession petition rights
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newMemberIsNominee}
                  onChange={(e) => setNewMemberIsNominee(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </div>

              {newMemberIsNominee && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Authorized Asset Classes
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Banking', 'EPF', 'Insurance', 'Investments', 'Pension', 'Mutual Funds'] as AssetCategory[]).map(
                      (cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => toggleCategoryPerm(cat)}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            newMemberPerms.includes(cat)
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold'
                              : 'bg-[#061525] border-[#1E3A5F] text-slate-400'
                          }`}
                        >
                          <span className="text-[11px] block">{cat}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E3A5F]">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#061525] hover:bg-[#0B1E32] text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald"
                >
                  Add Member & Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
