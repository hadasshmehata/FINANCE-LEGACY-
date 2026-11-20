import {
  UserProfile,
  FinancialAsset,
  Claim,
  DocumentItem,
  FinancialGap,
  FootprintRecord,
  NomineeRequest,
  ClaimLetter,
  ChatMessage,
  ActivityItem
} from '../types';

export const initialPrimaryUser: UserProfile = {
  id: 'usr_001',
  name: 'Ramesh Kumar',
  email: 'ramesh.kumar@email.com',
  phone: '+91 98765 43210',
  role: 'primary',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  biometricRegistered: true,
};

export const initialNomineeUser: UserProfile = {
  id: 'usr_002',
  name: 'Priya Kumar',
  email: 'priya.k@email.com',
  phone: '+91 98765 12345',
  role: 'nominee',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  biometricRegistered: false,
};

export const initialAssets: FinancialAsset[] = [
  {
    id: 'ast_001',
    name: 'ABC Bank Savings',
    category: 'Banking',
    institution: 'ABC Bank',
    estimatedValue: 125000,
    maskedAccountRef: '******4821',
    evidenceSource: 'Bank Statement Q4 2023',
    confidenceScore: 98,
    verificationStatus: 'Verified',
    nomineeName: 'Priya Kumar',
    nomineeRelationship: 'Spouse',
    discoveryDate: 'Apr 18, 2025',
    claimId: 'clm_001',
    notes: 'Dormant account identified via 2023 consolidated tax certificate.',
    linkedDocumentIds: ['doc_001'],
  },
  {
    id: 'ast_002',
    name: 'XYZ Fixed Deposit',
    category: 'Banking',
    institution: 'XYZ Bank',
    estimatedValue: 85000,
    maskedAccountRef: 'FD-****9012',
    evidenceSource: 'TDS Certificate Form 26AS',
    confidenceScore: 95,
    verificationStatus: 'Unverified',
    nomineeName: 'Priya Kumar',
    nomineeRelationship: 'Spouse',
    discoveryDate: 'Apr 19, 2025',
    claimId: 'clm_002',
    notes: 'Fixed deposit originated in 2019, interest TDS entries found.',
    linkedDocumentIds: ['doc_002'],
  },
  {
    id: 'ast_003',
    name: 'EPF Account',
    category: 'EPF',
    institution: 'EPFO',
    estimatedValue: 42500,
    maskedAccountRef: '1012****8829',
    evidenceSource: 'Salary Slip Oct 2021 (ABC Tech)',
    confidenceScore: 92,
    verificationStatus: 'Potentially Discovered',
    nomineeName: 'Priya Kumar',
    nomineeRelationship: 'Spouse',
    discoveryDate: 'Apr 20, 2025',
    claimId: 'clm_003',
    notes: 'Provident fund balance from previous employment at ABC Technologies.',
    linkedDocumentIds: ['doc_003'],
  },
  {
    id: 'ast_004',
    name: 'HDFC Life Insurance Policy',
    category: 'Insurance',
    institution: 'HDFC Life',
    estimatedValue: 180000,
    maskedAccountRef: 'POL-****7419',
    evidenceSource: 'Monthly Auto-Debit ECS Clue',
    confidenceScore: 88,
    verificationStatus: 'Documents Required',
    nomineeName: 'Rohan Kumar',
    nomineeRelationship: 'Son',
    discoveryDate: 'Apr 21, 2025',
    notes: 'Recurring auto-debit of ₹4,200 discovered in old passbook entries.',
    linkedDocumentIds: [],
  },
  {
    id: 'ast_005',
    name: 'SBI Mutual Fund (Bluechip)',
    category: 'Mutual Funds',
    institution: 'SBI Mutual Fund',
    estimatedValue: 65000,
    maskedAccountRef: 'FOLIO-****3310',
    evidenceSource: 'Dividend Credit in ABC Bank',
    confidenceScore: 91,
    verificationStatus: 'Verified',
    nomineeName: 'Priya Kumar',
    nomineeRelationship: 'Spouse',
    discoveryDate: 'Apr 22, 2025',
    claimId: 'clm_004',
    notes: 'Folio discovered from dividend distribution direct credit statement.',
    linkedDocumentIds: ['doc_004'],
  },
];

