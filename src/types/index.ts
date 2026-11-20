export type UserRole = 'primary' | 'nominee';

export type NomineeAccessStatus =
  | 'Not Requested'
  | 'Verification Pending'
  | 'Pending Verification'
  | 'Documents Required'
  | 'Access Approved'
  | 'Approved'
  | 'Access Rejected'
  | 'Restricted';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Other';
  email: string;
  phone?: string;
  isNominee: boolean;
  accessPermissions: AssetCategory[];
  verificationStatus: NomineeAccessStatus;
  invitationSentDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  biometricRegistered?: boolean;
  age?: number;
  occupation?: string;
  dateOfBirth?: string;
  address?: string;
  isDemoUser?: boolean;
  onboardingCompleted?: boolean;
  familyMembers?: FamilyMember[];
}

export type AssetCategory =
  | 'Banking'
  | 'Investments'
  | 'Insurance'
  | 'EPF'
  | 'Pension'
  | 'Mutual Funds'
  | 'Stocks'
  | 'Postal Savings'
  | 'Others';

export type VerificationStatus =
  | 'Potentially Discovered'
  | 'Unverified'
  | 'Verified'
  | 'Documents Required'
  | 'Claim Preparation'
  | 'Claim Submitted'
  | 'Under Verification'
  | 'Approved'
  | 'Recovered'
  | 'Closed';

export interface FinancialAsset {
  id: string;
  name: string;
  category: AssetCategory;
  institution: string;
  estimatedValue: number;
  maskedAccountRef: string;
  evidenceSource: string;
  confidenceScore: number; // e.g. 98, 95, 92
  verificationStatus: VerificationStatus;
  nomineeName?: string;
  nomineeRelationship?: string;
  discoveryDate: string;
  claimId?: string;
  notes?: string;
  linkedDocumentIds: string[];
}

export type ClaimStage =
  | 'Asset Discovered'
  | 'Verification Complete'
  | 'Claim Submitted'
  | 'Under Verification'
  | 'Recovery Pending'
  | 'Recovered';

export interface ClaimTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Claim {
  id: string;
  assetId: string;
  assetName: string;
  institution: string;
  assetType: AssetCategory;
  amount: number;
  claimReferenceNumber: string;
  currentStage: ClaimStage;
  progressPercentage: number;
  submissionDate: string;
  followUpDate: string;
  readinessScore: number;
  notes: string;
  tasks: ClaimTask[];
  history: {
    stage: ClaimStage;
    date: string;
    description: string;
    completed: boolean;
  }[];
}

export type DocumentCategory =
  | 'Bank Statements'
  | 'Salary Slips'
  | 'EPF Records'
  | 'Insurance Policies'
  | 'Investment Statements'
  | 'Pension Docs'
  | 'Identity Documents'
  | 'Death Certificates'
  | 'Claim Documents'
  | 'Other';

export interface ExtractedFinancialEntity {
  label: string;
  value: string;
  confidence: number;
  type?: 'account' | 'institution' | 'amount' | 'date' | 'uan' | 'policy' | 'nominee';
}

export interface DocumentItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  category: DocumentCategory;
  uploadDate: string;
  analyzed: boolean;
  confidenceScore: number;
  financialInstitution?: string;
  extractedEntities: ExtractedFinancialEntity[];
  potentialAssetFound?: string;
  aiExplanation?: string;
  recommendedSteps?: string[];
  linkedAssetId?: string;
  previewUrl?: string;
}

export type GapPriority = 'High' | 'Medium' | 'Info';

export interface FinancialGap {
  id: string;
  title: string;
  priority: GapPriority;
  evidence: string;
  confidenceScore: number;
  explanation: string;
  potentialConnection: string;
  recommendedAction: string;
  verificationResources: string[];
  resolved: boolean;
}

export interface FootprintRecord {
  previousEmployers: string[];
  knownBanks: string[];
  previousAddresses: string[];
  knownInsurance: string[];
  investments: string[];
  phoneEmailClues: string[];
  potentialConnections: {
    id: string;
    title: string;
    type: string;
    institution: string;
    evidence: string;
    confidence: number;
    recommendedVerification: string;
  }[];
}

export interface NomineeRequest {
  id: string;
  nomineeName: string;
  nomineeEmail: string;
  relationship: string;
  targetUserEmail: string;
  targetUserName: string;
  status: NomineeAccessStatus;
  requestDate: string;
  approvedDate?: string;
  deathCertificateUploaded: boolean;
  deathCertificateDetails?: {
    deceasedName: string;
    dateOfDeath: string;
    registrationNumber: string;
    issuingAuthority: string;
    verified: boolean;
  };
  relationshipProofUploaded: boolean;
  relationshipProofDetails?: {
    documentType: string;
    verified: boolean;
  };
  biometricVerified: boolean;
  permittedAssetCategories: AssetCategory[];
}

export interface FraudAnalysisResult {
  id: string;
  inputContent: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number; // 0-100
  suspiciousIndicators: string[];
  explanation: string;
  safeActions: string[];
  analyzedAt: string;
}

export interface ClaimLetter {
  id: string;
  title: string;
  assetId?: string;
  institution: string;
  recipientDesignation: string;
  subject: string;
  letterBody: string;
  dateGenerated: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'upload' | 'discovery' | 'claim' | 'verification' | 'alert';
  icon?: string;
}
