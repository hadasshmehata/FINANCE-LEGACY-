import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Lock,
  Download,
  RotateCcw,
  CheckCircle2,
  Fingerprint,
  Users,
  ChevronRight,
  Sparkles,
  Upload,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    resetDemoData,
    exportProfileBackup,
    importProfileBackup,
    clearChatHistory,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');

  // Form states synchronized with currentUser
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone || '+91 98765 43210');
  }, [currentUser]);

  // Notification toggles
  const [notifClaims, setNotifClaims] = useState(true);
  const [notifGaps, setNotifGaps] = useState(true);
  const [notifFraud, setNotifFraud] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = importProfileBackup(text);
        if (success) {
          setImportMessage('Backup restored successfully!');
        } else {
          setImportMessage('Failed to parse backup JSON. Invalid structure.');
        }
        setTimeout(() => setImportMessage(null), 4000);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Account & Security Settings
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Manage Your Financial Legacy Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Control personal information, biometric passkeys, nominee permissions, and encrypted backups for {currentUser.name}.
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Current Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Navigation Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
              activeSection === 'profile'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald/20'
                : 'bg-[#10283D] border-[#1E3A5F] text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Profile & Personal Information</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
              activeSection === 'security'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald/20'
                : 'bg-[#10283D] border-[#1E3A5F] text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Security & Passkeys</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
              activeSection === 'notifications'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald/20'
                : 'bg-[#10283D] border-[#1E3A5F] text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Alerts & Notifications</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveSection('privacy')}
            className={`w-full p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
              activeSection === 'privacy'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald/20'
                : 'bg-[#10283D] border-[#1E3A5F] text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Privacy & Encrypted Backups</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Column: Tab Content */}
        <div className="lg:col-span-8 bg-[#10283D] border border-[#1E3A5F] rounded-3xl p-5 sm:p-6 shadow-card">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-[#1E3A5F] pb-3 mb-4">
                <h3 className="text-sm font-bold text-white mb-1">Personal Profile Details</h3>
                <p className="text-xs text-slate-400">
                  Update your identity details. These will auto-populate claim petitions and KYC documents.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3.5 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3.5 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Primary Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#061525] border border-[#1E3A5F] rounded-xl px-3.5 py-2 text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {savedSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile updated and synchronized to storage!</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Authentication & Credentials</h3>
                <p className="text-xs text-slate-400 mb-4">Zero-knowledge proof authentication and passkey biometrics.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Biometric Passkey (WebAuthn / FIDO2)</h4>
                    <p className="text-[11px] text-slate-400">Unlock your financial vault via Windows Hello / Touch ID</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  Registered
                </span>
              </div>

              {/* Client-Side Zero-Knowledge Encryption Architecture Card */}
              <div className="p-5 rounded-2xl bg-[#0A2238] border border-emerald-500/40 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Client-Side Zero-Knowledge Architecture
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        PBKDF2 (100,000 Rounds) + WebCrypto AES-GCM 256-Bit
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    End-to-End Client Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 text-[11px]">
                  <div className="p-3 rounded-xl bg-[#061525] border border-[#1E3A5F] space-y-1">
                    <span className="font-bold text-white block">Client-Derived Keys</span>
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      Encryption keys are derived locally in browser memory via PBKDF2 using SHA-256 and unique user salts. Keys are never transmitted to any server or cloud API.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#061525] border border-[#1E3A5F] space-y-1">
                    <span className="font-bold text-white block">Zero Credential Storage</span>
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      Finance Legacy never stores bank passwords, MPINs, or debit card CVVs. Only read-only audit footprints and masked references are retained.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#061525] border border-[#1E3A5F] space-y-1">
                    <span className="font-bold text-white block">Cryptographic User Isolation</span>
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      Every registered user account maintains a distinct, cryptographically isolated storage compartment in IndexedDB / LocalStorage.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#061525] border border-[#1E3A5F] space-y-1">
                    <span className="font-bold text-white block">PII Redaction Engine</span>
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      Uploaded tax forms and bank statements pass through an in-memory client-side regex filter masking PAN, Aadhaar, and account digits before AI parsing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Assistant Chat Session</h4>
                  <p className="text-[11px] text-slate-400">Clear chat history and reset assistant memory</p>
                </div>
                <button
                  type="button"
                  onClick={clearChatHistory}
                  className="px-3 py-1.5 rounded-xl bg-[#10283D] border border-[#1E3A5F] text-slate-200 font-semibold text-xs hover:border-slate-500"
                >
                  Clear History
                </button>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Notification Preferences</h3>
                <p className="text-xs text-slate-400 mb-4">Choose what triggers real-time alerts and updates.</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-white">Claim Stage Progress Updates</h4>
                    <p className="text-[11px] text-slate-400">Get notified when an institution approves your claim</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifClaims}
                    onChange={(e) => setNotifClaims(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-white">Financial Gap Reminders</h4>
                    <p className="text-[11px] text-slate-400">Alerts when newly uploaded tax forms reveal unlinked accounts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifGaps}
                    onChange={(e) => setNotifGaps(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#061525] border border-[#1E3A5F] cursor-pointer">
                  <div>
                    <h4 className="text-xs font-bold text-white">Fraud Detector Live Alerts</h4>
                    <p className="text-[11px] text-slate-400">Real-time warning if incoming message resembles known recovery scam</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifFraud}
                    onChange={(e) => setNotifFraud(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Privacy & Data Control Section */}
          {activeSection === 'privacy' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Data Ownership & Portability</h3>
                <p className="text-xs text-slate-400 mb-4">Export full encrypted JSON snapshot or restore from backup.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Export Complete Financial Legacy Profile</h4>
                  <p className="text-[11px] text-slate-400">Download all assets, documents metadata, and claim files</p>
                </div>
                <button
                  type="button"
                  onClick={exportProfileBackup}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-emerald"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#061525] border border-[#1E3A5F] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Restore Profile from Backup File</h4>
                  <p className="text-[11px] text-slate-400">Upload a previously exported JSON profile snapshot</p>
                </div>
                <label className="px-4 py-2 rounded-xl bg-[#10283D] border border-cyan-500/40 text-cyan-300 hover:bg-[#13334E] font-bold text-xs flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                </label>
              </div>

              {importMessage && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
                  {importMessage}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#061525] border border-red-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-red-400">Reset Current Profile Data</h4>
                  <p className="text-[11px] text-slate-400">
                    Restores this profile to initial state without affecting other users or global settings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 font-bold text-xs border border-red-500/40 hover:bg-red-500/30"
                >
                  Reset Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl max-w-sm w-full p-6 shadow-card space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Reset This Profile?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to reset <strong>{currentUser.name}</strong>'s profile? This will restore initial demo/empty state for this user only. Other demo profiles and your application settings will be preserved.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#061525] text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow-glow-red"
              >
                Yes, Reset Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
