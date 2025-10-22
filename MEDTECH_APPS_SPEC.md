# MedTech Apps Specification

## Overview
Two demonstrator apps showcasing onchain medical data marketplace:
1. **MedAtlas** - De-identifies and monetizes medical records
2. **MedTagger** - Enriches and validates de-identified records through clinical collaboration

---

## App 1: MedAtlas (Medical Record De-Identifier)

### Purpose
Upload raw patient records → Remove PII → Prepare for enrichment marketplace

### UI Layout (Single Screen - 3 Columns)

#### Left Column: Upload & Records List
- **Upload Area** (drag-drop + file input)
- **Records List** (scrollable, click to select)
  - Record ID (MED-YYYY-MM-DD-###)
  - Filename
  - Status badge (processing, completed, enriching, sold)

#### Center Column: De-ID Preview
- **Record Header**
  - Status badge: "De-Identified ✓"
  - Record ID display
- **Before/After Comparison**
  - Original section (PII highlighted in red)
  - De-identified section (censored, highlighted in green)
- **Send to Enrichment Button**

#### Right Column: Revenue Dashboard
- **Cards showing:**
  - Records Uploaded (count)
  - Enriched Records (count)
  - Revenue Generated (H1)
  - Estimated Revenue (H1) - highlighted in emerald
- **Info Card** explaining the flow

### Mock Data
```
1 pre-loaded record: MED-2025-10-22-001
- Status: completed
- Estimated revenue: 2.5 H1
- Original: Full patient details (name, DOB, SSN, contact, insurance)
- De-ID: All PII replaced with [REMOVED] placeholders
```

### Onchain Integration
**Uses: `DataValidationFacet.sol`**
- `uploadDataset()` - Store de-ID'd record with metadata
- `trackDataUsage()` - Monitor downstream enrichment
- Tracks: recordId, uploaderId (doctor wallet), timestamp, status
- Revenue split: Original uploader gets % when record is enriched/sold

---

## App 2: MedTagger (Medical Record Enrichment)

### Purpose
Collaborate to enrich records with clinical tags → Unlock revenue → Build credentials

### UI Layout (Single Screen - 4 Columns)

#### Left Column: Bounty & Credentialing
- **Current Bounty Card**
  - Record ID
  - Reward amount (H1)
  - From Lab (MedAtlas Lab)
- **Reviewers List** (all 4 with avatars)
  - 3 completed (with checkmarks)
  - 1 in progress (You)
  - Status badges
- **Supervisor Card**
  - Name + Credential ID

#### Center Columns: Enrichment Interface (2 columns)
- **Header** with tag counter & reviewer progress badge
- **Record Display** (scrollable)
  - Medical record text (monospace)
  - Selectable for highlighting
- **Tag Options** (grid of 5 buttons)
  - REASONING (yellow)
  - HALLUCINATION (red)
  - PRESCRIPTION (blue)
  - PATHOLOGY (purple)
  - MEDICINE_DOMAIN (green)
- **Applied Tags** (scrollable list, removable)
  - Shows tag type, text snippet, added by
- **Action Buttons** (bottom)
  - AI Assist button (0.5 H1) - calls AI Agent
  - Submit button (disabled until 3+ tags)

#### Right Column: Discussion Chat
- **Chat History** (scrollable)
  - Clinician messages (👨‍⚕️)
  - AI messages (🤖)
  - Your messages (👤)
  - Timestamps
- **Message Input** (with Send button)

### Mock Data
```
Record: MED-2025-10-22-001
- Same de-ID'd record from MedAtlas
- Pre-tagged with 1 REASONING tag
- 3 clinicians completed (Dr. Sarah Chen, Dr. Michael Brown, Dr. James Wilson)
- You are the 4th reviewer
- Supervisor: Dr. James Wilson (Credential ID: 42)
- Chat: 3 existing messages + ability to add more
- Reward: 2.5 H1
```

### Onchain Integration
**Uses: `CredentialFacet.sol` + `DataValidationFacet.sol`**
- **CredentialFacet:**
  - `issueCredential()` - Record reviewer participation
  - Track: reviewer wallet, recordId, tags applied, timestamp
  - Build reputation score over time
  - Supervisor approval required for credential mint

- **DataValidationFacet:**
  - `updateDataWithEnrichment()` - Store tags on-chain
  - `recordEnrichmentContribution()` - Track who enriched what
  - Revenue distribution triggered on completion

- **AI Agent Integration:**
  - Deduct 0.5 H1 from wallet on "AI Assist" click
  - Simulate AI analysis response
  - Log transaction onchain

---

## Data Models

### Record
```typescript
{
  id: string;                          // MED-2025-10-22-001
  uploaderId: string;                  // Wallet address
  uploadedAt: Date;
  originalRecord: string;              // PII version
  deIdRecord: string;                  // Censored version
  status: 'processing' | 'completed' | 'enriching' | 'sold';
  enrichmentStatus: {
    reviewersCompleted: number;        // 3/4
    totalReviewers: number;
    tags: TagInstance[];
  };
  revenue: {
    estimatedValue: number;            // H1 tokens
    realizedValue: number;
    splits: { wallet: string, percent: number }[];
  };
}
```

### TagInstance
```typescript
{
  id: string;
  type: 'REASONING' | 'HALLUCINATION' | 'PRESCRIPTION' | 'PATHOLOGY' | 'MEDICINE_DOMAIN';
  text: string;                        // Tagged text snippet
  addedBy: string;                     // Reviewer wallet/name
  timestamp: Date;
  supervisorApproved?: boolean;
}
```

### Reviewer
```typescript
{
  wallet: string;
  name: string;
  credentialId?: number;
  completedAt?: Date;
  tagsAdded: number;
}
```

---

## User Flows

### MedAtlas Flow
1. Doctor uploads patient record (file)
2. System de-identifies automatically
3. Doctor reviews before/after
4. Sends to enrichment marketplace
5. Watches revenue dashboard as it's enriched
6. Receives H1 tokens when dataset is sold

### MedTagger Flow
1. Clinician views available enrichment bounties
2. Selects record to enrich
3. Reads de-identified medical record
4. Highlights text and applies semantic tags
5. Uses AI Agent for suggestions (costs 0.5 H1)
6. Collaborates in chat with other reviewers
7. Supervisor approves work
8. Gets paid H1 tokens + credential issued

---

## Onchain Transactions

### MedAtlas Transactions
1. `uploadDataset(recordId, deIdHash, metadata)` → DataValidationFacet
2. `updateRecordStatus(recordId, 'ready_for_enrichment')` → DataValidationFacet
3. Revenue split updated when sold

### MedTagger Transactions
1. `issueCredential(reviewerWallet, recordId, credentialType)` → CredentialFacet
2. `recordEnrichmentContribution(reviewerWallet, recordId, tags)` → DataValidationFacet
3. `deductTokens(userWallet, 0.5)` → LABSToken on AI assist
4. `distributeRevenue(recordId)` → RevenueFacet when complete

---

## Future Enhancements
- [ ] Integrate real DataValidationFacet calls
- [ ] Integrate real CredentialFacet calls
- [ ] Real text highlighting with exact position tracking
- [ ] Supervisor approval workflow
- [ ] Reputation scoring system
- [ ] Batch processing for multiple records
- [ ] Export enriched records
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile responsive optimization
