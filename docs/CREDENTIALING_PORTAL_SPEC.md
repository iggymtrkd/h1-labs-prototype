# **H1 Credentialing Portal — Product Specification**

> **Status:** Product Specification for Implementation  
> **Focus:** Medical-First, Multi-Domain Ready  
> **Last Updated:** October 2025

---

## **Overview**

Build the **H1 Credentialing Portal**, the on-ramp for verified professionals to establish onchain credentials. Launch **Medical-focused** with other domains (Legal, Defense, Finance, Robotics) as "Coming Soon" placeholders.

**Core Mission:** Transform professional credentials into verifiable, blockchain-backed identity that unlocks:
- Higher earning rates on dataset validation
- Gated access to sensitive healthcare data
- Credential NFT (soulbound, transferable via governance)
- Compliance proof for enterprise AI firms
- Ongoing reputation tracking

---

## **Page Structure & User Journeys**

### **1. Credentialing Portal Landing (`/credentialing`)**

#### **Hero Section**
```
Headline: "Get Credentialed. Earn More. Build Trust."
Subheading: "Verifiable professional identity for ethical AI training"

Two CTAs:
- "Apply for Medical Credential" (primary, green)
- "View My Credentials" (secondary, if already connected)

Background: Animated medical imagery or compliance icons (HIPAA, GDPR, etc.)
```

#### **How It Works - Explainer Section**

Present 5-step visual flow with icons + copy:

**Step 1: Apply**
```
Icon: Clipboard + Person
Copy: "Submit your resume, qualifications, and academic background. 
       Credentials verified via Credential Exchange protocol and 
       third-party professional databases."
```

**Step 2: Verify**
```
Icon: Shield + Checkmark
Copy: "We verify your licenses, degrees, and board certifications 
       using medical system APIs (NPDB, AMA, state boards).
       KYC screening ensures you are who you claim."
```

**Step 3: Approve**
```
Icon: Thumbs Up
Copy: "H1 Credentialing DAO reviews your submission. 
       Approval triggers credential NFT minting and 
       onchain proof-of-expertise."
```

**Step 4: Validate & Earn**
```
Icon: Star + Coin
Copy: "Access premium healthcare datasets. Earn 3x rewards 
       for credentialed validation work. Build your reputation."
```

**Step 5: Renew**
```
Icon: Circular Arrow
Copy: "Annual or per-domain renewal keeps credentials active. 
       Expired credentials reduce earning potential to standard rates."
```

---

#### **Domain Selector Tabs**

```
┌──────────────────────────────────────────┐
│  🏥 Medical   [Active]                   │
│                                           │
│  🏛️  Legal                                │
│      "Coming Q2 2025"                    │
│                                           │
│  🛡️  Defense                              │
│      "Coming Q3 2025"                    │
│                                           │
│  💼 Finance                               │
│      "Coming Q2 2025"                    │
│                                           │
│  🤖 Robotics                              │
│      "Coming Q3 2025"                    │
└──────────────────────────────────────────┘
```

Each "Coming Soon" domain shows:
- Icon + Name
- Expected launch date
- Faint "Learn More" link
- Lock icon

---

### **2. Medical Credential Application Flow**

#### **Step 0: Pre-Application Checklist**

Before entering full form, show:

```
You'll need to provide:
☐ Professional Resume (PDF, max 5MB)
☐ Medical License(s) (photo/scan, all states)
☐ Board Certification (ABIM, ABOM, etc.)
☐ Academic Degrees (MD, DO, MSc, PhD - transcripts recommended)
☐ Academic Papers/Publications (optional but boosts credibility)
☐ Proof of Malpractice Insurance (recommended)
☐ Background Check Consent (FCRA compliant)

Estimated Time: 15-20 minutes
```

**Button:** "I Have These Documents → Continue"

---

#### **Step 1: Personal Information & KYC**

```
Section: "Identity Verification"

Fields:
├─ Full Name (first, middle, last) [text input]
├─ Email Address [email input]
│  └─ Verify email via link sent
├─ Phone Number [tel input]
│  └─ Verify via SMS OTP
├─ Date of Birth [date picker]
├─ Professional Address [address input]
├─ Country of License [dropdown - pre-fill if possible]
└─ SSN or Tax ID (last 4 only for verification) [masked input]
    └─ "Used only for background check, never stored"

Compliance Note:
"This information is collected under HIPAA-compliant, SOC 2 Type II 
verified infrastructure. Your PII is encrypted and never sold."

[Continue Button]
```