export const initialClaims: Claim[] = [
  {
    id: 'clm_001',
    assetId: 'ast_001',
    assetName: 'ABC Bank Savings Account',
    institution: 'ABC Bank',
    assetType: 'Banking',
    amount: 125000,
    claimReferenceNumber: 'CLM-ABC-2025-098',
    currentStage: 'Under Verification',
    progressPercentage: 70,
    submissionDate: 'Apr 22, 2025',
    followUpDate: 'May 10, 2025',
    readinessScore: 94,
    notes: 'KYC re-validation submitted at Connaught Place Branch.',
    tasks: [
      { id: 't1', title: 'Submit Inactive Account Activation Form', completed: true, dueDate: 'Apr 21, 2025' },
      { id: 't2', title: 'Provide Self-Attested PAN & Aadhaar Copy', completed: true, dueDate: 'Apr 22, 2025' },
      { id: 't3', title: 'Branch Manager Signature on KYC Undertaking', completed: true, dueDate: 'Apr 23, 2025' },
      { id: 't4', title: 'Await Final Unfreezing SMS Notification', completed: false, dueDate: 'May 08, 2025' },
    ],
    history: [
      { stage: 'Asset Discovered', date: 'Apr 20, 2025', description: 'AI identified account from 2023 statement.', completed: true },
      { stage: 'Verification Complete', date: 'Apr 21, 2025', description: 'Masked account match confirmed by bank branch code.', completed: true },
      { stage: 'Claim Submitted', date: 'Apr 22, 2025', description: 'Application delivered to customer care desk.', completed: true },
      { stage: 'Under Verification', date: 'Apr 23, 2025', description: 'Compliance team reviewing dormant KYC.', completed: true },
      { stage: 'Recovery Pending', date: 'Pending', description: 'Funds disbursement to active primary savings.', completed: false },
    ],
  },
  {
    id: 'clm_002',
    assetId: 'ast_002',
    assetName: 'XYZ Fixed Deposit Certificate',
    institution: 'XYZ Bank',
    assetType: 'Banking',
    amount: 85000,
    claimReferenceNumber: 'CLM-XYZ-2025-412',
    currentStage: 'Claim Submitted',
    progressPercentage: 55,
    submissionDate: 'Apr 23, 2025',
    followUpDate: 'May 12, 2025',
    readinessScore: 88,
    notes: 'Maturity proceeds claim filed along with indemnity bond.',
    tasks: [
      { id: 't21', title: 'Download TDS Certificate Form 16A', completed: true, dueDate: 'Apr 20, 2025' },
      { id: 't22', title: 'Execute Indemnity Bond for Lost FD Receipt', completed: true, dueDate: 'Apr 23, 2025' },
      { id: 't23', title: 'Branch verification of original signatures', completed: false, dueDate: 'May 05, 2025' },
    ],
    history: [
      { stage: 'Asset Discovered', date: 'Apr 19, 2025', description: 'FD interest discovered in tax record.', completed: true },
      { stage: 'Verification Complete', date: 'Apr 22, 2025', description: 'Account number validated.', completed: true },
      { stage: 'Claim Submitted', date: 'Apr 23, 2025', description: 'Claim papers dispatched.', completed: true },
      { stage: 'Under Verification', date: 'Pending', description: 'Awaiting signature verification.', completed: false },
      { stage: 'Recovery Pending', date: 'Pending', description: 'Crediting to verified savings account.', completed: false },
    ],
  },
  {
    id: 'clm_003',
    assetId: 'ast_003',
    assetName: 'EPFO Dormant PF Balance',
    institution: 'EPFO',
    assetType: 'EPF',
    amount: 42500,
    claimReferenceNumber: 'EPF-DEL-2025-771',
    currentStage: 'Claim Submitted',
    progressPercentage: 65,
    submissionDate: 'Apr 22, 2025',
    followUpDate: 'May 15, 2025',
    readinessScore: 92,
    notes: 'Online transfer claim to current active UAN initiated.',
    tasks: [
      { id: 't31', title: 'Link UAN with Aadhaar and Active Mobile', completed: true, dueDate: 'Apr 18, 2025' },
      { id: 't32', title: 'Submit Online Transfer Form 13', completed: true, dueDate: 'Apr 22, 2025' },
      { id: 't33', title: 'Employer Attestation (ABC Tech HR)', completed: true, dueDate: 'Apr 25, 2025' },
      { id: 't34', title: 'Field Office Approval', completed: false, dueDate: 'May 12, 2025' },
    ],
    history: [
      { stage: 'Asset Discovered', date: 'Apr 20, 2025', description: 'Member ID extracted from salary slip.', completed: true },
      { stage: 'Verification Complete', date: 'Apr 21, 2025', description: 'Unified portal verified KYC status.', completed: true },
      { stage: 'Claim Submitted', date: 'Apr 22, 2025', description: 'Form 13 submitted on member e-Sewa portal.', completed: true },
      { stage: 'Under Verification', date: 'In Progress', description: 'Regional PF Commissioner office review.', completed: false },
      { stage: 'Recovery Pending', date: 'Pending', description: 'Final electronic credit.', completed: false },
    ],
  },
  {
    id: 'clm_004',
    assetId: 'ast_005',
    assetName: 'SBI Mutual Fund Folio Transmission',
    institution: 'SBI Mutual Fund',
    assetType: 'Mutual Funds',
    amount: 65000,
    claimReferenceNumber: 'MF-SBI-2025-104',
    currentStage: 'Verification Complete',
    progressPercentage: 40,
    submissionDate: 'Apr 24, 2025',
    followUpDate: 'May 18, 2025',
    readinessScore: 85,
    notes: 'Transmission request documents ready for CAMS submission.',
    tasks: [
      { id: 't41', title: 'Obtain Consolidated Account Statement (CAS)', completed: true, dueDate: 'Apr 21, 2025' },
      { id: 't42', title: 'Submit Form T3 (Transmission Request)', completed: false, dueDate: 'May 02, 2025' },
    ],
    history: [
      { stage: 'Asset Discovered', date: 'Apr 22, 2025', description: 'Dividend entry spotted.', completed: true },
      { stage: 'Verification Complete', date: 'Apr 24, 2025', description: 'Folio verified with CAMS.', completed: true },
      { stage: 'Claim Submitted', date: 'Pending', description: 'T3 dispatch pending.', completed: false },
      { stage: 'Under Verification', date: 'Pending', description: 'Registrar review.', completed: false },
      { stage: 'Recovery Pending', date: 'Pending', description: 'Units credited.', completed: false },
    ],
  },
  {
    id: 'clm_005',
    assetId: 'ast_004',
    assetName: 'HDFC Life Policy Surrender / Revival',
    institution: 'HDFC Life',
    assetType: 'Insurance',
    amount: 180000,
    claimReferenceNumber: 'INS-HDFC-2025-339',
    currentStage: 'Asset Discovered',
    progressPercentage: 20,
    submissionDate: 'Pending',
    followUpDate: 'May 20, 2025',
    readinessScore: 60,
    notes: 'Missing original policy bond; duplicate bond indemnity required.',
    tasks: [
      { id: 't51', title: 'Trace Policy Number from Net Banking ECS records', completed: true, dueDate: 'Apr 20, 2025' },
      { id: 't52', title: 'Request Duplicate Policy Bond from Branch', completed: false, dueDate: 'May 05, 2025' },
    ],
    history: [
      { stage: 'Asset Discovered', date: 'Apr 21, 2025', description: 'Recurring premium clue analyzed.', completed: true },
      { stage: 'Verification Complete', date: 'Pending', description: 'Insurer branch search.', completed: false },
      { stage: 'Claim Submitted', date: 'Pending', description: 'Waiting for policy documents.', completed: false },
      { stage: 'Under Verification', date: 'Pending', description: 'Underwriting investigation.', completed: false },
      { stage: 'Recovery Pending', date: 'Pending', description: 'Surrender value payout.', completed: false },
    ],
  },
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc_001',
    fileName: 'ABC_Bank_Consolidated_Statement_2023.pdf',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    category: 'Bank Statements',
    uploadDate: 'Apr 18, 2025',
    analyzed: true,
    confidenceScore: 98,
    financialInstitution: 'ABC Bank',
    extractedEntities: [
      { label: 'Account Holder', value: 'Ramesh Kumar', confidence: 99, type: 'nominee' },
      { label: 'Account Number', value: 'XXXXXX4821', confidence: 98, type: 'account' },
      { label: 'IFSC Code', value: 'ABCD0001234', confidence: 99, type: 'institution' },
      { label: 'Last Credit Balance', value: '₹1,25,000.00', confidence: 97, type: 'amount' },
      { label: 'Status', value: 'Dormant / Inactive since Nov 2022', confidence: 95, type: 'institution' },
    ],
    potentialAssetFound: 'ABC Bank Savings Account (₹1,25,000)',
    aiExplanation: 'Account has been classified as dormant due to no debit transactions for >24 months. Total accrued balance is eligible for unfreezing or recovery.',
    recommendedSteps: [
      'Submit Form 15G/15H and fresh KYC proofs at the home branch.',
      'Request account reactivation and test with ₹100 deposit.',
    ],
    linkedAssetId: 'ast_001',
  },
  {
    id: 'doc_002',
    fileName: 'Form_26AS_Tax_Credit_FY2022.pdf',
    fileSize: '1.8 MB',
    fileType: 'application/pdf',
    category: 'Investment Statements',
    uploadDate: 'Apr 19, 2025',
    analyzed: true,
    confidenceScore: 95,
    financialInstitution: 'XYZ Bank',
    extractedEntities: [
      { label: 'Deductor Name', value: 'XYZ Bank Limited', confidence: 98, type: 'institution' },
      { label: 'TDS Deducted under Section', value: '194A (Interest other than securities)', confidence: 96, type: 'institution' },
      { label: 'Total Interest Paid', value: '₹6,800.00', confidence: 94, type: 'amount' },
      { label: 'Derived Principal Value', value: '₹85,000 (at approx 8% p.a.)', confidence: 92, type: 'amount' },
      { label: 'FD Reference', value: 'FD-****9012', confidence: 93, type: 'account' },
    ],
    potentialAssetFound: 'XYZ Bank Fixed Deposit (₹85,000)',
    aiExplanation: 'Interest TDS entry reflects an active or matured Term Deposit not tracked in your regular accounts.',
    recommendedSteps: [
      'Approach XYZ Bank branch with PAN card and TDS certificate to locate deposit receipt.',
    ],
    linkedAssetId: 'ast_002',
  },
  {
    id: 'doc_003',
    fileName: 'Salary_Slip_ABC_Technologies_Oct2021.pdf',
    fileSize: '840 KB',
    fileType: 'application/pdf',
    category: 'Salary Slips',
    uploadDate: 'Today, 10:30 AM',
    analyzed: true,
    confidenceScore: 92,
    financialInstitution: 'EPFO / ABC Technologies',
    extractedEntities: [
      { label: 'Employee Name', value: 'Ramesh Kumar', confidence: 99, type: 'nominee' },
      { label: 'Universal Account Number (UAN)', value: '1012****8829', confidence: 94, type: 'uan' },
      { label: 'PF Member ID', value: 'DL/CPM/0045812/000/000109', confidence: 92, type: 'account' },
      { label: 'Monthly PF Deduction', value: '₹1,800.00', confidence: 96, type: 'amount' },
      { label: 'Estimated Unclaimed Corpus', value: '₹42,500.00', confidence: 89, type: 'amount' },
    ],
    potentialAssetFound: 'EPF Account at EPFO (₹42,500)',
    aiExplanation: 'Historical PF contributions deducted from ABC Tech were never transferred to your current employer UAN.',
    recommendedSteps: [
      'Log into Member e-Sewa using UAN 1012****8829.',
      'File Online Transfer Claim (Form 13).',
    ],
    linkedAssetId: 'ast_003',
  },
  {
    id: 'doc_004',
    fileName: 'SBI_Mutual_Fund_Dividend_Advice.pdf',
    fileSize: '1.1 MB',
    fileType: 'application/pdf',
    category: 'Investment Statements',
    uploadDate: 'Apr 22, 2025',
    analyzed: true,
    confidenceScore: 91,
    financialInstitution: 'SBI Mutual Fund',
    extractedEntities: [
      { label: 'Folio Number', value: 'FOLIO-****3310', confidence: 95, type: 'account' },
      { label: 'Scheme Name', value: 'SBI Bluechip Fund - Direct Growth', confidence: 94, type: 'institution' },
      { label: 'Estimated Value', value: '₹65,000.00', confidence: 90, type: 'amount' },
    ],
    potentialAssetFound: 'SBI Mutual Fund Folio (₹65,000)',
    aiExplanation: 'Dividend direct deposit discovered in old bank record, holding remains active in CAMS repository.',
    recommendedSteps: [
      'Request a consolidated CAS statement via CAMS / KFintech.',
    ],
    linkedAssetId: 'ast_005',
  },
];

