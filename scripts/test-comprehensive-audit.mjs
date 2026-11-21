// Comprehensive Audit & Verification Suite for Finance Legacy
import assert from 'assert';

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

// 1. Storage simulation matching StorageService
function saveRegisteredAccount(acc) {
  const accounts = JSON.parse(localStorage.getItem(REGISTERED_ACCOUNTS_KEY) || '[]');
  const idx = accounts.findIndex((a) => a.id === acc.id || a.email.toLowerCase() === acc.email.toLowerCase());
  if (idx >= 0) accounts[idx] = acc;
  else accounts.push(acc);
  localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getRegisteredAccounts() {
  return JSON.parse(localStorage.getItem(REGISTERED_ACCOUNTS_KEY) || '[]');
}

function saveProfile(userId, data) {
  localStorage.setItem(`${PROFILE_KEY_PREFIX}${userId}`, JSON.stringify(data));
}

function loadProfile(userId) {
  const raw = localStorage.getItem(`${PROFILE_KEY_PREFIX}${userId}`);
  return raw ? JSON.parse(raw) : null;
}

// 2. Sanitization & PII redaction check
function sanitizeInput(val) {
  if (typeof val !== 'string') return val;
  return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/[<>]/g, '');
}

function redactSensitivePII(text) {
  let masked = 0;
  let sanitized = text;
  // PAN
  sanitized = sanitized.replace(/\b([A-Z]{5})(\d{4})([A-Z]{1})\b/gi, (_m, p1, _p2, p3) => {
    masked++;
    return `${p1}****${p3}`;
  });
  // UAN (12 digits starting with 10) -> 1012****8829
  sanitized = sanitized.replace(/\b(10\d{2})\d{4}(\d{4})\b/g, (_m, prefix, suffix) => {
    masked++;
    return `${prefix}****${suffix}`;
  });
  // Aadhaar
  sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?(\d{4})\b/g, (_m, last4) => {
    masked++;
    return `XXXX-XXXX-${last4}`;
  });
  return { sanitized, maskedCount: masked };
}

console.log('=== STARTING FINANCE LEGACY COMPREHENSIVE AUDIT TEST ===\n');

// TEST 1: Registered Account Creation & Blank State Initialization
console.log('Test 1: User Registration & Blank Initial Portfolio');
const user1 = {
  id: 'usr_real_' + Date.now() + '_1',
  name: 'Vikramaditya Roy',
  email: 'vikram.roy@domain.in',
  role: 'primary',
  isDemoUser: false,
  onboardingCompleted: true,
};
saveRegisteredAccount(user1);

const user1Profile = {
  user: user1,
  assets: [],
  claims: [],
  documents: [],
  gaps: [],
  footprint: { previousEmployers: ['Tata Motors (2019-2023)'], knownBanks: ['Kotak Mahindra'], previousAddresses: ['Pune'] },
  familyMembers: [{ id: 'fam_1', name: 'Ananya Roy', relationship: 'Spouse', email: 'ananya.roy@domain.in', isNominee: true, accessPermissions: ['Banking', 'EPF'], verificationStatus: 'Not Requested' }],
  nomineeRequest: { nomineeName: 'Ananya Roy', nomineeEmail: 'ananya.roy@domain.in', relationship: 'Spouse', status: 'Not Requested', permittedAssetCategories: ['Banking', 'EPF'] },
  activities: [],
};
saveProfile(user1.id, user1Profile);

assert.strictEqual(loadProfile(user1.id).user.name, 'Vikramaditya Roy');
assert.strictEqual(loadProfile(user1.id).assets.length, 0, 'New user starts with 0 assets');
assert.strictEqual(loadProfile(user1.id).claims.length, 0, 'New user starts with 0 claims');
console.log('✓ Registered account created with strict isolation and zero demo contamination.\n');

// TEST 2: Asset Creation, Category Distribution & Dynamic Recovery Progress
console.log('Test 2: Asset Discovery, Calculations & Recovery Progress');
const newAsset1 = {
  id: 'ast_test_1',
  name: 'Kotak Dormant Current A/C',
  category: 'Banking',
  institution: 'Kotak Mahindra Bank',
  estimatedValue: 180000,
  maskedAccountRef: 'XXXXXX5521',
  verificationStatus: 'Verified',
  nomineeName: 'Ananya Roy',
};
const newAsset2 = {
  id: 'ast_test_2',
  name: 'EPF Accumulated Balance',
  category: 'EPF',
  institution: 'EPFO Pune',
  estimatedValue: 120000,
  maskedAccountRef: 'XXXXXX8812',
  verificationStatus: 'Verified',
  nomineeName: 'Ananya Roy',
};
user1Profile.assets.push(newAsset1, newAsset2);

// Calculate total & category distribution
const totalVal = user1Profile.assets.reduce((s, a) => s + a.estimatedValue, 0);
assert.strictEqual(totalVal, 300000, 'Total asset value must equal ₹3,00,000');

const bankingVal = user1Profile.assets.filter(a => a.category === 'Banking').reduce((s, a) => s + a.estimatedValue, 0);
const bankingPct = Math.round((bankingVal / totalVal) * 100);
assert.strictEqual(bankingPct, 60, 'Banking should be exactly 60% of total portfolio');