---

#### **Step 2: Professional Background**

```
Section: "Medical Credentials"

Subsection 2.1: "Current License(s)"
───────────────────────────────────

Label: "How many active medical licenses do you hold?"
Options: 1 / 2 / 3+ 

For each license:
├─ License Type [dropdown]
│  ├─ MD (Doctor of Medicine)
│  ├─ DO (Doctor of Osteopathic Medicine)
│  ├─ PA-C (Physician Assistant)
│  ├─ NP (Nurse Practitioner)
│  ├─ RN with Specialty
│  └─ Other [text input]
├─ License Number [text input]
├─ State/Country [dropdown]
├─ Specialty [dropdown/multi-select]
│  ├─ Cardiology
│  ├─ Oncology
│  ├─ Radiology
│  ├─ Internal Medicine
│  ├─ Emergency Medicine
│  └─ Other [50+ specialties]
├─ Sub-Specialty (optional) [text input]
│  └─ e.g., "Interventional Cardiology"
├─ Years in Field [number input]
├─ Upload License Document [file upload - accepts PDF/JPG/PNG]
│  └─ "Accepted formats: PDF, JPEG, PNG (max 10MB)"
└─ [Real-time Validation Badge]
    "🔍 Checking NPDB/State Board... [Verified ✓]"
    or
    "⏳ Queued for manual review"

[Add Another License Button]

Subsection 2.2: "Board Certifications"
─────────────────────────────────────

Label: "Board Certifications (select all that apply)"

Checkboxes with upload fields:
├─ ☐ ABIM (American Board of Internal Medicine)
│  └─ Cert Number: [input] | Expires: [date] | Upload: [file]
├─ ☐ ABOS (American Board of Surgery)
│  └─ Cert Number: [input] | Expires: [date] | Upload: [file]
├─ ☐ ABEM (Emergency Medicine)
│  └─ ...
├─ ☐ Other Board [input for name]
│  └─ Cert Number: [input] | Expires: [date] | Upload: [file]
└─ ☐ None yet (pursuing certification)

[Add Another Certification Button]
```

---

#### **Step 3: Academic Credentials**

```
Section: "Education & Qualifications"

Subsection 3.1: "Medical Degree(s)"
──────────────────────────────────

For each degree (Medical School, Residency, Fellowship):
├─ Degree Type [dropdown]
│  ├─ MD
│  ├─ DO
│  ├─ DDS/DMD
│  ├─ PhD
│  └─ Other
├─ Institution Name [text input with autocomplete]
│  └─ Autocomplete from LCME/AACOM accredited schools
├─ Graduation Year [date picker]
├─ Upload Diploma/Certificate [file upload]
├─ Upload Transcript [file upload - optional but recommended]
│  └─ "Boosted credentials include verified GPA"
└─ [Verify Button]
    "📊 Verifying with institution... [Verified ✓]"

[Add Another Degree Button]

Subsection 3.2: "Continuing Medical Education (CME)"
─────────────────────────────────────────────────────

Label: "CME Credits Earned (Last 3 Years)"
├─ Total Hours: [number input]
├─ Specialties Covered: [multi-select]
│  ├─ Clinical Care
│  ├─ Patient Safety
│  ├─ Healthcare Quality
│  └─ Other [text input]
├─ Upload CME Transcript [file upload]
│  └─ "From ACCME or equivalent body"
└─ Current Status: [dropdown]
    ├─ Maintaining CME Compliance
    ├─ Behind on CME (< 10 hours needed)
    └─ Not in mandatory CME cycle
```

---

#### **Step 4: Publications & Expertise**

```
Section: "Academic Publications & Expertise"
(Optional but significantly boosts credential score)

Subsection 4.1: "Peer-Reviewed Publications"
──────────────────────────────────────────────

Label: "Published in peer-reviewed medical journals?"
Radio: Yes / No

If Yes:
├─ Publication Title: [text input]
├─ Journal Name: [text input with autocomplete]
├─ Year Published: [date picker]
├─ DOI or PubMed ID: [text input]
│  └─ [Auto-verify button] "Checking PubMed..."
├─ Your Role: [dropdown]
│  ├─ First Author
│  ├─ Co-Author
│  ├─ Last Author (senior)
│  └─ Corresponding Author
├─ Field/Topic: [multi-select from specialties]
└─ Upload PDF [file upload]

[Add Another Publication Button]

Subsection 4.2: "Expertise Summary"
───────────────────────────────────

Label: "Areas of Clinical Expertise (beyond board certification)"
Field: [multi-select checkboxes] OR [tag input]

Examples:
- Rare Disease Diagnostics
- Precision Medicine/Genomics
- Clinical Trial Design
- Medical AI/Machine Learning
- Healthcare Data Privacy
- Patient Engagement Technologies
- [Add Custom Expertise Tag]

Character limit: 500

Note: "These help H1 Labs match you with 
       specialized dataset validation tasks."
```