export const initialGaps: FinancialGap[] = [
  {
    id: 'gap_001',
    title: 'EPF Information Missing',
    priority: 'High',
    evidence: 'Previous employment at ABC Technologies found in resume & salary slip, but no EPF transfer or withdrawal records exist.',
    confidenceScore: 94,
    explanation: 'Salaried employment in an establishment with >20 employees legally mandates EPF deduction. Unclaimed balance continues to accrue interest until age 58.',
    potentialConnection: 'EPFO Member Account linked to ABC Technologies (Est. Value ₹42,500)',
    recommendedAction: 'Verify UAN on EPFO Unified Portal and initiate Form 13 transfer.',
    verificationResources: ['EPFO Unified Member Portal (unifiedportal-mem.epfindia.gov.in)', 'Form 13 Guidelines'],
    resolved: false,
  },
  {
    id: 'gap_002',
    title: 'Insurance Policy Missing',
    priority: 'Medium',
    evidence: 'Recurring ECS auto-debits of ₹4,200 labeled "HDFC-LIFE-PREM" detected in 2022-2023 bank statements.',
    confidenceScore: 89,
    explanation: 'Regular premium deductions indicate an active life or endowment insurance policy, but no policy document or maturity receipt has been uploaded.',
    potentialConnection: 'HDFC Life Endowment or Term Policy (Sum Assured approx ₹1,80,000)',
    recommendedAction: 'Contact HDFC Life Customer Service with PAN and bank debit reference to obtain duplicate policy document.',
    verificationResources: ['HDFC Life Policy Lookup Portal', 'IRDAI Bima Bharosa Portal'],
    resolved: false,
  },
  {
    id: 'gap_003',
    title: 'FD Maturity Details Missing',
    priority: 'Info',
    evidence: 'Fixed deposit interest TDS deduction reported in Form 26AS for FY 2021-22 under XYZ Bank.',
    confidenceScore: 84,
    explanation: 'A fixed deposit exists with XYZ Bank that may have matured without auto-renewal or auto-credit instructions.',
    potentialConnection: 'XYZ Bank Term Deposit Certificate (Estimated ₹85,000)',
    recommendedAction: 'Visit XYZ Bank branch or check net banking unclaimed deposit register.',
    verificationResources: ['RBI UDGAM Portal (udgam.rbi.org.in)', 'XYZ Bank Unclaimed Deposits Search'],
    resolved: false,
  },
];

