# Lab Creation UI Features - Complete Guide

## 🎯 Overview

The lab creation process in the Prototype page now includes three major enhancements:
1. **Minimum Stake Validation** - Ensures users have 100k+ LABS before creating labs
2. **Lab Level Display** - Shows what level their lab will be based on current stake
3. **Created Labs Dashboard** - Displays all labs they've created with full details

---

## 1. 📊 Minimum Stake Validation (100k LABS Requirement)

### What Users See

#### **Insufficient Stake (< 100k LABS)**
```
┌─────────────────────────────────────────┐
│ Current Staked:         50,000 LABS     │
│ Projected Lab Level:    No Level (need 100k+)
│                                         │
│ ⚠️ You need at least 100,000 LABS       │
│    staked to create a lab. Currently    │
│    have 50,000.                         │
│                                         │
│ Level 1: 100,000 LABS                   │
│ Level 2: 250,000 LABS                   │
│ Level 3: 500,000 LABS                   │
└─────────────────────────────────────────┘
```

#### **Sufficient Stake (≥ 100k LABS)**
```
┌─────────────────────────────────────────┐
│ Current Staked:         150,000 LABS    │
│ Projected Lab Level:    Level 1         │
│                                         │
│ Level 1: 100,000 LABS                   │
│ Level 2: 250,000 LABS                   │
│ Level 3: 500,000 LABS                   │
└─────────────────────────────────────────┘
```

### Error Handling

**Toast Notification:**
```
❌ Insufficient staked LABS. You need at least 100,000 LABS to create a lab. 
   Please stake 50,000 more LABS.
```

**Activity Log Entry:**
```
14:32:15
❌ Stage 1: Create Lab
❌ Cannot create lab - only 50,000 LABS staked. Need at least 100,000 LABS
```

### Code Implementation

```typescript
// Validation constants
const MIN_STAKE_FOR_LAB = 100_000;      // 100k LABS minimum
const LEVEL1_THRESHOLD = 100_000;        // Level 1: 100k
const LEVEL2_THRESHOLD = 250_000;        // Level 2: 250k
const LEVEL3_THRESHOLD = 500_000;        // Level 3: 500k

// Check before creating lab
const stakedAmount = parseFloat(stakedLabs || '0');
if (stakedAmount < MIN_STAKE_FOR_LAB) {
  const needed = MIN_STAKE_FOR_LAB - stakedAmount;
  toast.error(`Insufficient staked LABS. You need at least ${MIN_STAKE_FOR_LAB.toLocaleString()} LABS to create a lab. Please stake ${needed.toLocaleString()} more LABS.`);
  addLog('error', 'Stage 1: Create Lab', `❌ Cannot create lab - only ${stakedAmount.toLocaleString()} LABS staked. Need at least ${MIN_STAKE_FOR_LAB.toLocaleString()} LABS`);
  return;
}
```

---

## 2. 🎖️ Lab Level Display

### Lab Level Calculation

The lab level is determined by total TVL (value staked):

| Level | Minimum LABS | Benefits |
|-------|-------------|----------|
| **None** | < 100,000 | Can't create lab |
| **Level 1** | 100,000 | 1 app slot |
| **Level 2** | 250,000 | 2 app slots |
| **Level 3** | 500,000 | 3 app slots |

### Pre-Creation Display

**In the Stake Section:**
- Current staked balance shown
- Projected lab level displayed
- Shows exact threshold values

**In Activity Log:**
```
14:32:20
ℹ️ Stage 1: Create Lab
🏗️ STARTING: Create "CardioLab" (CARDIO) lab in medical domain - Lab Level 1
```

### Post-Creation Display

**Success Toast:**
```
✅ Step 1 Complete! Lab created with ID: 1 (Level 1)
```

**Activity Log Confirmation:**
```
14:32:45
✅ Stage 1: Create Lab
✅ STEP 1 COMPLETE: Lab "CardioLab" created (ID: 1, Level 1) with vault deployed!
View tx ↗
```