---

#### **Step 5: Medical System Integrations (Optional but Recommended)**

```
Section: "Credential Verification Integrations"
(Boost trust score & automate verification)

Subsection 5.1: "Connect to Medical Databases"
──────────────────────────────────────────────

Checkbox Options (user selects which to authorize):

☐ National Practitioner Data Bank (NPDB) Lookup
  ├─ Checks for malpractice history, sanctions
  ├─ Powered by: Credentialing Exchange API
  ├─ Privacy: "Your NPDB record is not shared; 
                we only confirm 'clear' status"
  └─ [Connect via OAuth / Secure Link]

☐ State Medical Board Verification
  ├─ Auto-checks license status in selected states
  ├─ Real-time license verification via state board API
  ├─ Selected State: [dropdown - multi-select]
  └─ [Authorize - redirects to state board login (OAuth)]

☐ FSMB (Federation of State Medical Boards) Directory
  ├─ Comprehensive license lookup
  ├─ Public records verification
  └─ [Verify via FSMB API]

☐ HealthGrades or WebMD Physician Profile Lookup
  ├─ Cross-references your public profile
  ├─ Verifies specialties and credentials listed
  └─ [Link Your Profile]
    Input: [text] "Your HealthGrades profile URL"

Consent Statement (FCRA Compliant):
"By connecting to these services, you authorize H1 Labs to:
 ✓ Verify your professional license and credentials
 ✓ Check for disciplinary actions or malpractice claims
 ✓ Confirm your identity and professional standing
 ✓ Never share individual records without your consent

 This check will not impact your credit. 
 Compliant with Fair Credit Reporting Act (FCRA)."

[I Authorize These Checks - Continue Button]

---

Subsection 5.2: "Hospital/Health System Affiliation (Optional)"
──────────────────────────────────────────────────────────────

Label: "Are you affiliated with a hospital or health system?"
Radio: Yes / No

If Yes:
├─ Health System Name: [text input with autocomplete]
│  └─ Autocomplete from AHHA directory
├─ Affiliated Department: [text input]
├─ Title/Role: [dropdown]
│  ├─ Attending Physician
│  ├─ Resident
│  ├─ Fellow
│  ├─ CMO/Medical Director
│  └─ Other [text]
├─ Years Affiliated: [number input]
├─ Hospital Email: [email input]
│  └─ "Verify employment via institutional email"
└─ [Send Verification Email to Hospital Admin]
    "We'll ask your department administrator to confirm 
     your credentials. This can take 1-2 days."

Badge: 🏥 "Institutional Verification Pending" or ✓ "Verified"
```

---

#### **Step 6: Compliance & Data Privacy Confirmation**

```
Section: "Compliance & Consent"

Subsection 6.1: "HIPAA Privacy & Security"
──────────────────────────────────────────

Checkbox (must be checked to proceed):
☑ "I understand that by joining H1 Labs as a credentialed validator, 
   I am legally responsible for handling protected health information 
   (PHI) in accordance with HIPAA and organizational policies.
   
   I confirm that:
   ✓ I am a covered entity or authorized workforce member
   ✓ I will use credentials only for H1 Labs validation activities
   ✓ I will not export or store PHI outside H1 infrastructure
   ✓ I will report breaches immediately to H1 Legal"

[Link to full HIPAA Terms & Conditions]

Subsection 6.2: "Data Privacy & KYC"
───────────────────────────────────

Checkbox:
☑ "I consent to H1 Labs processing and storing my professional 
   credentials and personal information as described in the 
   Privacy Policy, including:
   
   ✓ Third-party verification (state boards, NPDB, etc.)
   ✓ Background checks via FCRA-compliant vendors
   ✓ Secure onchain recording of credential NFT metadata
   ✓ H1 Labs DAO governance review of my application"

[Link to Privacy Policy]

Subsection 6.3: "Credential NFT Terms"
──────────────────────────────────────

Checkbox:
☑ "Upon approval, H1 Labs will mint a Credential NFT to my wallet.
   I understand that:
   
   ✓ This NFT proves my credentials onchain
   ✓ It is non-transferable (soulbound) by default
   ✓ It can be revoked if I violate compliance terms
   ✓ I am responsible for wallet security
   ✓ H1 Labs is not liable for lost/hacked wallets"

[Learn more about Credential NFTs]

Subsection 6.4: "Acknowledgment of Risks"
─────────────────────────────────────────

Checkbox:
☑ "I acknowledge that:
   
   ✓ H1 Labs is a blockchain-based platform (testnet/mainnet risks)
   ✓ My wallet address will be publicly associated with my 
     credential status
   ✓ Credential NFTs can be viewed on public block explorers
   ✓ I have the option to limit public display of my credentials"

[Advanced Privacy Settings]
```

