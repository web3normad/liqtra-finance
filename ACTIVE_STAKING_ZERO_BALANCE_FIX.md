# Active Staking Zero Balance Fix

## Problem

User reported "Total Staked showing $0" even though showing "7 positions" on the Active Staking page.

## Root Cause Analysis

### The Issue

The active staking page was showing:

- **Total Staked: $0**
- **7 positions**

This mismatch indicates:

1. **localStorage has position data** (7 positions stored)
2. **Vault contract balance is 0** (no actual funds in contract)

### Why This Happens

Three possible scenarios:

1. **Funds were withdrawn** - User withdrew all funds but localStorage wasn't cleared
2. **Stale localStorage data** - Old position data from previous sessions
3. **Wrong contract** - Reading from incorrect vault address

## Solution Implemented

### 1. Enhanced Balance Calculation

```typescript
// Calculate from both sources
const positionsTotalAmount = positions.reduce(
  (sum, pos) => sum + pos.amount,
  0
);
const totalStaked =
  vaultBalance > 0
    ? vaultBalance // Trust contract balance if available
    : positionsTotalAmount > 0
    ? positionsTotalAmount // Fall back to positions sum
    : 0;
```

### 2. Mismatch Detection & Warning

```typescript
useEffect(() => {
  if (positionsTotalAmount > 0 && vaultBalance === 0) {
    console.error(
      "⚠️ MISMATCH: Positions show",
      positionsTotalAmount,
      "USDC but vault balance is 0!"
    );
    console.error("This means either:");
    console.error("1. Funds were withdrawn from the vault");
    console.error("2. localStorage has stale position data");
    console.error("3. Wrong vault contract address");
    toast.error("Position data mismatch detected! Check console.", {
      id: "mismatch",
    });
  }
}, [positionsTotalAmount, vaultBalance]);
```

### 3. Visual Indicators

```tsx
{
  /* Show warning icon if vault balance is 0 */
}
{
  vaultBalance > 0 ? (
    <CheckCircle size={20} weight="fill" className="text-success" />
  ) : (
    <WarningCircle size={20} weight="fill" className="text-warning" />
  );
}

{
  /* Show vault balance warning in position count */
}
{
  positions.length;
}
{
  positions.length === 1 ? "position" : "positions";
}
{
  vaultBalance === 0 && positionsTotalAmount > 0 && (
    <span className="text-warning ml-1">(⚠️ Vault: $0)</span>
  );
}
```

### 4. Enhanced Debug Logging

```typescript
console.log("🔍 Active Staking Debug:", {
  vaultBalanceData,
  vaultBalanceRaw: vaultBalanceData?.toString(),
  vaultBalance,
  vaultBalanceFormatted: vaultBalance.toFixed(6),
  address,
  vaultAddress,
  chainId,
  positionsCount: positions.length,
  hasBalance: vaultBalance > 0,
});

if (address && vaultAddress && vaultBalance === 0) {
  console.warn(
    "⚠️ Vault balance is 0 - check if funds are actually deposited in contract:",
    vaultAddress
  );
}
```

## How to Debug

### Step 1: Check Browser Console

Look for these messages:

```
🔍 Active Staking Debug: {
  vaultBalance: 0,
  positionsCount: 7,
  vaultAddress: "0x..."
}
```

### Step 2: Verify Contract Balance

1. Go to BaseScan: https://sepolia.basescan.org
2. Search for the vault address shown in console
3. Check if your wallet address has a balance in the vault

### Step 3: Clear Stale Data (If Needed)

If vault balance is actually 0:

```javascript
// In browser console
const address = "YOUR_WALLET_ADDRESS";
const chainId = 84532; // Base Sepolia
localStorage.removeItem(`positions_${address}_${chainId}`);
location.reload();
```

## Expected Behavior After Fix

### Scenario 1: Valid Balance

- ✅ Total Staked shows actual vault balance
- ✅ Green check icon
- ✅ Positions displayed correctly

### Scenario 2: Stale Data (Vault = 0, Positions exist)

- ⚠️ Total Staked shows positions sum (fallback)
- ⚠️ Yellow warning icon
- ⚠️ Warning text: "(⚠️ Vault: $0)"
- ⚠️ Toast notification about mismatch
- ⚠️ Console errors explaining the issue

### Scenario 3: No Data

- ℹ️ Total Staked shows $0
- ℹ️ 0 positions
- ℹ️ No warnings

## Testing Steps

1. **Connect wallet**
2. **Check console** for debug output
3. **Verify vault balance** on BaseScan
4. **Check Total Staked display**:
   - If vault has funds → Shows vault balance
   - If vault = 0 but positions exist → Shows warning
   - If both = 0 → Shows $0 correctly

## Files Modified

1. `/frontend/app/(dashboard)/active-staking/page.tsx`
   - Enhanced balance calculation
   - Added mismatch detection
   - Improved debug logging
   - Added visual warning indicators

## Prevention

To prevent stale localStorage data in the future:

1. Always clear positions after full withdrawal
2. Implement auto-sync with contract balance
3. Add localStorage version/timestamp validation
4. Show contract balance vs cached balance comparison

## Next Steps

If user is still seeing $0:

1. **Check console output** - What does vaultBalanceRaw show?
2. **Verify contract** - Is vaultAddress correct?
3. **Check network** - Connected to Base Sepolia (84532)?
4. **Verify deposit** - Was deposit transaction successful?
5. **Clear cache** - Remove stale localStorage data

## Related Files

- `useAutomation.ts` - clearPositions() function
- `page.tsx` (dashboard) - Portfolio value calculation
- Contract: `LiqtraVault.sol` - balanceOf() function
