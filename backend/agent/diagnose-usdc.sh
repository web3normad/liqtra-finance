#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   🔍 USDC DIAGNOSTIC TOOL               ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

RPC_URL="https://sepolia.base.org"
YOUR_WALLET="0x86E74256beC87d5f542BC9214b708A9dE78e3998"
VAULT_ADDRESS="0x9Cb38ba12c4b0c0dbf0e9B45397b2D9Bb7de1b05"
USDC_ADDRESS="0x036CbD53842c5426634e7929541eC2318f3dCF7e"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Wallet: $YOUR_WALLET"
echo "  Vault: $VAULT_ADDRESS"
echo "  Expected USDC: $USDC_ADDRESS"
echo ""

# Step 1: Check what USDC your vault is using
echo -e "${GREEN}[1/5]${NC} Checking vault's USDC address..."
VAULT_USDC=$(cast call $VAULT_ADDRESS "usdc()(address)" --rpc-url $RPC_URL)
echo "  Vault's USDC: $VAULT_USDC"

if [ "$VAULT_USDC" != "$USDC_ADDRESS" ]; then
    echo -e "${RED}  ⚠️  MISMATCH! Vault uses different USDC${NC}"
    USDC_ADDRESS=$VAULT_USDC
else
    echo -e "${GREEN}  ✅ Match!${NC}"
fi
echo ""

# Step 2: Check your balance in vault's USDC
echo -e "${GREEN}[2/5]${NC} Checking your balance in vault's USDC..."
BALANCE=$(cast call $USDC_ADDRESS "balanceOf(address)(uint256)" $YOUR_WALLET --rpc-url $RPC_URL)
BALANCE_FORMATTED=$(echo "scale=6; $BALANCE / 1000000" | bc)
echo "  Balance: $BALANCE_FORMATTED USDC"

if [ "$BALANCE" = "0" ]; then
    echo -e "${RED}  ❌ You have 0 USDC in this contract${NC}"
else
    echo -e "${GREEN}  ✅ You have USDC!${NC}"
fi
echo ""

# Step 3: Check your allowance
echo -e "${GREEN}[3/5]${NC} Checking vault allowance..."
ALLOWANCE=$(cast call $USDC_ADDRESS "allowance(address,address)(uint256)" $YOUR_WALLET $VAULT_ADDRESS --rpc-url $RPC_URL)
ALLOWANCE_FORMATTED=$(echo "scale=6; $ALLOWANCE / 1000000" | bc)
echo "  Allowance: $ALLOWANCE_FORMATTED USDC"

if [ "$ALLOWANCE" = "0" ]; then
    echo -e "${RED}  ❌ Not approved${NC}"
else
    echo -e "${GREEN}  ✅ Approved!${NC}"
fi
echo ""

# Step 4: Check the USDC from screenshot (0x70a08231...)
echo -e "${GREEN}[4/5]${NC} Checking the USDC from your screenshot..."
SCREENSHOT_USDC="0x70a08231" # This is the function selector, not an address

# Let's check common Base Sepolia USDC addresses
echo "  Checking known USDC contracts on Base Sepolia:"
echo ""

USDC_CONTRACTS=(
    "0x036CbD53842c5426634e7929541eC2318f3dCF7e"  # Base Sepolia USDC
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"  # Alternative testnet USDC
)

for USDC_ADDR in "${USDC_CONTRACTS[@]}"; do
    echo "  → $USDC_ADDR"
    BAL=$(cast call $USDC_ADDR "balanceOf(address)(uint256)" $YOUR_WALLET --rpc-url $RPC_URL 2>/dev/null)
    if [ ! -z "$BAL" ] && [ "$BAL" != "0" ]; then
        BAL_FMT=$(echo "scale=6; $BAL / 1000000" | bc)
        echo -e "    ${GREEN}Balance: $BAL_FMT USDC ✅${NC}"
        
        # Check if this is the same as vault's USDC
        if [ "$USDC_ADDR" = "$VAULT_USDC" ]; then
            echo -e "    ${GREEN}✅ This matches your vault!${NC}"
        else
            echo -e "    ${RED}⚠️  This is different from vault's USDC!${NC}"
        fi
    else
        echo "    Balance: 0 USDC"
    fi
    echo ""
done

# Step 5: Summary and fix
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   📊 DIAGNOSIS SUMMARY                   ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$BALANCE" -gt "0" ] && [ "$ALLOWANCE" -gt "0" ]; then
    echo -e "${GREEN}✅ Everything looks good!${NC}"
    echo "You should be able to deposit."
    echo ""
    echo "Try depositing 5 USDC:"
    echo -e "${YELLOW}curl -X POST http://localhost:3000/api/transactions/deposit \\
  -H 'Content-Type: application/json' \\
  -d '{\"address\":\"$YOUR_WALLET\",\"amount\":\"5\"}'${NC}"
    
elif [ "$BALANCE" = "0" ]; then
    echo -e "${RED}❌ Issue: You have 0 USDC in the contract your vault uses${NC}"
    echo ""
    echo "Vault expects USDC at: $VAULT_USDC"
    echo "Your USDC balance there: $BALANCE_FORMATTED"
    echo ""
    echo -e "${YELLOW}🔧 Fix Options:${NC}"
    echo ""
    echo "Option 1: Get USDC for the correct contract"
    echo "  If vault uses Mock USDC, call faucet():"
    echo -e "  ${YELLOW}cast send $VAULT_USDC \"faucet()\" --rpc-url $RPC_URL --private-key \$PRIVATE_KEY${NC}"
    echo ""
    echo "Option 2: Redeploy vault with the USDC you have"
    echo "  Find where you have USDC (check above)"
    echo "  Redeploy vault with that USDC address"
    
elif [ "$ALLOWANCE" = "0" ]; then
    echo -e "${RED}❌ Issue: Vault not approved${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Fix:${NC}"
    echo -e "  ${YELLOW}cast send $USDC_ADDRESS \\
    \"approve(address,uint256)\" \\
    $VAULT_ADDRESS \\
    1000000000000 \\
    --rpc-url $RPC_URL \\
    --private-key \$PRIVATE_KEY${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