---

#### **Step 7: Review & Submit**

```
Section: "Review Your Application"

[Expandable Sections]:

▼ Personal Information
  ├─ Name: Dr. Sarah Chen
  ├─ Email: sarah@hospital.org
  ├─ Phone: [Verified ✓]
  ├─ DOB: [Masked for privacy]
  └─ [Edit]

▼ Medical Credentials
  ├─ MD, Yale School of Medicine (2010) [Verified ✓]
  ├─ Cardiology Specialty, Mt. Sinai (2015)
  ├─ ABIM Board Certified [Verified ✓]
  ├─ Hospital Affiliation: Mt. Sinai Medical Center
  │  [Verification pending - 1 of 2 steps]
  └─ [Edit]

▼ Publications
  ├─ 3 peer-reviewed publications
  ├─ "Atrial Fibrillation Detection via ML" - Circulation (2022)
  ├─ 5 Areas of Expertise tagged
  └─ [Edit]

▼ Verifications
  ├─ ✓ NPDB: Clear
  ├─ ✓ NY Medical Board: Active License
  ├─ ⏳ Background Check: Pending
  └─ [View Details]

▼ Compliance Consents
  ├─ ✓ HIPAA Privacy Acknowledged
  ├─ ✓ Privacy Policy Accepted
  ├─ ✓ Credential NFT Terms Agreed
  └─ [View All]

Summary Bar:
┌─────────────────────────────────────┐
│ Application Completeness: 95%       │
│                                     │
│ Estimated Decision Timeline:        │
│ - Auto-verified items: 1-2 hours   │
│ - Manual review (if needed): 2-3d  │
│ - NFT Minting: Upon approval       │
└─────────────────────────────────────┘

[Edit Application Button] [Cancel & Save Draft]

Prominent CTA:
[Submit Application for Review - Primary Green Button]

Below button:
"By submitting, you confirm all information is accurate and 
complete. False statements may result in credential revocation."
```

---

### **3. Application Status Page**

After submission, user sees:

```
Status: ⏳ "PENDING REVIEW"
Submitted: March 15, 2025 at 2:34 PM

Timeline:
Step 1: Auto-Verification  [✓ Complete - 2hrs]
├─ NPDB Check: ✓ Clear
├─ State License: ✓ Verified
├─ Background Check: ⏳ In Progress (24-48 hrs)
└─ Email Verification: ✓ Confirmed

Step 2: Manual Credential Review [⏳ In Queue]
├─ Target time: 2-3 business days
├─ Queue position: ~47 ahead of you
└─ [View Review Criteria]

Step 3: NFT Minting [⏳ Pending Approval]
├─ Upon approval, credential NFT will be minted
├─ Gas fees: Covered by H1 Labs
└─ Estimated blockchain confirmation: 30 seconds

[Edit Application] [Contact Support] [View Privacy Settings]

Email Notification:
"You'll receive email updates as your application progresses.
 Expected approval: March 17-18, 2025"
```

---

### **4. Credential Dashboard (Post-Approval)**

Once approved, user sees "My Credentials":

```
┌─────────────────────────────────────────────────────┐
│ 🏥 Medical Credentials                              │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ [Card: MD Cardiology - Verified]             │   │
│ │                                               │   │
│ │ Credential ID: HIP-CARD-0042                 │   │
│ │ Issued: March 18, 2025                       │   │
│ │ Expires: March 18, 2026                      │   │
│ │ Status: ✓ Active                             │   │
│ │                                               │   │
│ │ Specialties: Cardiology, Interventional      │   │
│ │ NFT Address: 0x742d...                       │   │
│ │ Verification Level: HIGH                     │   │
│ │   ├─ ✓ NPDB Clear                            │   │
│ │   ├─ ✓ License Verified                      │   │
│ │   ├─ ✓ Publications (3)                      │   │
│ │   ├─ ✓ Hospital Affiliated                   │   │
│ │   └─ ✓ HIPAA Compliant                       │   │
│ │                                               │   │
│ │ [View on Etherscan] [Renew] [Settings]       │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ Earnings Boost:                                     │
│ ├─ Base validator reward: 1 H1 / dataset           │
│ └─ Credentialed bonus: +3x = 3 H1 / dataset        │
│                                                      │
│ [Apply for Another Credential - Coming Soon]      │
└─────────────────────────────────────────────────────┘
```

