# 🚀 Quick Deploy - TL;DR

## Before You Start

- [ ] Have Base Sepolia ETH (~0.003 ETH)
- [ ] Have Foundry installed (`foundryup`)
- [ ] Have BaseScan API key

## Deploy in 3 Commands

### 1. Setup Environment

```bash
cd /home/emmanuel/Documents/work_projects/liqtra-finance/contracts
cp .env.example .env
# Edit .env - add your PRIVATE_KEY and BASESCAN_API_KEY
```

### 2. Test (Optional but Recommended)

```bash
forge test
```

### 3. Deploy

```bash
forge script script/DeployAll.s.sol:DeployAll \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv
```

## After Deploy

### Copy These Addresses:

- **USDC:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (Circle Official)
- **Vault:** `0xYourDeployedVaultAddress` (from output)

### Update Frontend .env:

```bash
cd ../frontend
nano .env
# Add:
NEXT_PUBLIC_VAULT_CONTRACT=0xYourVaultAddress
NEXT_PUBLIC_USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### Update Backend .env:

```bash
cd ../backend/api
nano .env
# Add:
VAULT_ADDRESS=0xYourVaultAddress
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

### Get Test USDC:

Visit https://faucet.circle.com/ → Select "Base Sepolia" → Get 10 USDC

## Test It Works

```bash
# 1. Check USDC balance
cast call 0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  "balanceOf(address)(uint256)" \
  YOUR_ADDRESS \
  --rpc-url https://sepolia.base.org

# 2. Approve vault
cast send 0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  "approve(address,uint256)" \
  YOUR_VAULT_ADDRESS \
  10000000 \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY

# 3. Deposit
cast send YOUR_VAULT_ADDRESS \
  "deposit(uint256)" \
  10000000 \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY

# 4. Check vault balance
cast call YOUR_VAULT_ADDRESS \
  "balances(address)(uint256)" \
  YOUR_ADDRESS \
  --rpc-url https://sepolia.base.org
```

## Done! 🎉

Your vault is now live and working with official Circle USDC on Base Sepolia!

For full details, see `DEPLOYMENT_GUIDE.md`
