import {
  UserProfile,
  FinancialAsset,
  Claim,
  DocumentItem,
  FinancialGap,
  FootprintRecord,
  FamilyMember,
  NomineeRequest,
} from '../types';

export interface AssistantContext {
  user: UserProfile;
  assets: FinancialAsset[];
  claims: Claim[];
  documents: DocumentItem[];
  gaps: FinancialGap[];
  footprint: FootprintRecord;
  familyMembers: FamilyMember[];
  nomineeRequest: NomineeRequest;
  legacyScore: number;
  totalPotentialAssetsValue: number;
  assetsDiscoveredCount: number;
  claimsCount: number;
  readinessScore: number;
  recoveryProgress: number;
  activeTab?: string;
}

export interface AssistantResponse {
  text: string;
  source: 'gemini-api' | 'local-intelligence';
  confidence: number;
  suggestedFollowUps?: string[];
}

/**
 * Format number as Indian currency (e.g. ₹2,52,500)
 */
export const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

/**
 * Advanced Semantic Intent Classification for Financial Legacy
 */
type FinancialIntent =
  | 'DETECTED_ASSETS'
  | 'TOTAL_RECOVERY'
  | 'VERIFIED_ASSETS'
  | 'UNVERIFIED_ASSETS'
  | 'MISSING_DOCUMENTS'
  | 'EPF_RECOVERY'
  | 'RECOVERY_PROGRESS'
  | 'WHAT_NEXT'
  | 'LEGACY_SCORE_EXPLAIN'
  | 'IMPROVE_SCORE'
  | 'PRIORITIZE_CLAIM'
  | 'WHY_UNVERIFIED'
  | 'CLAIM_VS_ASSET'
  | 'NOMINEE_RECOVERY'
  | 'FRAUD_PROTECTION'
  | 'BANK_DORMANT_RULES'
  | 'INSURANCE_UNCLAIMED'
  | 'MUTUAL_FUNDS_FOLIO'
  | 'GENERAL_QUERY';