---

## **KYC & Verification Workflow**

### **KYC Tiers:**

| Verification Level | Time to Verify | Earning Potential |
|-------------------|----------------|------------------|
| Basic (Email verified) | Immediate | 1x base rewards, Access public data |
| Enhanced (ID + Phone) | 5 minutes | 1.5x rewards, Access labeled data |
| Professional (License + Medical Board) | 1-2 hours (auto) | 2x rewards, Moderate sensitivity |
| Credentialed (Full KYC, NPDB, Background) | 2-3 days (manual review) | 3x rewards, Access PHI, Gate compliance data |

**Show progression bar in dashboard:**
```
Your Verification Level: Enhanced → Credentialed
Progress: [████████░░] 80%
├─ ✓ Email verified
├─ ✓ Phone verified
├─ ✓ License checked
├─ ⏳ Background check (in progress)
└─ ⏳ Manual review (queued)

Estimated full credential: March 17, 2025
```

---

## **Compliance & Trust Indicators**

Throughout the flow, display **compliance badges** at key moments:

```
┌─────────────────────────────────────┐
│ 🔒 Compliance Methods Used:         │
├─────────────────────────────────────┤
│ ✓ HIPAA-Compliant Data Storage      │
│ ✓ SOC 2 Type II Certified           │
│ ✓ NPDB & State Board Integration    │
│ ✓ FCRA-Compliant Background Check   │
│ ✓ AES-256 Encryption at Rest        │
│ ✓ TLS 1.3 Encryption in Transit     │
│ ✓ Blockchain Immutable Audit Trail  │
│ ✓ GDPR Compliant (EU users)         │
│ ✓ EU AI Act Risk Classification     │
│ ✓ C2PA Compliant for Creative Data  │
└─────────────────────────────────────┘
```

---

## **Edge Cases & Error Handling**

### **License Not Found in State Board:**
```
⚠️ "Your license number could not be verified automatically.

This could mean:
• License number may be formatted differently (try XXX-XXX-XXX)
• License recently issued (wait 24-48 hours for sync)
• License in different state than selected

[Option 1: Manual Verification]
Upload a recent license statement from state board.

[Option 2: Try Again]
Double-check license number and state."
```

### **Background Check Flagged:**
```
⚠️ "Your background check has been flagged for manual review.

This does not automatically disqualify your application.
Common reasons:
• Name variation or address history
• Old administrative note (not disciplinary)
• Public record match (false positive)

We will contact you within 48 hours via email 
at [sarah@hospital.org] with next steps."
```

### **Credential Expiring Soon:**
```
⏰ "Your Medical Credential expires on June 15, 2025 
   (90 days from now)

Earning Impact:
├─ Days 1-60: Full 3x earning bonus
├─ Days 61-90: Reduced to 1.5x (pending renewal)
└─ After expiry: 1x base rate only

[Renew Now] [Renew in 30 Days]
```

---

## **Advanced Features**

### **Privacy Controls:**
- ☐ Hide credential from public explorer
- ☐ Hide specialty information
- ☐ Hide publication list
- ☐ Remove hospital affiliation from public record

### **Credential Renewal:**
- 30 days before expiry: Email notification + dashboard banner
- Renewal flow: Similar to application but faster
- Renewal cost: Free (platform absorbs verification fees)
- Renewal time: 1-2 hours

### **Multi-Credential Support:**
- Users can hold multiple credentials (MD, Board Cert, Subspecialties)
- Dashboard shows all active credentials
- Earnings combine for each credentialed specialty

---

## **Success Metrics & Analytics**

Track:
- Completion rate by step (where do users drop off?)
- Time to complete (identify friction points)
- Verification time by method (NPDB vs state board vs manual)
- Approval rate (should be 95%+)
- Re-application rate (why are some rejected?)
- Credential usage rate (% credentialed users validating data)
- Earning lift per credential type
- Renewal rate (track credential maintenance)
