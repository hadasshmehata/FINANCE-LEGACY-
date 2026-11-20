import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileSearch,
  Coins,
  Footprints,
  Compass,
  FileCheck,
  Building2,
  ShieldAlert,
  Users,
  Bot,
  FolderArchive,
  Settings,
  GitFork,
  FileText,
  Trophy,
  Radar,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeRole, assets, claims, gaps } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingGaps = gaps.filter(g => !g.resolved).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Document Scanner', icon: FileSearch },
    { id: 'assets', label: 'Asset Discovery', icon: Coins, count: assets.length },
    { id: 'footprint', label: 'Financial Footprint', icon: Footprints },
    { id: 'gaps', label: 'Gap Intelligence', icon: Radar, count: pendingGaps > 0 ? pendingGaps : undefined, badgeColor: 'bg-amber-500' },
    { id: 'legacyMap', label: 'Financial Legacy Map', icon: GitFork },
    { id: 'navigator', label: 'Claim Navigator', icon: Compass },
    { id: 'tracker', label: 'Claim Tracker', icon: FileCheck, count: claims.length },
    { id: 'epfo', label: 'EPFO Recovery', icon: Building2 },
    { id: 'fraud', label: 'Fraud Detector', icon: ShieldAlert },
    { id: 'nominee', label: 'Nominee Access', icon: Users, roleNotice: activeRole === 'nominee' },
    { id: 'letters', label: 'Claim Letters', icon: FileText },
    { id: 'legacyScore', label: 'Legacy Score', icon: Trophy },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'vault', label: 'Document Vault', icon: FolderArchive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-emerald-500 text-slate-900 shadow-glow-emerald flex items-center justify-center font-bold"
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#061525] border-r border-[#1E3A5F] flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-[#1E3A5F] px-4 flex items-center justify-between">
          <div className="overflow-hidden">
            <Logo size={collapsed ? 'sm' : 'md'} showSubtitle={!collapsed} />
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#10283D] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#10283D]/80'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    isActive ? 'text-emerald-400 scale-110' : 'text-slate-400 group-hover:text-cyan-400'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor
                        ? `${item.badgeColor} text-slate-900`
                        : 'bg-[#10283D] text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full shadow-glow-emerald" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Status Card */}
        {!collapsed && (
          <div className="p-3 border-t border-[#1E3A5F]">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#10283D] to-[#0B1E32] border border-cyan-500/20 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                  Secure Vault Active
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Client-side encrypted. No banking credentials stored.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