export const initialFootprint: FootprintRecord = {
  previousEmployers: ['ABC Technologies (2018 - 2021)', 'Infoway Solutions (2015 - 2018)'],
  knownBanks: ['ABC Bank', 'XYZ Bank', 'HDFC Bank', 'SBI'],
  previousAddresses: ['Flat 402, Green Glen Layout, Bellandur, Bangalore', 'C-12, Sector 62, Noida, Delhi NCR'],
  knownInsurance: ['HDFC Life Insurance', 'LIC of India (Jeevan Anand)'],
  investments: ['SBI Mutual Fund', 'Zerodha Broking Ltd'],
  phoneEmailClues: ['ramesh.kumar99@olddomain.com', '+91 98450 XXXXX'],
  potentialConnections: [
    {
      id: 'conn_001',
      title: 'EPF Account Clue',
      type: 'EPF',
      institution: 'EPFO (ABC Technologies)',
      evidence: 'Employment records show 3.5 years tenure with provident fund deduction.',
      confidence: 94,
      recommendedVerification: 'Check EPFO Member Portal with historical UAN.',
    },
    {
      id: 'conn_002',
      title: 'Insurance Payment Clue',
      type: 'Insurance',
      institution: 'HDFC Life Insurance',
      evidence: 'Electronic Clearing Service (ECS) mandate traces found in legacy statements.',
      confidence: 89,
      recommendedVerification: 'Submit PAN card to HDFC Life policy tracking portal.',
    },
    {
      id: 'conn_003',
      title: 'Salary Account Residual Balance',
      type: 'Banking',
      institution: 'HDFC Bank (Noida Branch)',
      evidence: 'Old salary bank account opened during Infoway Solutions tenure.',
      confidence: 82,
      recommendedVerification: 'Query RBI UDGAM portal for inactive account balances.',
    },
    {
      id: 'conn_004',
      title: 'Post Office Recurring Deposit',
      type: 'Postal Savings',
      institution: 'India Post',
      evidence: 'Noida residential address passbook record noted in family papers.',
      confidence: 76,
      recommendedVerification: 'Approach local post office with Aadhaar and passbook copy.',
    },
  ],
};

