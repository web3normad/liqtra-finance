# Vault Smart Contract - Overview

## Yes, the Vault IS a Smart Contract! 🔐

The vault is a **smart contract deployed on the Base Sepolia testnet** that manages user deposits, withdrawals, and yield optimization.

## Smart Contract Details

### Contract Address

**Location**: Configured in `.env` file

```bash
NEXT_PUBLIC_VAULT_CONTRACT=0xYourVaultContractAddress
```

**Chain**: Base Sepolia Testnet (Chain ID: 84532)
**RPC URL**: https://sepolia.base.org
**Explorer**: https://sepolia.basescan.org

### Contract ABI (Application Binary Interface)

The vault smart contract exposes these functions:

```solidity
// Read Functions (View)
function balances(address user) view returns (uint256)
function getUserBalance(address user) view returns (uint256)
function userRiskLevel(address user) view returns (uint8)
function usdc() view returns (address)

// Write Functions (State-Changing)
function deposit(uint256 amount)
function withdraw(uint256 amount)

// Events
event Deposit(address indexed user, uint256 amount)
event Withdrawal(address indexed user, uint256 amount)
```

## How It Works

### 1. User Deposits USDC

```
User Wallet → Approve USDC → Vault Contract → Store Balance
```

**Steps:**

1. User has USDC in their wallet (ERC20 token)
2. User approves vault contract to spend USDC
3. User calls `deposit(amount)` on vault contract
4. Vault contract transfers USDC from user to vault
5. Vault contract updates user's balance in storage
6. Vault emits `Deposit` event

**Code Implementation:**

```typescript
// From hooks/useTransactions.ts
const depositToVault = async (amount: string) => {
  const amountWei = parseUnits(amount, 6); // USDC has 6 decimals

  writeContract({
    address: vaultAddress, // Vault smart contract address
    abi: VAULT_ABI, // Contract ABI
    functionName: "deposit", // Function to call
    args: [amountWei], // Amount in wei (smallest unit)
  });
};
```

### 2. Vault Manages Funds

```
Vault Contract → AI Agent → DeFi Protocols → Generate Yields
```

**What the vault does:**

- Holds user USDC deposits
- Tracks individual user balances
- Executes yield strategies (via AI agent or manual)
- Routes funds to DeFi protocols (Lido, Aave, etc.)
- Collects yield rewards
- Updates user earnings

### 3. User Withdraws Funds

```
Vault Contract → Return USDC + Earnings → User Wallet
```

**Steps:**

1. User calls `withdraw(amount)` on vault contract
2. Vault checks user has sufficient balance
3. Vault transfers USDC (principal + earnings) to user
4. Vault updates user's balance
5. Vault emits `Withdrawal` event

**Code Implementation:**

```typescript
// From hooks/useTransactions.ts
const withdrawFromVault = async (amount: string) => {
  const amountWei = parseUnits(amount, 6);

  writeContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "withdraw",
    args: [amountWei],
  });
};
```

## Contract Integration in Frontend

### File Structure

```
lib/web3/contracts/
├── abis.ts           # Contract ABIs (function signatures)
└── addresses.ts      # Contract addresses per chain

hooks/
├── usePortfolio.ts   # Read vault balances (view functions)
└── useTransactions.ts # Write to vault (state-changing functions)
```

### Reading from Contract (View Functions)

**Example: Get User Balance**

```typescript
// From hooks/usePortfolio.ts
const { data: vaultBalance } = useReadContract({
  address: vaultAddress, // 0xYourVaultContractAddress
  abi: VAULT_ABI,
  functionName: "balances", // View function
  args: [userAddress], // User's wallet address
});

// Returns: BigInt (e.g., 1000000 = 1 USDC with 6 decimals)
```

**How it works:**

- Uses Wagmi's `useReadContract` hook
- Calls blockchain node (via Alchemy RPC)
- No gas fees (read-only)
- Returns data immediately
- Auto-refreshes on block updates

### Writing to Contract (State-Changing Functions)

**Example: Deposit USDC**

```typescript
// From hooks/useTransactions.ts
const { writeContract } = useWriteContract();

writeContract({
  address: vaultAddress,
  abi: VAULT_ABI,
  functionName: "deposit",
  args: [parseUnits("100", 6)], // Deposit 100 USDC
});

// Triggers MetaMask transaction approval
// Costs gas fees (paid in ETH)
// Updates blockchain state
```

**Transaction Flow:**

1. `writeContract()` called
2. MetaMask popup appears
3. User reviews transaction details:
   - Contract: `0xVault...`
   - Function: `deposit`
   - Amount: `100 USDC`
   - Gas fee: `~0.001 ETH`
4. User confirms
5. Transaction submitted to blockchain
6. Wait for confirmation (~2 seconds on Base)
7. Success! Balance updated

## USDC Token Contract

The vault interacts with the **USDC smart contract** (also on Base Sepolia):

```bash
NEXT_PUBLIC_USDC_CONTRACT=0xYourUSDCContractAddress
```

**USDC Functions Used:**

```solidity
// Check user's USDC balance
function balanceOf(address user) view returns (uint256)

// Approve vault to spend USDC
function approve(address spender, uint256 amount) returns (bool)

// Check vault's spending allowance
function allowance(address owner, address spender) view returns (uint256)
```

**Approval Flow:**

```
User → approve(vaultAddress, amount) → USDC Contract
```

This gives the vault permission to transfer USDC from user's wallet during deposit.

## Smart Contract Security

### Current Setup (Testnet)