const classifyIntent = (query: string): FinancialIntent => {
  const q = query.toLowerCase().trim();

  // 1. Prioritization & Which asset first
  if (
    q.includes('claim first') ||
    q.includes('prioritize') ||
    q.includes('which asset') ||
    q.includes('first claim') ||
    q.includes('where to start claiming')
  ) {
    return 'PRIORITIZE_CLAIM';
  }

  // 2. Why unverified
  if (
    q.includes('why is this asset') ||
    q.includes('why unverified') ||
    q.includes('marked as unverified') ||
    q.includes('why is my asset unverified') ||
    q.includes('reason for unverified')
  ) {
    return 'WHY_UNVERIFIED';
  }

  // 3. Difference between claim and asset
  if (
    (q.includes('difference') && (q.includes('claim') || q.includes('asset'))) ||
    q.includes('what is the difference between a claim and an asset') ||
    q.includes('asset vs claim')
  ) {
    return 'CLAIM_VS_ASSET';
  }

  // 4. Improve Legacy Score
  if (
    (q.includes('improve') && q.includes('score')) ||
    q.includes('increase score') ||
    q.includes('boost score') ||
    q.includes('higher score')
  ) {
    return 'IMPROVE_SCORE';
  }

  // 5. Explain Legacy Score
  if (
    q.includes('explain my financial legacy score') ||
    q.includes('explain legacy score') ||
    q.includes('what is my score') ||
    q.includes('legacy score breakdown') ||
    (q.includes('score') && (q.includes('what') || q.includes('how is') || q.includes('calculated')))
  ) {
    return 'LEGACY_SCORE_EXPLAIN';
  }

  // 6. Total recovery / How much money
  if (
    q.includes('how much money') ||
    q.includes('total potential recovery') ||
    q.includes('potential recovery') ||
    q.includes('how much can i recover') ||
    q.includes('total recovery amount') ||
    q.includes('total value')
  ) {
    return 'TOTAL_RECOVERY';
  }

  // 7. Verified assets
  if (
    (q.includes('which') || q.includes('what')) &&
    q.includes('verified') &&
    !q.includes('unverified')
  ) {
    return 'VERIFIED_ASSETS';
  }

  // 8. Unverified assets
  if (
    q.includes('unverified') ||
    q.includes('not verified') ||
    q.includes('pending verification')
  ) {
    return 'UNVERIFIED_ASSETS';
  }

  // 9. Detected assets general
  if (
    q.includes('detected') ||
    q.includes('what assets') ||
    q.includes('list my assets') ||
    q.includes('show assets') ||
    q.includes('what are my assets') ||
    q.includes('discovered assets')
  ) {
    return 'DETECTED_ASSETS';
  }

  // 10. Missing documents / Gaps
  if (
    q.includes('missing') ||
    q.includes('which documents') ||
    q.includes('what documents') ||
    q.includes('missing documents') ||
    q.includes('gaps') ||
    q.includes('required documents')
  ) {
    return 'MISSING_DOCUMENTS';
  }

  // 11. EPF Recovery
  if (
    q.includes('epf') ||
    q.includes('uan') ||
    q.includes('provident fund') ||
    q.includes('epfo') ||
    q.includes('form 13') ||
    q.includes('form 19')
  ) {
    return 'EPF_RECOVERY';
  }

  // 12. Recovery progress
  if (
    q.includes('progress') ||
    q.includes('recovery progress') ||
    q.includes('claim status') ||
    q.includes('track claim') ||
    q.includes('how are my claims')
  ) {
    return 'RECOVERY_PROGRESS';
  }

  // 13. What should I do next
  if (
    q.includes('what should i do next') ||
    q.includes('next step') ||
    q.includes('what to do next') ||
    q.includes('action plan') ||
    q.includes('recommendation')
  ) {
    return 'WHAT_NEXT';
  }

  // 14. Nominee recovery & family access
  if (
    q.includes('nominee') ||
    q.includes('family access') ||
    q.includes('succession') ||
    q.includes('death certificate') ||
    q.includes('heir')
  ) {
    return 'NOMINEE_RECOVERY';
  }

  // 15. Fraud protection
  if (
    q.includes('fraud') ||
    q.includes('scam') ||
    q.includes('phishing') ||
    q.includes('protect myself') ||
    q.includes('fake') ||
    q.includes('suspicious')
  ) {
    return 'FRAUD_PROTECTION';
  }

  // 16. Inoperative bank accounts / RBI rules
  if (q.includes('inoperative') || q.includes('dormant') || q.includes('rbi') || q.includes('udgam')) {
    return 'BANK_DORMANT_RULES';
  }

  // 17. Unclaimed insurance
  if (q.includes('insurance') || q.includes('lic') || q.includes('policy')) {
    return 'INSURANCE_UNCLAIMED';
  }

  // 18. Mutual funds / CAMS / Karvy
  if (q.includes('mutual fund') || q.includes('folio') || q.includes('cams') || q.includes('dividend')) {
    return 'MUTUAL_FUNDS_FOLIO';
  }

  return 'GENERAL_QUERY';
};

/**
 * Intelligent Local Financial Intelligence Engine
 * Generates exact, tailored, calculation-backed responses using the active profile data.
 */
