#!/bin/bash

# Liqtra Finance - Quick Start Script
# This script helps you quickly test the dashboard integration

echo "🚀 Liqtra Finance - Dashboard Integration Test"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contract addresses
VAULT_ADDRESS="0x8962C42bFE1f011194f6DF329500D1b34b9844d1"
USDC_ADDRESS="0x036CbD53842c5426634e7929541eC2318f3dCF7e"

echo -e "${GREEN}✅ Contract Deployed & Verified${NC}"
echo "   Vault: $VAULT_ADDRESS"
echo "   USDC:  $USDC_ADDRESS"
echo ""

echo -e "${BLUE}📋 Pre-Testing Checklist:${NC}"
echo "   1. Get Base Sepolia ETH:"
echo "      → https://www.alchemy.com/faucets/base-sepolia"
echo ""
echo "   2. Get Test USDC:"
echo "      → https://faucet.circle.com/"
echo ""
echo "   3. Ensure wallet is on Base Sepolia network (Chain ID: 84532)"
echo ""

echo -e "${YELLOW}🔧 Testing Steps:${NC}"
echo "   1. Connect Wallet"
echo "      - Click 'Connect Wallet' in top right"
echo "      - Select your wallet"
echo "      - Approve connection"
echo ""
echo "   2. Test Deposit Flow"
echo "      - Click 'Deposit' quick action"
echo "      - Enter amount (min 1 USDC)"
echo "      - Click 'Approve USDC' (first time only)"
echo "      - Wait for approval confirmation"
echo "      - Click 'Deposit'"
echo "      - Wait for transaction confirmation"
echo "      - Check vault balance updates"
echo ""
echo "   3. Test Risk Level"
echo "      - Click 'Update Risk Level' in sidebar"
echo "      - Select risk preference"
echo "      - Click 'Update Risk Level'"
echo "      - Confirm transaction"
echo ""
echo "   4. Test Withdraw Flow"
echo "      - Click 'Withdraw' quick action"
echo "      - Enter amount"
echo "      - Click 'Withdraw'"
echo "      - Wait for confirmation"
echo "      - Check USDC returned to wallet"
echo ""

echo -e "${GREEN}🔗 Useful Links:${NC}"
echo "   • Contract on BaseScan:"
echo "     https://sepolia.basescan.org/address/$VAULT_ADDRESS"
echo ""
echo "   • USDC Token:"
echo "     https://sepolia.basescan.org/address/$USDC_ADDRESS"
echo ""
echo "   • Network: Base Sepolia (84532)"
echo "     https://sepolia.base.org"
echo ""

echo -e "${BLUE}🎯 Starting Frontend...${NC}"
echo ""

# Check if in frontend directory
if [ ! -f "package.json" ]; then
    echo "Moving to frontend directory..."
    cd frontend || exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Start the development server
echo -e "${GREEN}Starting Next.js development server...${NC}"
npm run dev
