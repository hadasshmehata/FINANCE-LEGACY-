import React from 'react';
import { useApp } from './context/AppContext';
import { AuthPage } from './components/auth/AuthPage';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { DocumentScanner } from './components/scanner/DocumentScanner';
import { AssetDiscovery } from './components/assets/AssetDiscovery';
import { FootprintDetective } from './components/footprint/FootprintDetective';
import { GapIntelligence } from './components/gaps/GapIntelligence';
import { FinancialLegacyMap } from './components/legacyMap/FinancialLegacyMap';
import { ClaimNavigator } from './components/claimNavigator/ClaimNavigator';
import { ClaimTracker } from './components/claimTracker/ClaimTracker';
import { EpfoRecovery } from './components/epfo/EpfoRecovery';
import { FraudDetector } from './components/fraud/FraudDetector';
import { NomineePortal } from './components/nominee/NomineePortal';
import { ClaimLetterGenerator } from './components/letterGenerator/ClaimLetterGenerator';
import { LegacyScoreView } from './components/legacyScore/LegacyScoreView';
import { FinancialAssistant } from './components/assistant/FinancialAssistant';
import { DocumentVault } from './components/vault/DocumentVault';
import { SettingsView } from './components/settings/SettingsView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';

export const AppContent: React.FC = () => {
  const { isAuthenticated, activeTab, showOnboarding, setShowOnboarding } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'scanner':
        return <DocumentScanner />;
      case 'assets':
        return <AssetDiscovery />;
      case 'footprint':
        return <FootprintDetective />;
      case 'gaps':
        return <GapIntelligence />;
      case 'legacyMap':
        return <FinancialLegacyMap />;
      case 'navigator':
        return <ClaimNavigator />;
      case 'tracker':
        return <ClaimTracker />;
      case 'epfo':
        return <EpfoRecovery />;
      case 'fraud':
        return <FraudDetector />;
      case 'nominee':
        return <NomineePortal />;
      case 'letters':
        return <ClaimLetterGenerator />;
      case 'legacyScore':
        return <LegacyScoreView />;
      case 'assistant':
        return <FinancialAssistant />;
      case 'vault':
        return <DocumentVault />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#061525] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 5-Step Onboarding Wizard Modal for First-Time Users */}
      {showOnboarding && <OnboardingWizard onClose={() => setShowOnboarding(false)} />}

      {/* Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