**In Your Created Labs Card:**
```
┌────────────────────────────┐
│ CardioLab           Level 1 │
│ (CARDIO)                    │
│                             │
│ ID:                        1│
│ Domain:          medical   │
│ Created:   10/22/2025 14:45│
│ Vault:    0x29a7...e83488 ↗│
└────────────────────────────┘
```

---

## 3. 📋 Your Created Labs Section

### Overview

**Location:** Bottom of Prototype page (above progress banner)

**Visibility:** Only shows when user has created at least one lab

**Layout:**
- 1 column on mobile
- 2 columns on tablet (md breakpoint)
- 3 columns on desktop (lg breakpoint)

### What's Displayed Per Lab

```
┌─────────────────────────────────────────────┐
│  CardioLab                         Level 1   │ ← Lab name + level badge
│  (CARDIO)                                    │ ← Lab symbol
│                                              │
│  ID:                      1                  │ ← Lab ID
│  Domain:        medical                      │ ← Domain badge (capitalized)
│  Created:   10/22/2025 2:45:23 PM           │ ← Timestamp
│  Vault:   0x29a7...83488 ↗                 │ ← Clickable block explorer link
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  BiomedAnalytics                   Level 2   │
│  (BIOMED)                                    │
│                                              │
│  ID:                      2                  │
│  Domain:       biotech                       │
│  Created:   10/22/2025 2:43:12 PM           │
│  Vault:   0xd615...f512 ↗                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  ResearchHub                       Level 3   │
│  (RESEARCH)                                  │
│                                              │
│  ID:                      3                  │
│  Domain:      research                       │
│  Created:   10/22/2025 2:40:05 PM           │
│  Vault:   0xd615...f512 ↗                   │
└─────────────────────────────────────────────┘
```

### Section Header

```
Your Created Labs
Total: 3 labs created

[Lab Card 1] [Lab Card 2] [Lab Card 3]
```

### Features

✅ **Responsive Grid:** Auto-adjusts columns based on screen size
✅ **Level Badge:** Shows lab level with primary color
✅ **Domain Badge:** Outlined badge with capitalized domain
✅ **Block Explorer Link:** Truncated vault address with link to block explorer
✅ **Timestamps:** Human-readable creation date and time
✅ **Hover Effect:** Cards brighten on hover for interactivity

### Code Example

```typescript
interface CreatedLab {
  labId: number;
  name: string;
  symbol: string;
  domain: string;
  vaultAddress: string;
  createdAt: Date;
}

// When lab is created, add to array:
const newLab: CreatedLab = {
  labId: 1,
  name: 'CardioLab',
  symbol: 'CARDIO',
  domain: 'medical',
  vaultAddress: '0x29a7297e84df485aff8def2d27e467f3a37619c0',
  createdAt: new Date()
};
setUserCreatedLabs(prev => [newLab, ...prev]); // Most recent first
```

---

## 4. 🔄 Complete User Flow

### Step 1: User Lands on Prototype Page
```
✓ Page loads
✓ Current staked balance fetched from contract
✓ Projected lab level calculated
✓ If no stake: Shows "No Level (need 100k+)" with warning
```

### Step 2: User Stakes LABS (if needed)
```
✓ User enters stake amount
✓ Clicks "Stake LABS Tokens"
✓ Signs approval + stake transactions
✓ Staked balance updates in real-time
✓ Projected level recalculates
```

### Step 3: User Creates Lab
```
✓ User fills lab name, symbol, domain
✓ System checks: If staked < 100k, shows error and stops
✓ If staked ≥ 100k, proceeds with creation
✓ Activity log shows calculated lab level
✓ Success message includes lab level
✓ Lab card appears in "Your Created Labs"
```

### Step 4: View Created Lab
```
✓ Scroll to bottom of page
✓ See "Your Created Labs" section
✓ Lab card shows:
  - Lab name & symbol
  - Level badge
  - Lab ID
  - Domain
  - Creation time
  - Vault address (clickable)
```

---

## 5. 🎨 UI Components Used