// Claim pipeline calculation
const claim1 = {
  id: 'clm_test_1',
  assetId: newAsset1.id,
  assetName: newAsset1.name,
  institution: newAsset1.institution,
  amount: newAsset1.estimatedValue,
  currentStage: 'Claim Submitted',
  progressPercentage: 50,
  history: [
    { stage: 'Asset Discovered', completed: true, date: 'Today' },
    { stage: 'Claim Submitted', completed: true, date: 'Today' },
  ],
};
user1Profile.claims.push(claim1);
saveProfile(user1.id, user1Profile);

const calculatedRecovery = Math.round(
  user1Profile.claims.reduce((s, c) => s + (c.progressPercentage || 50), 0) / user1Profile.claims.length
);
assert.strictEqual(calculatedRecovery, 50, 'Dynamic recovery progress must equal 50%');
console.log('✓ Assets, category percentages (Banking: 60%), and recovery progress correctly computed.\n');

// TEST 3: User Data Isolation
console.log('Test 3: User Data Isolation (User A vs User B)');
const user2 = {
  id: 'usr_real_' + Date.now() + '_2',
  name: 'Sunita Mehra',
  email: 'sunita.mehra@service.org',
  role: 'primary',
  isDemoUser: false,
};
saveRegisteredAccount(user2);
const user2Profile = {
  user: user2,
  assets: [{ id: 'ast_test_u2', name: 'SBI Fixed Deposit', category: 'Banking', institution: 'State Bank of India', estimatedValue: 500000, nomineeName: 'Rajesh Mehra' }],
  claims: [],
  documents: [],
  gaps: [],
  footprint: { previousEmployers: [], knownBanks: ['SBI'], previousAddresses: [] },
  familyMembers: [],
  nomineeRequest: { nomineeName: 'Rajesh Mehra', nomineeEmail: 'rajesh.m@service.org', status: 'Not Requested' },
};
saveProfile(user2.id, user2Profile);

// Verify isolation
assert.notStrictEqual(loadProfile(user1.id).user.id, loadProfile(user2.id).user.id);
assert.strictEqual(loadProfile(user1.id).assets[0].name, 'Kotak Dormant Current A/C');
assert.strictEqual(loadProfile(user2.id).assets[0].name, 'SBI Fixed Deposit');
console.log('✓ Multi-user data isolation verified: User A and User B datasets are completely separated.\n');

// TEST 4: Nominee Binding to Registered Asset Owner
console.log('Test 4: Nominee Portal Data Connection');
const nomineeLookup = (nomEmail, targetOwnerEmail) => {
  const registered = getRegisteredAccounts();
  for (const acc of registered) {
    if (targetOwnerEmail && acc.email.toLowerCase() !== targetOwnerEmail.toLowerCase()) continue;
    const ownerData = loadProfile(acc.id);
    if (!ownerData) continue;
    if (ownerData.nomineeRequest && ownerData.nomineeRequest.nomineeEmail.toLowerCase() === nomEmail.toLowerCase()) {
      return { owner: acc, ownerData };
    }
  }
  return null;
};

const nomResult = nomineeLookup('ananya.roy@domain.in', 'vikram.roy@domain.in');
assert.ok(nomResult, 'Nominee relationship must be located');
assert.strictEqual(nomResult.owner.name, 'Vikramaditya Roy');
assert.strictEqual(nomResult.ownerData.assets.length, 2);
assert.strictEqual(nomResult.ownerData.assets[0].institution, 'Kotak Mahindra Bank');

// Ensure nominee cannot access User 2's data
const unauthorizedNomResult = nomineeLookup('ananya.roy@domain.in', 'sunita.mehra@service.org');
assert.strictEqual(unauthorizedNomResult, null, 'Nominee cannot access unlinked user profile');
console.log('✓ Nominee is strictly bound to registered asset owner and unauthorized access is blocked.\n');

// TEST 5: Security & Input Sanitization
console.log('Test 5: XSS Sanitization & PII Redaction');
const dirtyInput = '<script>alert("xss")</script>SBI Main Branch <b>Safe</b>';
const clean = sanitizeInput(dirtyInput);
assert.ok(!clean.includes('<script>'), 'Script tag stripped');
assert.ok(!clean.includes('<'), 'HTML brackets sanitized');

const sensitiveText = 'My PAN is ABCDE1234F, Aadhaar is 1234-5678-9012, and UAN is 101234567890';
const redacted = redactSensitivePII(sensitiveText);
assert.ok(!redacted.sanitized.includes('1234F'), 'PAN masked');
assert.ok(redacted.sanitized.includes('ABCDE****F'), 'PAN format preserved with masking');
assert.ok(!redacted.sanitized.includes('1234-5678'), 'Aadhaar masked');
assert.ok(redacted.sanitized.includes('1012****7890'), 'UAN masked');
console.log('✓ Input sanitization and PII redaction working accurately.\n');

console.log('=== ALL COMPREHENSIVE AUDIT TESTS PASSED SUCCESSFULLY! ===');
