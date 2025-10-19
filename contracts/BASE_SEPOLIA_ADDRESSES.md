# Base Sepolia - Contract Addresses

## Official Circle USDC

**Address:** `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

- **Name:** USD Coin
- **Symbol:** USDC
- **Decimals:** 6
- **Network:** Base Sepolia Testnet
- **Chain ID:** 84532
- **Issuer:** Circle
- **Verified:** ✅ Yes
- **Explorer:** https://sepolia.basescan.org/address/0x036CbD53842c5426634e7929541eC2318f3dCF7e

## Get Test USDC

🚰 **Circle Faucet:** https://faucet.circle.com/

- Select "Base Sepolia" network
- Enter your wallet address
- Receive 10 USDC instantly

## LiqtraVault (Your Deployment)

**Address:** `TBD - Will be set after deployment`

Update this address in:

- `/frontend/.env` → `NEXT_PUBLIC_VAULT_CONTRACT`
- `/backend/api/.env` → `VAULT_ADDRESS`

## Network Configuration

### Base Sepolia Testnet

- **Chain ID:** 84532
- **RPC URL:** https://sepolia.base.org
- **Currency:** ETH
- **Block Explorer:** https://sepolia.basescan.org

### Add to MetaMask

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Manual entry:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.basescan.org

### Get Base Sepolia ETH

- Coinbase Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Alchemy Faucet: https://www.alchemy.com/faucets/base-sepolia

## Frontend Configuration

Update `/frontend/.env`:

```bash
# Network
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Contracts
NEXT_PUBLIC_VAULT_CONTRACT=YOUR_VAULT_ADDRESS_HERE
NEXT_PUBLIC_USDC_CONTRACT=0x036CbD53842c5426634e7929541eC2318f3dCF7e

# Explorer
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.basescan.org
```

## Backend Configuration

Update `/backend/api/.env`:

```bash
# Network
RPC_URL=https://sepolia.base.org
CHAIN_ID=84532

# Contracts
VAULT_ADDRESS=YOUR_VAULT_ADDRESS_HERE
USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
```

## Quick Command Reference

### Check USDC Balance

```bash
cast call 0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  "balanceOf(address)(uint256)" \
  YOUR_ADDRESS \
  --rpc-url https://sepolia.base.org
```

### Approve Vault

```bash
cast send 0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  "approve(address,uint256)" \
  YOUR_VAULT_ADDRESS \
  10000000 \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY
```

### Deposit to Vault

```bash
cast send YOUR_VAULT_ADDRESS \
  "deposit(uint256)" \
  10000000 \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY
```

### Check Vault Balance

```bash
cast call YOUR_VAULT_ADDRESS \
  "balances(address)(uint256)" \
  YOUR_ADDRESS \
  --rpc-url https://sepolia.base.org
```

## Important Notes

✅ **Use Official Circle USDC** - No need for mock tokens!  
✅ **Get from Circle Faucet** - https://faucet.circle.com/  
✅ **Same as Production** - Just on testnet  
✅ **Already Verified** - Contract verified on BaseScan  
✅ **Free Test Tokens** - 10 USDC per faucet request

⚠️ **These are test tokens** - No real value  
⚠️ **Base Sepolia only** - Won't work on mainnet  
⚠️ **Save gas** - Use public RPC or free Alchemy tier
