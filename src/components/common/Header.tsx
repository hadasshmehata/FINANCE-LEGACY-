import React, { useState } from 'react';
import {
  Search,
  Bell,
  Trophy,
  Shield,
  User,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeRole,
    switchRole,
    logout,
    searchQuery,
    setSearchQuery,
    notificationsCount,
    clearNotifications,
    activities,
    legacyScore,
    setActiveTab,
    activeDemoKey,
    selectDemoProfile,
    setShowOnboarding,
    registeredUsers,
    loginRegisteredUser,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-[#1E3A5F] bg-[#061525]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assets, claims, documents..."
          className="w-full bg-[#10283D]/80 border border-[#1E3A5F] focus:border-cyan-400/70 focus:ring-1 focus:ring-cyan-400/40 rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 outline-none transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        {/* Onboarding Wizard shortcut if needed */}
        {!currentUser.onboardingCompleted && (
          <button
            onClick={() => setShowOnboarding(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold shadow-glow-emerald/30 animate-pulse transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Onboarding (5 Steps)</span>
          </button>
        )}

        {/* Legacy Score Pill */}
        <button
          onClick={() => setActiveTab('legacyScore')}
          className="hidden sm:flex items-center gap-2 bg-[#10283D] border border-amber-500/40 hover:border-amber-400/70 rounded-full px-3 py-1 text-xs text-amber-300 shadow-glow-gold/20 transition-all group"
          title="View Financial Legacy Score Breakdown"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-white">Score:</span>
          <span className="font-bold text-amber-400">{legacyScore}/100</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
              if (!showNotifications) clearNotifications();
            }}
            className="relative p-2 rounded-xl bg-[#10283D] border border-[#1E3A5F] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#10283D] border border-[#1E3A5F] rounded-2xl shadow-card p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E3A5F]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  Live Activity & Alerts
                </h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="p-2 rounded-lg bg-[#061525]/60 border border-[#1E3A5F]/50 flex items-start gap-2.5 text-xs">
                    {act.type === 'discovery' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />}
                    {act.type === 'claim' && <Shield className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />}
                    {act.type === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />}
                    {(act.type === 'upload' || act.type === 'verification') && <RefreshCw className="w-3.5 h-3.5 text-emerald-300 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-slate-200 text-[11px] leading-snug">{act.title}</p>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#10283D] border border-[#1E3A5F] hover:border-emerald-500/50 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-medium leading-none">
                {activeRole === 'primary' ? 'Primary User' : 'Nominee'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#10283D] border border-[#1E3A5F] rounded-2xl shadow-card p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-[#1E3A5F]">
                <p className="text-xs font-bold text-white">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                {currentUser.occupation && (
                  <p className="text-[10px] text-cyan-300 truncate mt-0.5">{currentUser.occupation}</p>
                )}
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {currentUser.isDemoUser ? 'Demonstration Account' : 'Registered Account'}
                </span>
              </div>

              {/* Registered Real Accounts Switcher */}
              {registeredUsers && registeredUsers.length > 0 && (
                <div className="py-2 border-b border-[#1E3A5F] space-y-1">
                  <p className="text-[10px] font-bold text-emerald-400 px-3 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Registered Real Accounts</span>
                  </p>
                  {registeredUsers.map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => {
                        loginRegisteredUser(reg.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1 rounded-lg text-xs flex items-center justify-between ${
                        currentUser.id === reg.id && !currentUser.isDemoUser
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'text-slate-300 hover:bg-[#1E3A5F]'
                      }`}
                    >
                      <span className="truncate">{reg.name} (Real)</span>
                      {currentUser.id === reg.id && !currentUser.isDemoUser && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* 4 Demo Profiles Switcher (Requirement 3) */}
              <div className="py-2 border-b border-[#1E3A5F] space-y-1">
                <p className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Switch Demo Profile</span>
                </p>
                <button
                  onClick={() => {
                    selectDemoProfile('ramesh');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1 rounded-lg text-xs flex items-center justify-between ${
                    activeDemoKey === 'ramesh' && currentUser.isDemoUser ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-[#1E3A5F]'
                  }`}
                >
                  <span>Ramesh Kumar (52, Salaried)</span>
                  {activeDemoKey === 'ramesh' && currentUser.isDemoUser && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => {
                    selectDemoProfile('priya');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1 rounded-lg text-xs flex items-center justify-between ${
                    activeDemoKey === 'priya' && currentUser.isDemoUser ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-[#1E3A5F]'
                  }`}
                >
                  <span>Priya Sharma (45, Business)</span>
                  {activeDemoKey === 'priya' && currentUser.isDemoUser && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => {
                    selectDemoProfile('arjun');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1 rounded-lg text-xs flex items-center justify-between ${
                    activeDemoKey === 'arjun' && currentUser.isDemoUser ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-[#1E3A5F]'
                  }`}
                >
                  <span>Arjun Reddy (28, Software Eng)</span>
                  {activeDemoKey === 'arjun' && currentUser.isDemoUser && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => {
                    selectDemoProfile('meera');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1 rounded-lg text-xs flex items-center justify-between ${
                    activeDemoKey === 'meera' && currentUser.isDemoUser ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-[#1E3A5F]'
                  }`}
                >
                  <span>Meera Patel (61, Retired)</span>
                  {activeDemoKey === 'meera' && currentUser.isDemoUser && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>

              {/* Role Toggle */}
              <div className="py-2 border-b border-[#1E3A5F] space-y-1">
                <p className="text-[10px] font-semibold text-slate-400 px-3 uppercase tracking-wider">
                  Role Perspective
                </p>
                <button
                  onClick={() => {
                    switchRole('primary');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    activeRole === 'primary' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-[#1E3A5F]'
                  }`}
                >
                  <span>Asset Owner (Primary)</span>
                  {activeRole === 'primary' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => {
                    switchRole('nominee');
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                    activeRole === 'nominee' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-[#1E3A5F]'
                  }`}
                >
                  <span>Nominee Portal</span>
                  {activeRole === 'nominee' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>

              {/* Quick Settings & Logout */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setShowOnboarding(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Onboarding Wizard (5 Steps)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-[#1E3A5F] transition-colors"
                >
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
