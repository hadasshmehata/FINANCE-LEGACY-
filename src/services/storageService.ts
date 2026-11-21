import {
  UserProfile,
  FinancialAsset,
  Claim,
  DocumentItem,
  FinancialGap,
  FootprintRecord,
  FamilyMember,
  NomineeRequest,
  ActivityItem,
  ChatMessage,
  ClaimLetter,
  FraudAnalysisResult,
} from '../types';
import { demoProfilesMap, DemoProfileData } from '../data/demoProfiles';
import { initialLetters, initialChatMessages } from '../data/initialData';

export const SCHEMA_VERSION = 2;

export interface UserProfileData {
  user: UserProfile;
  assets: FinancialAsset[];
  claims: Claim[];
  documents: DocumentItem[];
  gaps: FinancialGap[];
  footprint: FootprintRecord;
  familyMembers: FamilyMember[];
  nomineeRequest: NomineeRequest;
  activities: ActivityItem[];
  chatMessages: ChatMessage[];
  claimLetters: ClaimLetter[];
  fraudScans: FraudAnalysisResult[];
  version: number;
  lastUpdated: string;
}

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'primary' | 'nominee';
  occupation?: string;
  createdAt: string;
  onboardingCompleted?: boolean;
}

export interface AppSettings {
  activeDemoKey: string;
  activeRole: 'primary' | 'nominee';
  isAuthenticated: boolean;
  activeUserId: string;
}

const SETTINGS_KEY = 'fl_app_settings_v2';
const PROFILE_KEY_PREFIX = 'fl_profile_v2_';
const REGISTERED_ACCOUNTS_KEY = 'fl_registered_accounts_v2';

/**
 * Default initial profile for an empty registered user
 */