export const initialNomineeRequest: NomineeRequest = {
  id: 'nom_req_001',
  nomineeName: 'Priya Kumar',
  nomineeEmail: 'priya.k@email.com',
  relationship: 'Spouse',
  targetUserEmail: 'ramesh.kumar@email.com',
  targetUserName: 'Ramesh Kumar',
  status: 'Pending Verification',
  requestDate: 'Apr 21, 2025',
  deathCertificateUploaded: false,
  relationshipProofUploaded: true,
  biometricVerified: false,
  permittedAssetCategories: ['Banking', 'EPF', 'Insurance'],
};

export const initialLetters: ClaimLetter[] = [
  {
    id: 'ltr_001',
    title: 'Bank Inactive Account Reactivation & Claim Letter',
    assetId: 'ast_001',
    institution: 'ABC Bank',
    recipientDesignation: 'The Branch Manager, ABC Bank, Connaught Place Branch, New Delhi',
    subject: 'Request for Reactivation and Disbursement of Balance in Inoperative Savings Account No. XXXXXX4821',
    category: 'Banking',
    dateGenerated: 'Apr 22, 2025',
    letterBody: `To,
The Branch Manager,
ABC Bank, Connaught Place Branch,
New Delhi - 110001.

Subject: Request for Reactivation and Disbursement of Balance in Inoperative Savings Account No. XXXXXX4821

Respected Sir/Madam,

I, Ramesh Kumar, holding PAN: ABCDE1234F, am the sole account holder of Savings Bank Account No. XXXXXX4821 held at your branch.

Due to a change in residence and employment relocation, I was unable to operate the aforementioned account for an extended period, resulting in its classification as Inoperative / Dormant under RBI regulations.

As per my records and consolidated statements, a sum of approximately ₹1,25,000 (Rupees One Lakh Twenty-Five Thousand Only) plus accrued interest is standing to the credit of this account.

I hereby submit the required self-attested documents for fresh Know Your Customer (KYC) compliance:
1. Copy of Aadhaar Card (Proof of Identity & Address)
2. Copy of PAN Card
3. Two recent passport-size photographs
4. Cancelled cheque / Bank statement of my active primary savings account

I request you to kindly re-activate the account and facilitate the transfer of the entire credit balance to my active account details enclosed herewith.

Thanking you,

Yours faithfully,

Ramesh Kumar
Contact: +91 98765 43210
Email: ramesh.kumar@email.com
Date: April 22, 2025`,
  },
  {
    id: 'ltr_002',
    title: 'EPFO Form 19/10C Settlement Application Letter',
    assetId: 'ast_003',
    institution: 'EPFO',
    recipientDesignation: 'The Regional Provident Fund Commissioner, EPFO Regional Office, Delhi North',
    subject: 'Claim Application for Settlement of Dormant EPF Accumulations under UAN 1012****8829',
    category: 'EPF',
    dateGenerated: 'Apr 23, 2025',
    letterBody: `To,
The Regional Provident Fund Commissioner,
Employees' Provident Fund Organisation,
Regional Office, Wazirpur Industrial Area,
Delhi - 110052.

Subject: Claim Application for Settlement of Dormant EPF Accumulations under UAN 1012****8829

Respected Commissioner,

I was formerly employed with M/s ABC Technologies Pvt. Ltd. from October 2018 through November 2021, having PF Member ID DL/CPM/0045812/000/000109 linked to Universal Account Number (UAN) 1012****8829.

My provident fund balance of approximately ₹42,500 has remained non-operational since separation from service. I have completed Aadhaar seeding and KYC verification on the Unified Member Portal.

I humbly request your good office to process the full and final settlement / transfer of my accumulated provident fund and pension benefit credits to my linked verified bank account.

Enclosures:
1. Salary Slip copy bearing Member ID
2. Cancelled cheque with printed name
3. Copy of Aadhaar & PAN card

Yours sincerely,

Ramesh Kumar
UAN: 1012****8829`,
  },
];

