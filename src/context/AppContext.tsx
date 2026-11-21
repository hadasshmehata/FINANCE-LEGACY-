import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  UserRole,
  FinancialAsset,
  Claim,
  DocumentItem,
  FinancialGap,
  FootprintRecord,
  NomineeRequest,
  FraudAnalysisResult,
  ClaimLetter,
  ChatMessage,
  ActivityItem,
  ClaimStage,
  VerificationStatus,
  AssetCategory,
  ExtractedFinancialEntity,
  FamilyMember,
  NomineeAccessStatus,
} from '../types';
import {
  demoProfilesMap,
  demoRamesh,
  demoPriya,
  demoArjun,
  demoMeera,
} from '../data/demoProfiles';
import { initialLetters, initialChatMessages } from '../data/initialData';
import { StorageService, UserProfileData, createEmptyProfileData, RegisteredAccount } from '../services/storageService';
import { queryFinancialAssistant, AssistantContext } from '../services/aiAssistantService';

interface AppContextType {
  // Auth & User
  currentUser: UserProfile;
  isAuthenticated: boolean;
  activeRole: UserRole;
  login: (role: UserRole, email?: string, password?: string) => void;
  registerNewUser: (name: string, email: string, password?: string, role?: UserRole) => void;
  loginNomineeWithTarget: (nomineeEmail: string, nomineePassword: string, targetUserEmail: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Registered Real Accounts
  registeredUsers: RegisteredAccount[];
  loginRegisteredUser: (userId: string) => void;
  deleteRegisteredUser: (userId: string) => void;

  // Demo Profiles
  activeDemoKey: string;
  selectDemoProfile: (key: 'ramesh' | 'priya' | 'arjun' | 'meera') => void;

  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  completeOnboarding: () => void;

  // Family & Nominee Management
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMemberPermission: (id: string, permissions: AssetCategory[]) => void;
  approveNomineeAccess: (nomineeId: string) => void;
  rejectNomineeAccess: (nomineeId: string) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Assets
  assets: FinancialAsset[];
  addAsset: (asset: Omit<FinancialAsset, 'id' | 'discoveryDate'>) => void;
  updateAsset: (id: string, updates: Partial<FinancialAsset>) => void;
  deleteAsset: (id: string) => void;
  verifyAsset: (id: string, status: VerificationStatus) => void;

  // Claims
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'claimReferenceNumber'>) => void;
  updateClaimStage: (id: string, stage: ClaimStage) => void;
  toggleClaimTask: (claimId: string, taskId: string) => void;
  addClaimTask: (claimId: string, title: string, dueDate?: string) => void;

  // Documents
  documents: DocumentItem[];
  uploadDocument: (file: { name: string; size: string; category: any; extractedData?: any }) => void;
  deleteDocument: (id: string) => void;
  linkDocumentToAsset: (docId: string, assetId: string) => void;

  // Gaps
  gaps: FinancialGap[];
  resolveGap: (id: string) => void;

  // Footprint
  footprint: FootprintRecord;
  updateFootprint: (newFootprint: Partial<FootprintRecord>) => void;
  analyzeFootprintAI: () => void;
  isAnalyzingFootprint: boolean;

  // Nominee Portal
  nomineeRequest: NomineeRequest;
  updateNomineeStatus: (status: NomineeAccessStatus) => void;
  uploadDeathCertificate: (details: any) => void;
  uploadRelationshipProof: (details: any) => void;
  simulateBiometricAuth: () => Promise<boolean>;

  // Fraud Detector
  fraudScans: FraudAnalysisResult[];
  analyzeFraudText: (text: string) => FraudAnalysisResult;

  // Claim Letters
  claimLetters: ClaimLetter[];
  addClaimLetter: (letter: Omit<ClaimLetter, 'id' | 'dateGenerated'>) => void;

  // AI Assistant Chat
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isAiTyping: boolean;
  clearChatHistory: () => void;
  aiEngineSource: 'gemini-api' | 'local-intelligence';

  // Score & Metrics
  legacyScore: number;
  totalPotentialAssetsValue: number;
  assetsDiscoveredCount: number;
  claimsCount: number;
  readinessScore: number;
  recoveryProgress: number;

