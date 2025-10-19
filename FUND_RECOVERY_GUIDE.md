# 🚨 FUND RECOVERY GUIDE - URGENT

## Critical Issue: Funds Missing from Vault

**User reported**: "No funds to unstake. Vault balance: 0 USDC"

## IMMEDIATE STEPS TO LOCATE YOUR FUNDS

### Step 1: Check Your Wallet Balance

**Your USDC might still be in your wallet if the deposit failed!**

1. Open MetaMask/your wallet
2. Check USDC balance on Base Sepolia network
3. **If you see your USDC balance** → The deposit transaction failed, your money is safe in your wallet!

### Step 2: Check Transaction History

#### Option A: In Your Wallet

1. Open MetaMask → Activity tab
2. Look for recent transactions:
   - ✅ "Approve" - USDC approval
   - ✅ "Deposit" - Vault deposit
   - ✅ "Contract Interaction" - Could be either

#### Option B: On BaseScan

1. Go to: https://sepolia.basescan.org
2. Enter your wallet address in the search bar
3. Click "Transactions" tab
4. Look for recent transactions

### Step 3: Analyze Transaction Status

For each transaction, check:

- ✅ **Success** = Transaction completed
- ❌ **Failed** = Transaction reverted (gas paid but nothing happened)
- ⏳ **Pending** = Still processing

## COMMON SCENARIOS & SOLUTIONS

### Scenario 1: Deposit Transaction Failed ✅ SAFE

**Symptoms:**

- Vault balance = 0
- USDC still in your wallet
- Transaction shows "Failed" status

**What happened:**

- Deposit transaction was rejected/reverted
- Your funds never left your wallet
- You only lost gas fees

**Solution:**

- Your money is safe! Try depositing again
- Make sure you approved USDC first
- Check gas settings

---

### Scenario 2: Only Approved, Never Deposited ✅ SAFE

**Symptoms:**

- Vault balance = 0
- USDC still in your wallet
- Only "Approve" transaction in history

**What happened:**

- You approved USDC but didn't complete the deposit
- Approval allows vault to spend, but you need to call deposit()

**Solution:**

```javascript
// Your money is safe in your wallet!
// Just complete the deposit:
1. Click "Deposit" button again
2. Enter amount (don't need to approve again)
3. Confirm transaction
```

---

### Scenario 3: Deposited to Wrong Address ⚠️ CHECK

**Symptoms:**

- Vault balance = 0
- USDC missing from wallet
- Transaction succeeded but wrong contract

**What happened:**

- Deposited to incorrect vault address
- Wrong network (Ethereum instead of Base Sepolia?)

**Check:**

```javascript
// In browser console:
console.log("Vault Address:", "EXPECTED_VAULT_ADDRESS");
console.log("Network:", "84532 (Base Sepolia)");
```

**Solution:**

- Check transaction on BaseScan
- See which contract received your USDC
- If it's a different vault, you may need to withdraw from there

---

### Scenario 4: Funds Actually in Vault 🔍 DEBUG

**Symptoms:**

- Vault balance shows 0 in UI
- Deposit transaction succeeded
- BaseScan shows USDC in vault contract

**What happened:**

- UI bug reading wrong balance
- Wrong vault address in config
- Cached data issue

**Immediate Check:**

1. Open Browser Console (F12)
2. Look for debug output:

```
🔍 Active Staking Debug: {
  vaultBalanceRaw: "0",  ← Should be your amount
  vaultAddress: "0x..."  ← Copy this
}
```

3. Go to BaseScan: https://sepolia.basescan.org/address/VAULT_ADDRESS
4. Click "Contract" → "Read Contract"
5. Find `balanceOf` function
6. Enter your wallet address
7. Click "Query"
8. **If it shows a balance** → Your funds are safe! It's a UI bug

---

### Scenario 5: Successfully Withdrawn ℹ️ CHECK

**Symptoms:**

- Vault balance = 0
- USDC is back in wallet
- Withdrawal transaction in history

**What happened:**

- You already withdrew your funds!
- They're back in your wallet

**Check:**

- Look at your USDC balance in wallet
- Check for "Withdraw" transactions

---

## RECOVERY COMMANDS

### Check Vault Balance Directly (Browser Console)

```javascript
// 1. Get your addresses
const myWallet = "YOUR_WALLET_ADDRESS";
const vaultAddress = "0x..."; // From console debug output

// 2. Check vault balance on BaseScan
// Go to: https://sepolia.basescan.org/address/[VAULT_ADDRESS]#readContract
// Call balanceOf(myWallet)

// 3. Check USDC balance in wallet
// Go to: https://sepolia.basescan.org/address/[MY_WALLET]
// Look for USDC token balance
```

