# 🎯 Dashboard Integration - Quick Start Guide

## ✅ Integration Status: COMPLETE

Your dashboard is now fully integrated with the LiqtraVault smart contract deployed on Base Sepolia testnet.

---

## 🚀 Quick Start (3 Steps)

### 1. Start Frontend

```bash
cd frontend
npm run dev
```

Or use the test script:

```bash
./test-dashboard.sh
```

### 2. Get Test Tokens

- **Base Sepolia ETH**: https://www.alchemy.com/faucets/base-sepolia
- **Test USDC**: https://faucet.circle.com/

### 3. Connect & Test

1. Open http://localhost:3000
2. Connect your wallet (top right)
3. Switch to Base Sepolia network
4. Try deposit, withdraw, and risk level features

---

## 📝 Contract Addresses

```
Vault:  0x8962C42bFE1f011194f6DF329500D1b34b9844d1
USDC:   0x036CbD53842c5426634e7929541eC2318f3dCF7e
Network: Base Sepolia (84532)
```

**View on BaseScan**:

- Vault: https://sepolia.basescan.org/address/0x8962C42bFE1f011194f6DF329500D1b34b9844d1
- USDC: https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e

---

## 🧪 Testing Features

### ✅ Deposit Flow

1. Click "Deposit" quick action button
2. Enter amount (min 1 USDC)
3. Click "Approve USDC" (first time only)
4. Wait for approval confirmation
5. Click "Deposit"
6. Verify vault balance updates

**Expected**: USDC moves from wallet → vault, balance updates in UI

### ✅ Withdraw Flow

1. Click "Withdraw" quick action button
2. Enter amount (up to vault balance)
3. Click "Withdraw"
4. Wait for confirmation
5. Verify USDC back in wallet

**Expected**: USDC moves from vault → wallet, balance updates in UI

### ✅ Risk Level

1. Click "Update Risk Level" in sidebar
2. Select preference:
   - 🛡️ Conservative (3-5% APY)
   - ⚖️ Moderate (5-10% APY)
   - 🚀 Aggressive (10-20% APY)
3. Click "Update Risk Level"
4. Confirm transaction
5. Verify change reflected in UI

**Expected**: Risk level stored on-chain, UI updates immediately

### ✅ Stake Now Button

1. Scroll to "Top Yield Opportunities"
2. Click "Stake Now" on any card
3. Deposit modal opens
4. Follow deposit flow

**Expected**: Seamless transition from opportunity → deposit

---

## 📦 What's Integrated

### Smart Contract Functions

- ✅ `deposit(uint256)` - Deposit USDC
- ✅ `withdraw(uint256)` - Withdraw USDC
- ✅ `balances(address)` - Read vault balance
- ✅ `userRiskLevel(address)` - Read risk preference
- ✅ `setRiskLevel(uint8)` - Update risk preference
- ✅ USDC approval flow
- ✅ Transaction monitoring
- ✅ Event listening (Deposit, Withdrawal, RiskLevelUpdated)

### UI Components

- ✅ StatsOverview - Shows total value, earnings, APY
- ✅ QuickActions - Deposit/Withdraw/AI buttons
- ✅ ActivePositions - Shows vault positions
- ✅ TopYieldCards - DeFiLlama opportunities
- ✅ DepositWithdrawCard - Transaction interface
- ✅ RiskLevelCard - Risk preference selector
- ✅ Modals - Clean UX for transactions

### Data Sources

- ✅ Vault balance from smart contract
- ✅ USDC balance from chain
- ✅ Risk level from smart contract
- ✅ Top yields from DeFiLlama API
- ✅ Token prices from CoinGecko
- ✅ Portfolio data from backend (optional)

---

## 🔍 Verification

### Check Integration Works

```bash
# Check .env has correct addresses
grep VAULT_CONTRACT frontend/.env

# Expected output:
# NEXT_PUBLIC_VAULT_CONTRACT=0x8962C42bFE1f011194f6DF329500D1b34b9844d1
# NEXT_PUBLIC_USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### Check Files Updated

```bash
# All these files should exist
ls -la frontend/lib/web3/contracts/abis/vault.json
ls -la frontend/components/dashboard/RiskLevelCard.tsx
ls -la frontend/lib/web3/contracts/deployed.ts
```

---

## 🛠️ Troubleshooting

### "Wallet not connected"

- Click "Connect Wallet" in top right
- Select your wallet provider
- Approve connection

### "Wrong network"

- Open wallet
- Switch to Base Sepolia network
- Chain ID: 84532
- RPC: https://sepolia.base.org

### "Insufficient USDC"

- Get test USDC: https://faucet.circle.com/
- Make sure you're on Base Sepolia network
- Wait a few minutes for faucet transaction

### "Transaction failed"

- Check you have Base Sepolia ETH for gas
- Verify USDC approval before deposit
- Ensure amount doesn't exceed balance
- Check BaseScan for transaction details

### "Balance not updating"

- Wait for transaction confirmation (~2-5 seconds)
- Check transaction on BaseScan
- Refresh page if needed
- Verify you're on correct network

### "Risk level won't change"

- Ensure transaction is confirmed on-chain
- Check you have gas for transaction
- View transaction on BaseScan
- Refresh page after confirmation

---

## 📊 Expected Behavior

### On Connect

- Wallet address appears in header
- Stats overview shows $0 (until deposit)
- USDC balance loads from chain
- Vault balance loads from contract
- Risk level loads from contract

### After Deposit

- Vault balance increases
- USDC wallet balance decreases
- Active positions section appears
- Stats overview shows total value
- Transaction appears on BaseScan

### After Withdraw

- Vault balance decreases
- USDC wallet balance increases
- If balance = 0, positions hidden
- Stats update accordingly
- Transaction appears on BaseScan

### After Risk Level Change

- Sidebar shows new risk level
- Icon changes (🛡️/⚖️/🚀)
- Expected APY updates
- On-chain value verified
- Transaction on BaseScan

---

## 🔗 Important Links

### Faucets

- Base Sepolia ETH: https://www.alchemy.com/faucets/base-sepolia
- Test USDC: https://faucet.circle.com/

### Explorers

- Vault Contract: https://sepolia.basescan.org/address/0x8962C42bFE1f011194f6DF329500D1b34b9844d1
- USDC Token: https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e
- Base Sepolia: https://sepolia.base.org

### Documentation

- Full Integration Guide: `DASHBOARD_INTEGRATION_COMPLETE.md`
- Deployment Details: `../contracts/DEPLOYMENT_SUCCESS.md`
- Contract Source: `../contracts/src/LiqtraVault.sol`

---

## 🎯 Next Steps

### Testing (Now)

1. ✅ Test deposit with 1 USDC
2. ✅ Test risk level changes
3. ✅ Test withdraw back to wallet
4. ✅ Verify all balances update correctly
5. ✅ Check transactions on BaseScan

### Backend Integration (Optional)

1. Update backend .env files with contract addresses
2. Start backend API and agent services
3. Enable portfolio history
4. Enable AI yield optimization
5. Enable WebSocket real-time updates

### Production (Later)

1. Deploy contracts to Base Mainnet
2. Update .env with mainnet addresses
3. Switch to mainnet RPC
4. Test with real USDC
5. Enable mainnet features

---

## ✨ You're All Set!

The dashboard is fully integrated and ready for testing. Connect your wallet and start exploring! 🚀

**Need Help?**

- Check BaseScan for transaction details
- View browser console for error messages
- Review `DASHBOARD_INTEGRATION_COMPLETE.md` for full details
- All contract functions are documented in `deployed.ts`

**Happy Testing! 🎉**
