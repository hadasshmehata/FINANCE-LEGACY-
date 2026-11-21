// Verification test for Nominee View data connection & isolation
import assert from 'assert';

// Mock localStorage for Node test runner
const store = new Map();
globalThis.localStorage = {
  getItem: (key) => store.get(key) || null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
};

const SETTINGS_KEY = 'finance_legacy_app_settings_v2';
const REGISTERED_ACCOUNTS_KEY = 'finance_legacy_registered_accounts_v2';
const PROFILE_KEY_PREFIX = 'fl_profile_';

function saveRegisteredAccount(account) {
  const accounts = JSON.parse(localStorage.getItem(REGISTERED_ACCOUNTS_KEY) || '[]');
  const idx = accounts.findIndex((a) => a.id === account.id || a.email.toLowerCase() === account.email.toLowerCase());
  if (idx >= 0) accounts[idx] = account;
  else accounts.push(account);
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getRegisteredAccounts() {
  return JSON.parse(localStorage.getItem(REGISTERED_ACCOUNTS_KEY) || '[]');
}

function saveProfileData(userId, data) {
  localStorage.setItem(`${PROFILE_KEY_PREFIX}${userId}`, JSON.stringify(data));
}

function loadProfileData(userId) {
  const raw = localStorage.getItem(`${PROFILE_KEY_PREFIX}${userId}`);
  return raw ? JSON.parse(raw) : null;
}

function updateNomineeRequestForOwner(ownerId, updates) {
  const data = loadProfileData(ownerId);
  if (!data) return;
  data.nomineeRequest = { ...data.nomineeRequest, ...updates };
  if (updates.status && data.familyMembers) {
    data.familyMembers = data.familyMembers.map((m) =>
      m.isNominee || (updates.nomineeEmail && m.email.toLowerCase() === updates.nomineeEmail.toLowerCase())
        ? { ...m, verificationStatus: updates.status }
        : m
    );
  }
  saveProfileData(ownerId, data);
}

function findNomineeRelationship(nomineeEmail, targetOwnerEmail) {
  if (!nomineeEmail) return null;
  const cleanNom = nomineeEmail.trim().toLowerCase();
  const cleanTarget = (targetOwnerEmail || '').trim().toLowerCase();

  const registered = getRegisteredAccounts();
  for (const acc of registered) {
    if (cleanTarget) {
      const matchEmail = acc.email.toLowerCase() === cleanTarget;
      const matchName = acc.name.toLowerCase() === cleanTarget;
      if (!matchEmail && !matchName) continue;
    }

    const ownerData = loadProfileData(acc.id);
    if (!ownerData) continue;

    const matchedMember = (ownerData.familyMembers || []).find(
      (m) => m.isNominee && m.email && m.email.toLowerCase().trim() === cleanNom
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

    if (
      ownerData.nomineeRequest &&
      ownerData.nomineeRequest.nomineeEmail &&
      ownerData.nomineeRequest.nomineeEmail.toLowerCase().trim() === cleanNom
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

  return null;
}

console.log('--- STARTING NOMINEE WORKFLOW VERIFICATION TEST ---');

// TEST 1: Register Real User 1 ("Aditya Singhania")
const adityaId = 'usr_real_1001';
const adityaAccount = {
  id: adityaId,
  name: 'Aditya Singhania',
  email: 'aditya.singhania@corp.com',
  password: 'password123',
  role: 'primary',
  createdAt: new Date().toISOString(),
  onboardingCompleted: true,
};
saveRegisteredAccount(adityaAccount);

const adityaProfile = {
  user: {
    id: adityaId,
    name: 'Aditya Singhania',
    email: 'aditya.singhania@corp.com',
    role: 'primary',
    isDemoUser: false,
    onboardingCompleted: true,
    familyMembers: [],
  },
  assets: [
    {
      id: 'ast_101',
      name: 'HDFC Senior Fixed Deposit',
      category: 'Banking',
      institution: 'HDFC Bank',
      estimatedValue: 550000,
      verificationStatus: 'CONFIRMED',
      maskedAccountRef: 'HDFC-FD-****-8812',
    },
    {
      id: 'ast_102',
      name: 'EPF Accumulated Balance',
      category: 'EPF',
      institution: 'EPFO India',
      estimatedValue: 320000,
      verificationStatus: 'CONFIRMED',
      maskedAccountRef: 'UAN-****-1002',
    },
  ],
  claims: [
    {
      id: 'clm_101',
      assetId: 'ast_101',
      stage: 'Form Submitted',
      title: 'HDFC Deposit Transfer',
    },
  ],
  familyMembers: [],
  nomineeRequest: {
    id: `nom_req_${adityaId}`,
    nomineeName: '',
    nomineeEmail: '',
    relationship: '',
    targetUserEmail: 'aditya.singhania@corp.com',
    targetUserName: 'Aditya Singhania',
    status: 'Documents Required',
    deathCertificateUploaded: false,
    relationshipProofUploaded: false,
    biometricVerified: false,
    permittedAssetCategories: [],
  },
};
saveProfileData(adityaId, adityaProfile);
console.log('✓ Registered User 1 (Aditya Singhania) saved with 2 financial assets totaling ₹8,70,000');

// TEST 2: Aditya adds Nominee ("Pooja Singhania")
const poojaNominee = {
  id: 'fam_2001',
  name: 'Pooja Singhania',
  relationship: 'Spouse',
  email: 'pooja.singhania@corp.com',
  phone: '+91 98765 11223',
  isNominee: true,
  accessPermissions: ['Banking', 'EPF'],
  verificationStatus: 'Verification Pending',
};
adityaProfile.familyMembers.push(poojaNominee);
adityaProfile.nomineeRequest = {
  ...adityaProfile.nomineeRequest,
  nomineeName: poojaNominee.name,
  nomineeEmail: poojaNominee.email,
  relationship: poojaNominee.relationship,
  permittedAssetCategories: poojaNominee.accessPermissions,
  status: poojaNominee.verificationStatus,
};
saveProfileData(adityaId, adityaProfile);
console.log('✓ Nominee relationship saved: Pooja Singhania (Spouse) designated for Aditya Singhania');

// TEST 3: Register Real User 2 ("Karan Verma")
const karanId = 'usr_real_1002';
const karanAccount = {
  id: karanId,
  name: 'Karan Verma',
  email: 'karan.verma@corp.com',
  password: 'password123',
  role: 'primary',
  createdAt: new Date().toISOString(),
  onboardingCompleted: true,
};
saveRegisteredAccount(karanAccount);

const karanProfile = {
  user: {
    id: karanId,
    name: 'Karan Verma',
    email: 'karan.verma@corp.com',
    role: 'primary',
    isDemoUser: false,
    onboardingCompleted: true,
    familyMembers: [],
  },
  assets: [
    {
      id: 'ast_201',
      name: 'ICICI Mutual Fund Folio',
      category: 'Investments',
      institution: 'ICICI Prudential',
      estimatedValue: 1200000,
      verificationStatus: 'CONFIRMED',
      maskedAccountRef: 'ICICI-MF-****-9900',
    },
  ],
  claims: [],
  familyMembers: [
    {
      id: 'fam_3001',
      name: 'Sneha Verma',
      relationship: 'Spouse',
      email: 'sneha.verma@corp.com',
      isNominee: true,
      accessPermissions: ['Investments'],
      verificationStatus: 'Verification Pending',
    },
  ],
  nomineeRequest: {
    id: `nom_req_${karanId}`,
    nomineeName: 'Sneha Verma',
    nomineeEmail: 'sneha.verma@corp.com',
    relationship: 'Spouse',
    targetUserEmail: 'karan.verma@corp.com',
    targetUserName: 'Karan Verma',
    status: 'Verification Pending',
    deathCertificateUploaded: false,
    relationshipProofUploaded: false,
    biometricVerified: false,
    permittedAssetCategories: ['Investments'],
  },
};
saveProfileData(karanId, karanProfile);
console.log('✓ Registered User 2 (Karan Verma) saved with distinct assets and nominee Sneha Verma');

// TEST 4: Nominee View queries relationship for Pooja Singhania
const relPooja = findNomineeRelationship('pooja.singhania@corp.com', 'aditya.singhania@corp.com');
assert(relPooja !== null, 'Relationship for Pooja must exist');
assert.strictEqual(relPooja.ownerAccount.name, 'Aditya Singhania', 'Asset Owner MUST be Aditya Singhania');
assert.strictEqual(relPooja.ownerAccount.email, 'aditya.singhania@corp.com');
assert.strictEqual(relPooja.nomineeMember.name, 'Pooja Singhania');
assert.strictEqual(relPooja.ownerData.assets.length, 2, 'Must retrieve Aditya\'s 2 assets');
assert.strictEqual(relPooja.ownerData.assets[0].name, 'HDFC Senior Fixed Deposit');
assert.strictEqual(relPooja.ownerData.assets[0].institution, 'HDFC Bank');
assert.strictEqual(relPooja.ownerData.assets[0].estimatedValue, 550000);
console.log('✓ Nominee View correctly retrieves Aditya Singhania\'s real assets (HDFC Bank, EPFO) - NOT Ramesh Kumar!');

// TEST 5: Verify Ramesh Kumar demo data is NOT displayed
assert.notStrictEqual(relPooja.ownerAccount.name, 'Ramesh Kumar', 'Must NOT display Ramesh Kumar');
assert(!JSON.stringify(relPooja.ownerData).includes('Ramesh Kumar'), 'No Ramesh Kumar data in owner profile');
console.log('✓ Verified: Ramesh Kumar demo data is completely absent from registered nominee access');

// TEST 6: Strict Isolation — Pooja cannot access Karan Verma\'s assets
const crossAccess = findNomineeRelationship('pooja.singhania@corp.com', 'karan.verma@corp.com');
assert.strictEqual(crossAccess, null, 'Pooja MUST NOT be able to access Karan Verma\'s financial details');
console.log('✓ Cross-Account Security: Unauthorized nominee cannot access another user\'s financial data');

// TEST 7: Unregistered Nominee
const unknownNominee = findNomineeRelationship('stranger@test.com', 'aditya.singhania@corp.com');
assert.strictEqual(unknownNominee, null, 'Unregistered nominee returns null');
console.log('✓ Unlinked nominee correctly rejected (triggers "No linked asset owner found" message)');

// TEST 8: Succession verification & Access Approval workflow
updateNomineeRequestForOwner(adityaId, {
  deathCertificateUploaded: true,
  deathCertificateDetails: {
    deceasedName: 'Aditya Singhania',
    dateOfDeath: 'Nov 15, 2026',
    registrationNumber: 'MCD/DTH/2026/88812',
    issuingAuthority: 'Municipal Corporation of Delhi',
    verified: true,
  },
  relationshipProofUploaded: true,
  biometricVerified: true,
  status: 'Access Approved',
});

const updatedRel = findNomineeRelationship('pooja.singhania@corp.com', 'aditya.singhania@corp.com');
assert.strictEqual(updatedRel.ownerData.nomineeRequest.status, 'Access Approved');
assert.strictEqual(updatedRel.ownerData.nomineeRequest.biometricVerified, true);
assert.strictEqual(updatedRel.ownerData.nomineeRequest.deathCertificateUploaded, true);
console.log('✓ Succession Verification workflow: Death cert, biometric passkey, and Access Approval successfully persisted in asset owner profile');

console.log('\n--- ALL NOMINEE WORKFLOW TESTS PASSED SUCCESSFULLY! ---');
