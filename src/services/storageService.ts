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

export interface AppSettings {
  activeDemoKey: string;
  activeRole: 'primary' | 'nominee';
  isAuthenticated: boolean;
  activeUserId: string;
}

const SETTINGS_KEY = 'fl_app_settings_v2';
const PROFILE_KEY_PREFIX = 'fl_profile_v2_';

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
        inputContent: 'You have won ₹1,00,000! Click here to claim: http://fake-link.com',
        riskLevel: 'HIGH',
        riskScore: 94,
        suspiciousIndicators: [
          'Urgent action required',
          'External suspicious link',
          'Guaranteed unrealistic reward',
          'Unsolicited prize claim',
        ],
        explanation:
          'This message uses classic phishing urgency and suspicious domain hosting to harvest personal/banking credentials under the guise of an unclaimed cash lottery.',
        safeActions: [
          'Do not click any provided links',
          'Report and block the sender',
          'Never share banking OTP or card CVV',
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
        inputContent: 'You have won ₹1,00,000! Click here to claim: http://fake-link.com',
        riskLevel: 'HIGH',
        riskScore: 94,
        suspiciousIndicators: [
          'Urgent action required',
          'External suspicious link',
          'Guaranteed unrealistic reward',
          'Unsolicited prize claim',
        ],
        explanation:
          'This message uses classic phishing urgency and suspicious domain hosting to harvest personal/banking credentials under the guise of an unclaimed cash lottery.',
        safeActions: [
          'Do not click any provided links',
          'Report and block the sender',
          'Never share banking OTP or card CVV',
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
    const fallbackUser: UserProfile = {
      id: userId,
      name: 'Registered User',
      email: `${userId}@financelegacy.local`,
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
};
