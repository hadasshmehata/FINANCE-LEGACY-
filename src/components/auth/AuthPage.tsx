import React, { useState } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Fingerprint,
  UploadCloud,
  Clock,
  AlertTriangle,
  Briefcase,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { NomineeAccessStatus } from '../../types';

export const AuthPage: React.FC = () => {
  const {
    login,
    registerNewUser,
    loginNomineeWithTarget,
    selectDemoProfile,
    nomineeRequest,
    uploadDeathCertificate,
    uploadRelationshipProof,
    simulateBiometricAuth,
  } = useApp();

  const [role, setRole] = useState<'primary' | 'nominee'>('primary');
  const [email, setEmail] = useState('ramesh.kumar@email.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Nominee Login specific fields
  const [targetOwnerEmail, setTargetOwnerEmail] = useState('ramesh.kumar@email.com');
  const [nomineeDeathCertFile, setNomineeDeathCertFile] = useState<string | null>(null);
  const [nomineeRelationFile, setNomineeRelationFile] = useState<string | null>(null);
  const [nomineeStatus, setNomineeStatus] = useState<NomineeAccessStatus>('Verification Pending');
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'primary' | 'nominee'>('primary');

  // Forgot password
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // 4 Demo Profiles for 1-Click Evaluation
  const demoList = [
    {
      key: 'ramesh' as const,
      name: 'Ramesh Kumar',
      age: 52,
      role: 'Salaried Employee',
      employer: 'ABC Technologies',
      nominee: 'Priya Kumar (Spouse)',
      badge: '₹2,52,500 Assets',
    },
    {
      key: 'priya' as const,
      name: 'Priya Sharma',
      age: 45,
      role: 'Small Business Owner',
      employer: 'Artisan Crafts Exports',
      nominee: 'Amit Sharma (Spouse)',
      badge: '₹4,45,000 Assets',
    },
    {
      key: 'arjun' as const,
      name: 'Arjun Reddy',
      age: 28,
      role: 'Software Engineer',
      employer: 'CloudTech Labs',
      nominee: 'Sunita Reddy (Mother)',
      badge: '₹5,45,000 Assets',
    },
    {
      key: 'meera' as const,
      name: 'Meera Patel',
      age: 61,
      role: 'Retired Teacher',
      employer: 'Govt School Pension',
      nominee: 'Rajesh Patel (Son)',
      badge: '₹6,98,000 Assets',
    },
  ];

  const handleRoleChange = (newRole: 'primary' | 'nominee') => {
    setRole(newRole);
    if (newRole === 'primary') {
      setEmail('ramesh.kumar@email.com');
    } else {
      setEmail('priya.k@email.com');
      setTargetOwnerEmail('ramesh.kumar@email.com');
    }
  };

  const handleBiometricAuth = async () => {
    setIsBiometricScanning(true);
    await simulateBiometricAuth();
    setIsBiometricScanning(false);
    setBiometricVerified(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#10B981', '#22D3EE'],
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'primary') {
      login('primary', email);
    } else {
      loginNomineeWithTarget(email, password, targetOwnerEmail);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;
    registerNewUser(regName.trim(), regEmail.trim(), regPassword, regRole);
  };

  const getStatusBadge = (status: NomineeAccessStatus) => {
    switch (status) {
      case 'Access Approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Access Approved
          </span>
        );
      case 'Verification Pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Verification Pending
          </span>
        );
      case 'Documents Required':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5" />
            Documents Required
          </span>
        );
      case 'Access Rejected':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Access Rejected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#061525] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background radial fintech glow effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl rounded-3xl bg-[#0B1E32]/95 border border-[#1E3A5F] shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Visual Hero Section (Branding + 4 Demo Profiles) */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-b from-[#0B1E32] via-[#081a2e] to-[#040f1a] border-b lg:border-b-0 lg:border-r border-[#1E3A5F]">
          <div>
            <Logo size="lg" showSubtitle={false} />
            <h1 className="mt-4 text-3xl font-extrabold text-white tracking-tight leading-tight">
              FINANCE <span className="text-emerald-400">LEGACY</span>
            </h1>
            <p className="mt-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Recover What Matters.
            </p>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              AI-Powered Forgotten Financial Asset Discovery & Recovery Platform. Transform scattered records into an organized family legacy with secure nominee succession.
            </p>
          </div>

          {/* Graphic with Family Silhouette & Glowing Tree */}
          <div className="my-5 relative w-full h-36 rounded-2xl overflow-hidden border border-emerald-500/30 bg-gradient-to-t from-emerald-950/60 via-[#061525] to-transparent p-3 flex flex-col justify-end items-center">
            <div className="absolute top-2 w-20 h-20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-400/20 blur-lg animate-pulse" />
              <svg viewBox="0 0 100 100" className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                <circle cx="50" cy="35" r="22" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="2.5" />
                <path d="M50 30V75" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M50 45L35 35" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M50 48L65 37" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="44" y="72" width="3.5" height="14" rx="1.5" fill="#22D3EE" />
                <rect x="50" y="68" width="3.5" height="18" rx="1.5" fill="#10B981" />
                <rect x="56" y="64" width="3.5" height="22" rx="1.5" fill="#34D399" />
              </svg>
            </div>

            {/* Silhouette of Family */}
            <div className="relative z-10 flex items-end gap-2.5 pb-1 opacity-90">
              <div className="w-3.5 h-12 bg-slate-900 rounded-t-full relative">
                <div className="w-3 h-3 bg-slate-900 rounded-full absolute -top-3.5 left-0.5" />
              </div>
              <div className="w-2.5 h-7 bg-slate-900 rounded-t-full relative">
                <div className="w-2 h-2 bg-slate-900 rounded-full absolute -top-2.5 left-0.5" />
              </div>
              <div className="w-3.5 h-10 bg-slate-900 rounded-t-full relative">
                <div className="w-3 h-3 bg-slate-900 rounded-full absolute -top-3.5 left-0.5" />
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-glow-emerald" />
          </div>

          {/* Multi-User Demo Profiles Switcher (Requirement 3 & 4) */}
          <div className="p-3.5 rounded-2xl bg-[#10283D] border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>4 Fictional Demonstration Profiles</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">1-Click Test</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoList.map((demo) => (
                <button
                  key={demo.key}
                  type="button"
                  onClick={() => selectDemoProfile(demo.key)}
                  className="p-2.5 rounded-xl bg-[#061525] border border-[#1E3A5F] hover:border-emerald-400/60 text-left transition-all group hover:bg-[#0B1E32]"
                >
                  <div className="flex items-center justify-between font-bold text-white text-[11px] group-hover:text-emerald-300">
                    <span>{demo.name} ({demo.age})</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{demo.role}</p>
                  <div className="flex items-center justify-between text-[9px] mt-1">
                    <span className="text-cyan-300 font-semibold">{demo.badge}</span>
                    <span className="text-slate-500">Demo</span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 mt-2 text-center">
              ⚠️ Demonstration accounts only. Their financial data never copies into real registered accounts.
            </p>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>256-Bit Financial Encryption • Strict Account-Level Data Isolation</span>
          </div>
        </div>

        {/* Right Form Card Section (Dual Login & Registration) */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center bg-[#10283D]">
          {!isRegistering ? (
            /* Login Form */
            <div>
              <div className="text-center mb-5">
                <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
                <p className="text-xs text-slate-400 mt-0.5">Login to access your financial legacy</p>
              </div>

              {/* User Login vs Nominee Login Pill Tabs */}
              <div className="flex rounded-full bg-[#061525] p-1 mb-5 border border-[#1E3A5F]">
                <button
                  type="button"
                  onClick={() => handleRoleChange('primary')}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    role === 'primary'
                      ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  User Login
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('nominee')}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    role === 'nominee'
                      ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Nominee Login
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-3.5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {role === 'primary' ? 'Registered User Email' : "Nominee's Registered Email"}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'primary' ? 'ramesh.kumar@email.com' : 'priya.k@email.com'}
                      className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {role === 'primary' ? 'Account Password' : 'Separate Nominee Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* ADDITIONAL NOMINEE FIELDS (Requirement 1B & 7) */}
                {role === 'nominee' && (
                  <div className="p-3 rounded-2xl bg-[#061525] border border-cyan-500/40 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-[#1E3A5F]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        Nominee Authorization Workflow
                      </span>
                      {getStatusBadge(nomineeStatus)}
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1 font-semibold">
                        Target Asset Owner Email
                      </label>
                      <input
                        type="email"
                        required
                        value={targetOwnerEmail}
                        onChange={(e) => setTargetOwnerEmail(e.target.value)}
                        placeholder="ramesh.kumar@email.com"
                        className="w-full bg-[#10283D] border border-[#1E3A5F] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Death certificate upload */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <label className="cursor-pointer p-2 rounded-lg bg-[#10283D] border border-[#1E3A5F] hover:border-cyan-400/50 flex items-center justify-between text-slate-300 truncate">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setNomineeDeathCertFile(e.target.files[0].name);
                              uploadDeathCertificate({ deceasedName: targetOwnerEmail.split('@')[0] });
                              setNomineeStatus('Verification Pending');
                            }
                          }}
                        />
                        <span className="truncate">{nomineeDeathCertFile || 'Death Certificate'}</span>
                        <UploadCloud className="w-3.5 h-3.5 text-cyan-400 ml-1 flex-shrink-0" />
                      </label>

                      <label className="cursor-pointer p-2 rounded-lg bg-[#10283D] border border-[#1E3A5F] hover:border-cyan-400/50 flex items-center justify-between text-slate-300 truncate">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setNomineeRelationFile(e.target.files[0].name);
                              uploadRelationshipProof({ documentType: 'Aadhaar / Legal Heir Cert' });
                            }
                          }}
                        />
                        <span className="truncate">{nomineeRelationFile || 'Relationship Proof'}</span>
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400 ml-1 flex-shrink-0" />
                      </label>
                    </div>

                    <p className="text-[9px] text-slate-400 leading-tight">
                      * Simulated verification for prototype demonstration. Assets remain locked until authorization approval.
                    </p>
                  </div>
                )}

                {/* Biometric Passkey Button (Requirement 1A & 1B) */}
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  disabled={isBiometricScanning}
                  className={`w-full py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    biometricVerified
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#061525] border-cyan-500/40 text-cyan-300 hover:bg-[#0B1E32]'
                  }`}
                >
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  <span>
                    {isBiometricScanning
                      ? 'Scanning Touch ID / Passkey...'
                      : biometricVerified
                      ? 'Biometric Authenticated ✓'
                      : 'Biometric Authentication (WebAuthn)'}
                  </span>
                </button>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#1E3A5F] bg-[#061525] text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                    />
                    Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 mt-1"
                >
                  <span>{role === 'primary' ? 'Login to Legacy Dashboard' : 'Authenticate Nominee Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1E3A5F]" />
                </div>
                <span className="relative bg-[#10283D] px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  OR
                </span>
              </div>

              {/* Create Account Button (Requirement 2 & 4) */}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="w-full py-2.5 rounded-xl bg-[#061525] hover:bg-[#0B1E32] border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-bold text-xs transition-all shadow-sm"
              >
                Register New User (Starts with Empty Profile)
              </button>
            </div>
          ) : (
            /* Registration Form */
            <div className="animate-in fade-in">
              <div className="text-center mb-5">
                <h2 className="text-2xl font-extrabold text-white">Create New Account</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Starts with an empty financial profile & 5-step onboarding
                </p>
              </div>

              {/* Role selector for registration */}
              <div className="flex rounded-full bg-[#061525] p-1 mb-4 border border-[#1E3A5F]">
                <button
                  type="button"
                  onClick={() => setRegRole('primary')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                    regRole === 'primary' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Asset Owner (Primary)
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('nominee')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                    regRole === 'nominee' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Nominee / Beneficiary
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. vikram@domain.com"
                    className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Set Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-emerald-500 rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-[#061525] border border-[#1E3A5F] text-[10px] text-slate-300">
                  <span className="font-bold text-emerald-400 block mb-0.5">Strict Data Isolation Guarantee:</span>
                  Newly registered accounts start 100% blank. Fictional demo data from Ramesh or Priya will never appear.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all mt-1"
                >
                  Create Account & Start Onboarding
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-white mt-3"
              >
                Already registered? <span className="text-emerald-400 font-semibold">Login here</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-300 mb-4">
              Enter your email to receive a secure identity verification reset link.
            </p>
            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs mb-4 flex items-center gap-2 text-left">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Password reset link sent! Check your inbox.</span>
              </div>
            ) : (
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3.5 py-2 text-xs text-white mb-4 outline-none focus:border-cyan-400"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#061525] text-slate-300 text-xs hover:text-white border border-[#1E3A5F]"
              >
                Close
              </button>
              {!forgotSent && (
                <button
                  onClick={() => setForgotSent(true)}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
                >
                  Send Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