### New/Enhanced Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Card` | Stake section box | Container for balance display |
| `Badge` | Level display | Shows level number in color |
| `Badge` | Domain display | Shows domain in outline style |
| `Input` | Stake amount | For staking amount entry |
| `Button` | "Stake LABS Tokens" | Action button |
| `Separator` | UI divider | Visual separation |
| `Grid` | Lab cards layout | Responsive 3-column grid |
| `ScrollArea` | Activity log | Scrollable log display |

### Styling Classes

```typescript
// Staked balance display
"flex items-center justify-between text-sm"
"font-semibold text-primary"

// Warning box
"bg-destructive/10 border border-destructive/30 rounded text-xs text-destructive"

// Lab card
"grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
"p-4 border-secondary/30 bg-secondary/5 hover:bg-secondary/10 transition"

// Level badge
"bg-primary text-primary-foreground"

// Domain badge
"variant='outline' className='capitalize'"
```

---

## 6. 📱 Responsive Behavior

### Mobile (< 768px)
- Stake info displays as full-width stacked layout
- Lab cards show 1 per row
- Warning box has full padding
- All text readable and touchable

### Tablet (768px - 1024px)
- Stake info still readable
- Lab cards show 2 per row
- Grid maintains good spacing

### Desktop (> 1024px)
- Stake info optimized for wide screens
- Lab cards show 3 per row
- Maximum content utilization
- Sidebar remains sticky

---

## 7. 🚨 Error States

### Before Transaction
```
❌ INSUFFICIENT BALANCE
"You need at least 100,000 LABS staked to create a lab. Currently have 50,000."
```

### Missing Fields
```
❌ VALIDATION ERROR
"Please fill in all lab details"
```

### Network Error
```
❌ CREATION FAILED
"Failed to create lab"
```

### Wallet Not Connected
```
❌ NOT CONNECTED
"Please connect your wallet first"
```

---

## 8. ✨ Key Features

✅ **Real-time Balance Display** - Shows current staked LABS
✅ **Projected Level** - Calculates level BEFORE creating lab
✅ **Smart Validation** - Prevents lab creation without 100k+ LABS
✅ **Clear Messaging** - User knows exactly what they need
✅ **Threshold Reference** - Shows all level tiers
✅ **Lab Cards** - Beautiful display of created labs
✅ **Block Explorer Links** - Easy access to vault contracts
✅ **Responsive Design** - Works on all screen sizes
✅ **Activity Logging** - Full transparency of what happened
✅ **Toast Notifications** - Quick feedback on actions

---

## 9. 🔧 Technical Implementation

### State Variables
```typescript
const [userCreatedLabs, setUserCreatedLabs] = useState<CreatedLab[]>([]);
```

### Helper Functions
```typescript
const calculateLabLevel = (stakedAmount: number): number => {
  if (stakedAmount >= LEVEL3_THRESHOLD) return 3;
  if (stakedAmount >= LEVEL2_THRESHOLD) return 2;
  if (stakedAmount >= LEVEL1_THRESHOLD) return 1;
  return 0;
};
```

### Computed Values
```typescript
const currentStakedAmount = parseFloat(stakedLabs || '0');
const projectedLabLevel = calculateLabLevel(currentStakedAmount);
const canCreateLab = currentStakedAmount >= MIN_STAKE_FOR_LAB;
```

### Event Parsing
```typescript
const labCreatedEvent = receipt.logs.find(
  (log: any) => log.topics[0] === ethers.id("LabCreated(uint256,address,string,string,string,address)")
);
const labId = ethers.toNumber(labCreatedEvent.topics[1]);

// Extract vault address
const iface = new ethers.Interface(LABSCoreFacet_ABI);
const decoded = iface.parseLog(labCreatedEvent);
const vaultAddress = decoded.args[5];
```

---

## 10. 📝 Summary

This enhancement transforms the lab creation experience from:
- **Before:** "Let me try to create a lab and see what happens"
- **After:** "I know exactly what level I'll get and where my labs are"

Users now have:
1. **Clear requirements** - Exactly 100k LABS needed
2. **Predictability** - See level before creating
3. **Visibility** - All created labs in one place
4. **Control** - Full information to make decisions
5. **Transparency** - Activity log shows everything

The implementation is production-ready and handles edge cases gracefully.