  // Activities & Notifications
  activities: ActivityItem[];
  addActivity: (title: string, type: ActivityItem['type']) => void;
  notificationsCount: number;
  clearNotifications: () => void;

  // Reset & Backup
  resetDemoData: () => void;
  exportProfileBackup: () => void;
  importProfileBackup: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load global application settings
  const initialSettings = StorageService.loadSettings();
  const [activeDemoKey, setActiveDemoKey] = useState<string>(initialSettings.activeDemoKey);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialSettings.isAuthenticated);
  const [activeRole, setActiveRole] = useState<UserRole>(initialSettings.activeRole);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial user profile data loaded from storage service
  const initialProfileData = StorageService.loadProfileData(initialSettings.activeUserId, initialSettings.activeDemoKey);

  const [currentUser, setCurrentUser] = useState<UserProfile>(initialProfileData.user);
  const [assets, setAssets] = useState<FinancialAsset[]>(initialProfileData.assets);
  const [claims, setClaims] = useState<Claim[]>(initialProfileData.claims);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialProfileData.documents);
  const [gaps, setGaps] = useState<FinancialGap[]>(initialProfileData.gaps);
  const [footprint, setFootprint] = useState<FootprintRecord>(initialProfileData.footprint);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialProfileData.familyMembers);
  const [nomineeRequest, setNomineeRequest] = useState<NomineeRequest>(initialProfileData.nomineeRequest);
  const [fraudScans, setFraudScans] = useState<FraudAnalysisResult[]>(initialProfileData.fraudScans);
  const [claimLetters, setClaimLetters] = useState<ClaimLetter[]>(initialProfileData.claimLetters);
  const [messages, setMessages] = useState<ChatMessage[]>(initialProfileData.chatMessages);
  const [activities, setActivities] = useState<ActivityItem[]>(initialProfileData.activities);
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() =>
    StorageService.getRegisteredAccounts()
  );

  const [isAnalyzingFootprint, setIsAnalyzingFootprint] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiEngineSource, setAiEngineSource] = useState<'gemini-api' | 'local-intelligence'>('local-intelligence');
  const [notificationsCount, setNotificationsCount] = useState<number>(2);

  // Prevent saving during profile transition
  const isSwitchingProfileRef = useRef(false);

  // Sync settings when auth/role/demokey changes
  useEffect(() => {
    StorageService.saveSettings({
      activeDemoKey,
      activeRole,
      isAuthenticated,
      activeUserId: currentUser.id,
    });
  }, [activeDemoKey, activeRole, isAuthenticated, currentUser.id]);

  // Unified Centralized Profile Persistence: save to StorageService whenever profile state changes
  useEffect(() => {
    if (isSwitchingProfileRef.current) return;
    if (!currentUser || !currentUser.id) return;

    StorageService.saveProfileData(currentUser.id, {
      user: currentUser,
      assets,
      claims,
      documents,
      gaps,
      footprint,
      familyMembers,
      nomineeRequest,
      activities,
      chatMessages: messages,
      claimLetters,
      fraudScans,
      version: 2,
      lastUpdated: new Date().toISOString(),
    });
  }, [
    currentUser,
    assets,
    claims,
    documents,
    gaps,
    footprint,
    familyMembers,
    nomineeRequest,
    activities,
    messages,
    claimLetters,
    fraudScans,
  ]);

  // Derived Metrics
  const totalPotentialAssetsValue = assets.reduce((sum, a) => sum + a.estimatedValue, 0);
  const assetsDiscoveredCount = assets.length;
  const claimsCount = claims.length;

  const verifiedAssetsCount = assets.filter(
    (a) => a.verificationStatus === 'Verified' || a.verificationStatus === 'Approved' || a.verificationStatus === 'Recovered'
  ).length;
  const docsCount = documents.length;
  const resolvedGapsCount = gaps.filter((g) => g.resolved).length;

  // Dynamic Financial Legacy Score
  const legacyScore =
    assets.length === 0 && documents.length === 0
      ? currentUser.onboardingCompleted
        ? 40
        : 15
      : Math.min(
          100,
          Math.round(
            (docsCount >= 3 ? 25 : docsCount * 8) +
              (assets.length > 0 ? (verifiedAssetsCount / assets.length) * 35 : 0) +
              (claims.length >= 3 ? 20 : claims.length * 6) +
              (resolvedGapsCount > 0 ? 12 : 5) +
              (nomineeRequest.relationshipProofUploaded ? 8 : 0)
          )
        );

  const readinessScore = assets.length === 0 ? 0 : Math.min(100, Math.round((verifiedAssetsCount / (assets.length || 1)) * 92));
  const recoveryProgress = claims.length === 0 ? 0 : 72;

  // ==========================================
  // PROFILE SWITCHING (ISOLATED DATASETS)
  // ==========================================
  const selectDemoProfile = (key: 'ramesh' | 'priya' | 'arjun' | 'meera') => {
    isSwitchingProfileRef.current = true;
    setActiveDemoKey(key);

    const demoKey = key;
    const targetUserId = `demo_${demoKey}`;
    const loadedData = StorageService.loadProfileData(targetUserId, demoKey);

    setCurrentUser(loadedData.user);
    setAssets(loadedData.assets);
    setClaims(loadedData.claims);
    setDocuments(loadedData.documents);
    setGaps(loadedData.gaps);
    setFootprint(loadedData.footprint);
    setFamilyMembers(loadedData.familyMembers);
    setNomineeRequest(loadedData.nomineeRequest);
    setActivities(loadedData.activities);
    setMessages(loadedData.chatMessages);
    setClaimLetters(loadedData.claimLetters);
    setFraudScans(loadedData.fraudScans);

    setActiveRole('primary');
    setIsAuthenticated(true);
    setShowOnboarding(false);

    // Save active settings
    StorageService.saveSettings({
      activeDemoKey: key,
      activeRole: 'primary',
      isAuthenticated: true,
      activeUserId: targetUserId,
    });

    setTimeout(() => {
      isSwitchingProfileRef.current = false;
    }, 100);

    addActivity(`Loaded Demo Profile: ${loadedData.user.name} (${loadedData.user.occupation})`, 'alert');
  };

  // ==========================================
  // REAL REGISTERED USERS MANAGEMENT
  // ==========================================
  const loginRegisteredUser = (userId: string) => {
    isSwitchingProfileRef.current = true;
    const profileData = StorageService.loadProfileData(userId);

    setCurrentUser(profileData.user);
    setAssets(profileData.assets);
    setClaims(profileData.claims);
    setDocuments(profileData.documents);
    setGaps(profileData.gaps);
    setFootprint(profileData.footprint);
    setFamilyMembers(profileData.familyMembers);
    setNomineeRequest(profileData.nomineeRequest);
    setActivities(profileData.activities);
    setMessages(profileData.chatMessages);
    setClaimLetters(profileData.claimLetters);
    setFraudScans(profileData.fraudScans);

    setActiveRole(profileData.user.role || 'primary');
    setIsAuthenticated(true);
    setActiveDemoKey('custom');

    StorageService.saveSettings({
      activeDemoKey: 'custom',
      activeRole: profileData.user.role || 'primary',
      isAuthenticated: true,
      activeUserId: userId,
    });

    setTimeout(() => {
      isSwitchingProfileRef.current = false;
    }, 100);

    if (!profileData.user.onboardingCompleted && profileData.user.role === 'primary') {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }

    addActivity(`Logged in as Real Asset Owner: ${profileData.user.name} (${profileData.user.email})`, 'alert');
  };

  const deleteRegisteredUser = (userId: string) => {
    StorageService.deleteRegisteredAccount(userId);
    setRegisteredAccounts(StorageService.getRegisteredAccounts());
    if (currentUser.id === userId) {
      selectDemoProfile('ramesh');
    }
    addActivity('Registered user account removed from system', 'alert');
  };

  // ==========================================
  // REGISTER NEW REAL USER (STARTS COMPLETELY EMPTY)
  // ==========================================
  const registerNewUser = (name: string, email: string, password?: string, role: UserRole = 'primary') => {
    isSwitchingProfileRef.current = true;
    const cleanEmail = email.trim().toLowerCase();
    const newUserId = `usr_real_${Date.now()}`;
    const newUser: UserProfile = {
      id: newUserId,
      name,
      email: cleanEmail,
      role,
      isDemoUser: false,
      onboardingCompleted: false,
      biometricRegistered: false,
      familyMembers: [],
    };

    const emptyData = createEmptyProfileData(newUser);
    StorageService.saveProfileData(newUserId, emptyData);

    const newAccount: RegisteredAccount = {
      id: newUserId,
      name,
      email: cleanEmail,
      password: password || 'password123',
      role,
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
    };
    StorageService.saveRegisteredAccount(newAccount);
    setRegisteredAccounts(StorageService.getRegisteredAccounts());

    setCurrentUser(emptyData.user);
    setAssets(emptyData.assets);
    setClaims(emptyData.claims);
    setDocuments(emptyData.documents);
    setGaps(emptyData.gaps);
    setFootprint(emptyData.footprint);
    setFamilyMembers(emptyData.familyMembers);
    setNomineeRequest(emptyData.nomineeRequest);
    setActivities(emptyData.activities);
    setMessages(emptyData.chatMessages);
    setClaimLetters(emptyData.claimLetters);
    setFraudScans(emptyData.fraudScans);

    setActiveRole(role);
    setIsAuthenticated(true);
    setActiveDemoKey('custom');

    StorageService.saveSettings({
      activeDemoKey: 'custom',
      activeRole: role,
      isAuthenticated: true,
      activeUserId: newUserId,
    });

    setTimeout(() => {
      isSwitchingProfileRef.current = false;
    }, 100);

    if (role === 'primary') {
      setShowOnboarding(true);
    }

    addActivity(`New real asset owner registered: ${name}. Starting with empty financial profile.`, 'alert');
  };

  // Nominee Login with Target User Verification workflow
  const loginNomineeWithTarget = (nomineeEmail: string, nomineePassword: string, targetUserEmail: string) => {
    let targetName = 'Ramesh Kumar';
    let targetProfile = demoRamesh;

    if (targetUserEmail.toLowerCase().includes('priya.sharma') || targetUserEmail.toLowerCase().includes('priya')) {
      targetName = 'Priya Sharma';
      targetProfile = demoPriya;
    } else if (targetUserEmail.toLowerCase().includes('arjun')) {
      targetName = 'Arjun Reddy';
      targetProfile = demoArjun;
    } else if (targetUserEmail.toLowerCase().includes('meera')) {
      targetName = 'Meera Patel';
      targetProfile = demoMeera;
    }

    const nomineeUser: UserProfile = {
      id: `usr_nom_${Date.now()}`,
      name: nomineeEmail.split('@')[0],
      email: nomineeEmail,
      role: 'nominee',
      isDemoUser: true,
      onboardingCompleted: true,
      biometricRegistered: true,
    };

    setCurrentUser(nomineeUser);
    setActiveRole('nominee');
    setIsAuthenticated(true);

    if (targetProfile.nomineeRequest.status === 'Access Approved') {
      setAssets(targetProfile.assets);
      setClaims(targetProfile.claims);
    } else {
      setAssets([]);
      setClaims([]);
    }

    setNomineeRequest({
      ...targetProfile.nomineeRequest,
      nomineeEmail,
      targetUserEmail,
      targetUserName: targetName,
    });

    addActivity(`Nominee logged in: ${nomineeEmail}. Status: ${targetProfile.nomineeRequest.status}`, 'alert');
  };

  const login = (role: UserRole, email?: string, password?: string) => {
    setActiveRole(role);
    setIsAuthenticated(true);

    if (role === 'primary') {
      const cleanEmail = (email || '').trim().toLowerCase();

      // 1. Check if user email matches an existing registered real account
      const foundAccount = StorageService.findAccountByEmail(cleanEmail);
      if (foundAccount) {
        loginRegisteredUser(foundAccount.id);
        return;
      }

      // 2. Check if email matches one of the 4 fictional demo profiles
      if (cleanEmail.includes('priya') || cleanEmail.includes('sharma')) {
        selectDemoProfile('priya');
      } else if (cleanEmail.includes('arjun')) {
        selectDemoProfile('arjun');
      } else if (cleanEmail.includes('meera')) {
        selectDemoProfile('meera');
      } else if (cleanEmail.includes('ramesh')) {
        selectDemoProfile('ramesh');
      } else if (cleanEmail.length > 0) {
        // 3. New real user email entered: automatically create their registered account and start empty profile
        const autoName = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
        const formattedName = autoName.charAt(0).toUpperCase() + autoName.slice(1);
        registerNewUser(formattedName, cleanEmail, password || 'password123', 'primary');
      } else {
        // Default fallback to first registered account or Ramesh demo
        const registered = StorageService.getRegisteredAccounts();
        if (registered.length > 0) {
          loginRegisteredUser(registered[0].id);
        } else {
          selectDemoProfile('ramesh');
        }
      }
    } else {
      loginNomineeWithTarget(email || 'priya.k@email.com', password || 'password123', 'ramesh.kumar@email.com');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    StorageService.saveSettings({
      activeDemoKey,
      activeRole,
      isAuthenticated: false,
      activeUserId: currentUser.id,
    });
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'primary') {
      if (currentUser && !currentUser.isDemoUser) {
        loginRegisteredUser(currentUser.id);
      } else {
        selectDemoProfile((activeDemoKey as any) || 'ramesh');
      }
    } else {
      loginNomineeWithTarget('priya.k@email.com', 'demo', currentUser.email);
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      if (!updated.isDemoUser) {
        StorageService.saveRegisteredAccount({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          occupation: updated.occupation,
          createdAt: new Date().toISOString(),
          onboardingCompleted: updated.onboardingCompleted,
        });
        setRegisteredAccounts(StorageService.getRegisteredAccounts());
      }
      return updated;
    });
    addActivity('Updated personal profile information', 'alert');
  };

  const completeOnboarding = () => {
    setCurrentUser((prev) => {
      const updated = { ...prev, onboardingCompleted: true };
      if (!updated.isDemoUser) {
        StorageService.saveRegisteredAccount({
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          occupation: updated.occupation,
          createdAt: new Date().toISOString(),
          onboardingCompleted: true,
        });
        setRegisteredAccounts(StorageService.getRegisteredAccounts());
      }
      return updated;
    });
    setShowOnboarding(false);
    addActivity('Completed 5-step financial legacy onboarding', 'discovery');
  };

  // Family & Nominee Management
  const addFamilyMember = (memberData: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...memberData,
      id: `fam_${Date.now()}`,
      invitationSentDate: 'Today',
    };
    setFamilyMembers((prev) => [...prev, newMember]);
    addActivity(`Added family member: ${newMember.name} (${newMember.relationship})`, 'alert');
  };

  const updateFamilyMemberPermission = (id: string, permissions: AssetCategory[]) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, accessPermissions: permissions } : m))
    );
    addActivity('Updated nominee access permissions', 'alert');
  };

  const approveNomineeAccess = (nomineeId: string) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === nomineeId ? { ...m, verificationStatus: 'Access Approved' } : m))
    );
    setNomineeRequest((prev) => ({
      ...prev,
      status: 'Access Approved',
      approvedDate: 'Today',
    }));
    addActivity('Approved nominee access request', 'alert');
  };

  const rejectNomineeAccess = (nomineeId: string) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === nomineeId ? { ...m, verificationStatus: 'Access Rejected' } : m))
    );
    setNomineeRequest((prev) => ({
      ...prev,
      status: 'Access Rejected',
    }));
    addActivity('Rejected nominee access request', 'alert');
  };

  const addActivity = (title: string, type: ActivityItem['type']) => {
    const newAct: ActivityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${title} - Just now`,
      timestamp: 'Just now',
      type,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  const clearNotifications = () => {
    setNotificationsCount(0);
  };

  // Asset actions
  const addAsset = (assetData: Omit<FinancialAsset, 'id' | 'discoveryDate'>) => {
    const newAsset: FinancialAsset = {
      ...assetData,
      id: `ast_${Date.now()}`,
      discoveryDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setAssets((prev) => [newAsset, ...prev]);
    addActivity(`Discovered new asset: ${newAsset.name} (${newAsset.institution})`, 'discovery');
  };

  const updateAsset = (id: string, updates: Partial<FinancialAsset>) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    addActivity(`Updated asset information`, 'verification');
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    addActivity(`Removed asset from portfolio`, 'alert');
  };

  const verifyAsset = (id: string, status: VerificationStatus) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, verificationStatus: status } : a)));
    addActivity(`Verified asset status updated to ${status}`, 'verification');
  };

  // Claim actions
  const addClaim = (claimData: Omit<Claim, 'id' | 'claimReferenceNumber'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `clm_${Date.now()}`,
      claimReferenceNumber: `FL-${claimData.assetType.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
    };
    setClaims((prev) => [newClaim, ...prev]);
    addActivity(`Initiated recovery claim for ${newClaim.assetName}`, 'claim');
  };

  const updateClaimStage = (id: string, stage: ClaimStage) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              currentStage: stage,
              progressPercentage:
                stage === 'Recovered'
                  ? 100
                  : stage === 'Recovery Pending'
                  ? 85
                  : stage === 'Under Verification'
                  ? 65
                  : stage === 'Claim Submitted'
                  ? 50
                  : 30,
              history: [
                ...c.history,
                {
                  stage,
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  description: `Advanced to ${stage}`,
                  completed: true,
                },
              ],
            }
          : c
      )
    );
    addActivity(`Claim advanced to stage: ${stage}`, 'claim');
  };

  const toggleClaimTask = (claimId: string, taskId: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
            }
          : c
      )
    );
  };

  const addClaimTask = (claimId: string, title: string, dueDate?: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              tasks: [...c.tasks, { id: `tsk_${Date.now()}`, title, completed: false, dueDate }],
            }
          : c
      )
    );
  };

  // Document actions
  const uploadDocument = (file: { name: string; size: string; category: any; extractedData?: any }) => {
    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: 'PDF Document',
      category: file.category,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      analyzed: true,
      confidenceScore: 94,
      financialInstitution: file.category === 'EPF Records' ? 'EPFO' : 'HDFC Bank',
      extractedEntities: [
        { label: 'Document Type', value: file.category, confidence: 98 },
        { label: 'Holder Name', value: currentUser.name, confidence: 95 },
      ],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addActivity(`Uploaded document: ${file.name}`, 'discovery');
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addActivity(`Deleted document from vault`, 'alert');
  };

  const linkDocumentToAsset = (docId: string, assetId: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, linkedAssetId: assetId } : d)));
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, linkedDocumentIds: [...a.linkedDocumentIds, docId] } : a))
    );
    addActivity('Linked document to financial asset', 'verification');
  };

  // Gap actions
  const resolveGap = (id: string) => {
    setGaps((prev) => prev.map((g) => (g.id === id ? { ...g, resolved: true } : g)));
    addActivity('Resolved financial documentation gap', 'verification');
  };

  // Footprint actions
  const updateFootprint = (newFootprint: Partial<FootprintRecord>) => {
    setFootprint((prev) => ({ ...prev, ...newFootprint }));
  };

  const analyzeFootprintAI = () => {
    setIsAnalyzingFootprint(true);
    setTimeout(() => {
      setIsAnalyzingFootprint(false);
      const newConnection = {
        id: `conn_${Date.now()}`,
        title: 'PF Balance Clue Detected',
        type: 'EPF',
        institution: 'EPFO (ABC Technologies)',
        evidence: 'Past salary slip deduction record indicates un-transferred PF balance.',
        confidence: 94,
        recommendedVerification: 'Check EPFO Member Portal with historical UAN',
      };
      setFootprint((prev) => ({
        ...prev,
        potentialConnections: [newConnection, ...prev.potentialConnections],
      }));
      addActivity('AI Footprint Detective found new financial connection', 'discovery');
    }, 1500);
  };

  // Nominee actions
  const updateNomineeStatus = (status: NomineeAccessStatus) => {
    setNomineeRequest((prev) => ({
      ...prev,
      status,
      approvedDate: status === 'Access Approved' ? 'Today' : prev.approvedDate,
    }));
    addActivity(`Nominee access status updated: ${status}`, 'alert');
  };

  const uploadDeathCertificate = (details: any) => {
    setNomineeRequest((prev) => ({
      ...prev,
      deathCertificateUploaded: true,
      deathCertificateDetails: {
        deceasedName: details.deceasedName || currentUser.name,
        dateOfDeath: details.dateOfDeath || 'Jan 15, 2025',
        registrationNumber: details.regNo || 'MCD/DTH/2025/90412',
        issuingAuthority: details.authority || 'Municipal Corporation of Delhi',
        verified: true,
      },
      status: 'Verification Pending',
    }));
    addActivity('Uploaded & verified official death certificate (Simulated OCR)', 'verification');
  };

  const uploadRelationshipProof = (details: any) => {
    setNomineeRequest((prev) => ({
      ...prev,
      relationshipProofUploaded: true,
      relationshipProofDetails: {
        documentType: details.documentType || 'Marriage Certificate',
        verified: true,
      },
    }));
    addActivity('Uploaded relationship verification proof', 'verification');
  };

  const simulateBiometricAuth = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setNomineeRequest((prev) => ({ ...prev, biometricVerified: true }));
        addActivity('Biometric passkey verified successfully', 'verification');
        resolve(true);
      }, 1000);
    });
  };

  // Fraud detector actions
  const analyzeFraudText = (text: string): FraudAnalysisResult => {
    const lower = text.toLowerCase();
    const indicators: string[] = [];

    const hasOtpOrPin = lower.includes('otp') || lower.includes('pin') || lower.includes('password') || lower.includes('cvv');
    const hasMoneyOrWon = lower.includes('won') || lower.includes('lottery') || lower.includes('crore') || lower.includes('lakh');
    const hasLink = lower.includes('http') || lower.includes('.com') || lower.includes('bit.ly') || lower.includes('claim:');
    const hasUrgency = lower.includes('urgent') || lower.includes('immediately') || lower.includes('24 hours') || lower.includes('suspended');

    if (hasMoneyOrWon) indicators.push('Unrealistic financial prize / lottery promise');
    if (hasLink) indicators.push('Suspicious unverified external link');
    if (hasOtpOrPin) indicators.push('Attempts to elicit sensitive security credentials');
    if (hasUrgency) indicators.push('Artificial urgency and coercive deadlines');

    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
      indicators.length >= 3 || hasOtpOrPin || (hasMoneyOrWon && hasLink)
        ? 'HIGH'
        : indicators.length === 2
        ? 'MEDIUM'
        : 'LOW';

    const riskScore = riskLevel === 'HIGH' ? 94 : riskLevel === 'MEDIUM' ? 65 : 22;

    const explanation =
      riskLevel === 'HIGH'
        ? 'CRITICAL ALERT: This message exhibits classic predatory financial fraud markers. Official financial institutions and government bodies (RBI, EPFO, Banks) NEVER require upfront fee transfers, OTP sharing, or unsolicited lottery claims via third-party web links.'
        : riskLevel === 'MEDIUM'
        ? 'CAUTION: Message contains urgency indicators or unverified links. Verify authenticity directly through official bank channels.'
        : 'LOW RISK: No prominent phishing or extortion vectors detected. Always exercise routine digital caution.';

    const safeActions = [
      'Never reveal OTP, PIN, CVV, or banking net-passwords to anyone.',
      'Do not click unknown web links or download attached APK files.',
      'Always verify claim status on official government portals (udgam.rbi.org.in or epfindia.gov.in).',
      'Report suspicious numbers to the National Cyber Crime Reporting Portal (cybercrime.gov.in / 1930).',
    ];

    const result: FraudAnalysisResult = {
      id: `frd_${Date.now()}`,
      inputContent: text,
      riskLevel,
      riskScore,
      suspiciousIndicators: indicators,
      explanation,
      safeActions,
      analyzedAt: 'Just now',
    };

    setFraudScans((prev) => [result, ...prev]);
    addActivity(`AI Fraud Detector scanned message: ${riskLevel} RISK`, riskLevel === 'HIGH' ? 'alert' : 'verification');
    return result;
  };

  // Claim Letter actions
  const addClaimLetter = (letterData: Omit<ClaimLetter, 'id' | 'dateGenerated'>) => {
    const newLetter: ClaimLetter = {
      ...letterData,
      id: `ltr_${Date.now()}`,
      dateGenerated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setClaimLetters((prev) => [newLetter, ...prev]);
    addActivity(`Generated formal claim letter for ${newLetter.institution}`, 'claim');
  };

  // ==========================================
  // UPGRADED AI FINANCIAL ASSISTANT DISPATCHER
  // ==========================================
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    const context: AssistantContext = {
      user: currentUser,
      assets,
      claims,
      documents,
      gaps,
      footprint,
      familyMembers,
      nomineeRequest,
      legacyScore,
      totalPotentialAssetsValue,
      assetsDiscoveredCount,
      claimsCount,
      readinessScore,
      recoveryProgress,
      activeTab,
    };

    try {
      const response = await queryFinancialAssistant(text, context);
      setAiEngineSource(response.source);

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Failed to get assistant response', err);
      const fallbackMsg: ChatMessage = {
        id: `msg_bot_err_${Date.now()}`,
        sender: 'assistant',
        text: `I encountered an unexpected issue processing your query. Please rephrase your question or select one of the suggested prompts below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const clearChatHistory = () => {
    const newMessages = StorageService.clearChatHistory(currentUser.id);
    setMessages(newMessages);
    addActivity('Cleared assistant chat history', 'alert');
  };

  // Safe reset for CURRENT active profile only
  const resetDemoData = () => {
    isSwitchingProfileRef.current = true;
    const resetData = StorageService.resetProfile(currentUser.id, activeDemoKey);

    setCurrentUser(resetData.user);
    setAssets(resetData.assets);
    setClaims(resetData.claims);
    setDocuments(resetData.documents);
    setGaps(resetData.gaps);
    setFootprint(resetData.footprint);
    setFamilyMembers(resetData.familyMembers);
    setNomineeRequest(resetData.nomineeRequest);
    setActivities(resetData.activities);
    setMessages(resetData.chatMessages);
    setClaimLetters(resetData.claimLetters);
    setFraudScans(resetData.fraudScans);

    setTimeout(() => {
      isSwitchingProfileRef.current = false;
    }, 100);

    addActivity(`Reset ${resetData.user.name}'s profile data to initial demo state`, 'alert');
  };

  const exportProfileBackup = () => {
    const jsonStr = StorageService.exportBackup(currentUser.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FINANCE_LEGACY_${currentUser.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    addActivity('Exported encrypted profile backup', 'verification');
  };

  const importProfileBackup = (jsonString: string): boolean => {
    const imported = StorageService.importBackup(currentUser.id, jsonString);
    if (imported) {
      isSwitchingProfileRef.current = true;
      setCurrentUser(imported.user);
      setAssets(imported.assets);
      setClaims(imported.claims);
      setDocuments(imported.documents);
      setGaps(imported.gaps);
      setFootprint(imported.footprint);
      setFamilyMembers(imported.familyMembers);
      setNomineeRequest(imported.nomineeRequest);
      setActivities(imported.activities);
      setMessages(imported.chatMessages);
      setClaimLetters(imported.claimLetters);
      setFraudScans(imported.fraudScans);
      setTimeout(() => {
        isSwitchingProfileRef.current = false;
      }, 100);
      addActivity('Successfully restored profile from backup file', 'verification');
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activeRole,
        login,
        registerNewUser,
        loginNomineeWithTarget,
        logout,
        switchRole,
        updateUserProfile,
        registeredUsers: registeredAccounts,
        loginRegisteredUser,
        deleteRegisteredUser,
        activeDemoKey,
        selectDemoProfile,
        showOnboarding,
        setShowOnboarding,
        completeOnboarding,
        familyMembers,
        addFamilyMember,
        updateFamilyMemberPermission,
        approveNomineeAccess,
        rejectNomineeAccess,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        assets,
        addAsset,
        updateAsset,
        deleteAsset,
        verifyAsset,
        claims,
        addClaim,
        updateClaimStage,
        toggleClaimTask,
        addClaimTask,
        documents,
        uploadDocument,
        deleteDocument,
        linkDocumentToAsset,
        gaps,
        resolveGap,
        footprint,
        updateFootprint,
        analyzeFootprintAI,
        isAnalyzingFootprint,
        nomineeRequest,
        updateNomineeStatus,
        uploadDeathCertificate,
        uploadRelationshipProof,
        simulateBiometricAuth,
        fraudScans,
        analyzeFraudText,
        claimLetters,
        addClaimLetter,
        messages,
        sendMessage,
        isAiTyping,
        clearChatHistory,
        aiEngineSource,
        legacyScore,
        totalPotentialAssetsValue,
        assetsDiscoveredCount,
        claimsCount,
        readinessScore,
        recoveryProgress,
        activities,
        addActivity,
        notificationsCount,
        clearNotifications,
        resetDemoData,
        exportProfileBackup,
        importProfileBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