export const initialActivities: ActivityItem[] = [
  {
    id: 'act_1',
    title: 'Salary slip uploaded - Today, 10:30 AM',
    timestamp: 'Today, 10:30 AM',
    type: 'upload',
  },
  {
    id: 'act_2',
    title: 'FD clue detected - Today, 09:15 AM',
    timestamp: 'Today, 09:15 AM',
    type: 'discovery',
  },
  {
    id: 'act_3',
    title: 'Claim tracker updated - Yesterday',
    timestamp: 'Yesterday, 04:45 PM',
    type: 'claim',
  },
  {
    id: 'act_4',
    title: 'ABC Bank savings verified - Apr 21, 2025',
    timestamp: 'Apr 21, 2025',
    type: 'verification',
  },
  {
    id: 'act_5',
    title: 'AI Footprint analysis performed - Apr 20, 2025',
    timestamp: 'Apr 20, 2025',
    type: 'alert',
  },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'assistant',
    text: "Hello Ramesh! I am your AI Financial Legacy Assistant. I have analyzed your uploaded documents and identified potential forgotten assets worth ₹2,52,500 across 4 institutions. How can I assist you with your recovery journey today?",
    timestamp: '10:30 AM',
    suggestedActions: [
      { label: 'What are my potential assets?', action: 'assets' },
      { label: 'Which documents are missing?', action: 'missing_docs' },
      { label: 'How can I verify my EPF?', action: 'epf_guide' },
      { label: 'What is my recovery progress?', action: 'recovery_progress' },
    ],
  },
];