export const generateLocalIntelligenceResponse = (
  query: string,
  ctx: AssistantContext
): AssistantResponse => {
  const intent = classifyIntent(query);
  const { assets, claims, documents, gaps, user, legacyScore, totalPotentialAssetsValue } = ctx;

  const verifiedAssets = assets.filter(
    (a) => a.verificationStatus === 'Verified' || a.verificationStatus === 'Approved' || a.verificationStatus === 'Recovered'
  );
  const unverifiedAssets = assets.filter(
    (a) => a.verificationStatus !== 'Verified' && a.verificationStatus !== 'Approved' && a.verificationStatus !== 'Recovered'
  );

  const verifiedSum = verifiedAssets.reduce((sum, a) => sum + a.estimatedValue, 0);
  const unverifiedSum = unverifiedAssets.reduce((sum, a) => sum + a.estimatedValue, 0);

  // Intent Handlers
  switch (intent) {
    case 'DETECTED_ASSETS': {
      if (assets.length === 0) {
        return {
          text: `You currently have **0 detected assets** recorded in your profile.

### How to Detect Assets:
1. **Document Scanner**: Upload past salary slips, Form 26AS, or bank account statements.
2. **Financial Footprint Detective**: Enter previous employer names or old residential addresses to infer retirement or dormant balances.
3. **Manual Entry**: Click **+ Add Asset** in the Asset Discovery tab to register any known account.`,
          source: 'local-intelligence',
          confidence: 0.98,
          suggestedFollowUps: ['How do I recover my EPF?', 'What documents should I upload?'],
        };
      }

      const list = assets
        .map(
          (a, i) =>
            `${i + 1}. **${a.name}** (${a.institution})\n   • Value: **${formatINR(
              a.estimatedValue
            )}** | Status: **${a.verificationStatus}** (Confidence: ${a.confidenceScore}%)\n   • Evidence: ${a.evidenceSource}`
        )
        .join('\n\n');

      return {
        text: `Based on your analyzed financial records, we have identified **${assets.length} financial assets** totaling **${formatINR(
          totalPotentialAssetsValue
        )}**:

${list}

**Summary**:
• **Verified Assets**: ${verifiedAssets.length} (${formatINR(verifiedSum)})
• **Unverified/Potential Assets**: ${unverifiedAssets.length} (${formatINR(unverifiedSum)})`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['Which asset should I claim first?', 'Which assets are unverified?'],
      };
    }

    case 'TOTAL_RECOVERY': {
      if (assets.length === 0) {
        return {
          text: `Your current potential recovery is **₹0** because no assets have been uploaded or detected yet.

Once you upload financial documents (such as old salary slips, annual information statements, or bank passbooks), the AI will scan for dormant balances and calculate your exact recovery sum.`,
          source: 'local-intelligence',
          confidence: 0.98,
          suggestedFollowUps: ['What documents am I missing?', 'How do I start?'],
        };
      }

      return {
        text: `### Total Potential Recovery Calculation

You can potentially recover a total of **${formatINR(totalPotentialAssetsValue)}** across **${assets.length} identified accounts**:

1. **Immediate Claim Potential (Verified)**:
   • **${formatINR(verifiedSum)}** (${verifiedAssets.length} accounts verified and ready for institutional claims).

2. **Conditional Recovery (Unverified / Forensic Clues)**:
   • **${formatINR(unverifiedSum)}** (${unverifiedAssets.length} accounts requiring secondary KYC or statement proof).

All recovery actions can be initiated directly via the **AI Claim Navigator** and tracked in the **Claim Tracker**.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['Which asset should I claim first?', 'What documents am I missing?'],
      };
    }

    case 'VERIFIED_ASSETS': {
      if (verifiedAssets.length === 0) {
        return {
          text: `You currently have **0 verified assets**.

You have **${unverifiedAssets.length} unverified asset(s)** requiring documentation (such as fresh KYC, cancelled cheque, or historical salary slips). Visit the **Asset Discovery** or **Claim Navigator** tab to verify them.`,
          source: 'local-intelligence',
          confidence: 0.95,
          suggestedFollowUps: ['Which assets are unverified?', 'What documents am I missing?'],
        };
      }

      const list = verifiedAssets
        .map(
          (a) =>
            `• **${a.name}** at *${a.institution}*: **${formatINR(a.estimatedValue)}** [Ref: \`${a.maskedAccountRef}\`]`
        )
        .join('\n');

      return {
        text: `You have **${verifiedAssets.length} verified asset(s)** totaling **${formatINR(verifiedSum)}**:

${list}

These assets have confirmed evidence sources and are ready for filing institutional claims immediately.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['Which asset should I claim first?', 'How do I generate a claim letter?'],
      };
    }

    case 'UNVERIFIED_ASSETS': {
      if (unverifiedAssets.length === 0) {
        return {
          text: `**All your assets are currently verified!** None of your recorded accounts are marked as unverified. You can proceed with lodging claims in the Claim Navigator.`,
          source: 'local-intelligence',
          confidence: 0.99,
          suggestedFollowUps: ['What is my recovery progress?', 'Explain my Financial Legacy Score.'],
        };
      }

      const list = unverifiedAssets
        .map(
          (a) =>
            `• **${a.name}** at *${a.institution}* — Value: **${formatINR(
              a.estimatedValue
            )}**\n  *Evidence*: ${a.evidenceSource}\n  *Action*: Submit supporting bank statement or KYC in Claim Navigator.`
        )
        .join('\n\n');

      return {
        text: `You have **${unverifiedAssets.length} unverified asset(s)** totaling **${formatINR(unverifiedSum)}**:

${list}

**Why are these unverified?**
These accounts were detected through indirect clues (such as tax deduction traces, EPFO establishment matching, or employer records) and require secondary documentation before statutory claims can be lodged.`,
        source: 'local-intelligence',
        confidence: 0.98,
        suggestedFollowUps: ['Why is this asset marked as unverified?', 'What documents am I missing?'],
      };
    }

    case 'MISSING_DOCUMENTS': {
      const activeGaps = gaps.filter((g) => !g.resolved);

      if (activeGaps.length === 0) {
        return {
          text: `**No critical missing documents detected!**

Your financial footprint is well-documented with **${documents.length} verified document(s)** on file. All major asset requirements (identity, employment, and banking proofs) have been satisfied.`,
          source: 'local-intelligence',
          confidence: 0.97,
          suggestedFollowUps: ['What is my Financial Legacy Score?', 'What is my recovery progress?'],
        };
      }

      const gapList = activeGaps
        .map(
          (g) =>
            `• **${g.title}** [${g.priority} Priority]:\n  ${g.explanation}\n  *Recommended Step*: ${g.recommendedAction}`
        )
        .join('\n\n');

      return {
        text: `Based on our AI financial audit, we identified **${activeGaps.length} missing document requirement(s)**:

${gapList}

Resolving these gaps will directly boost your **Financial Legacy Score** and accelerate asset claim approvals.`,
        source: 'local-intelligence',
        confidence: 0.98,
        suggestedFollowUps: ['How do I recover my EPF?', 'How can I improve my score?'],
      };
    }

    case 'EPF_RECOVERY': {
      const epfAsset = assets.find((a) => a.category === 'EPF');
      const amountStr = epfAsset ? formatINR(epfAsset.estimatedValue) : 'estimated dormant balance';
      const uanStr = '1012****8829';

      return {
        text: `### Step-by-Step Guide to Recover Your Dormant EPF (${amountStr})

Under statutory EPFO regulations, dormant provident fund accounts continue to accrue interest up to retirement age (58 years). Follow these steps to recover or transfer your funds:

1. **Verify Your Universal Account Number (UAN)**:
   • Your detected UAN is **${uanStr}**. If you have multiple UANs, consolidate them under your current active number.

2. **Complete e-KYC on EPFO Member e-Sewa**:
   • Log in to [unifiedportal-mem.epfindia.gov.in](https://unifiedportal-mem.epfindia.gov.in/memberinterface/).
   • Ensure Aadhaar and bank account IFSC details are digitally signed and verified by your employer.

3. **Submit Online Transfer Form 13**:
   • Go to **Online Services → One Member - One EPF Account (Transfer Request)**.
   • Select your previous employer (e.g. ABC Technologies) and attest through either your previous or current establishment.

4. **Claim Final Settlement (Form 19 & 10C)**:
   • If unemployed for over two months, you may submit **Composite Claim Form (Aadhaar/Non-Aadhaar)** directly to Regional PF Commissioner.

You can also use the dedicated **EPFO Recovery** tab in the sidebar to review your detected PF profile and generate a claim letter.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['Which asset should I claim first?', 'What documents am I missing?'],
      };
    }

    case 'RECOVERY_PROGRESS': {
      if (claims.length === 0) {
        return {
          text: `You have **0 claims currently filed**.

To begin recovery:
1. Open the **Claim Navigator** tab.
2. Select one of your verified assets (e.g., *${assets[0]?.name || 'Bank Account'}*).
3. Review the compliance checklist and click **Initiate Recovery Claim**.`,
          source: 'local-intelligence',
          confidence: 0.96,
          suggestedFollowUps: ['Which asset should I claim first?', 'What assets have been detected?'],
        };
      }

      const claimDetails = claims
        .map(
          (c) =>
            `• **${c.assetName}** at *${c.institution}*:\n  • Amount: **${formatINR(
              c.amount
            )}** | Stage: **${c.currentStage}** (${c.progressPercentage}%)\n  • Ref: \`${c.claimReferenceNumber}\` | Next Follow-Up: ${c.followUpDate}`
        )
        .join('\n\n');

      return {
        text: `### Current Claim Recovery Progress (${ctx.recoveryProgress}% Overall)

You have **${claims.length} claim(s)** actively tracked:

${claimDetails}

**Next Recommended Action**:
Open the **Claim Tracker** to advance pending verification checkpoints or attestation tasks.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['What should I do next?', 'Which claim should I prioritize?'],
      };
    }

    case 'WHAT_NEXT': {
      let step1 = '';
      let step2 = '';
      let step3 = '';

      if (assets.length === 0) {
        step1 = 'Complete the **5-Step Onboarding Wizard** or upload your first bank statement.';
        step2 = 'Enter past employer details into the **Financial Footprint Detective**.';
        step3 = 'Add a trusted family nominee under the **Nominee Access Portal**.';
      } else if (unverifiedAssets.length > 0) {
        const topUnv = unverifiedAssets[0];
        step1 = `Upload supporting evidence for **${topUnv.name}** (${formatINR(topUnv.estimatedValue)}) in the Document Scanner to elevate it to Verified status.`;
        step2 = 'Open the **Claim Navigator** to verify documentation checklist for your highest value asset.';
        step3 = 'Generate an official legal claim petition using the **Claim Letter Generator**.';
      } else if (claims.length < assets.length) {
        step1 = 'Lodge claims for verified assets that do not yet have an active claim reference.';
        step2 = 'Confirm your nominee designation in the **Nominee Access Portal**.';
        step3 = 'Review and resolve any active gap alerts in the **Gap Intelligence** tab.';
      } else {
        step1 = 'Check the **Claim Tracker** to monitor regional commissioner attestations and bank officer sign-offs.';
        step2 = 'Export your encrypted financial legacy backup from **Settings**.';
        step3 = 'Ensure your Nominee has completed biometric passkey registration.';
      }

      return {
        text: `### Recommended Action Plan for ${user.name}

Here are the highest-impact steps tailored to your current portfolio state:

1. **Top Priority**:
   ${step1}

2. **Secondary Priority**:
   ${step2}

3. **Long-Term Protection**:
   ${step3}`,
        source: 'local-intelligence',
        confidence: 0.98,
        suggestedFollowUps: ['Which asset should I claim first?', 'How can I improve my score?'],
      };
    }

    case 'LEGACY_SCORE_EXPLAIN': {
      return {
        text: `### Financial Legacy Score: ${legacyScore}/100

Your Financial Legacy Score quantifies how thoroughly your assets are documented, verified, and protected for seamless succession.

### Weighted Score Breakdown:
1. **Document Vault Coverage (25% weight)**:
   • Based on verified tax filings, salary slips, and statement uploads (${documents.length} documents on file).
2. **Asset Verification Ratio (35% weight)**:
   • Percentage of discovered assets with confirmed ownership (${verifiedAssets.length}/${assets.length || 1} verified).
3. **Active Claim Momentum (20% weight)**:
   • Progress in recovering identified balances through institutional workflows (${claims.length} claims active).
4. **Gap Resolution (12% weight)**:
   • Resolution of missing EPF records, unlinked policies, or mature FD terms.
5. **Succession & Nominee Authorization (8% weight)**:
   • Presence of registered legal nominees and verified relationship documentation.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['How can I improve my financial legacy score?', 'What documents am I missing?'],
      };
    }

    case 'IMPROVE_SCORE': {
      const current = legacyScore;
      const target = Math.min(100, current + 20);

      return {
        text: `### Actionable Roadmap to Boost Your Score from ${current} to ${target}+:

1. **Verify Unverified Assets (+10 to +15 Points)**:
   • Upload supporting statements for ${unverifiedAssets[0]?.name || 'unverified accounts'} in the Document Scanner.

2. **Resolve High-Priority Gaps (+8 Points)**:
   • Resolve missing document warnings (e.g. past employment EPF records) in the **Gap Intelligence** module.

3. **Lodge Pending Recovery Claims (+6 Points)**:
   • Convert discovered assets into formal claims using the **Claim Navigator**.

4. **Complete Nominee Succession Verification (+5 Points)**:
   • Ensure nominee relationship proof (Aadhaar / Marriage Certificate) is validated in the **Nominee Access Portal**.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['Explain my Financial Legacy Score.', 'What should I do next?'],
      };
    }

    case 'PRIORITIZE_CLAIM': {
      if (assets.length === 0) {
        return {
          text: `You have no assets registered yet. Once you upload a document or add an asset, the AI will rank them by recovery probability and financial value.`,
          source: 'local-intelligence',
          confidence: 0.95,
          suggestedFollowUps: ['What documents should I upload?'],
        };
      }

      // Rank assets by: Verified status first, then by estimatedValue descending
      const ranked = [...assets].sort((a, b) => {
        const aVerified = a.verificationStatus === 'Verified' ? 1 : 0;
        const bVerified = b.verificationStatus === 'Verified' ? 1 : 0;
        if (aVerified !== bVerified) return bVerified - aVerified;
        return b.estimatedValue - a.estimatedValue;
      });

      const top = ranked[0];

      return {
        text: `### Claim Priority Recommendation

You should claim **${top.name}** (${top.institution}) first.

### Why This Asset Takes Precedence:
• **Estimated Value**: **${formatINR(top.estimatedValue)}**
• **Verification Status**: **${top.verificationStatus}** (Confidence: ${top.confidenceScore}%)
• **Recovery Readiness**: Has existing documentary evidence (${top.evidenceSource}).
• **Procedural Friction**: Commercial bank and EPF claims have established statutory timelines under RBI/EPFO citizen charters (typically 14–21 business days).

**Next Step**:
Click on **Claim Navigator**, select **${top.name}**, and generate your formal claim application dossier.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['Why is this asset marked as unverified?', 'What is my recovery progress?'],
      };
    }

    case 'WHY_UNVERIFIED': {
      if (unverifiedAssets.length === 0) {
        return {
          text: `All of your assets are currently verified! None are marked unverified.`,
          source: 'local-intelligence',
          confidence: 0.98,
        };
      }

      const sample = unverifiedAssets[0];

      return {
        text: `### Why is "${sample.name}" Marked as Unverified?

Under statutory audit standards, an asset is designated as **Unverified** or **Potentially Discovered** when:

1. **Indirect Evidence Only**: The account was inferred from secondary records (such as an interest TDS deduction in Form 26AS or past salary slip mention) rather than a direct account statement.
2. **Missing Active KYC**: The issuing institution (${sample.institution}) requires updated Know Your Customer (KYC) documentation because the account has been inoperative.
3. **Account Number Masking**: The full 16-digit account number is not yet confirmed on official letterhead.

### How to Verify It:
• Upload a recent passbook copy, bank statement, or TDS certificate in the **Document Scanner**.
• Once uploaded, our AI will match the account reference and upgrade the status to **Verified**.`,
        source: 'local-intelligence',
        confidence: 0.98,
        suggestedFollowUps: ['Which assets are unverified?', 'What documents am I missing?'],
      };
    }

    case 'CLAIM_VS_ASSET': {
      return {
        text: `### Difference Between a Financial Asset and a Recovery Claim

| Attribute | Financial Asset | Recovery Claim |
| :--- | :--- | :--- |
| **Definition** | A dormant, lost, or forgotten balance owned by you or an ancestor (e.g., savings account, EPF corpus, matured policy). | The formal legal/administrative petition lodged with an institution to disburse or reactivate those funds. |
| **State** | Discovery phase (identified via bank statements, tax traces, or resumes). | Execution phase (submitted with identity proofs, indemnity bond, cancelled cheque). |
| **Tracking** | Tracked in **Asset Discovery**. | Tracked in **Claim Tracker** with reference number and deadlines. |
| **Outcome** | Represents potential wealth (${formatINR(totalPotentialAssetsValue)} in your profile). | Results in liquid fund transfer directly into your active bank account. |

In short: **An asset is what you found; a claim is how you get it back.**`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['What assets have been detected?', 'What is my recovery progress?'],
      };
    }

    case 'NOMINEE_RECOVERY': {
      return {
        text: `### How Nominee Succession & Asset Recovery Works

In Indian financial law, a **Nominee** is a designated trustee entitled to receive funds upon the account holder's demise to facilitate lawful distribution to legal heirs:

1. **Independent Nominee Portal**:
   • Nominees must register with their **own independent credentials** (they never share the primary user's password).
2. **Statutory Verification Gate**:
   • Deceased account holder assets remain **cryptographically locked** until:
     a) Biometric passkey assertion is confirmed.
     b) Official Municipal Death Certificate is uploaded and verified via forensic OCR.
     c) Relationship proof (Aadhaar, Marriage Certificate, or Legal Heir Certificate) is submitted.
3. **Fiduciary Authorization**:
   • The system grants access exclusively to the specific asset classes authorized by the primary user (e.g. Banking, EPF, Insurance).

You can configure nominees and view active succession requests under the **Nominee Access Portal**.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['What assets have been detected?', 'What should I do next?'],
      };
    }

    case 'FRAUD_PROTECTION': {
      return {
        text: `### Financial Asset Recovery Scam Defense Checklist

Fraudsters frequently target citizens attempting to recover forgotten funds or dormant provident funds. Always adhere to these safeguards:

1. **Zero Upfront Processing Fees**:
   • Neither the RBI, EPFO, nor legitimate banks will ever demand upfront processing fees, "stamp charges", or crypto transfers via Telegram or WhatsApp.
2. **Never Share OTP or Banking Credentials**:
   • Official claim forms (Form 13, 19, or Form 26AS) never require net banking passwords or debit card CVVs.
3. **Use Only Official Government Portals**:
   • EPFO: [unifiedportal-mem.epfindia.gov.in](https://unifiedportal-mem.epfindia.gov.in)
   • RBI Unclaimed Deposits: [udgam.rbi.org.in](https://udgam.rbi.org.in)
   • IEPF (Unclaimed Shares/Dividends): [iepf.gov.in](https://www.iepf.gov.in)
4. **Scan Suspicious Messages**:
   • Paste any suspicious SMS or email into our **AI Fraud Detector** tab to analyze phishing vectors immediately.`,
        source: 'local-intelligence',
        confidence: 0.99,
        suggestedFollowUps: ['What should I do next?', 'How do I recover my EPF?'],
      };
    }

    case 'BANK_DORMANT_RULES': {
      return {
        text: `### RBI Guidelines on Inoperative & Dormant Accounts

Under Reserve Bank of India (RBI) Master Circulars:
• **Inoperative Classification**: A savings or current account with no customer-induced transactions for over **2 years** is categorized as inoperative.
• **DEA Fund Transfer**: Balances unclaimed for **10 or more years** are transferred to the RBI's **Depositor Education and Awareness (DEA) Fund**, but continue to accrue interest.
• **Reactivation Process**:
  1. The bank **cannot charge** any fee for reactivating an inoperative account.
  2. The account holder must submit fresh KYC (Aadhaar & PAN) and a formal reactivation petition.
  3. You can generate a compliant petition letter using the **Claim Letter Generator** in the sidebar.`,
        source: 'local-intelligence',
        confidence: 0.98,
        suggestedFollowUps: ['How do I generate a claim letter?', 'Which asset should I claim first?'],
      };
    }

    case 'INSURANCE_UNCLAIMED': {
      return {
        text: `### Unclaimed Insurance & Matured Policy Recovery

Under IRDAI circulars:
• Unclaimed policy dues, death claims, and maturity amounts must be maintained in a searchable database on every insurer's website.
• Dues lying unclaimed for over 10 years are transferred to the **Senior Citizens' Welfare Fund (SCWF)**, but policyholders and nominees retain full legal right to claim at any time.
• **Required Documents**:
  1. Original policy bond or indemnity bond if bond is misplaced.
  2. KYC proofs of the claimant.
  3. Cancelled cheque for direct NEFT bank transfer.`,
        source: 'local-intelligence',
        confidence: 0.98,
        suggestedFollowUps: ['What documents am I missing?', 'Which asset should I claim first?'],
      };
    }

    case 'MUTUAL_FUNDS_FOLIO': {
      return {
        text: `### Unclaimed Mutual Fund Dividends & Redemptions

Under SEBI regulations:
• Unclaimed mutual fund distributions and redemption proceeds are deployed in liquid/money market instruments until claimed.
• **How to Recover**:
  1. Fetch your **Consolidated Account Statement (CAS)** from CAMS ([camsonline.com](https://www.camsonline.com)) or KFintech ([kfintech.com](https://www.kfintech.com)).
  2. Submit a bank mandate updation request with a cancelled cheque bearing your printed name.
  3. Request transmission of unclaimed dividend distributions.`,
        source: 'local-intelligence',
        confidence: 0.98,
        suggestedFollowUps: ['What assets have been detected?', 'What should I do next?'],
      };
    }

    case 'GENERAL_QUERY':
    default: {
      return {
        text: `I have analyzed your query against your active financial legacy profile:

• **Profile**: ${user.name} (${user.occupation || 'Primary User'})
• **Detected Assets**: ${assets.length} account(s) totaling **${formatINR(totalPotentialAssetsValue)}**
• **Active Claims**: ${claims.length} claim(s) (${ctx.recoveryProgress}% recovery progress)
• **Financial Legacy Score**: **${legacyScore}/100**

You can ask me specific questions such as:
• *"What assets have been detected?"*
• *"What is my total potential recovery?"*
• *"Which asset should I claim first?"*
• *"How do I recover my EPF?"*
• *"What documents am I missing?"*
• *"Explain my Financial Legacy Score."*`,
        source: 'local-intelligence',
        confidence: 0.92,
        suggestedFollowUps: [
          'What assets have been detected?',
          'What is my total potential recovery?',
          'Which asset should I claim first?',
        ],
      };
    }
  }
};

/**
 * Main Assistant Dispatcher
 * Calls real Gemini API if VITE_GEMINI_API_KEY is configured in the environment,
 * otherwise cleanly executes the local financial intelligence reasoning engine.
 */
export const queryFinancialAssistant = async (
  query: string,
  ctx: AssistantContext
): Promise<AssistantResponse> => {
  // Check for Gemini API key in Vite environment variables
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY;

  if (apiKey && typeof apiKey === 'string' && apiKey.trim() !== '' && !apiKey.includes('your_api_key')) {
    try {
      const systemPrompt = `You are the AI Financial Assistant for "FINANCE LEGACY", an AI-powered forgotten financial asset discovery and recovery platform in India.
Current User Context:
- User: ${ctx.user.name} (${ctx.user.occupation || 'Individual'}, age ${ctx.user.age || 'N/A'})
- Total Potential Assets: ${formatINR(ctx.totalPotentialAssetsValue)} across ${ctx.assets.length} accounts
- Assets: ${JSON.stringify(
        ctx.assets.map((a) => ({
          name: a.name,
          institution: a.institution,
          value: formatINR(a.estimatedValue),
          status: a.verificationStatus,
          confidence: a.confidenceScore,
        }))
      )}
- Claims in Progress: ${JSON.stringify(
        ctx.claims.map((c) => ({
          asset: c.assetName,
          amount: formatINR(c.amount),
          stage: c.currentStage,
          progress: `${c.progressPercentage}%`,
        }))
      )}
- Missing Documents / Gaps: ${JSON.stringify(
        ctx.gaps.map((g) => ({ title: g.title, priority: g.priority, explanation: g.explanation }))
      )}
- Financial Legacy Score: ${ctx.legacyScore}/100

Guidelines:
- Answer the user's specific question directly first.
- Use Indian currency formatting (₹, Lakhs, Crores).
- Format response with markdown bullet points, headings, and bold numbers.
- Never invent assets not present in the user context.
- Provide practical, statutory Indian financial advice (RBI, EPFO, IRDAI, SEBI).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${query}` }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return {
            text: candidateText,
            source: 'gemini-api',
            confidence: 0.99,
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to Local Financial Intelligence Engine', e);
    }
  }

  // Fallback: Local Financial Intelligence Reasoning Engine
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateLocalIntelligenceResponse(query, ctx));
    }, 450);
  });
};