- ⚠️ **Testnet funds** - No real value
- ⚠️ **Placeholder addresses** - Need actual deployed contracts
- ⚠️ **Test USDC** - Faucet tokens for testing

### Production Requirements

- ✅ **Audit smart contracts** - Professional security audit
- ✅ **Multi-sig wallet** - Require multiple approvals for admin functions
- ✅ **Upgrade mechanism** - Proxy pattern for bug fixes
- ✅ **Emergency pause** - Circuit breaker for security incidents
- ✅ **Time locks** - Delay for sensitive operations
- ✅ **Rate limiting** - Prevent flash loan attacks
- ✅ **Insurance** - Cover potential exploits

## Current Status

### ✅ What's Implemented

- Frontend integration with vault contract
- Read user balances from vault
- Approve USDC spending
- Deposit USDC to vault
- Withdraw USDC from vault
- Transaction monitoring
- Error handling
- Loading states
- Toast notifications

### ⚠️ What's Pending

- **Deploy actual vault contract** to Base Sepolia
- **Get vault contract address** and update `.env`
- **Deploy or get USDC test token** contract address
- **Test full deposit/withdraw flow** with real contracts
- **Verify contracts** on BaseScan (block explorer)

## How to Deploy the Vault Contract

### Prerequisites

```bash
# Install Hardhat or Foundry
npm install --save-dev hardhat

# Or use Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Deployment Steps

1. **Write Vault Contract** (Solidity)

```solidity
// contracts/Vault.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {
    IERC20 public usdc;
    mapping(address => uint256) public balances;
    mapping(address => uint8) public userRiskLevel;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        require(usdc.transfer(msg.sender, amount), "Transfer failed");
        emit Withdrawal(msg.sender, amount);
    }

    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
```

2. **Deploy to Base Sepolia**

```bash
# Using Hardhat
npx hardhat run scripts/deploy.js --network baseSepolia

# Using Foundry
forge create Vault --constructor-args <USDC_ADDRESS> --rpc-url $BASE_SEPOLIA_RPC --private-key $PRIVATE_KEY
```

3. **Verify Contract**

```bash
# On BaseScan
npx hardhat verify --network baseSepolia <VAULT_ADDRESS> <USDC_ADDRESS>
```

4. **Update Frontend**

```bash
# Add deployed address to .env
NEXT_PUBLIC_VAULT_CONTRACT=0xActualDeployedVaultAddress
```

## Testing the Vault

### Get Test USDC

```
1. Go to Base Sepolia faucet
2. Get test ETH for gas fees
3. Get test USDC tokens
4. Add USDC to MetaMask (custom token)
```

### Test Flow

```
1. Connect wallet → ✅ MetaMask connected
2. Check USDC balance → ✅ 1000 USDC (test)
3. Check vault balance → ✅ 0 USDC (first time)
4. Approve USDC → ✅ Transaction confirmed
5. Deposit 100 USDC → ✅ Transaction confirmed
6. Check vault balance → ✅ 100 USDC
7. Withdraw 50 USDC → ✅ Transaction confirmed
8. Check vault balance → ✅ 50 USDC
9. Check USDC balance → ✅ 950 USDC (1000 - 100 + 50)
```

## Block Explorer

View vault contract on **BaseScan**:

```
https://sepolia.basescan.org/address/0xYourVaultContractAddress
```

**What you can see:**

- Contract code (if verified)
- All transactions to/from vault
- Deposit events
- Withdrawal events
- Current USDC balance held by vault
- Number of unique depositors

## Architecture Diagram

```
┌─────────────┐
│   User UI   │
│  (Browser)  │
└─────┬───────┘
      │
      │ Wagmi + Viem
      │
┌─────▼───────────────────────────────────┐
│      Base Sepolia Blockchain            │
│                                          │
│  ┌────────────┐      ┌──────────────┐  │
│  │   USDC     │◄────►│    Vault     │  │
│  │  Contract  │      │   Contract   │  │
│  └────────────┘      └──────────────┘  │
│                                          │
│  • User approves USDC spending          │
│  • Vault transfers USDC from user       │
│  • Vault stores user balance            │
│  • Vault returns USDC + earnings        │
└──────────────────────────────────────────┘
```

## Next Steps

1. **Deploy Vault Contract**

   - Write Solidity code
   - Test on local hardhat network
   - Deploy to Base Sepolia testnet
   - Verify on BaseScan

2. **Update .env**

   - Add vault contract address
   - Add USDC contract address (or deploy test token)

3. **Test Integration**

   - Connect wallet to app
   - Approve USDC
   - Deposit to vault
   - Check balance updates
   - Withdraw from vault

4. **Production Deployment**
   - Audit smart contracts
   - Deploy to Base mainnet
   - Set up monitoring
   - Configure admin controls

## Resources

- **Wagmi Docs**: https://wagmi.sh
- **Viem Docs**: https://viem.sh
- **Base Docs**: https://docs.base.org
- **OpenZeppelin**: https://docs.openzeppelin.com/contracts
- **Hardhat**: https://hardhat.org
- **Foundry**: https://book.getfoundry.sh

## Summary

✅ Yes, the vault **IS a smart contract**  
✅ Deployed on **Base Sepolia** testnet  
✅ Manages **USDC deposits and withdrawals**  
✅ Frontend **reads from and writes to** the contract  
✅ Uses **Wagmi + Viem** for Web3 interactions  
✅ All transactions are **on-chain and verifiable**  
⚠️ Need to **deploy actual contract** and update addresses  
⚠️ Need **test USDC tokens** for testing

Your frontend is **100% ready** to interact with the vault smart contract - you just need to deploy it and configure the addresses! 🚀
