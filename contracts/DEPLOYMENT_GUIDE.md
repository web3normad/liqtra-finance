# Liqtra Finance - Smart Contract Deployment Guide

## 📋 Prerequisites

1. **Foundry installed**

   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Wallet with Base Sepolia ETH**

   - Get Base Sepolia ETH from faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Or use Alchemy faucet: https://www.alchemy.com/faucets/base-sepolia
   - Need ~0.005 ETH for deployment

3. **Alchemy or public RPC**

   - Free Alchemy API: https://www.alchemy.com/
   - Or use public RPC: https://sepolia.base.org

4. **BaseScan API Key (for verification)**
   - Get free key: https://basescan.org/apis

## 💰 Official USDC on Base Sepolia

**Good news!** Circle has official USDC on Base Sepolia testnet:

- Address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- This is the same USDC used in production (just on testnet)
- No need to deploy mock USDC!
- Get test USDC from: https://faucet.circle.com/

## 🔧 Setup

### 1. Navigate to contracts directory

```bash
cd /home/emmanuel/Documents/work_projects/liqtra-finance/contracts
```

### 2. Install dependencies

```bash
forge install
```

### 3. Create .env file

```bash
cp .env.example .env
```

### 4. Edit .env file

```bash
# Add your private key (the one with Base Sepolia ETH)
PRIVATE_KEY=0xyour_private_key_here

# Add RPC URL
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
# Or: https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Add BaseScan API key
BASESCAN_API_KEY=your_basescan_api_key
```

⚠️ **IMPORTANT**: Never commit your .env file! It's already in .gitignore.

## 🧪 Test Contracts First

Before deploying, run tests to ensure everything works:

```bash
# Run all tests
forge test

# Run tests with verbose output
forge test -vvv

# Run specific test
forge test --match-test testDeposit -vvv
```

Expected output:

```
✅ All tests should pass
✅ Gas estimates will be shown
```

## 🚀 Deployment

### Deploy Vault Contract

The deployment script will use Circle's official USDC on Base Sepolia:

```bash
forge script script/DeployAll.s.sol:DeployAll \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv
```

**What happens during deployment:**

1. **Connects to Base Sepolia** via your RPC URL
2. **Deploys LiqtraVault** with official USDC address
3. **Verifies on BaseScan** automatically
4. **Shows deployment summary** with addresses

Expected output:

```
==============================================
Deployment Summary
==============================================
USDC (Circle):   0x036CbD53842c5426634e7929541eC2318f3dCF7e
LiqtraVault:     0xYourNewVaultAddress
Owner:           0xYourWalletAddress
```

## 📝 After Deployment

### 1. Save Contract Addresses

Copy the addresses from deployment output:

```
USDC (Circle):  0x036CbD53842c5426634e7929541eC2318f3dCF7e
LiqtraVault:    0xYourNewVaultAddress
```

### 2. Update Frontend .env

```bash
cd /home/emmanuel/Documents/work_projects/liqtra-finance/frontend
```

Edit `.env`:

```bash
NEXT_PUBLIC_VAULT_CONTRACT=0xYourVaultAddress
NEXT_PUBLIC_USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### 3. Update Backend .env

```bash
cd /home/emmanuel/Documents/work_projects/liqtra-finance/backend/api
```

Edit `.env` or `env.example`:

```bash
VAULT_ADDRESS=0xYourVaultAddress
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
RPC_URL=https://sepolia.base.org
```

### 4. Verify on BaseScan

Visit your contract on BaseScan:

```
https://sepolia.basescan.org/address/0xYourVaultAddress
```

You should see:

- ✅ Green checkmark (verified)
- Read Contract tab
- Write Contract tab
- All functions visible

## 💰 Get Test USDC

### Circle USDC Faucet (Official)

**Best option:** Use Circle's official faucet for Base Sepolia:

1. Visit: https://faucet.circle.com/
2. Select "Base Sepolia" network
3. Enter your wallet address
4. Click "Get USDC"
5. Receive 10 USDC instantly!

### Alternative: Alchemy Faucet

Some multi-chain faucets also support Base Sepolia USDC:

- https://www.alchemy.com/faucets/base-sepolia

### Verify USDC Balance

```bash
cast call 0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  "balanceOf(address)(uint256)" \
  YOUR_WALLET_ADDRESS \
  --rpc-url https://sepolia.base.org
```

Expected output: `10000000` (10 USDC with 6 decimals)

## 🧪 Test the Vault

### 1. Check USDC Balance

```bash
cast call 0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  "balanceOf(address)(uint256)" \
  YOUR_WALLET_ADDRESS \
  --rpc-url https://sepolia.base.org
```

Expected: `10000000` (10 USDC)

### 2. Approve Vault to Spend USDC

```bash
cast send 0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  "approve(address,uint256)" \
  YOUR_VAULT_ADDRESS \
  10000000 \
  --rpc-url base_sepolia \
  --private-key $PRIVATE_KEY