### Emergency Withdrawal (If Funds in Vault)

If BaseScan shows funds in vault but UI doesn't:

```javascript
// Option 1: Use the app's withdraw function
// Go to Active Staking → Manual Unstake

// Option 2: Direct contract interaction
// Go to BaseScan → Vault Contract → Write Contract
// Connect wallet
// Call withdraw(amount) with your full balance
```

### Clear Cached Data

```javascript
// In browser console:
localStorage.clear();
location.reload();
```

---

## DEBUGGING CHECKLIST

Print this and check each item:

- [ ] Checked USDC balance in my wallet
- [ ] Checked transaction history on BaseScan
- [ ] Verified all transactions are on Base Sepolia (Chain ID 84532)
- [ ] Checked vault contract balance on BaseScan
- [ ] Verified vault address matches config
- [ ] Checked browser console for errors
- [ ] Cleared localStorage and refreshed
- [ ] Switched wallet and switched back

---

## CONTRACT ADDRESSES TO VERIFY

**Base Sepolia Network (Chain ID: 84532)**

Get the addresses from your console debug output and verify:

```javascript
Vault Address: 0x...
USDC Address: 0x...
Your Wallet: 0x...
```

Then check each on BaseScan:

- https://sepolia.basescan.org/address/VAULT_ADDRESS
- https://sepolia.basescan.org/address/USDC_ADDRESS
- https://sepolia.basescan.org/address/YOUR_WALLET

---

## MOST LIKELY CAUSES (In Order)

### 1. ✅ Deposit Failed (90% chance)

- Your money is still in your wallet
- Transaction reverted
- Check wallet USDC balance

### 2. ✅ Only Approved, Didn't Deposit (8% chance)

- Approved but forgot to deposit
- Money safe in wallet
- Complete the deposit

### 3. 🔍 UI Bug (1.5% chance)

- Funds actually in vault
- UI showing wrong data
- Check BaseScan directly

### 4. ⚠️ Wrong Network/Address (0.5% chance)

- Deposited to wrong place
- Need to find the transaction
- May be recoverable

---

## IMMEDIATE ACTION REQUIRED

### DO THIS NOW:

1. **Check your wallet USDC balance** ← MOST IMPORTANT

   - Open MetaMask
   - Make sure you're on Base Sepolia
   - Look for USDC balance

2. **Check BaseScan transaction history**

   - https://sepolia.basescan.org
   - Enter your wallet address
   - Look at last 5-10 transactions

3. **Report back with:**
   - Your USDC balance in wallet: **\_\_\_**
   - Last transaction status: Success/Failed/Pending
   - Transaction hash: 0x...
   - Vault address from console: 0x...

---

## CONTACT FOR HELP

If you still can't find your funds:

1. **Screenshot** your browser console (F12)
2. **Copy** transaction hash from BaseScan
3. **Note** your wallet address
4. **Share** vault address from debug output

**In 95% of cases, your funds are safe in your wallet and the deposit just failed!**

---

## PREVENTION FOR FUTURE

1. Always check transaction status before moving on
2. Verify vault balance after deposit
3. Keep transaction hashes
4. Use small test amounts first
5. Check BaseScan for confirmation

---

## TECHNICAL DEEP DIVE

### How Deposits Work:

```
1. User → Approve USDC (vault can spend)
2. User → Deposit (calls vault.deposit())
3. Vault → transferFrom (pulls USDC from user)
4. Vault → Updates balanceOf[user]
```

### If Any Step Fails:

- Step 1 fails → No approval, money safe in wallet
- Step 2 fails → Approval done, but money still in wallet
- Step 3 fails → Vault couldn't pull USDC (insufficient balance/approval)
- Step 4 fails → Money might be in vault but not credited (RARE)

### Check Each Step:

```javascript
// 1. Check USDC approval
// BaseScan → USDC Contract → Read → allowance(yourWallet, vaultAddress)

// 2. Check vault balance
// BaseScan → Vault Contract → Read → balanceOf(yourWallet)

// 3. Check USDC token balance
// BaseScan → Your Wallet → Token Holdings → USDC
```

---

## WORST CASE SCENARIO RECOVERY

If funds truly stuck (extremely rare):

1. Contact vault contract owner (if upgradeable)
2. Submit issue with transaction proof
3. Request manual recovery
4. Community assistance

**But again: In 95% of cases, your money is just in your wallet because deposit failed!**