export const createEmptyProfileData = (user: UserProfile): UserProfileData => {
  return {
    user,
    assets: [],
    claims: [],
    documents: [],
    gaps: [],
    footprint: {
      previousEmployers: [],
      knownBanks: [],
      previousAddresses: [],
      knownInsurance: [],
      investments: [],
      phoneEmailClues: [],
      potentialConnections: [],
    },
    familyMembers: user.familyMembers || [],
    nomineeRequest: {
      id: `nom_req_${user.id}`,
      nomineeName: '',
      nomineeEmail: '',
      relationship: '',
      targetUserEmail: user.email,
      targetUserName: user.name,
      status: 'Not Requested',
      requestDate: 'Today',
      deathCertificateUploaded: false,
      relationshipProofUploaded: false,
      biometricVerified: false,
      permittedAssetCategories: [],
    },
    activities: [
      {
        id: `act_${Date.now()}`,
        title: `Welcome to Finance Legacy, ${user.name}! Profile initialized.`,
        timestamp: 'Just now',
        type: 'alert',
      },
    ],
    chatMessages: [
      {
        id: `msg_welcome_${Date.now()}`,
        sender: 'assistant',
        text: `Welcome to **FINANCE LEGACY**, ${user.name}! I am your AI Financial Assistant. Your profile has started cleanly with zero pre-loaded assets. You can ask me how to get started, complete your 5-step onboarding, or upload financial documents for discovery.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    claimLetters: initialLetters,
    fraudScans: [
      {
        id: `frd_init_${Date.now()}`,
        inputContent:
          'URGENT: Outstanding unclaimed insurance settlement of ₹2,85,000 pending under Policy #908123. To release payment to your bank savings account immediately, deposit mandatory processing stamp duty fee of ₹2,500 to UPI ID govt-settlement@upi or call +91-98765-43210.',
        riskLevel: 'HIGH',
        riskScore: 92,
        suspiciousIndicators: [
          'Demands upfront advance processing fee before releasing funds',
          'Uses urgent, time-pressured language to induce panic',
          'Requests money transfer to personal or unverified UPI handle',
          'Official financial institutions deduct fees from proceeds rather than asking for UPI pre-deposits',
        ],
        explanation:
          'This message exhibits all signature patterns of an Advance Fee Recovery Scam (Section 66D IT Act). Legitimate regulators (RBI, IRDAI, EPFO) never solicit processing fees or stamp duties via personal UPI handles.',
        safeActions: [
          'Never transfer any advance registration or processing fee to release financial claims',
          'Block the sender number and do not dial the provided helpline',
          'Report the incident to the National Cyber Crime Helpline at 1930',
          'Verify legitimate claim status directly on the official insurer or bank portal',
        ],
        analyzedAt: 'Preset sample',
      },
    ],
    version: SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Create profile dataset from predefined demo data
 */
export const createDemoProfileData = (demo: DemoProfileData): UserProfileData => {
  return {
    user: demo.profile,
    assets: [...demo.assets],
    claims: [...demo.claims],
    documents: [...demo.documents],
    gaps: [...demo.gaps],
    footprint: { ...demo.footprint },
    familyMembers: [...(demo.profile.familyMembers || [])],
    nomineeRequest: { ...demo.nomineeRequest },
    activities: [
      {
        id: `act_${Date.now()}_1`,
        title: `Salary slip analyzed - EPF Clue Detected`,
        timestamp: 'Today, 10:30 AM',
        type: 'discovery',
      },
      {
        id: `act_${Date.now()}_2`,
        title: `FD interest trace identified from 26AS`,
        timestamp: 'Today, 09:15 AM',
        type: 'verification',
      },
      {
        id: `act_${Date.now()}_3`,
        title: `Claim status synchronized with bank`,
        timestamp: 'Yesterday',
        type: 'claim',
      },
    ],
    chatMessages: [
      {
        id: 'msg_init_1',
        sender: 'assistant',
        text: `Hello ${demo.profile.name.split(' ')[0]}! I am your **AI Financial Assistant**. I have analyzed your portfolio of **${demo.assets.length} potential assets** totaling **₹${demo.assets
          .reduce((sum, a) => sum + a.estimatedValue, 0)
          .toLocaleString('en-IN')}**. You can ask me what assets have been detected, how to claim your EPF, what documents are missing, or how to improve your Financial Legacy Score.`,
        timestamp: '10:00 AM',
      },
    ],
    claimLetters: initialLetters,
    fraudScans: [
      {
        id: `frd_demo_${Date.now()}`,
        inputContent:
          'URGENT: Outstanding unclaimed insurance settlement of ₹2,85,000 pending under Policy #908123. To release payment to your bank savings account immediately, deposit mandatory processing stamp duty fee of ₹2,500 to UPI ID govt-settlement@upi or call +91-98765-43210.',
        riskLevel: 'HIGH',
        riskScore: 92,
        suspiciousIndicators: [
          'Demands upfront advance processing fee before releasing funds',
          'Uses urgent, time-pressured language to induce panic',
          'Requests money transfer to personal or unverified UPI handle',
          'Official financial institutions deduct fees from proceeds rather than asking for UPI pre-deposits',
        ],
        explanation:
          'This message exhibits all signature patterns of an Advance Fee Recovery Scam (Section 66D IT Act). Legitimate regulators (RBI, IRDAI, EPFO) never solicit processing fees or stamp duties via personal UPI handles.',
        safeActions: [
          'Never transfer any advance registration or processing fee to release financial claims',
          'Block the sender number and do not dial the provided helpline',
          'Report the incident to the National Cyber Crime Helpline at 1930',
          'Verify legitimate claim status directly on the official insurer or bank portal',
        ],
        analyzedAt: 'Today, 10:15 AM',
      },
    ],
    version: SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Storage Service for Finance Legacy
 */
export const StorageService = {
  /**
   * Save app-level settings (active user, role, auth state)
   */
  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save app settings to localStorage', e);
    }
  },

  /**
   * Load app-level settings with safe defaults
   */
  loadSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          activeDemoKey: parsed.activeDemoKey || 'ramesh',
          activeRole: parsed.activeRole || 'primary',
          isAuthenticated: typeof parsed.isAuthenticated === 'boolean' ? parsed.isAuthenticated : true,
          activeUserId: parsed.activeUserId || 'demo_ramesh',
        };
      }
    } catch (e) {
      console.warn('Failed to load app settings, using defaults', e);
    }

    // Check legacy auth keys if settings not found
    const legacyAuth = localStorage.getItem('fl_auth') === 'true';
    const legacyRole = (localStorage.getItem('fl_role') as any) || 'primary';
    const legacyDemo = localStorage.getItem('fl_active_demo_key') || 'ramesh';

    return {
      activeDemoKey: legacyDemo,
      activeRole: legacyRole,
      isAuthenticated: legacyAuth !== false,
      activeUserId: legacyDemo === 'ramesh' ? 'demo_ramesh' : `demo_${legacyDemo}`,
    };
  },

  /**
   * Load user profile data with safe parsing and demo/empty fallbacks
   */
  loadProfileData(userId: string, demoKey?: string): UserProfileData {
    const key = `${PROFILE_KEY_PREFIX}${userId}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed: UserProfileData = JSON.parse(raw);
        if (parsed && parsed.user && Array.isArray(parsed.assets)) {
          // Validate and ensure all required fields exist
          return {
            user: parsed.user,
            assets: Array.isArray(parsed.assets) ? parsed.assets : [],
            claims: Array.isArray(parsed.claims) ? parsed.claims : [],
            documents: Array.isArray(parsed.documents) ? parsed.documents : [],
            gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
            footprint: parsed.footprint || {
              previousEmployers: [],
              knownBanks: [],
              previousAddresses: [],
              knownInsurance: [],
              investments: [],
              phoneEmailClues: [],
              potentialConnections: [],
            },
            familyMembers: Array.isArray(parsed.familyMembers) ? parsed.familyMembers : [],
            nomineeRequest: parsed.nomineeRequest || {
              id: `nom_req_${userId}`,
              nomineeName: '',
              nomineeEmail: '',
              relationship: '',
              targetUserEmail: parsed.user?.email || '',
              targetUserName: parsed.user?.name || '',
              status: 'Not Requested',
              requestDate: 'Today',
              deathCertificateUploaded: false,
              relationshipProofUploaded: false,
              biometricVerified: false,
              permittedAssetCategories: [],
            },
            activities: Array.isArray(parsed.activities) ? parsed.activities : [],
            chatMessages: Array.isArray(parsed.chatMessages) ? parsed.chatMessages : [],
            claimLetters: Array.isArray(parsed.claimLetters) ? parsed.claimLetters : initialLetters,
            fraudScans: Array.isArray(parsed.fraudScans) ? parsed.fraudScans : [],
            version: parsed.version || SCHEMA_VERSION,
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn(`Failed to parse profile data for ${userId}, falling back to defaults`, e);
    }

    // Fallback: If this is a demo user, initialize with clean demo data
    const matchedDemoKey = demoKey || (userId.startsWith('demo_') ? userId.replace('demo_', '') : null);
    if (matchedDemoKey && demoProfilesMap[matchedDemoKey]) {
      const defaultDemoData = createDemoProfileData(demoProfilesMap[matchedDemoKey]);
      StorageService.saveProfileData(userId, defaultDemoData);
      return defaultDemoData;
    }

    // Fallback for real users: return empty profile structure
    const matchedAccount = StorageService.getRegisteredAccounts().find((a) => a.id === userId);
    const fallbackUser: UserProfile = {
      id: userId,
      name: matchedAccount ? matchedAccount.name : 'Registered User',
      email: matchedAccount ? matchedAccount.email : `${userId}@financelegacy.local`,
      occupation: matchedAccount?.occupation,
      role: matchedAccount ? matchedAccount.role : 'primary',
      isDemoUser: false,
      onboardingCompleted: matchedAccount?.onboardingCompleted ?? false,
      familyMembers: [],
    };
    const emptyData = createEmptyProfileData(fallbackUser);
    StorageService.saveProfileData(userId, emptyData);
    return emptyData;
  },

  /**
   * Save user profile data
   */
  saveProfileData(userId: string, data: UserProfileData): void {
    if (!userId) return;
    try {
      const payload: UserProfileData = {
        ...data,
        version: SCHEMA_VERSION,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(`${PROFILE_KEY_PREFIX}${userId}`, JSON.stringify(payload));
    } catch (e) {
      console.warn(`Failed to persist profile data for ${userId}`, e);
    }
  },

  /**
   * Reset data for a single user/demo profile ONLY, without wiping other profiles or settings
   */
  resetProfile(userId: string, demoKey?: string): UserProfileData {
    const key = `${PROFILE_KEY_PREFIX}${userId}`;
    localStorage.removeItem(key);

    const matchedDemoKey = demoKey || (userId.startsWith('demo_') ? userId.replace('demo_', '') : 'ramesh');
    if (demoProfilesMap[matchedDemoKey]) {
      const resetData = createDemoProfileData(demoProfilesMap[matchedDemoKey]);
      StorageService.saveProfileData(userId, resetData);
      return resetData;
    }

    const fallbackUser: UserProfile = {
      id: userId,
      name: 'User',
      email: 'user@email.com',
      role: 'primary',
      isDemoUser: false,
      onboardingCompleted: false,
      familyMembers: [],
    };
    const emptyData = createEmptyProfileData(fallbackUser);
    StorageService.saveProfileData(userId, emptyData);
    return emptyData;
  },

  /**
   * Clear chat history only for a specific user
   */
  clearChatHistory(userId: string): ChatMessage[] {
    const current = StorageService.loadProfileData(userId);
    const initialWelcome: ChatMessage = {
      id: `msg_welcome_${Date.now()}`,
      sender: 'assistant',
      text: `Hello ${current.user.name.split(' ')[0]}! Chat history has been cleared. How can I assist you with your financial legacy today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    current.chatMessages = [initialWelcome];
    StorageService.saveProfileData(userId, current);
    return [initialWelcome];
  },

  /**
   * Export complete profile as JSON backup
   */
  exportBackup(userId: string): string {
    const data = StorageService.loadProfileData(userId);
    return JSON.stringify(data, null, 2);
  },

  /**
   * Import JSON backup for a user
   */
  importBackup(userId: string, jsonString: string): UserProfileData | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.user && Array.isArray(parsed.assets)) {
        const validatedData: UserProfileData = {
          ...parsed,
          user: {
            ...parsed.user,
            id: userId, // Preserve current user ID
          },
          version: SCHEMA_VERSION,
          lastUpdated: new Date().toISOString(),
        };
        StorageService.saveProfileData(userId, validatedData);
        return validatedData;
      }
    } catch (e) {
      console.error('Invalid JSON backup file', e);
    }
    return null;
  },

  /**
   * Get all registered accounts (including default sample registered account)
   */
  getRegisteredAccounts(): RegisteredAccount[] {
    try {
      const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load registered accounts', e);
    }

    // Default registered account to ensure Asset Owner login always has a real registered user available
    const defaultRegistered: RegisteredAccount[] = [
      {
        id: 'usr_real_vikram',
        name: 'Vikram Malhotra',
        email: 'vikram.malhotra@email.com',
        password: 'password123',
        role: 'primary',
        occupation: 'Business Executive',
        createdAt: new Date().toISOString(),
        onboardingCompleted: false,
      },
    ];

    try {
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(defaultRegistered));
    } catch {
      // ignore
    }

    return defaultRegistered;
  },

  /**
   * Save or update a registered account
   */
  saveRegisteredAccount(account: RegisteredAccount): void {
    try {
      const accounts = StorageService.getRegisteredAccounts();
      const existingIdx = accounts.findIndex(
        (a) => a.id === account.id || a.email.toLowerCase() === account.email.toLowerCase()
      );
      if (existingIdx >= 0) {
        accounts[existingIdx] = { ...accounts[existingIdx], ...account };
      } else {
        accounts.unshift(account);
      }
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save registered account', e);
    }
  },

  /**
   * Find a registered account by email (case-insensitive)
   */
  findAccountByEmail(email: string): RegisteredAccount | undefined {
    if (!email) return undefined;
    const cleanEmail = email.trim().toLowerCase();
    const accounts = StorageService.getRegisteredAccounts();
    return accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  },

  /**
   * Delete a registered account
   */
  deleteRegisteredAccount(accountId: string): void {
    try {
      const accounts = StorageService.getRegisteredAccounts().filter((a) => a.id !== accountId);
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
      localStorage.removeItem(`${PROFILE_KEY_PREFIX}${accountId}`);
    } catch (e) {
      console.warn('Failed to delete registered account', e);
    }
  },

  /**
   * Find a valid nominee relationship between a nominee and an asset owner.
   * Scans real registered accounts first, then demo profiles if explicitly targeted.
   */
  findNomineeRelationship(
    nomineeEmail: string,
    targetOwnerEmail?: string
  ): {
    ownerAccount: { id: string; name: string; email: string; isDemoUser?: boolean };
    ownerData: UserProfileData;
    nomineeMember: {
      name: string;
      email: string;
      relationship: string;
      permittedCategories?: any[];
      status?: any;
    };
  } | null {
    if (!nomineeEmail) return null;
    const cleanNomEmail = nomineeEmail.trim().toLowerCase();
    const cleanTarget = (targetOwnerEmail || '').trim().toLowerCase();

    // 1. Scan all real registered accounts
    const registered = StorageService.getRegisteredAccounts();
    for (const acc of registered) {
      if (cleanTarget) {
        const matchEmail = acc.email.toLowerCase() === cleanTarget;
        const matchName = acc.name.toLowerCase() === cleanTarget;
        if (!matchEmail && !matchName) {
          continue;
        }
      }
      const ownerData = StorageService.loadProfileData(acc.id);
      if (!ownerData) continue;

      // Check if designated in familyMembers
      const matchedMember = (ownerData.familyMembers || []).find(
        (m) => m.isNominee && m.email && m.email.toLowerCase().trim() === cleanNomEmail
      );
      if (matchedMember) {
        return {
          ownerAccount: { id: acc.id, name: acc.name, email: acc.email, isDemoUser: false },
          ownerData,
          nomineeMember: {
            name: matchedMember.name,
            email: matchedMember.email,
            relationship: matchedMember.relationship,
            permittedCategories: matchedMember.accessPermissions,
            status: matchedMember.verificationStatus,
          },
        };
      }

      // Check if designated directly in nomineeRequest
      if (
        ownerData.nomineeRequest &&
        ownerData.nomineeRequest.nomineeEmail &&
        ownerData.nomineeRequest.nomineeEmail.toLowerCase().trim() === cleanNomEmail
      ) {
        return {
          ownerAccount: { id: acc.id, name: acc.name, email: acc.email, isDemoUser: false },
          ownerData,
          nomineeMember: {
            name: ownerData.nomineeRequest.nomineeName,
            email: ownerData.nomineeRequest.nomineeEmail,
            relationship: ownerData.nomineeRequest.relationship,
            permittedCategories: ownerData.nomineeRequest.permittedAssetCategories,
            status: ownerData.nomineeRequest.status,
          },
        };
      }
    }

    // 2. Check demo profiles ONLY if explicitly targeted
    if (cleanTarget) {
      const demoKeys: Array<keyof typeof demoProfilesMap> = ['ramesh', 'priya', 'arjun', 'meera'];
      for (const dKey of demoKeys) {
        const demo = demoProfilesMap[dKey];
        if (
          demo.profile.email.toLowerCase() === cleanTarget ||
          demo.profile.name.toLowerCase() === cleanTarget ||
          cleanTarget.includes(dKey)
        ) {
          const ownerData = StorageService.loadProfileData(`demo_${dKey}`, dKey);
          if (
            (ownerData.nomineeRequest.nomineeEmail &&
              ownerData.nomineeRequest.nomineeEmail.toLowerCase() === cleanNomEmail) ||
            cleanNomEmail.includes(dKey) ||
            cleanNomEmail.includes('priya')
          ) {
            return {
              ownerAccount: { id: `demo_${dKey}`, name: demo.profile.name, email: demo.profile.email, isDemoUser: true },
              ownerData,
              nomineeMember: {
                name: ownerData.nomineeRequest.nomineeName,
                email: cleanNomEmail,
                relationship: ownerData.nomineeRequest.relationship,
                permittedCategories: ownerData.nomineeRequest.permittedAssetCategories,
                status: ownerData.nomineeRequest.status,
              },
            };
          }
        }
      }
    }

    return null;
  },

  /**
   * Update nomineeRequest specifically inside an asset owner's stored profile
   */
  updateNomineeRequestForOwner(ownerId: string, updates: Partial<NomineeRequest>): void {
    if (!ownerId) return;
    try {
      const ownerData = StorageService.loadProfileData(ownerId);
      if (ownerData) {
        ownerData.nomineeRequest = {
          ...ownerData.nomineeRequest,
          ...updates,
        };
        // Also update matching family member verificationStatus if applicable
        if (updates.status && ownerData.familyMembers) {
          ownerData.familyMembers = ownerData.familyMembers.map((m) =>
            m.isNominee || (updates.nomineeEmail && m.email.toLowerCase() === updates.nomineeEmail.toLowerCase())
              ? { ...m, verificationStatus: updates.status! }
              : m
          );
        }
        StorageService.saveProfileData(ownerId, ownerData);
      }
    } catch (e) {
      console.warn(`Failed to update nominee request for owner ${ownerId}`, e);
    }
  },
};