```

### 3. Deposit to Vault

```bash
cast send YOUR_VAULT_ADDRESS \
  "deposit(uint256)" \
  10000000 \
  --rpc-url base_sepolia \
  --private-key $PRIVATE_KEY
```

### 4. Check Vault Balance

```bash
cast call YOUR_VAULT_ADDRESS \
  "balances(address)(uint256)" \
  YOUR_WALLET_ADDRESS \
  --rpc-url https://sepolia.base.org
```

Expected: `10000000` (10 USDC deposited)

### 5. Withdraw from Vault

```bash
cast send YOUR_VAULT_ADDRESS \
  "withdraw(uint256)" \
  5000000 \
  --rpc-url base_sepolia \
  --private-key $PRIVATE_KEY
```

Withdraws 5 USDC, leaving 5 USDC in vault.

## 🔍 Verify Contract Manually (if auto-verify fails)

### For LiqtraVault:

```bash
forge verify-contract \
  YOUR_VAULT_ADDRESS \
  src/LiqtraVault.sol:LiqtraVault \
  --constructor-args $(cast abi-encode "constructor(address)" 0x036CbD53842c5426634e7929541eC2318f3dCF7e) \
  --chain base-sepolia \
  --etherscan-api-key $BASESCAN_API_KEY
```

Note: USDC contract is already verified by Circle, no need to verify it.

## 🎯 Contract Functions Reference

### Circle USDC Contract

**Address:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

**Read Functions:**

- `balanceOf(address account)` - Get USDC balance
- `allowance(address owner, address spender)` - Check allowance
- `totalSupply()` - Total USDC supply
- `decimals()` - Returns 6

**Write Functions:**

- `approve(address spender, uint256 amount)` - Approve spending
- `transfer(address to, uint256 amount)` - Transfer USDC

### LiqtraVault Functions

**Read Functions:**

- `balances(address user)` - Get user's vault balance
- `getUserBalance(address user)` - Same as balances
- `userRiskLevel(address user)` - Get user's risk level (0-2)
- `totalDeposited()` - Total USDC in vault
- `getVaultBalance()` - Vault's USDC balance
- `usdc()` - USDC contract address (returns `0x036CbD...`)

**Write Functions:**

- `deposit(uint256 amount)` - Deposit USDC (min 1 USDC)
- `withdraw(uint256 amount)` - Withdraw specific amount
- `withdrawAll()` - Withdraw all balance
- `setRiskLevel(uint8 level)` - Set risk level (0-2)
- `emergencyWithdraw()` - Emergency withdraw all

## 🐛 Troubleshooting

### "Insufficient funds" error

- Make sure you have Base Sepolia ETH for gas
- Get more from faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

### "Need USDC" error

- Get test USDC from Circle's faucet: https://faucet.circle.com/
- Select "Base Sepolia" network
- Receive 10 USDC instantly

### "Contract verification failed"

- Wait 1-2 minutes after deployment
- Try manual verification command above
- Check BaseScan API key is valid

### "Transaction reverted"

- Check you approved USDC before deposit
- Check amount is >= 1 USDC (1000000 with 6 decimals)
- Check you have enough USDC balance

### "Private key error"

- Make sure .env file exists
- Make sure PRIVATE_KEY starts with 0x
- Check private key has Base Sepolia ETH

## 📊 Gas Costs (Estimate)

- Deploy LiqtraVault: ~0.002 ETH
- Approve USDC: ~0.0001 ETH
- Deposit: ~0.0002 ETH
- Withdraw: ~0.0002 ETH

**Total for testing**: ~0.003 ETH (~$8 worth)

## ✅ Deployment Checklist

- [ ] Foundry installed
- [ ] Base Sepolia ETH in wallet (>0.003 ETH)
- [ ] Created .env file with private key
- [ ] Added RPC URL to .env
- [ ] Added BaseScan API key to .env
- [ ] Ran tests successfully (`forge test`)
- [ ] Deployed vault (`forge script`)
- [ ] Copied vault address
- [ ] Updated frontend .env with vault + USDC addresses
- [ ] Updated backend .env with vault + USDC addresses
- [ ] Verified contract on BaseScan
- [ ] Got test USDC from Circle faucet (https://faucet.circle.com/)
- [ ] Tested deposit flow
- [ ] Tested withdraw flow

## 🎉 Success!

Once deployed, your vault will be live on Base Sepolia testnet with official Circle USDC!

**USDC Address (Circle Official):** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

**Next Steps:**

1. Test full flow in frontend
2. Connect wallet
3. Get USDC from Circle faucet
4. Deposit USDC to vault
5. Check balance updates
6. Withdraw funds

## 📚 Resources

- Foundry Book: https://book.getfoundry.sh/
- Base Docs: https://docs.base.org/
- BaseScan: https://sepolia.basescan.org/
- Base Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Circle USDC Faucet: https://faucet.circle.com/
- Circle USDC on Base Sepolia: https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e
